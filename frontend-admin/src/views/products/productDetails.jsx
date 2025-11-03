import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import api from 'src/services/api'
import { PermissionContext } from 'src/contexts/PermissionContext'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CRow,
  CFormSelect,
  CFormFeedback,
  CSpinner,
  CImage,
} from '@coreui/react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

// Helper to create a consistent object for the form
const getFormValues = (productData) => {
  return {
    name: productData?.name || productData?.title || '',
    description: productData?.description || '',
    price: productData?.price ?? '',
    specifications: productData?.specifications || '',
    sku: productData?.sku || '',
    stock: productData?.stock ?? '',
    subcategory_id: productData?.subcategory?.id ?? '',
  }
}

const ProductDetails = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [originalProduct, setOriginalProduct] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [categories, setCategories] = useState([])
  const [submitError, setSubmitError] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [galleryFiles, setGalleryFiles] = useState([])
  const permissions = useContext(PermissionContext)

  const fetchProduct = useCallback(async () => {
    try {
      const response = await api.get(`/admin/products/${productId}`)
      const productData = response.data.data
      setProduct(productData)
      setOriginalProduct(productData)
    } catch (error) {
      console.error('Error fetching product:', error)
    }
  }, [productId])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories')
        setCategories(response.data.data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchProduct()
    fetchCategories()
  }, [productId, fetchProduct])

  const validationSchema = Yup.object({
    name: Yup.string().max(255, 'Name must be 255 characters or less').required('Name is required'),
    description: Yup.string().nullable(),
    price: Yup.number().min(0, 'Price cannot be negative').required('Price is required'),
    specifications: Yup.string().nullable(),
    sku: Yup.string().max(255, 'SKU must be 255 characters or less').nullable(),
    stock: Yup.number()
      .integer('Stock must be an integer')
      .min(0, 'Stock cannot be negative')
      .required('Stock is required'),
    subcategory_id: Yup.number().required('Subcategory is required'),
  })

  const formik = useFormik({
    initialValues: getFormValues(product),
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitError(null)
      const formData = new FormData()
      const originalFormValues = getFormValues(originalProduct)

      Object.keys(values).forEach((key) => {
        const formValue = ['price', 'stock', 'subcategory_id'].includes(key)
          ? Number(values[key])
          : values[key]
        if (formValue !== originalFormValues[key]) {
          formData.append(key, formValue)
        }
      })

      if (imageFile) {
        formData.append('primary_image', imageFile)
      }

      if (galleryFiles.length > 0) {
        galleryFiles.forEach((file) => {
          formData.append('images[]', file)
        })
      }

      if (formData.entries().next().done && !imageFile && galleryFiles.length === 0) {
        setIsEditing(false)
        setSubmitting(false)
        return
      }

      try {
        await api.post(`/admin/products/${productId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          params: { _method: 'PATCH' },
        })
        await fetchProduct()
        setIsEditing(false)
        setImageFile(null)
        setGalleryFiles([])
      } catch (error) {
        console.error('Error updating product:', error)
        setSubmitError(error.response?.data?.message || 'An unexpected error occurred.')
      }
      setSubmitting(false)
    },
  })

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/admin/products/${productId}`)
        navigate('/products/list')
      } catch (error) {
        console.error('Error deleting product:', error)
        setSubmitError(error.response?.data?.message || 'Failed to delete product.')
      }
    }
  }

  if (!product) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <CSpinner />
      </div>
    )
  }

  const subcategoryName = product
    ? `${product.subcategory?.name || 'Unknown'} (Category: ${product.category?.name || 'Unknown'})`
    : 'N/A'

  return (
    <CCard>
      <CCardHeader>
        <CRow>
          <CCol>Product Details</CCol>
          <CCol className="text-end">
            {!isEditing && (permissions.includes('edit products') || permissions.includes('delete products')) && (
              <div>
                {permissions.includes('edit products') && (
                  <CButton
                    color="primary"
                    className="me-2"
                    onClick={() => {
                      setSubmitError(null)
                      formik.resetForm({ values: getFormValues(originalProduct) })
                      setIsEditing(true)
                    }}
                  >
                    Edit
                  </CButton>
                )}
                {permissions.includes('delete products') && (
                  <CButton color="danger" onClick={handleDelete}>
                  Delete
                  </CButton>
                )}
              </div>
            )}
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody style={{ position: 'relative' }}>
        {formik.isSubmitting && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 10,
            }}
          >
            <CSpinner />
            <span className="ms-2">Submitting...</span>
          </div>
        )}
        {submitError && !isEditing && (
          <CAlert color="danger">
            <p>
              <strong>Error:</strong> {submitError}
            </p>
          </CAlert>
        )}
        {isEditing ? (
          <CForm onSubmit={formik.handleSubmit}>
            {submitError && (
              <CAlert color="danger">
                <p>
                  <strong>Error:</strong> {submitError}
                </p>
                <Link to="/products">
                  <CButton color="danger" variant="outline">
                    Return to Products List
                  </CButton>
                </Link>
              </CAlert>
            )}
            {/* Form fields */}
            <CRow className="mb-3">
              <CFormLabel htmlFor="name" className="col-sm-2 col-form-label">
                Name
              </CFormLabel>
              <CCol sm={10}>
                <CFormInput
                  id="name"
                  {...formik.getFieldProps('name')}
                  invalid={formik.touched.name && !!formik.errors.name}
                />
                <CFormFeedback invalid>{formik.errors.name}</CFormFeedback>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="description" className="col-sm-2 col-form-label">
                Description
              </CFormLabel>
              <CCol sm={10}>
                <CFormTextarea
                  id="description"
                  rows={3}
                  {...formik.getFieldProps('description')}
                  invalid={formik.touched.description && !!formik.errors.description}
                />
                <CFormFeedback invalid>{formik.errors.description}</CFormFeedback>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="price" className="col-sm-2 col-form-label">
                Price
              </CFormLabel>
              <CCol sm={10}>
                <CFormInput
                  type="number"
                  id="price"
                  {...formik.getFieldProps('price')}
                  invalid={formik.touched.price && !!formik.errors.price}
                />
                <CFormFeedback invalid>{formik.errors.price}</CFormFeedback>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="specifications" className="col-sm-2 col-form-label">
                Specifications
              </CFormLabel>
              <CCol sm={10}>
                <CFormTextarea
                  id="specifications"
                  rows={3}
                  {...formik.getFieldProps('specifications')}
                  invalid={formik.touched.specifications && !!formik.errors.specifications}
                />
                <CFormFeedback invalid>{formik.errors.specifications}</CFormFeedback>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="sku" className="col-sm-2 col-form-label">
                SKU
              </CFormLabel>
              <CCol sm={10}>
                <CFormInput
                  id="sku"
                  {...formik.getFieldProps('sku')}
                  invalid={formik.touched.sku && !!formik.errors.sku}
                />
                <CFormFeedback invalid>{formik.errors.sku}</CFormFeedback>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="stock" className="col-sm-2 col-form-label">
                Stock
              </CFormLabel>
              <CCol sm={10}>
                <CFormInput
                  type="number"
                  id="stock"
                  {...formik.getFieldProps('stock')}
                  invalid={formik.touched.stock && !!formik.errors.stock}
                />
                <CFormFeedback invalid>{formik.errors.stock}</CFormFeedback>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="subcategory_id" className="col-sm-2 col-form-label">
                Subcategory
              </CFormLabel>
              <CCol sm={10}>
                <CFormSelect
                  id="subcategory_id"
                  {...formik.getFieldProps('subcategory_id')}
                  invalid={formik.touched.subcategory_id && !!formik.errors.subcategory_id}
                >
                  <option value="">Select a Subcategory</option>
                  {categories.map((category) => (
                    <optgroup key={category.id} label={category.name}>
                      {category.subcategories.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </CFormSelect>
                <CFormFeedback invalid>{formik.errors.subcategory_id}</CFormFeedback>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="primary_image" className="col-sm-2 col-form-label">
                Main Image
              </CFormLabel>
              <CCol sm={10}>
                <CFormInput
                  type="file"
                  id="primary_image"
                  onChange={(event) => setImageFile(event.currentTarget.files[0])}
                  accept="image/*"
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="images" className="col-sm-2 col-form-label">
                Gallery Images
              </CFormLabel>
              <CCol sm={10}>
                <CFormInput
                  type="file"
                  id="images"
                  multiple
                  onChange={(event) => setGalleryFiles(Array.from(event.currentTarget.files))}
                  accept="image/*"
                />
              </CCol>
            </CRow>
            <CButton type="submit" color="success" className="me-2" disabled={formik.isSubmitting}>
              Submit
            </CButton>
            <CButton
              color="secondary"
              onClick={() => setIsEditing(false)}
              disabled={formik.isSubmitting}
            >
              Cancel
            </CButton>
          </CForm>
        ) : (
          <CRow>
            <CCol md={8}>
              <h5>{product.name || product.title}</h5>
              <p>
                <strong>SKU:</strong> {product.sku || 'N/A'}
              </p>
              <p>
                <strong>Subcategory:</strong> {subcategoryName}
              </p>
              <p>
                <strong>Description:</strong> {product.description || 'N/A'}
              </p>
              <p>
                <strong>Specifications:</strong> {product.specifications || 'N/A'}
              </p>
              <p>
                <strong>Price:</strong> ${product.price}
              </p>
              <p>
                <strong>Stock:</strong> {product.stock} units
              </p>
            </CCol>
            <CCol md={4}>
              <h6>Main Image</h6>
              {product.primaryImage ? (
                <CImage src={product.primaryImage} alt={product.name} fluid thumbnail />
              ) : (
                <p>No image available.</p>
              )}
            </CCol>
          </CRow>
        )}
      </CCardBody>
    </CCard>
  )
}

export default ProductDetails
