const express=require("express");
const { loadRegister, insertUser, loginLoad ,verifyLogin,loadHome,userLogout } = require("../controllers/userController");
const user_route=express();
const session=require('express-session');
const config = require("../config/config");
user_route.use(session({
    secret:config.sessionSecret,
    resave: true,
    saveUninitialized: true
}))
const auth = require('../middleware/auth');

user_route.set('view engine','ejs');
user_route.set('views','./views/users');
const bodyParser = require('body-parser');
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));
const multer=require("multer")
const path= require("path")
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,  '../public/userImages'));
    },
    filename:function(req,file,cb){
        cb(null, new Date().getTime() + path.extname(file.originalname))
    }
})
const upload=multer({storage:storage})

user_route.get('/register',auth.isLogout,loadRegister)
user_route.post('/register',upload.single('image'),insertUser)
user_route.get('/',auth.isLogout,loginLoad);
user_route.get('/login',auth.isLogout,loginLoad);
user_route.post('/login',verifyLogin);
user_route.get('/home',auth.isLogin,loadHome);
user_route.get('/logout',auth.isLogin,userLogout);

  

module.exports=user_route;