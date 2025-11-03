/**
 * This function calculates total price of a new order
 * @param {Array} products cartProduct: Array of Objects
 * @returns {number} Total price
 */
export const totalPrice = (products) => {
    if (!products) {
        return 0
    }
    let sum = 0
    products.forEach(product => sum += (product.quantity??1) * product.price)
    return parseFloat(Number(sum).toFixed(2))
}