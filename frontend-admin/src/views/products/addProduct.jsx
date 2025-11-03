import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import api from 'src/services/api'
import {
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
  CAlert,
} from '@coreui/react'

const AddProduct = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [submitError, setSubmitError] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [galleryFiles, setGalleryFiles] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories')
        setCategories(response.data.data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  const validationSchema = Yup.object({
    name: Yup.string().max(255, 'Name must be 255 characters or less').required('Name is required'),
    price: Yup.number().min(0, 'Price cannot be negative').required('Price is required'),
    description: Yup.string().nullable(),
    stock: Yup.number()
      .integer('Stock must be an integer')
      .min(0, 'Stock cannot be negative')
      .required('Stock is required'),
    sku: Yup.string().max(255, 'SKU must be 255 characters or less').required('SKU is required'),
    specifications: Yup.string().nullable(),
    subcategory_id: Yup.number().required('Subcategory is required'),
  })

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      price: '',
      specifications: '',
      sku: '',
      stock: '',
      subcategory_id: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitError(null)
      const formData = new FormData()

      Object.keys(values).forEach((key) => {
        formData.append(key, values[key])
      })

      if (imageFile) {
        formData.append('primary_image', imageFile)
      }

      if (galleryFiles.length > 0) {
        galleryFiles.forEach((file) => {
          formData.append('images[]', file)
        })
      }

      try {
        await api.post('/admin/products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        navigate('/products/list', { replace: true })
      } catch (error) {
        console.error('Error creating product:', error)
        setSubmitError(error.response?.data?.message || 'An unexpected error occurred.')
      } finally {
        setSubmitting(false)
      }
    },
  })

  return (
    <CCard>
      <CCardHeader>
        <CRow>
          <CCol>Add New Product</CCol>
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
        <CForm onSubmit={formik.handleSubmit}>
          {submitError && (
            <CAlert color="danger">
              <p>
                <strong>Error:</strong> {submitError}
              </p>
              <Link to="/products/list">
                <CButton color="danger" variant="outline">
                  Return to Products List
                </CButton>
              </Link>
            </CAlert>
          )}
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
            Create Product
          </CButton>
          <CButton
            color="secondary"
            onClick={() => navigate('/products/list')}
            disabled={formik.isSubmitting}
          >
            Cancel
          </CButton>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default AddProduct
