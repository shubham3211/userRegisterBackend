let express = require('express');
let app = express();
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let User = require('./model/user')

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,Accept");
  next();
})

mongoose.connect('mongodb://shubham:shubham123@ds018168.mlab.com:18168/nn-outh-test')
  .then(() => {
    connect()
  })
  .catch((err) => {
    console.log(err);
  })

app.post('/user', (req, res) => {
  let { userName } = req.body;
  User.find({userName})
    .then((users) => {
      if(users.length >= 1){
        res.send({
          status: false,
          message: 'user found'
        })
      }else{
        res.send({
          status: true,
          message: 'user not found'
        })
      }
    })
    .catch((err) => {
      res.send({
        status: false,
        message: 'quey error'
      })
    })
})

app.get('/user', (req, res) => {
  User.find({})
    .then((users) => {
      res.send({
        status: true,
        result: users
      })
    })
    .catch((err) => {
      res.send({
        status: false,
        message: 'query not extcuetd'
      })
    })
})

app.post('/addUser', (req, res) => {
  let { userName, password, mobileNo } = req.body;
  let user = new User({ userName, password, mobileNo });
  user.save()
    .then((result) => {
      res.send({
        status: true,
        message: 'user saved successfully'
      })
    })
    .catch(() => {
      res.send({
        status: false,
        meassage: 'could not save the user'
      })
    })
})

function connect(){
  app.listen(5000, () => console.log('listening on port 5000'))
}