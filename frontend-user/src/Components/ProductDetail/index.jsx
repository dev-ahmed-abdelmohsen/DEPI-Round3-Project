import {useContext, useEffect} from 'react'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { ShoppingCartContext } from '../../Context'
import './styles.css'
import axios from "axios";

const ProductDetail = () => {
    const context = useContext(ShoppingCartContext)

    const handleAddToCart = async (event) => {
        event.stopPropagation()
        await context.addToCart(context.productToShow)
        context.openCheckoutSideMenu()
        context.closeProductDetail()
    }

    useEffect(() => {
        console.log(context.productToShow)
        console.log(context.IsProductDetailOpen)
    }, [context.IsProductDetailOpen]);

    return (
        <>
            {/* Overlay con fade */}
            <div 
                className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ease-in-out ${
                    context.isProductDetailOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => context.closeProductDetail()}
            />
            
            {/* Aside con transición */}
            <aside 
                className={`product-detail flex flex-col fixed right-0 border border-black rounded-lg bg-white
                    transform transition-transform duration-300 ease-in-out
                    ${context.isProductDetailOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className='flex justify-between items-center p-6'>
                    <h2 className='font-medium text-xl'>Detail</h2>
                    <div>
                        <XMarkIcon
                            className='h-6 w-6 text-black-500 cursor-pointer'
                            onClick={() => context.closeProductDetail()}>
                        </XMarkIcon>
                    </div>
                </div>
                <div className='flex-1 overflow-y-auto'>
                    <figure className='px-6'>
                        <img
                            src={context.productToShow.primaryImage}
                            alt={context.productToShow.title}
                            onError={e => { e.target.onerror = null; e.target.src = `https://placehold.jp/000000/ffffff/300x300.png?text=${context.productToShow.title}`; console.log(productToShow) }}
                            className='w-full h-full rounded-lg'/>
                    </figure>
                    <div className='flex flex-col p-6'>
                        <span className='font-medium text-2xl mb-2'>${context.productToShow.price}</span>
                        <span className='font-medium text-md'>{context.productToShow.title}</span>
                        <span className='font-light text-sm'>{context.productToShow.description}</span>
                    </div>
                </div>
                <div className='px-6 mb-6'>
                    <button 
                        className='bg-black py-3 text-white w-full rounded-lg' 
                        onClick={handleAddToCart}>
                        Add to Cart
                    </button>
                </div>
            </aside>
        </>
    )
}

export default ProductDetail