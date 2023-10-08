const express = require('express');
const userRouter = express.Router();
const { signup,verifyOTP,sentOTP, getAllMovies, Products,stripes,verifylogin,Addres,order,Profile,updateProfileByUserId,buy,login} = require("../Controller/user-controler")
const authMiddleware = require('../Middelware/middelware');



 // Make sure to import the Signup model or replace it with the correct model import

userRouter.post('/Signup',signup );
userRouter.post('/verifyOTP/:number',verifyOTP)
userRouter.post('/login',login);
userRouter.get('/verifylogin',verifylogin);
userRouter.post('/payment',stripes);
userRouter.post('/sentOTP/:number',sentOTP);
userRouter.get('/home',getAllMovies)
userRouter.post('/buy',buy)
userRouter.post('/checkout',Addres);
userRouter.post('/Profile',Profile);
userRouter.put('/profile/:userId',updateProfileByUserId);
userRouter.post('/order',order);
userRouter.get('/home/:id',Products)



module.exports = userRouter;