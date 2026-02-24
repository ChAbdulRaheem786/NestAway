const mongoose=require('mongoose')
const userSchema= new mongoose.Schema({
    firstname: {
        type:String,
        required:[true,'First name is required']
    },
    lastname: {
        type:String,
        required:[true,'Last name is required']
    },
    email: {
        type:String,
        required:[true,'Email is required'],unique:true
    },
    password: {
        type:String,
        required:[true,'Password is required']
    },
    usertype: {
        type:String,
        enum:['guest','host'],default:'guest'
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Home'
    }],
    adminHouses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Home'
    }],
    requests: [{
        home: { type: mongoose.Schema.Types.ObjectId, ref: 'Home' },
        guestEmail: { type: String, required: true },
        bookedAt: { type: Date, default: Date.now }
    }],
    bookings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Home'
    }]
});
module.exports=mongoose.model('User',userSchema);