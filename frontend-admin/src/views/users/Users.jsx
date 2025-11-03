// src/views/users/Users.jsx
import React, { useContext, useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import api from '../../services/api'
import { useNavigate } from 'react-router-dom'
import { PermissionContext } from 'src/contexts/PermissionContext'

const Users = () => {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')
  const [perPage, setPerPage] = useState(10)
  const navigate = useNavigate()
  const permissions = useContext(PermissionContext)

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users', {
        params: {
          query: searchTerm,
          sort_by: sortBy,
          sort_order: sortOrder,
          per_page: perPage,
        },
      })
      setUsers(response.data.data.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [sortBy, sortOrder, perPage])

  const handleSearch = () => {
    fetchUsers()
  }

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${userId}`)
        setUsers(users.filter((user) => user.id !== userId))
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <span>Users List</span>
            {permissions.includes('create users') && (
              <CButton color="primary" onClick={() => navigate('/users/add')}>
                Add User
              </CButton>
            )}
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-3">
              <CCol md={6}>
                <CInputGroup>
                  <CFormInput
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <CButton onClick={handleSearch}>Search</CButton>
                </CInputGroup>
              </CCol>
            </CRow>
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                  {/*<CTableHeaderCell scope="col">Role</CTableHeaderCell>*/}
                  {/*<CTableHeaderCell scope="col">Status</CTableHeaderCell>*/}
                  <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {users.map((user) => (
                  <CTableRow key={user.id}>
                    <CTableHeaderCell scope="row">{user.id}</CTableHeaderCell>
                    <CTableDataCell>{user.name}</CTableDataCell>
                    <CTableDataCell>{user.email}</CTableDataCell>
                    {/*<CTableDataCell>{user.role}</CTableDataCell>*/}
                    {/*<CTableDataCell>{user.is_active ? 'Active' : 'Inactive'}</CTableDataCell>*/}

                    {(permissions.includes('edit users') || permissions.includes('delete users') || permissions.includes('view users')) && (
                      <CTableDataCell>
                        <CButton
                          color="primary"
                          size="sm"
                          onClick={() => {
                            navigate(`/users/${user.id}`)
                          }}
                          className="me-2"
                        >
                          View
                        </CButton>
                        {permissions.includes('edit users') && (
                          <CButton
                            color="secondary"
                            size="sm"
                            onClick={() => {
                              navigate(`/users/edit/${user.id}`)
                            }}
                            className="me-2"
                          >
                            Edit
                          </CButton>
                        )}
                        {permissions.includes('delete users') && (
                          <CButton color="danger" size="sm" onClick={() => handleDelete(user.id)}>
                            Delete
                          </CButton>
                        )}
                      </CTableDataCell>
                    )}
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

export default Users
