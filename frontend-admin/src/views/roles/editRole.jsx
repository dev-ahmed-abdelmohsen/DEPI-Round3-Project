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
  CFormCheck,
} from '@coreui/react'
import api from '../../services/api'
import { useNavigate, useParams } from 'react-router-dom'

const EditRole = () => {
  const [formData, setFormData] = useState({
    name: '',
    permissions: [],
  })
  const [allPermissions, setAllPermissions] = useState([])
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await api.get(`/admin/roles/${id}`)
        const roleData = response.data.data
        setFormData({
          name: roleData.name || '',
          permissions: roleData.permissions.map((p) => p.name) || [],
        })
      } catch (error) {
        console.error('Error fetching role:', error)
      }
    }

    const fetchPermissions = async () => {
      try {
        const response = await api.get('/admin/roles/permissions')
        setAllPermissions(response.data.data)
      } catch (error) {
        console.error('Error fetching permissions:', error)
      }
    }

    fetchRole()
    fetchPermissions()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handlePermissionChange = (e) => {
    const { value, checked } = e.target
    let { permissions } = formData
    if (checked) {
      permissions.push(value)
    } else {
      permissions = permissions.filter((p) => p !== value)
    }
    setFormData({ ...formData, permissions })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.patch(`/admin/roles/${id}`, formData)
      navigate('/roles')
    } catch (error) {
      console.error('Error updating role:', error)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Edit Role</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <div className="mb-3">
                <CFormLabel htmlFor="name">Role Name</CFormLabel>
                <CFormInput
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Permissions</CFormLabel>
                <CRow>
                  {allPermissions.map((permission) => (
                    <CCol md={3} key={permission.id}>
                      <CFormCheck
                        id={`permission-${permission.id}`}
                        label={permission.name}
                        value={permission.name}
                        checked={formData.permissions.includes(permission.name)}
                        onChange={handlePermissionChange}
                      />
                    </CCol>
                  ))}
                </CRow>
              </div>
              <CButton type="submit" color="primary">
                Update Role
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default EditRole
