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
  res.header("Access-Control-Allow-Mthods", "GET, POST, PUT, DELETE, OPTIONS")
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
// { mobileNo: { $gt: 1 } }
// { $or: [ { userName: "shubham" }, { mobileNo: { $ne: 89 } } ] }
app.get('/user', (req, res) => {
  User.find({})
    .sort("mobileNo")
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

app.get('/user/:_id', (req, res) => {
  let _id = req.params._id;
  console.log(_id);
  User.findOneAndDelete({_id}, {userName: "sumit"})
    .then((user) => {
      res.send({
        status: true,
        result: user
      })
    })
    .catch((err) => {
      res.send({
        status: false,
        err
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

app.post('/addUsers', (req, res) => {
  let users = req.body.users;
  let usersPromise = [];
  users.forEach((user) => usersPromise.push(new User(user).save()));
  Promise.all(usersPromise)
    .then((values) => {
      res.send({
        status: true,
        result: values
      })
    })
    .catch((err) => {
      res.send({
        status: false,
        result: err
      })
    })
})

//send invalid id and check
app.delete('/user', (req, res) => {
  let id = req.body._id;
  console.log(id);
  User.deleteOne({ _id: id })
    .then((response) => {
      if(response.n == 1){
        res.send({
          status: true,
          message: 'User Deleted',
          result: response
        })
      }else{
        res.send({
          status: false,
          message: 'No user found',
          result: response
        })
      }
    })
    .catch((err) => {
      res.send({
        status: false,
        message: 'Use',
        err
      })
    })
})

app.delete('/users', (req, res) => {
  let ids = req.body.ids;
  User.deleteMany({ _id: { $in: ids } })
    .then((response) => {
      if(response.n >= 1){
        res.send({
          status: true,
          message: 'User deleted succesfully',
          result: response
        })
      }else{
        res.send({
          status: false,
          message: 'no user found',
          result: response
        })
      }
    })
    .catch((err) => {
      res.send({
        status: false,
        message: 'Couldnot execute the query',
        err
      })
    })
})

app.put('/user/id', (req, res) => {
  let changes = req.body.changes;
  let _id = req.body._id;
  User.updateOne({_id}, changes)
    .then((response) => {
      res.send({
        status: true,
        message: 'user updates',
        result: response
      })
    })
    .catch((err) => {
      res.send({
        status: false,
        message: 'Query not executed',
        result: err
      })
    })
})

app.get('/user/id/:_id', (req, res) => {
  let _id = req.params._id;
  User.findById(_id)
    .then((result) => {
      res.send({
        status: true,
        message: 'User found',
        result
      })
    })
    .catch((err) => {
      res.send({
        status: false,
        message: 'User not found'
      })
    })
})

app.put('/users', (req, res) => {
  let { userName, _id, mobileNo } =  req.body, search  = {}, change = req.body.change ;
  if(userName){
    search.userName = userName;
  }
  if(_id){
    search._id = _id
  }
  if(mobileNo){
    search.mobileNo = mobileNo
  }
  User.updateMany({userName: "shubham"}, { 
    // $mul: { mobileNo: 2 },
    $currentDate: { lastModified: { $type: "date" } },
    // $min: { mobileNo: 100 },
    // $max: {mobileNo: 101},
    // $rename: { mobileNo: "mob" }
    // $rename: { mob: "mobileNo" },
    // $unset: { password: "" },
    $push: {
      cars: {
        $each: [{carName: "marutia", name: "Shubham"}, {carName:"altoa"}, {carName:"bmwa"}]
      }
    }
   })
    .then((result) => {
      res.send({
        status: true,
        message: 'users updates',
        result
      })
    })
    .catch((err) => {
      res.send({
        status: false,
        message: 'Query not executed',
        err
      })
    })
})

function connect(){
  app.listen(5000, () => console.log('listening on port 5000'))
}