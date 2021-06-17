const express = require('express');

const router = express.Router();

//her sayfanın renderını buradan yapabiliriz. 

router.get('/',(req,res)=>{
    res.render('index');
})

router.get('/register',(req,res)=>{
    res.render('register');
})

router.get('/login',(req,res)=>{
    
    res.render('index');
})

router.get('/search',(req,res)=>{
    res.render('search');
})

router.get('/privatelogin',(req,res)=>{
    res.render('PrivateLogin');
})

router.get('/searchresult',(req,res)=>{
    res.render('searchresult');
})

router.get('/privateInterface',(req,res)=>{
    res.render('privateInterface');
})

router.get('/profile',(req,res)=>{
    res.render('profile');
})

router.get('/kutuphanebir',(req,res)=>{
    res.render('kutuphanebir');
})

router.get('/kutuphaneiki',(req,res)=>{
    res.render('kutuphaneiki');
})

router.get('/kutuphaneuc',(req,res)=>{
    res.render('kutuphaneuc');
})
module.exports = router;