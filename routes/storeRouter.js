const express=require('express');
const storeRouter=express.Router();
const storeController=require('../controllers/storeController');

storeRouter.get('/',storeController.getIndex);
storeRouter.get('/homes',storeController.getHomes);
storeRouter.get('/bookings',storeController.getBookings);
storeRouter.get('/Favorites',storeController.getFavorites);
storeRouter.post('/Favorites',storeController.postAddToFavorites);
storeRouter.post('/Favorites/remove/:id',storeController.postRemoveFromFavorites);
storeRouter.get('/homes/:homeId',storeController.getHomeDetails);

module.exports=storeRouter;