//Todo: Load more Products
import { createContext, useState, useEffect, useMemo } from 'react'
import api from "../services/api.js";
import { totalPrice } from '../../src/utils'


export const ShoppingCartContext = createContext()

// eslint-disable-next-line react/prop-types
export const ShoppingCartProvider = ({children}) => {
    // Cart State
    const [count, setCount] = useState(0)
    const [cartProducts, setCartProducts] = useState([])
    const [order, setOrder] = useState([])

    // UI State
    const [isProductDetailOpen, setIsProductDetailOpen] = useState(false)
    const [isCheckoutSideMenuOpen, setIsCheckoutSideMenuOpen] = useState(false)
    const [productToShow, setProductToShow] = useState({})
    const [isLoading, setIsLoading] = useState(true)

    // Products State
    const [items, setItems] = useState(null)
    const [filteredItems, setFilteredItems] = useState(null)
    const [searchByTitle, setSearchByTitle] = useState(null)
    const [searchByCategory, setSearchByCategory] = useState(null)
    const [categories, setCategories] = useState([])
    const [offset, setOffset] = useState(1)
    const limit = 12;

    // User State
    const [account, setAccount] = useState(null)
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false)

    // UI Actions
    const openProductDetail = () => setIsProductDetailOpen(true)
    const closeProductDetail = () => setIsProductDetailOpen(false)
    const openCheckoutSideMenu = () => setIsCheckoutSideMenuOpen(true)
    const closeCheckoutSideMenu = () => setIsCheckoutSideMenuOpen(false)

    // Fetch Categories
    const fetchCategories = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/categories`)
            const data = await response.json()
            setCategories(data.data)
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
    }


    const fetchAndSetOrders = async () => {
        const orders = await fetchOrdersIndex()
        setOrder(orders)
    }

    // Initialize user session
    useEffect(() => {
        const loadUserSession = async () => {
            await updateLoginStatus()
            await fetchCategories()




            await fetchAndSetOrders()

            const backendCart = await fetchCart();
            setCartProducts(backendCart)
            setCount(backendCart.reduce((total, product) => total + product.quantity, 0))
            setIsLoading(false)
        }

        loadUserSession()
    }, [])

    // Save order to localStorage when it changes
    useEffect(() => {
        if (order.length > 0) {
            localStorage.setItem('order', JSON.stringify(order))
        }
    }, [order])

    // Authentication methods
    const handleSignIn = async (email, password) => {
        let savedAccountJson = localStorage.getItem('account')
        let savedAccount = null
        try
        {
            const response = await api.post('/login', {
                'email': email,
                'password': password
            })

            savedAccount = response.data.data.user
            savedAccountJson = JSON.stringify(savedAccount)
            // console.log(savedAccountJson)
            setAccount(savedAccount)
            localStorage.setItem('authToken', response.data.data.token)



        }
        catch (error) {
            // console.error('Error during sign in:', error);
            const message = error.response?.data?.message;
            // console.log(message)
            if (message) {
                if (typeof message === 'object') {
                    const errorMessages = Object.values(message).flat();
                    // console.log(errorMessages.join(' '))
                    throw new Error(errorMessages.join(' '));
                } else if (typeof message === 'string') {
                    throw new Error(message);
                }
            }

            // If the error is not an array, throw the default error message
            throw new Error(error.response.data.data || 'An error occurred during sign in')
        }


        localStorage.setItem('isUserAuthenticated', 'true')
        localStorage.setItem('account', savedAccountJson)
        setIsUserAuthenticated(true)
        localStorage.setItem('isUserAuthenticated', 'true')

        // Recover pending cart if exists
        const pendingCart = localStorage.getItem('pendingCart')
        if (pendingCart) {
            setCartProducts(JSON.parse(pendingCart))
            localStorage.removeItem('pendingCart')
        }

        return true

        // return false
    }

    const handleSignUp = async (email, password, name) => {

        try {
            const response = await api.post('/register', {
                'name' : name,
                'email' : email,
                'password' : password,
                'password_confirmation' : password,
            })
            // console.log(response.data.data)

            // const newAccount = { email, password, name }
            const newAccount = { email, name }
            setAccount(newAccount)
            setIsUserAuthenticated(true)
            localStorage.setItem('account', JSON.stringify(newAccount))
            localStorage.setItem('isUserAuthenticated', 'true')
            localStorage.setItem('authToken', response.data.data.token)
        }
        catch (error) {
            // console.error('Error during sign up:', error);
            const message = error.response?.data?.message;
            // console.log(message)
            if (message) {
                if (typeof message === 'object') {
                    const errorMessages = Object.values(message).flat();
                    // console.log(errorMessages.join(' '))
                    throw new Error(errorMessages.join(' '));
                } else if (typeof message === 'string') {
                    throw new Error(message);
                }
            }

            // If the error is not an array, throw the default error message
            throw new Error(error.response.data.data || 'An error occurred during sign up')
        }



    }

    const handleSignOut = async () => {
        try{
            const response = await api.post('/logout')
            // console.log('logout response:', response)
        }
        catch (error) {
            console.error('Error during sign out:', error);
            // Handle error if needed, e.g., show a notification
            throw error;
        }
        finally {
            // Clear user session
            setIsUserAuthenticated(false)
            setAccount(null)

            // Clear cart and orders
            setCartProducts([])
            setCount(0)

            // Clear localStorage
            localStorage.removeItem('authToken')
            localStorage.setItem('isUserAuthenticated', 'false')
            localStorage.removeItem('pendingCart')
        }
        // should I remove account and order from localStorage, account shouldn't be created?
        // localStorage.removeItem('account')
        // localStorage.removeItem('order')
        
        // Close any open modals
        closeProductDetail()
        closeCheckoutSideMenu()
    }

    const updateLoginStatus = async () => {

        setIsLoading(true)
        try {
            const response = await api.get('/amIUser')
            // console.log(response.data.data)
            setAccount(response.data.data.user)
            setIsUserAuthenticated(response.data.success)
            localStorage.setItem('account', JSON.stringify(response.data.data.user))
            localStorage.setItem('isUserAuthenticated', !!response.data.success)
            setIsLoading(false)
            return true
        } catch (error) {
            console.error('Error fetching user data:', error)
            setIsUserAuthenticated(false)
            localStorage.setItem('isUserAuthenticated', false)
            setIsLoading(false)
            return false
        }
        // return is added for convenience
    }

    // Fetch products
    const fetchProducts = async (pageOffset, title, category) => {
        try {
            setOffset(pageOffset)
            let endpoint = 'products';
            const params = new URLSearchParams({
                page: pageOffset,
                per_page: limit,
            });

            if (title || category) {
                endpoint = 'products/search';
            if (title) {
                    params.append('query', title);
            }
            if (category) {
                    params.append('category', category);
            }
            }

            const url = `${import.meta.env.VITE_API_URL}/${endpoint}?${params.toString()}`;
            const response = await fetch(url)
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json()

            // console.log(data)
            return data.data.data
        } catch (error) {
            console.error('Error fetching products:', error)
            return []
        }
    }

    const loadMoreItems = async () => {
        const newOffset = offset + 1;
        const newItems = await fetchProducts(newOffset, searchByTitle, searchByCategory);
        if (newItems.length > 0) {
            setItems(prevItems => [...prevItems, ...newItems]);
            setOffset(newOffset);
        }
    }


    // fetch cart from the backend
     const fetchCart = async () => {
         try {
             const cartResponse = await api.get('/cart')
             // console.log(cartResponse.data.data)
             // setCartProducts(cartResponse.data.data)
             const cartItems = cartResponse.data.data.map(cart => {
                 return {
                     ...cart.product,
                     price: parseInt(cart.product.price),
                     title: cart.product.name,
                     quantity: cart.quantity
                 }
             })
             // console.log(cartItems)
             return cartItems
         }
         catch (error) {
                // console.error('Error fetching cart:', error.response?.data?.message || error.message)
                // Handle error, e.g., show a notification
                return []
         }

    }

    const fetchOrdersIndex = async () => {

        try {
            const ordersIndexResponse = await api.get('/order')

            const orders = ordersIndexResponse.data.data.map(order => ({
                ...order,
                date: order.created_at,
                products: order.products.map(product => ({
                    ...product,
                    title: product.name,
                    price: parseFloat(Number(product.price).toFixed(2)),
                })),
                totalProducts: order.products.length,
                totalPrice: totalPrice(order.products)

            }))
            return orders
        }
        catch (error) {
            // console.error('Error fetching orders:', error)
            return []

        }


    }

    // const fetchOrder = async (id) => {}


    useEffect(() => {
        const getProducts = async () => {
            const initialItems = await fetchProducts(0, searchByTitle, searchByCategory)
            setItems(initialItems)
        }
        getProducts()
    }, [searchByTitle, searchByCategory])



    // Memoized filter functions are no longer needed as filtering is done on the backend.

    // Update filtered items when filters change
    useEffect(() => {
        // The items state is now directly the filtered items from the backend
        setFilteredItems(items)
    }, [items])

    // Cart methods
    const addToCart = (productData, quantity = 1) => {
        try
        {
            const response = api.post('/cart/add',  {
                product_id: productData.id,
                quantity: quantity
            })
        }
        catch (error) {
            console.error('Error adding product to cart:', error)
            // Handle error, e.g., show a notification
            // later add a toast notification or alert
        }

        // search if product already exists in cart
        const existingProduct = cartProducts.find(product => product.id === productData.id)
        if (existingProduct) {
            // If the product already exists, update its quantity
            setCartProducts(prev => prev.map(product =>
                product.id === productData.id
                    ? { ...product, quantity: product.quantity + quantity }
                    : product
            ))
            // not sure where is it used
            setCount(prev => prev + quantity)

        }
        else {
            // If the product does not exist, add it to the cart
            productData.quantity = quantity // Add quantity to the product data
            // console.log('Adding product to cart:', productData)

            setCartProducts(prev => [...prev, productData])
            setCount(prev => prev + productData.quantity)
        }

        // openCheckoutSideMenu()
    }

    const removeFromCart = (id, quantity = 1) => {

        try
        {
            // console.log('Removing product from cart:', id, 'Quantity:', quantity)
            const response = api.post('/cart/subtract',  {
                product_id: id,
                quantity: quantity
            })
        }
        catch (error) {
            console.error('Error subtracting product to cart:', error)
            // Handle error, e.g., show a notification
            // later add a toast notification or alert
        }


        const existingProduct = cartProducts.find(product => product.id === id)
        if (quantity >= existingProduct.quantity) {
            setCartProducts(prevCart => prevCart.filter(item => item.id !== id));
            setCount(prev => prev - quantity)
        }

        else if (existingProduct) {
            // If the product already exists, update its quantity
            setCartProducts(prev => prev.map(product =>
                product.id === id
                    ? { ...product, quantity: product.quantity - quantity }
                    : product
            ))
            // not sure where is it used
            setCount(prev => prev -  quantity)

        }

        // setCartProducts(prev => prev.filter(product => product.id !== id))


    }

    const handleCheckout = async () => {
        if (!isUserAuthenticated) {
            // todo check this functionality and logic later
            // If the user is not authenticated, save the cart to localStorage
            localStorage.setItem('pendingCart', JSON.stringify(cartProducts))
            return false
        }
        let checkoutResponse = null
        try {

            // Ensure the cart is synced with the backend
            // This is to handle cases where the cart might have been modified on another device or session

            const localCart = cartProducts;
            const backendCart = await fetchCart();

            const isCartSynced = localCart.length === backendCart.length &&
                localCart.every(localItem => {
                    const backendItem = backendCart.find(bItem => bItem.id === localItem.id);
                    return backendItem && backendItem.quantity === localItem.quantity;
                });

            if (!isCartSynced) {
                setCartProducts(backendCart);
            }



            // Proceed with checkout
            checkoutResponse = await api.post('/order', {
                //ignoring the shipping address for now
            })
            // console.log(checkoutResponse.data.data)

            // Clear cart after successful checkout
            setCartProducts([])
            setCount(0)
            localStorage.removeItem('pendingCart')


        } catch (error) {
            console.error('Error during checkout:', error)
            // Handle error, e.g., show a notification
            throw error
        }

        // If checkout was successful, create an order object from the response

        const orderData = checkoutResponse.data.data;
        const orderToAdd = {
            ...orderData,
            date: orderData.created_at,
            products: orderData.products.map(product => ({
                ...product,
                title: product.name,
            })),
            totalProducts: orderData.products.reduce((sum, product) => sum + product.quantity, 0),
            totalPrice: orderData.total
        };

        setOrder((prev) => [...prev, orderToAdd])
        setCartProducts([])
        setSearchByTitle(null)

        // fetchAndSetOrders()

        return true

    }

    const contextValue = {
        // Cart
        count,
        setCount,
        cartProducts,
        setCartProducts,
        addToCart,
        removeFromCart,
        order,
        setOrder,
        handleCheckout,

        // UI
        isProductDetailOpen,
        openProductDetail,
        closeProductDetail,
        isCheckoutSideMenuOpen,
        openCheckoutSideMenu,
        closeCheckoutSideMenu,
        productToShow,
        setProductToShow,
        isLoading,

        // Products
        items,
        filteredItems,
        searchByTitle,
        setSearchByTitle,
        searchByCategory,
        setSearchByCategory,
        categories,
        loadMoreItems,
        fetchAndSetOrders,

        // User
        account,
        isUserAuthenticated,
        handleSignIn,
        handleSignUp,
        handleSignOut,
        updateLoginStatus
    }

    return (
        <ShoppingCartContext.Provider value={contextValue}>
            {children}
        </ShoppingCartContext.Provider>
    )
}