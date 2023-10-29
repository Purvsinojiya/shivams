const express = require('express');
const Middelware =require("../Middelware/middelware.js")

const { addProduct,getAllProduct,deleteProduct,updateProduct,getAllUsers,allorder,cancelOrder, allstock,returnOrder,stockadd     } = require('../Controller/admin-controler');

const adminRouter = express.Router();

adminRouter.post('/addProduct',Middelware,addProduct);
adminRouter.get('/getallProduct',Middelware,getAllProduct);
adminRouter.delete('/deleteProduct/:productId',deleteProduct);
adminRouter.put('/updateProduct/:productId', updateProduct);
adminRouter.get('/user',getAllUsers);
adminRouter.get('/order',Middelware,allorder);
adminRouter.post('/addstock',Middelware,stockadd);
adminRouter.get('/stocks',Middelware,allstock);
adminRouter.put('/order/cancel/:productId',cancelOrder);
adminRouter.put('/order/return/:productId',returnOrder);

module.exports = adminRouter;