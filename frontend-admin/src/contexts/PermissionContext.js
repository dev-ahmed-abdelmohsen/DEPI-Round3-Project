import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

export const PermissionContext = createContext([])

export const PermissionProvider = ({ children }) => {
    const [permissions, setPermissions] = useState([])
    const [token, setToken] = useState(localStorage.getItem('authToken'))

    useEffect(() => {
        api.get('/admin/adminPermissions')
            .then(res => {
                if (res.data && res.data.success === false && res.data.message === 'unauthenticated') {
                    setPermissions([])
                } else if (res.data && res.data.data) {
                    setPermissions(res.data.data.map(p => p.name))
                }
            })
            .catch(() => {
                // Mute API error in the console
                setPermissions([])
            })
    }, [token])

    // Listen for changes in localStorage to update the token
    // This is useful if the token is updated in another tab or window
    // and we want to reflect that change in the current context
    // Note: This will not work in the same tab, only across different tabs/windows
    useEffect(() => {
        const onStorage = () => setToken(localStorage.getItem('authToken'))
        window.addEventListener('storage', onStorage)
        return () => window.removeEventListener('storage', onStorage)
    }, [])

    // Also update token and permissions when it changes in this tab
    useEffect(() => {
        const origSetItem = localStorage.setItem
        const origRemoveItem = localStorage.removeItem
        localStorage.setItem = function(key, value) {
            origSetItem.apply(this, arguments)
            if (key === 'authToken') {
                setToken(value)
            }
        }
        localStorage.removeItem = function(key) {
            origRemoveItem.apply(this, arguments)
            if (key === 'authToken') {
                setToken(null)
            }
        }
        return () => {
            localStorage.setItem = origSetItem
            localStorage.removeItem = origRemoveItem
        }
    }, [])

    return (
        <PermissionContext.Provider value={permissions}>
            {children}
        </PermissionContext.Provider>
    )
}
