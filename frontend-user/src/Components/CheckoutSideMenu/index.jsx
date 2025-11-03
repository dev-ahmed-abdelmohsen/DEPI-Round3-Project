import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { ShoppingCartContext } from '../../Context'
import OrderCard from '../OrderCard'
import { totalPrice } from '../../utils'
import './styles.css'
import axios from "axios";

const CheckoutSideMenu = () => {
  const context = useContext(ShoppingCartContext)
  const navigate = useNavigate()

    const handleDelete = async (id) => {
        try {
            await context.removeFromCart(id)
        } catch (error) {
            console.error("Failed to add product to cart:", error);
            // Here you could add logic to notify the user that the action failed.

            // later add a toast notification or alert
        }

  }

  const handleViewCart = () => {
    context.closeCheckoutSideMenu()
    navigate('/cart-summary')
  }

  return (
    <>
        <div
            className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ease-in-out ${
                context.isCheckoutSideMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => context.closeCheckoutSideMenu()}
        />
        <aside
            className={`checkout-side-menu flex flex-col fixed right-0 border border-black rounded-lg bg-white
                w-full sm:w-[360px] h-[calc(100vh-68px)] top-[68px]
                transform transition-transform duration-300 ease-in-out
                ${context.isCheckoutSideMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className='flex justify-between items-center p-6'>
                <h2 className='font-medium text-xl'>My Cart</h2>
                <div>
                    <XMarkIcon
                        className='h-6 w-6 text-black-500 cursor-pointer'
                        onClick={() => context.closeCheckoutSideMenu()}>
                    </XMarkIcon>
                </div>
            </div>
            {/* Contenedor con scroll para productos */}
            <div className='flex-1 overflow-y-auto px-6'>
                {context.cartProducts.map(product => (
                    <OrderCard
                        key={product.id}
                        id={product.id}
                        title={product.title}
                        imageUrl={product.primaryImage}
                        price={product.price}
                        quantity={product.quantity}
                        handleDelete={handleDelete}
                    />
                ))}
            </div>
            {/* Footer fijo con total y botón */}
            <div className='px-6 py-4 border-t border-gray-200 mt-auto'>
                <p className='flex justify-between items-center mb-2'>
                    <span className='font-light'>Total:</span>
                    <span className='font-medium text-2xl'>${totalPrice(context.cartProducts)}</span>
                </p>
                <button
                    className='bg-black py-3 text-white w-full rounded-lg'
                    onClick={handleViewCart}>
                    View Cart
                </button>
            </div>
        </aside>
    </>
)
}

export default CheckoutSideMenu