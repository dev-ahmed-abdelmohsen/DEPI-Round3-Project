import React, { useEffect, useState } from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilLockLocked,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar10 from './../../assets/images/avatars/10.jpg'
import avatar11 from './../../assets/images/avatars/11.jpg'
import api from 'src/services/api'
import { useNavigate } from 'react-router-dom'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()

  const [amIadmin, setAmIAdmin] = useState(false)
  const checkAdminStatus = async () => {
    try {
      const response = await api.get('/admin/amIAdmin')
      setAmIAdmin(response.data.success)
      console.log('Am I admin:', response.data.success)
    } catch (error) {
        setAmIAdmin(false)
      console.error('Error checking admin status:', error)
  }
  }

  useEffect(() => {
    checkAdminStatus()
  }, [])

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={ amIadmin? avatar10 : avatar11} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2 ">Account</CDropdownHeader>
        { amIadmin ?
          <CDropdownItem
            style={{ cursor: 'pointer' }}
            onClick={async () => {
              // Handle lock account logic here
              try {
                const logoutResponse = await api.post('/admin/logout')
              } catch (error) {
                console.error('Error during logout:', error)
              }

              // Optionally, you can clear the token from localStorage
              localStorage.removeItem('authToken')

              // console.log(logoutResponse)
              // console.log('Account locked')
              navigate('/login', {
                state: { message: 'Account locked. Please log in again.' },
              })
            }}
          >
            <CIcon icon={cilLockLocked} className="me-2" />
            Lock Account
          </CDropdownItem>
          :
          <CDropdownItem
            style={{ cursor: 'pointer' }}
            onClick={async () => {
              navigate('/login')
            }}
          >
            <CIcon icon={cilUser} className="me-2" />
            Login
          </CDropdownItem>
        }
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
