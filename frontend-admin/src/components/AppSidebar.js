import React, { useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { logo } from 'src/assets/brand/logo'
import { sygnet } from 'src/assets/brand/sygnet'

// sidebar nav config
import navigation from '../_nav'
import { PermissionContext } from '../contexts/PermissionContext'

function filterNav(items, permissions) {
  // If permissions is empty (unauthenticated), only show items without a permission property
  if (!permissions || permissions.length === 0) {
    return items
      .filter(item => !item.permission)
      .map(item =>
        item.items
          ? { ...item, items: filterNav(item.items, permissions) }
          : item
      )
  }
  // Otherwise, filter as before
  return items
    .filter(item => {
      if (!item.permission) return true
      if (Array.isArray(item.permission)) {
        return item.permission.some(p => permissions.includes(p))
      }
      return permissions.includes(item.permission)
    })
    .map(item =>
      item.items
        ? { ...item, items: filterNav(item.items, permissions) }
        : item
    )
}

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const permissions = useContext(PermissionContext)
  const filteredNav = filterNav(navigation, permissions)

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        {/*<CSidebarBrand to="/">*/}
        {/*  <CIcon customClassName="sidebar-brand-full" icon={logo} height={32} />*/}
        {/*  <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} />*/}
        {/*</CSidebarBrand>*/}
        {/*<CCloseButton*/}
        {/*  className="d-lg-none"*/}
        {/*  dark*/}
        {/*  onClick={() => dispatch({ type: 'set', sidebarShow: false })}*/}
        {/*/>*/}
      </CSidebarHeader>
      <AppSidebarNav items={filteredNav} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default AppSidebar
