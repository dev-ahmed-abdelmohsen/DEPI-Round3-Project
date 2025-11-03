import {useContext, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import { ShoppingCartContext } from '../../Context'
import Layout from '../../Components/Layout'
import OrderCard from '../../Components/OrderCard'
import {totalPrice} from "../../utils/index.js";

function MyOrder() {
  const context = useContext(ShoppingCartContext)
  const currentPath = window.location.pathname
  let index = currentPath.substring(currentPath.lastIndexOf('/') + 1)
  if (index === 'last') index = context.order?.length - 1

  let currentOrder = context.order?.[index]
  let totalItems = currentOrder?.products?.reduce((total, product) => total + product.quantity, 0) ?? 0
  let totalAmount = totalPrice(currentOrder?.products) || 0


  // just to ensure the order is fetched when the component mounts
  // this is useful if the user navigates directly to the order page
  // without going through the orders list
  // if the order is not fetched, it will be fetched here
  // and the component will re-render with the fetched order
  // this is a good practice to ensure the data is always up-to-date
  // but it can be removed if you are sure the order is always fetched before this component
  // is rendered
  useEffect(() => {
    if (!context.order || context.order.length === 0) {
      context.fetchAndSetOrders()
    }
  }, [context.order])

  // useEffect(() => {
  //   console.log('Current Order:', currentOrder.products)
  // })
  // const totalAmount = currentOrder?.products.reduce((sum, product) => sum + product.price, 0) || 0

  return (
    <Layout>
      <div className='flex items-center justify-center relative w-80 mb-6'>
        <Link to='/my-orders' className='absolute left-0'>
          <ChevronLeftIcon className='h-6 w-6 text-black cursor-pointer'/>
        </Link>
        <h1>My Order</h1>
      </div>
      <div className='flex flex-col w-80'>
        {currentOrder?.products?.map(product => (
          <OrderCard
            key={product.id}
            id={product.id}
            title={product.title}
            imageUrl={product.primaryImage}
            price={product.price}
            quantity={product.quantity}
          />
        ))}
        <div className="border-t border-black mt-4 pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Total Items:</span>
            <span>{totalItems}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Amount:</span>
            <span>${totalAmount}</span>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default MyOrder