import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import api from '../../services/api'
import { useParams } from 'react-router-dom'

const RoleDetails = () => {
  const [role, setRole] = useState(null)
  const { id } = useParams()

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await api.get(`/admin/roles/${id}`)
        setRole(response.data.data)
      } catch (error) {
        console.error('Error fetching role details:', error)
      }
    }

    fetchRole()
  }, [id])

  if (!role) {
    return <div>Loading...</div>
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Role Details</strong>
          </CCardHeader>
          <CCardBody>
            <p>
              <strong>Name:</strong> {role.name}
            </p>
            <p>
              <strong>Permissions:</strong>{' '}
              {role.permissions.map((permission) => permission.name).join(', ')}
            </p>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default RoleDetails

