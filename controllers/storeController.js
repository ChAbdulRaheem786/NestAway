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
exports.getBookings=async (req,res,next)=>{
    const userId=req.session.user._id;
    const user=await User.findById(userId).populate('bookings');
    res.render('store/bookings',{
        bookings:user.bookings,
        pageTitle:'Bookings',
        currentPage:'Bookings',
        isLoggedIn:req.isLoggedIn,
        user: req.session.user
    });
}
exports.getFavorites=async (req,res,next)=>{
    const userId=req.session.user._id;
    const user=await User.findById(userId).populate('favorites');
    res.render('store/favoriteList',{
        FavoriteHomes: user.favorites,
        pageTitle:'My Favorites',
        currentPage:'Favorites',
        isLoggedIn:req.isLoggedIn,
        user: req.session.user
    });
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
exports.getBook=(req,res,next)=>{
    const homeId=req.params.homeId;
    Home.findById(homeId).then(homes=>{
        const home=homes;
        if(!home){
            console.log('Home not found');
            res.redirect('/homes');
            return;
        }
        res.render('store/book',{home:home,
            pageTitle:'Book now',
            currentPage:'Book now',
            isLoggedIn:req.isLoggedIn,
            user: req.session.user
        });
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
exports.postBook = async (req, res, next) => {
    const homeId = req.body.homeId;
    const userId = req.session.user._id;

    const user = await User.findById(userId);
    const home = await Home.findById(homeId).populate('owner');
    const admin = home.owner;
    if(!admin.requests.some(r => r.home.toString() === homeId && r.guestEmail === user.email)){
        admin.requests.push({
            home: homeId,
            guestEmail: user.email
        });
        await admin.save();
    }
    if(!user.bookings.some(b => b.toString() === homeId)){
        user.bookings.push(homeId);
        await user.save();
    }
    res.redirect('/bookings');
};
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
exports.postCancelBooking = async (req, res, next) => {
    const homeId = req.params.homeId;
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    const home = await Home.findById(homeId).populate('owner');
    const admin = home.owner;
    admin.requests = admin.requests.filter(req => !(req.home.toString() === homeId && req.guestEmail === user.email));
    await admin.save();
    user.bookings = user.bookings.filter(book => book.toString() !== homeId);
    await user.save();
    res.redirect('/bookings');
};