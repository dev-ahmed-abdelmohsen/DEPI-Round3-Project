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

const Admins = () => {
  const [admins, setAdmins] = useState([])
  const navigate = useNavigate()
  const permissions = useContext(PermissionContext)


  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        // Assuming an endpoint to list admins
        const response = await api.get('/admin/admins')
        setAdmins(response.data.data)
        console.log(response.data.data)
      } catch (error) {
        console.error('Error fetching admins:', error)
      }
    }

    fetchAdmins()
  }, [])

  const handleDelete = async (adminId) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      try {
        await api.delete(`/admin/admins/${adminId}`)
        setAdmins(admins.filter((admin) => admin.id !== adminId))
      } catch (error) {
        console.error('Error deleting admin:', error)
      }
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <span>Admins List</span>
            {permissions.includes('create admins') && (
              <CButton color="primary" onClick={() => navigate('/admins/add')}>
                Add Admin
              </CButton>
            )}
          </CCardHeader>
          <CCardBody>
            <CTable hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Role</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {admins.map((admin, index) => (
                  <CTableRow key={admin.id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{admin.name}</CTableDataCell>
                    <CTableDataCell>{admin.email}</CTableDataCell>
                    <CTableDataCell>
                      {admin.roles && admin.roles.map((role) => role.name).join(', ')}
                    </CTableDataCell>

                    {(permissions.includes('edit admins') || permissions.includes('delete admins') || permissions.includes('view admins')) && (
                      <CTableDataCell>
                        <CButton
                          color="info"
                          size="sm"
                          onClick={() => navigate(`/admins/${admin.id}`)}
                          className="me-2"
                        >
                          View
                        </CButton>
                        {permissions.includes('edit admins') && (
                          <CButton
                            color="secondary"
                            size="sm"
                            onClick={() => navigate(`/admins/edit/${admin.id}`)}
                            className="me-2"
                          >
                            Edit
                          </CButton>
                        )}
                        {permissions.includes('delete admins') && (
                          <CButton color="danger" size="sm" onClick={() => handleDelete(admin.id)}>
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

export default Admins
