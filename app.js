// Core Modules
// Built-in Node.js modules
const path=require('path');
// External Modules
// Third-party modules
const express=require('express');
const session=require('express-session');
const MongoDBStore=require('connect-mongodb-session')(session)
const multer=require('multer')
const {default: mongoose}=require('mongoose')
require('dotenv').config();
// Local Modules
// Custom modules within the project
const rootDir=require('./utils/pathUtil');
const storeRouter=require('./routes/storeRouter');
const hostRouter=require('./routes/hostRouter');
const authRouter=require('./routes/authRouter')
const get404Router=require('./routes/404');

const db_path = process.env.MONGO_URI;
const store=new MongoDBStore({
    uri: db_path,
    collection: 'session'
})
const app=express();

app.set('view engine','ejs');
app.set('views','views');
const randomString=(length)=>{
    const characters='abcdefghijklmnopqrstuvwxyz'
    let result=''
    for(let i=0;i<length;i++){
        result+=characters.charAt(Math.floor(Math.random()*characters.length))
    }
    return result;
}
const storage=multer.diskStorage({
    destination: (req,res,cb)=>{
        cb(null,"uploads/")
    },
    filename: (req,file,cb)=>{
        cb(null, randomString(10) + '-' + file.originalname)
    }
});
const fileFilter=(req,file,cb)=>{
    if(file.mimetype==='image/png'||file.mimetype==='image/jpeg'||file.mimetype==='image/jpg'){
        cb(null,true);
    }else{
        cb(null,false);
    }
}
const multerOptions={
    storage,fileFilter
}
app.use(express.urlencoded());
app.use(multer(multerOptions).single('photo'));
app.use(express.static(path.join(rootDir,'public')));
app.use('/uploads',express.static(path.join(rootDir,'uploads')))
app.use('/host/uploads',express.static(path.join(rootDir,'uploads')))
app.use('/homes/uploads',express.static(path.join(rootDir,'uploads')))

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store
}))
app.use((req,res,next)=>{
    req.isLoggedIn=req.session.isLoggedIn;
    next();
})
app.use(storeRouter);
app.use('/host',(req,res,next)=>{
    if(req.isLoggedIn){
        next();
    }else{
        res.redirect('/login');
    }
})
app.use('/host',hostRouter);
app.use(authRouter);
app.use(get404Router);

const PORT = process.env.PORT || 3000;
mongoose.connect(db_path).then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch(err=>{
    console.log("Error while connecting to mongo",err)
});