let mongoose = require('mongoose');
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let User = require('./model/user');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested_With, Content-Type, Accept")
  next();
})
  
app.post('/addUser', (req, res) => {
  let { userName, mobileNo, password } = req.body;
  mongoose.connect('mongodb://shubham:shubham123@ds018168.mlab.com:18168/nn-outh-test')
    .then(() => {
      return User.find({userName, password, mobileNo})
    })
    .then((response) => {
      if(response.length >=1 ){
        res.send({
          status: false,
          message: 'User already exist'
        })
      }else{
        let user = new User({userName, password, mobileNo});
        user.save()
          .then((result) => {
            res.send({
              status: true,
              message: 'User saved succesfully',
              result
            })
          })
      }
    })
    .catch((err) => {
      res.send({
        status: false,
        message: "Error occured while executin the query",
        err
      })
    })
})

  app.listen(5000, () => console.log("Listening on port 5000"));