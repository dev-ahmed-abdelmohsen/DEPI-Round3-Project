import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import api from '../../services/api'
import { useParams } from 'react-router-dom'

const UserDetails = () => {
  const [user, setUser] = useState(null)
  const { id } = useParams()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/admin/users/${id}`)
        setUser(response.data.data)
      } catch (error) {
        console.error('Error fetching user details:', error)
      }
    }

    fetchUser()
  }, [id])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>User Details</strong>
          </CCardHeader>
          <CCardBody>
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default UserDetails

