import { useRoutes, BrowserRouter } from 'react-router-dom'
import { ShoppingCartProvider, ShoppingCartContext } from '../../Context'
import Home from '../Home'
import MyAccount from '../MyAccount'
import MyOrder from '../MyOrder'
import MyOrders from '../MyOrders'
import NotFound from '../NotFound'
import SignIn from '../SignIn'
import SignUp from '../SignUp'
import Navbar from '../../Components/Navbar'
import CheckoutSideMenu from '../../Components/CheckoutSideMenu'
import ProtectedRoute from '../../Components/ProtectedRoute'
import CartSummary from '../../Components/CartSummary'
import './App.css'
import { useContext } from 'react'

const AppRoutes = () => {
  const context = useContext(ShoppingCartContext)
  const { categories, isLoading } = context

  const categoryRoutes = categories.map(category => ({
    path: `/${category.name.toLowerCase()}`,
    element: <Home />
  }))

  let routes = useRoutes([
    { path: '/', element: <Home /> },
    ...categoryRoutes,
    { path: '/cart-summary', element: <CartSummary /> },
    { 
      path: '/my-account', 
      element: (
        <ProtectedRoute>
          <MyAccount />
        </ProtectedRoute>
      ) 
    },
    { 
      path: '/my-order', 
      element: (
        <ProtectedRoute>
          <MyOrder />
        </ProtectedRoute>
      ) 
    },
    { 
      path: '/my-orders', 
      element: (
        <ProtectedRoute>
          <MyOrders />
        </ProtectedRoute>
      ) 
    },
    { 
      path: '/my-orders/last', 
      element: (
        <ProtectedRoute>
          <MyOrder />
        </ProtectedRoute>
      ) 
    },
    { 
      path: '/my-orders/:id', 
      element: (
        <ProtectedRoute>
          <MyOrder />
        </ProtectedRoute>
      ) 
    },
    { path: '/sign-in', element: <SignIn /> },
    { path: '/sign-up', element: <SignUp /> },
    { path: '/*', element: <NotFound /> },
  ])

  if (isLoading) {
    return null // or a loading spinner component
  }
  
  return routes
}

const App = () => {
  return (
    <ShoppingCartProvider>
      <BrowserRouter>
        <AppRoutes />
        <Navbar />
        <CheckoutSideMenu />
      </BrowserRouter>
    </ShoppingCartProvider>
  )
}

export default App