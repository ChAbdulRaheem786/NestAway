const express=require('express');
const get404Router=express.Router();
const errorController=require('../controllers/errors');

get404Router.use(errorController.get404);

module.exports=get404Router;