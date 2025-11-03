import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import api from '../../../services/api' // Import the custom axios instance
import { useDispatch } from 'react-redux'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    try {
      // Use the custom 'api' instance for the request
      const response = await api.post('/adminLogin', {
        email: username,
        password: password,
      })

      // console.log(response)

      const { token, admin } = response.data.data
      // console.log(token)
      // Store the token. The interceptor will handle adding it to headers.
      localStorage.setItem('authToken', token)
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: admin, token } })

      navigate('/dashboard')
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message)
      } else {
        setError('Login failed. Please try again.')
      }
      console.error('Login error:', err)
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    {error && <CAlert color="danger">{error}</CAlert>}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="primary" className="px-4">
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-end">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              {/*<CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>*/}
              {/*  <CCardBody className="text-center">*/}
              {/*    <div>*/}
              {/*      <h2>Sign up</h2>*/}
              {/*      <p>*/}
              {/*        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod*/}
              {/*        tempor incididunt ut labore et dolore magna aliqua.*/}
              {/*      </p>*/}
              {/*      <Link to="/register">*/}
              {/*        <CButton color="primary" className="mt-3" active tabIndex={-1}>*/}
              {/*          Register Now!*/}
              {/*        </CButton>*/}
              {/*      </Link>*/}
              {/*    </div>*/}
              {/*  </CCardBody>*/}
              {/*</CCard>*/}
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
