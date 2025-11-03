import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilUser,
  cilPeople,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavGroup,
    name: 'Products',
    to: '/products',
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
    permission: ['view products', 'edit products', 'delete products', 'create products'],
    items: [
      {
        component: CNavItem,
        name: 'List Products',
        to: '/products/list',
        permission: ['view products', 'edit products', 'delete products', 'create products'],
      },
      {
        component: CNavItem,
        name: 'Add Product',
        to: '/products/add',
        permission: ['create products'],
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Users',
    to: '/users',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    permission: ['view users', 'edit users', 'delete users', 'create users'],
    items: [
      {
        component: CNavItem,
        name: 'List Users',
        to: '/users',
        permission: ['view users', 'edit users', 'delete users'],
      },
      {
        component: CNavItem,
        name: 'Add User',
        to: '/users/add',
        permission: ['create users'],

      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Admins',
    to: '/admins',
    permission: ['view admins', 'edit admins', 'delete admins', 'create admins'],
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'List Admins',
        to: '/admins',
        permission: ['view admins', 'edit admins', 'delete admins'],
      },
      {
        component: CNavItem,
        name: 'Add Admin',
        to: '/admins/add',
        permission: ['create admins'],
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Roles',
    to: '/roles',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
    permission: ['view roles', 'edit roles', 'delete roles', 'create roles'],
    items: [
      {
        component: CNavItem,
        name: 'List Roles',
        to: '/roles',
        permission: ['view roles', 'edit roles', 'delete roles'],
      },
      {
        component: CNavItem,
        name: 'Add Role',
        to: '/roles/add',
        permission: ['create roles'],
      },
    ],
  },
]

export default _nav
