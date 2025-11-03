import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import api from '../../services/api'
import { useParams } from 'react-router-dom'

const AdminDetails = () => {
  const [admin, setAdmin] = useState(null)
  const { id } = useParams()

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await api.get(`/admin/admins/${id}`)
        setAdmin(response.data.data)
      } catch (error) {
        console.error('Error fetching admin details:', error)
      }
    }

    fetchAdmin()
  }, [id])

  if (!admin) {
    return <div>Loading...</div>
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Admin Details</strong>
          </CCardHeader>
          <CCardBody>
            <p>
              <strong>Name:</strong> {admin.name}
            </p>
            <p>
              <strong>Email:</strong> {admin.email}
            </p>
            <p>
              <strong>Roles:</strong> {admin.roles.map((role) => role.name).join(', ')}
            </p>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AdminDetails

