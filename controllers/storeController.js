const Home=require('../models/homes');
const User=require('../models/user')
exports.getIndex=(req,res,next)=>{
    Home.find().then(registeredHomes=>{
        res.render('store/index',{
            registeredHomes:registeredHomes,
            pageTitle:'Home',
            currentPage:'Home',
            isLoggedIn:req.isLoggedIn,
            user: req.session.user
        });
    });
}
exports.getHomes=(req,res,next)=>{
    Home.find().then(registeredHomes=>{
        res.render('store/homeList',{
            registeredHomes:registeredHomes,
            pageTitle:'Home List',
            currentPage:'Home List',
            isLoggedIn:req.isLoggedIn,
            user: req.session.user
        });
    });
}
exports.getBookings=(req,res,next)=>{
    Home.find().then(registeredHomes=>{
        res.render('store/bookings',{
            registeredHomes:registeredHomes,
            pageTitle:'My Bookings',
            currentPage:'Bookings',
            isLoggedIn:req.isLoggedIn,
            user: req.session.user
        });
    });
}
exports.getFavorites=async (req,res,next)=>{
    const userId=req.session.user._id;
    const user=await User.findById(userId).populate('favorites');
    res.render('store/FavoriteList',{
        FavoriteHomes:user.favorites,
        pageTitle:'My Favorites',
        currentPage:'Favorites',
        isLoggedIn:req.isLoggedIn,
        user: req.session.user
    });
}
exports.postAddToFavorites=async(req,res,next)=>{
    const homeId=req.body.id;
    const userId=req.session.user._id;
    const user=await User.findById(userId)
    if(!user.favorites.includes(homeId)){
        user.favorites.push(homeId);
        await user.save();
    }
    res.redirect('/Favorites')
}
exports.postRemoveFromFavorites=async (req,res,next)=>{
    const homeId=req.params.id;
    const userId=req.session.user._id;
    const user=await User.findById(userId)
    if(user.favorites.includes(homeId)){
        user.favorites=user.favorites.filter(fav=>fav!=homeId)
        await user.save();
    }
    res.redirect('/Favorites')
}
exports.getHomeDetails=(req,res,next)=>{
    const homeId=req.params.homeId;
    Home.findById(homeId).then(homes=>{
        const home=homes;
        if(!home){
            console.log('Home not found');
            res.redirect('/homes');
            return;
        }
        res.render('store/homeDetail',{home:home,
            pageTitle:'Home Detail',
            currentPage:'Home',
            isLoggedIn:req.isLoggedIn,
            user: req.session.user
        });
    });
}