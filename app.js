const express = require('express');
const path = require('path');
const mysql = require('mysql');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config({ path: './.env'});


const app = express();

const dp = mysql.createConnection({
    host: process.env.DATABASE_HOST, /*uzaktan bağlantı için ip kullanılabilir.*/
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE

    //http://localhost/phpmyadmin/
});
//public dosyalarının path'i
const publicDirectory = path.join(__dirname, './public'); 
app.use(express.static(publicDirectory));



//parse url encoded bodies (as sent by html forms)
app.use(express.urlencoded({ extended: false}));

//parse JSON bodies (as sent by api client)
app.use(express.json({}));
//cookies
app.use(cookieParser());


app.set('view engine', 'hbs');

dp.connect((err)=>{
    if(err)
    {
        console.log(err);
    }
    else
    {
        console.log('MYSQL connected...')
    }
})

//DEFINE ROUTES
app.use('/',require('./routes/pages'));
app.use('/auth',require('./routes/auth'))

app.listen(5000,()=>{
    console.log('Server started on Port 5000');   
})