import React, { useContext, useEffect, useState } from 'react'
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
import api from '../../services/api'
import { useNavigate } from 'react-router-dom'
import { PermissionContext } from 'src/contexts/PermissionContext'

const Roles = () => {
  const [roles, setRoles] = useState([])
  const navigate = useNavigate()
  const permissions = useContext(PermissionContext)


  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await api.get('/admin/roles')
        setRoles(response.data.data)
      } catch (error) {
        console.error('Error fetching roles:', error)
      }
    }

    fetchRoles()
  }, [])

  const handleDelete = async (roleId) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await api.delete(`/admin/roles/${roleId}`)
        setRoles(roles.filter((role) => role.id !== roleId))
      } catch (error) {
        console.error('Error deleting role:', error)
      }
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <span>Roles List</span>
            {permissions.includes('create roles') && (
              <CButton color="primary" onClick={() => navigate('/roles/add')}>
                Add Role
              </CButton>
            )}
          </CCardHeader>
          <CCardBody>
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {roles.map((role) => (
                  <CTableRow key={role.id}>
                    <CTableHeaderCell scope="row">{role.id}</CTableHeaderCell>
                    <CTableDataCell>{role.name}</CTableDataCell>
                    <CTableDataCell>

                      {(permissions.includes('edit roles') || permissions.includes('delete roles') || permissions.includes('view roles')) && (
                        <CTableDataCell>
                          <CButton
                            color="primary"
                            size="sm"
                            onClick={() => navigate(`/roles/${role.id}`)}
                            className="me-2"
                          >
                            View
                          </CButton>
                          {permissions.includes('edit roles') && (
                            <CButton
                              color="secondary"
                              size="sm"
                              onClick={() => navigate(`/roles/edit/${role.id}`)}
                              className="me-2"
                            >
                              Edit
                            </CButton>
                          )}
                          {permissions.includes('delete roles') && (
                            <CButton color="danger" size="sm" onClick={() => handleDelete(role.id)}>
                              Delete
                            </CButton>
                          )}
                        </CTableDataCell>
                      )}
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

export default Roles
