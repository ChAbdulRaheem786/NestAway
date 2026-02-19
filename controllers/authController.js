const { check,validationResult } = require('express-validator')
const bcrypt=require('bcrypt')
const User=require('../models/user.js')
exports.getLogin=(req,res,next)=>{
    res.render('auth/login',{
        pageTitle:'Login',
        currentPage:'Add Home',
        isLoggedIn:false,
        errors:[],
        oldInput: {email:''},
        user: {}
    });
}
exports.postLogin=async(req,res,next)=>{
    const {email,password}=req.body;
    const user= await User.findOne({email});
    if(!user){
        return res.status(422).render('auth/login',{
            pageTitle: 'Login',
            currentPage: 'Login',
            isLoggedIn: false,
            errors: ["Email does not exist"],
            oldInput: {email},
            user: {}
        })
    }

    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
        return res.status(422).render('auth/login',{
            pageTitle: 'Login',
            currentPage: 'Login',
            isLoggedIn: false,
            errors: ["Invalid password"],
            oldInput: {email},
            user: {}
        })
    }
    req.session.isLoggedIn=true;
    req.session.user=user
    await req.session.save()
    res.redirect('/');
}
exports.postLogout=(req,res,next)=>{
    req.session.destroy(()=>{
        res.redirect('/login')
    })
}
exports.getSignup=(req,res,next)=>{
    res.render('auth/signup',
        {
            pageTitle:'SignUp',
            currentPage:'SignUp',
            isLoggedIn:false,
            errors: [],
            oldInput: {firstname:'',lastname:'',email:'',password:'',usertype:''},
            user: {}
        });
}
exports.postSignup=[
    check('firstname')
    .trim()
    .isLength({min:2})
    .withMessage("First name should be atleast 2 characters long")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("First name should contain only alphabets"),

    check('lastname')
    .trim()
    .isLength({min:2})
    .withMessage("First name should be atleast 2 characters long")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("First name should contain only alphabets"),

    check('email')
    .isEmail()
    .withMessage('Please enter valid email')
    .normalizeEmail(),

    check('password')
    .isLength({min:8})
    .withMessage('Password should be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('Password should contain atleast one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password should contain atleast one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password should contain atleast one number')
    .matches(/[!@#$&]/)
    .withMessage('Password should contain atleast one special character'),
    
    check('confirmpassword')
    .trim()
    .custom((value,{req})=>{
        if(value!==req.body.password){
            throw new Error('Passwords do not match')
        }
        return true
    }),

    check('usertype')
    .notEmpty()
    .withMessage('Please select a user type')
    .isIn(['guest','host'])
    .withMessage("Invalid user type"),

    check('terms')
    .notEmpty()
    .withMessage('Please accept the terms and conditions'),
    (req,res,next)=>{
        const {firstname,lastname,email,password,confirmpassword,usertype}=req.body;
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(422).render('auth/signup',{
                pageTitle: 'Signup',
                currentPage: 'signup',
                isLoggedIn: false,
                errors: errors.array().map(err=>err.msg),
                oldInput: {firstname,lastname,email,password,confirmpassword,usertype},
                user: {}
            })
        }
        
        bcrypt.hash(password,12)
        .then(hashedPassword=>{
            const user=new User({firstname,lastname,email,password:hashedPassword,usertype})
            user.save().then(()=>{
            res.redirect('/login')
        }).catch(err=>{
            return res.status(422).render('auth/signup',{
                pageTitle: 'Signup',
                currentPage: 'Signup',
                isLoggedIn: false,
                errors: errors.array().map(err=>err.msg),
                oldInput: {firstname,lastname,email,usertype},
                user: {}
            })
        })
    })
}]