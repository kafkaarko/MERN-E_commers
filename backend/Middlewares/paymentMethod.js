const OrderModel = require("../Model/OrderModel")

const canShip = (order) =>{
    if(order.paymentId.method === "COD") return true;
    return order.status === 'paid';
}

module.exports = canShip