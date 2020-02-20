// making express available
var express = require('express');
const app = express();

//connecting to port
const port = app.listen(1000, ()=>{
    console.log("Listening at port: 1000");
});

//setting engine
app.set('view engine', 'ejs');

//middle wares
app.use(express.static(__dirname+'/public'));

//requiring formidable and fs
var fm = require('formidable');
var fs = require('fs');

//Creating a method from formidable class
var form = new fm.IncomingForm();

//bodyParser
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//requiring mysql::::::::::::::::::::::::::::::::::::::::::::::::::::::
var mysql = require('mysql');

//seting connection:::::::::::::::::::::::::::::::::::::::::
let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "minaret_db"
    // host: "remotemysql.com",
    // user: "1JTq39QISa",
    // password: "wO8zfGSyqY",
    // database: "1JTq39QISa"
});


//index - onload
app.get('/', (req, res)=>{
    res.render('index', {status: null});
});

//routing into signup page::::::::::::::::::::::::::::::::::::::::::::::::
app.get('/signup', (req,res)=>{
    res.render('signup', {status: null});
});

//submitting sign-up data:::::::::::::::::::::::::::::::::::::::::::::::::
app.post('/register', (req, res)=>{
    //creating a method from formidable class::::::::::::::::::::::::::::::
    var form = new fm.IncomingForm();
    
    //submitting files and fields to database:::::::::::::::::::::::
    form.parse(req, (err, fields, files)=>{
       if(fields.fname !="" || fields.mobile !="" || fields.lname !="" || fields.mname != "" || fields.email !="" || fields.address !=""){
            
                let tmp = files.avatar.path;
                let pix = files.avatar.name;
                let img = pix;
                let imgLink = "public/userImages/"+pix;

                //generating password
                const pwd = Math.random().toString(35).slice(2,6);
            
                let newUserInfo = {
                    fname: fields.fname,
                    mobile: fields.mobile,
                    lname: fields.lname,
                    mname: fields.mname,
                    fname: fields.fname,
                    address: fields.address,
                    password: pwd,
                    dob: fields.dob,
                    email: fields.email,
                    file: img
                };
        
                //putting into database and sending from temporary location to permanent location::::::::::::::::::::::::::::::::::::
                fs.rename(tmp, imgLink, ()=>{

                    //sql check if email exist
                    checkEmailExist =  `SELECT * FROM customer_tb where email = '${newUserInfo.email}'`;

                    connection.query(checkEmailExist, (err, result, fields)=>{
                       if(result.length==0){
                            // submit into database
                            sql_insert = `INSERT into customer_tb (fname, lname, mname, address, dob, email, password, mobile, image) values('${newUserInfo.fname}','${newUserInfo.lname}','${newUserInfo.mname}', '${newUserInfo.address}', '${newUserInfo.dob}', '${newUserInfo.email}', '${newUserInfo.password}', '${newUserInfo.mobile}', '${newUserInfo.file}')`;

                            connection.query(sql_insert, (err,data)=>{
                                if(err)throw err;
                                //fetch data from database
                                fetchData =  `SELECT * FROM customer_tb where email = '${newUserInfo.email}'`;

                                connection.query(fetchData, (err, data, fields)=>{
                                    res.render('dashboard', { status: 'Account Created Succesfully', data: data[0] });
                                })
                            });


                       }

                        else{
                            res.render('signup', { status: 'Email already Exist' });
                        }
                    })


                    // var nUser = new user(newUserInfo);
                    // nUser.save().then(data=>{
                    //     res.render('index', {status: 'signedIn', username: fields.username, mobile: null})
                    // })
                });
        
    }  
    else {
        res.render('signup', { status: 'Please Fill all boxes correctly' });
    }
})
})

//routing into login page::::::::::::::::::::::::::::::::::::::::::::::::
app.get('/login', (req,res)=>{
    res.render('login', {status: null});
});

app.post('/dashboard', (req,res)=>{
    if(req.body.account_no!='' || req.body.password!='') {
         //fetch data from database
         fetchData =  `SELECT * FROM customer_tb where account_id = '${req.body.account_no}' AND password = '${req.body.password}'`;

         connection.query(fetchData, (err, data, fields)=>{
             if(data.length>0) res.render('dashboard', { status: 'Logged In!', data: data[0] });
             res.render('login', {status: 'Incorrect Password or/and Account Number'});
         })
    }
});