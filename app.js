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
    database: "cahtbot_db"
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
            //image preparatiom of storage
            let tmp = files.avatar.path;
            let pix = files.avatar.name;
            let img = pix;
            let imgLink = "public/userImages/"+pix;

            //generating password
            const pwd = Math.random().toString(35).slice(2,6);
        
            //storing data into variable
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
                                //insert default amount into account table
                                defaultAmount = 4400;
                                _defaultAmount = `INSERT into account_tb(account_id, account_balance) values('${data[0].account_id}', '${defaultAmount}')`;
                                connection.query(_defaultAmount, (err,_data)=>{
                                    if(err)throw err;
                                    res.render('dashboard', { status: 'Account Created Succesfully', data: data[0] });
                                })
                                // localStorage.setItem('id',data[0].account_id);
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
             if(data.length>0) {
                res.render('dashboard', { status: 'Logged In!', data: data[0] });
             }
             else{
                 res.render('login', {status: 'Incorrect Password or/and Account Number'});
             }
         })
    }

});
//routing into account balance
app.get('/account_balance/:data', (req,res)=>{
    //fetch account balance from database
    fetchData =  `SELECT customer_tb.lname, customer_tb.image, customer_tb.account_id, account_tb.account_balance FROM customer_tb JOIN account_tb using (account_id) where account_id = '${req.params.data}'`;

    connection.query(fetchData, (err, data, fields)=>{
        res.render('account-balance', {status: null , data: data[0]});
    })
})

//routing into dashboard
app.get('/account_details/:data', (req,res)=>{
    //fetch account balance from database
    fetchData =  `SELECT customer_tb.fname, customer_tb.mname, customer_tb.lname, customer_tb.image, account_tb.account_balance, account_tb.timeStamp, account_tb.account_id FROM customer_tb JOIN account_tb using (account_id) where account_id = '${req.params.data}'`;

    connection.query(fetchData, (err, data, fields)=>{
        res.render('account-details', {status: null, data: data[0]});
    })
})

//routing into dashboard
app.get('/profile/:data', (req,res)=>{
    //fetch account balance from database
    fetchData =  `SELECT * FROM customer_tb where account_id = '${req.params.data}'`;

    connection.query(fetchData, (err, data, fields)=>{
        res.render('dashboard', {status: null, data: data[0]});
    })
})


app.post('/transfer', (req,res)=>{
    //checking if all data are well inputed
    if(req.body.rec_account_no=='' || req.body.amount==''){
        res.render('fund-transfer', { status: 'Fill all boxes correctly', acc_id: req.body.acc_id })
    }
    
    else{
        //checking if recipient account number exist
        check =  `SELECT * FROM customer_tb where account_id = '${req.body.rec_account_no}'`;
        connection.query(check, (err, data, fields)=>{
            if(data.length==0){
                res.render('fund-transfer', { status: 'Account Number not valid', acc_id: req.body.acc_id })
            }
            else{
                //checking sender account balanmce
                checkBal =  `SELECT * FROM account_tb where account_id = '${req.body.acc_id}'`;
                connection.query(checkBal, (err, data, fields)=>{
                    //checking if sending amount is less than or equal to available balacne
                    if(data[0].account_balance >= req.body.amount){
                        //removing amount from sender
                        selectSenderOldBalance =  `SELECT * FROM account_tb where account_id = '${req.body.acc_id}'`
                        connection.query(selectSenderOldBalance, (err, data__, fields)=>{
                            newSender = data__[0].account_balance - req.body.amount;
                            //updating sender account balance
                            updateSenderAcc = `UPDATE account_tb SET account_balance = '${newSender}' WHERE account_id = '${req.body.acc_id}'`;
                            connection.query(updateSenderAcc, (err, dat, fields)=>{

                                //adding amount to recipient balance
                                selectRecipientOldBalance = `SELECT * FROM account_tb where account_id = '${req.body.rec_account_no}'`
                                connection.query(selectRecipientOldBalance, (err, data_, fields)=>{
                                    newRecipient = parseFloat(data_[0].account_balance) + parseFloat(req.body.amount);
                                    //updating recipient account balance
                                    updateRecipientAcc = `UPDATE account_tb SET account_balance = '${newRecipient}' WHERE account_id = '${req.body.rec_account_no}'`;
                                    connection.query(updateRecipientAcc, (err, dat_, fields)=>{
                                        res.render('success');
                                    })
                                })

                            })
                        })

                        
                    }
                    else {
                        //insufficient
                        res.render('fund-transfer', { status: 'Insufficient Balance', acc_id: req.body.acc_id })
                    }
                })
            }
        })
    }

})

//routing into transfer
app.get('/fund_transfer/:data', (req,res)=>{
    res.render('fund-transfer', {status: null, acc_id: req.params.data});
    //fetch account balance from database
    //fetchData =  `SELECT * FROM customer_tb where account_id = '${req.params.data}'`;

   // connection.query(fetchData, (err, data, fields)=>{
   // })
})


