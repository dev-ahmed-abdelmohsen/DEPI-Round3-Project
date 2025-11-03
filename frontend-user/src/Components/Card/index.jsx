import { useState, useContext } from 'react'
import { PlusIcon, CheckIcon } from '@heroicons/react/24/solid'
import { ShoppingCartContext } from '../../Context'

const Card = (data) => {
    const [isAdded, setIsAdded] = useState(false)
    const context = useContext(ShoppingCartContext)

    const showProduct = (productDetail) => {
        context.openProductDetail()
        context.setProductToShow(productDetail)
    }

    const addProductsToCart = (event, productData) => {
        event.stopPropagation()
        context.addToCart(productData)
        context.closeProductDetail()
        setIsAdded(true)
        setTimeout(() => setIsAdded(false), 1000)
    }

    const renderIcon = () => {
        // const isInCart = context.cartProducts.filter(product => product.id === id).length > 0

        if (isAdded) {
            return (
                <div 
                    className="absolute top-0 right-0 flex justify-center items-center bg-black w-6 h-6 rounded-full m-2">
                    <CheckIcon className='h-6 w-6 text-white'></CheckIcon>
                </div>
            )
        } else {
            return (
                <div 
                    className="absolute top-0 right-0 flex justify-center items-center bg-white w-6 h-6 rounded-full m-2 hover:bg-gray-100"
                    onClick={(event) => addProductsToCart(event, data.data)}>
                    <PlusIcon className='h-6 w-6 text-black'></PlusIcon>
                </div>
            )
        }
    }

    return(
        <div 
            className="bg-white cursor-pointer w-full max-w-[280px] mx-auto h-60 rounded-lg hover:shadow-lg transition-shadow"
            onClick={() => showProduct(data.data)}>
            <figure className="relative mb-2 w-full h-4/5">
                <span className="absolute bottom-0 left-0 bg-white/60 rounded-lg text-black text-xs m-2 px-3 py-0.5">{data.data.category.name}</span>
                <img
                  className="w-full h-full object-cover rounded-lg"
                  src={data.data.images[0] ?? `https://placehold.jp/000000/ffffff/300x300.png?text=${data.data.title}`}
                  alt={data.data.title}
                  onError={e => { e.target.onerror = null; e.target.src = `https://placehold.jp/000000/ffffff/300x300.png?text=${data.data.title}` }}
                />
                {renderIcon()}
            </figure>
            <p className="flex justify-between px-2 items-center">
                <span className="text-sm font-light truncate">{data.data.title}</span>
                <span className="text-lg font-medium">${data.data.price}</span>
            </p>
        </div>
    )
}

export default Card
