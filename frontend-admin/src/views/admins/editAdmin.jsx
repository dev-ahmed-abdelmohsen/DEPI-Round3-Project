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
  CFormSelect,
} from '@coreui/react'
import api from '../../services/api'
import { useNavigate, useParams } from 'react-router-dom'

const EditAdmin = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    roles: [],
  })
  const [allRoles, setAllRoles] = useState([])
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await api.get(`/admin/admins/${id}`)
        const adminData = response.data.data
        setFormData({
          name: adminData.name || '',
          email: adminData.email || '',
          roles: adminData.roles.map((role) => role.id) || [],
          password: '',
          password_confirmation: '',
        })
      } catch (error) {
        console.error('Error fetching admin:', error)
      }
    }

    const fetchRoles = async () => {
      try {
        const response = await api.get('/admin/roles')
        setAllRoles(response.data.data)
      } catch (error) {
        console.error('Error fetching roles:', error)
      }
    }

    fetchAdmin()
    fetchRoles()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleRoleChange = (e) => {
    const { options } = e.target
    const value = []
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value)
      }
    }
    setFormData({ ...formData, roles: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const dataToSubmit = { ...formData }
    if (!dataToSubmit.password) {
      delete dataToSubmit.password
      delete dataToSubmit.password_confirmation
    }
    if (!dataToSubmit.roles || dataToSubmit.roles.length === 0) {
      dataToSubmit.roles = []
    }
    // If roles are not selected, set to an empty array
    dataToSubmit.roles = dataToSubmit.roles.map((roleId) => parseInt(roleId))
    try {
      // console.log(dataToSubmit)
      const response = await api.patch(`/admin/admins/${id}`, dataToSubmit)
      // console.log(response.data.data)

      navigate('/admins')
    } catch (error) {
      console.error('Error updating admin:', error)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Edit Admin</strong>
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
                <CFormLabel htmlFor="roles">
                  Roles
                </CFormLabel>
                  <small className="text-muted" style={{ display: 'block', marginTop: '0px' }}>
                    Hold Ctrl & Shift for multi-select
                  </small>
                <CFormSelect
                  id="roles"
                  name="roles"
                  multiple
                  value={formData.roles}
                  onChange={handleRoleChange}
                >
                  {allRoles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </CFormSelect>
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
                Update Admin
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default EditAdmin

