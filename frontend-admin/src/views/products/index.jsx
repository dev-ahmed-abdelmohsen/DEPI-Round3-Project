import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import api from 'src/services/api'
import { PermissionContext } from 'src/contexts/PermissionContext'

const Index = () => {
  const [products, setProducts] = React.useState([])
  const [page, setPage] = React.useState(1)
  const [response, setResponse] = React.useState(null)
  const navigate = useNavigate()
  const permissions = useContext(PermissionContext)


  const fetchProducts = async (pageOffset = 1, limit = 20) => {
    try {
      const response = await api.get(`/products?page=${pageOffset}&per_page=${limit}`)
      setResponse(response)
      console.log(response.data.data.data)
      setProducts(response.data.data.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }
  // Fetch products on component mount
  React.useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">

            <span>Products List</span>

            {permissions.includes('create products') && (
              <CButton color="primary" onClick={() => navigate('/products/add')}>
                Add Product
              </CButton>
            )}

          </CCardHeader>
          <CCardBody>
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Title</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Price</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Stock</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Updated At</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Details</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {products.map((product) => (
                  <CTableRow key={product.id}>
                    <CTableHeaderCell scope="row">{product.id}</CTableHeaderCell>
                    <CTableDataCell>{product.title}</CTableDataCell>
                    <CTableDataCell>{product.price}</CTableDataCell>
                    <CTableDataCell>{product.stock}</CTableDataCell>
                    <CTableDataCell>
                      {new Date(product.updatedAt).toLocaleDateString()}
                    </CTableDataCell>
                    <CTableDataCell>
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          navigate(`/products/${product.id}`)
                        }}
                      >
                        View Details
                      </button>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Index
