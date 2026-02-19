const Home=require('../models/homes');
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
exports.postAddHome=(req,res,next)=>{
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
        photo:req.file.path
    });
    
    home.save().then(()=>{
        console.log('Home saved successfully')
    });
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
exports.getHostHomes=(req,res,next)=>{
    Home.find().then(registeredHomes=>{
        res.render('host/hostHomeList',{
            registeredHomes:registeredHomes,
            pageTitle:'Host Home List',
            currentPage:'Host Home List',
            isLoggedIn:req.isLoggedIn,
            user: req.session.user
        });
    });
}
exports.postDeleteHome=(req,res,next)=>{
    const homeId=req.params.homeId;
    Home.findByIdAndDelete(homeId).then(() => {
        res.redirect('/host/host-home-list');
    }).catch(err => {
        console.log('Error while deleting home', err);
        res.redirect('/host/host-home-list');
    });
}