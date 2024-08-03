import express from 'express'
import { createOrderController } from '../../Controller/order/OrderController.js'
const route = express.Router()




// -------------create order---------------


route.post('/create', createOrderController)












export default route