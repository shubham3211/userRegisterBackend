let mongoose = require('mongoose');
let User = require('./model/user');
let express = require('express');
let app = express();
let bodyParser= require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-with, Content-Type, Action")
  next();
});

app.listen((5000), () => console.log("Listening on port 5000"))

app.post('/addUser', (req, res) => {
  let { userName, mobileNo, passWord } = req.body;
  mongoose.connect('mongodb://shubham:shubham123@ds018168.mlab.com:18168/nn-outh-test')
    .then(() => {
      User.find({userName})
        .then((response) => {
          if(response.length >=1 ){
            res.send({
              status: false,
              message: 'User already exist'
            })
          }else{
            let user = new User({userName, passWord, mobileNo});
            user.save()
              .then(() => {
                res.send({
                  status: true,
                  message: 'User created successfully'
                })
              })
          }
        })
        .catch((err) => {
          res.send({
            status: false,
            message: 'Query not executed successfully'
          })
        })
    })
})

app.get('/users', (req, res) => {
  mongoose.connect('mongodb://shubham:shubham123@ds018168.mlab.com:18168/nn-outh-test')
  .then(() => {
    User.find({})
      .then((response) => {
        res.send({
          status: true,
          message: 'User found',
          result: response
        })
      })
  })
  .catch((err) => {
    res.send({
      status: false,
      message: 'Query not executed successfuly',
      err
    })
  })
})