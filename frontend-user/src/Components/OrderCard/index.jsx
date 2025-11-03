import { XMarkIcon } from "@heroicons/react/24/solid"
import {useEffect} from "react";

const OrderCard = props => {
    const { id, title, imageUrl, price, handleDelete, quantity } = props
    let renderXMarkIcon
    if (handleDelete) {
        renderXMarkIcon = <XMarkIcon  onClick={() => handleDelete(id)} className='h-6 w-6 text-black cursor-pointer'></XMarkIcon>
    }

    useEffect(()=>{
        console.log(imageUrl)
    }, [])

    return (
        <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
                <figure className="w-20 h-20">
                    <img className="w-full h-full rounded-lg object-cover"
                    src={imageUrl ?? `https://placehold.jp/000000/ffffff/300x300.png?text=${title}`}
                    // src={imageUrl}
                    alt={title}
                    onError={e => { e.target.onerror = null; e.target.src = `https://placehold.jp/000000/ffffff/300x300.png?text=${title}` }}
                    />
                </figure>
                <p className="text-sm font-light">{title}</p>
            </div>
            <div className=" flex items-center gap-2">
                <p className="text-lg font-medium">{quantity??1} x ${price}</p>
                {renderXMarkIcon}
            </div>
        </div>
    )
}

export default OrderCard