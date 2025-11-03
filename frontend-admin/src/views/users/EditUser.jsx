import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
} from '@coreui/react'
import api from '../../services/api'
import { useNavigate, useParams } from 'react-router-dom'

const EditUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/admin/users/${id}`)
        const userData = response.data.data
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          password: '',
          password_confirmation: '',
        })
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }
    fetchUser()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const dataToSubmit = { ...formData, user_id: id }
    // Remove password fields if not provided
    if (!dataToSubmit.password && !dataToSubmit.password_confirmation) {
      delete dataToSubmit.password
      delete dataToSubmit.password_confirmation
    }
    if (!dataToSubmit.password) {
      delete dataToSubmit.password
      delete dataToSubmit.password_confirmation
    }
    try {
      await api.patch(`/admin/users/${id}`, dataToSubmit)
      navigate('/users')
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Edit User</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <div className="mb-3">
                <CFormLabel htmlFor="name">Name</CFormLabel>
                <CFormInput
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="email">Email address</CFormLabel>
                <CFormInput
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="password">New Password (optional)</CFormLabel>
                <CFormInput
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="password_confirmation">Confirm New Password</CFormLabel>
                <CFormInput
                  type="password"
                  id="password_confirmation"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                />
              </div>
              <CButton type="submit" color="primary">
                Update User
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default EditUser
