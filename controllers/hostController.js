const Home=require('../models/homes');
const User=require('../models/user');
const fs=require('fs');
exports.getAddHome=(req,res,next)=>{
    res.render('host/editHome',{
        pageTitle:'Add Home',
        currentPage:'Add Home',
        editing:false,
        isLoggedIn:req.isLoggedIn,
        user: req.session.user
    });
}
exports.getEditHome=(req,res,next)=>{
    const homeId=req.params.homeId;
    const editing=req.query.editing==='true';
    Home.findById(homeId).then(homes=>{
        const home=homes;
        if(!home){
            console.log('Home not found');
            return res.redirect('/');
        }
        res.render('host/editHome',{
            pageTitle:'Edit Home',
            currentPage:'Host Homes',
            editing:editing,
            home:home,
            isLoggedIn:req.isLoggedIn,
            user: req.session.user
        });
    });
        
}
exports.postAddHome=async (req,res,next)=>{
    if(!req.file){
        console.log('No image provided');
        return res.status(422).send('No image provided')
    }
    const {houseName,price,location,rating,description,phone}=req.body;
    const home=new Home({
        houseName,
        price,
        location,
        rating,
        description,
        phone,
        photo:req.file.path,
        owner:req.session.user._id
    });
    
    const savedHome = await home.save();

    const userId=req.session.user._id;
    const user=await User.findById(userId)
    user.adminHouses.push(savedHome._id);
    await user.save();
    
    res.redirect('/host/host-home-list');
}
exports.postEditHome=(req,res,next)=>{
    const {id,houseName,price,location,rating,description}=req.body;
    Home.findById(id).then(home=>{
        home.houseName=houseName;
        home.price=price;
        home.location=location;
        home.rating=rating;
        home.description=description;
        home.phone=phone;
        if(req.file){
            fs.unlink(home.photo,(err)=>{
                if(err){
                    console.log('Error while deleting file',err);
                }
            })
            home.photo=req.file.path;
        }
        home.save().then(result=>{
            console.log("Home Updated", result);
        }).catch(err=>{
            console.log('Error while updating ',err)
        }).catch(err=>{
            console.log('Error while finding',err)
        });
        res.redirect('/host/host-home-list');
    });
}
exports.getHostHomes=async (req,res,next)=>{
    const userId=req.session.user._id;
    const user=await User.findById(userId).populate('adminHouses');
    res.render('host/hostHomeList',{
        registeredHomes:user.adminHouses,
        pageTitle:'Host Home List',
        currentPage:'Host Home List',
        isLoggedIn:req.isLoggedIn,
        user: req.session.user
    });
}
exports.postDeleteHome = async (req, res, next) => {
    const homeId = req.params.homeId;
        await Home.findByIdAndDelete(homeId);
        await User.updateMany(
            { favorites: homeId },
            { $pull: { favorites: homeId } }
        );
        await User.updateMany(
            { bookings: homeId },
            { $pull: { bookings: homeId } }
        );
        await User.updateMany(
            { adminHouses: homeId },
            { $pull: { adminHouses: homeId } }
        );
        await User.updateMany(
            { "requests.home": homeId },
            { $pull: { requests: { home: homeId } } }
        );
        res.redirect('/host/host-home-list');
};
exports.getRequest = async (req, res, next) => {
    const userId = req.session.user._id;

    const user = await User.findById(userId).populate({
        path: 'requests.home'
    });

    res.render('host/request', {
        requests: user.requests,
        pageTitle: 'Requests',
        currentPage: 'Requests',
        isLoggedIn: req.isLoggedIn,
        user: req.session.user
    });
};
exports.postDeleteRequest = async (req, res, next) => {
    const homeId = req.params.homeId;
    const adminId = req.session.user._id;
    const admin = await User.findById(adminId);
    const request = admin.requests.find(r => r.home.toString() === homeId);
    if (!request) {
        return res.redirect('/host/request');
    }
    const guest = await User.findOne({ email: request.guestEmail });
    if (guest) {
        guest.bookings = guest.bookings.filter(book => book.toString() !== homeId);
        await guest.save();
    }
    admin.requests = admin.requests.filter(r => r.home.toString() !== homeId);
    await admin.save();
    res.redirect('/host/request');
};