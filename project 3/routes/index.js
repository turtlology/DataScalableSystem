var express = require('express');
var app = require('../app');
var router = express.Router();
var User = require('../Module/User');
var Product = require('../Module/Product');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
var identityKey = 'skey';

//const Sequelize = require('sequelize');
//const sequelize = new Sequelize('DataScalableSystem', 'root', 'root', {
//  host: 'localhost',
//  dialect: 'mysql',
//
//  pool: {
//    max: 5,
//    min: 0,
//    acquire: 10000,
//    idle: 10000,
//    evict: 10000
//  },
//
//  operatorsAliases: false
//});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });

});

router.get('/check', function(req, res){
  res.writeHeader(200);
  res.end();
})

router.post('/registerUser', function(req, res, next) {
  if (req.body){
    var username = req.body.username;
    var state = req.body.state;
    var fname = req.body.fname;
    var lname = req.body.lname;
    var address = req.body.address;
    var city = req.body.city;
    var zip = req.body.zip;
    var email = req.body.email;
    var password = req.body.password;
    User.create({
      username: username,
      state: state,
      fname: fname,
      lname: lname,
      address: address,
      city: city,
      zip: zip,
      email: email,
      password: password
    }).then(function(item){
      res.send({"message": fname + " was registered successfully"});
    }).catch(function(err){
      res.send({"message" : "The input you provided is not valid"});
    });
  } else {
    res.send('The input is not in json type');
  }
});

router.get('/start', function(req, res){

  User.sync({force: true}).then(() => {
    // Table created
    return User.create({
      username: "jadmin",
      password: "admin",
      fname: "Jenny",
      lname: "Admin",
      address: "300 Crag Street",
      city: "Pittsburgh",
      state: "PA",
      zip: "15213",
      email: "Jadmin@cmu.edu"
    });
  });

  Product.sync({force: true});
  res.send({"message": "insert successfully"});
});


router.post('/login', function(req, res){
  if (req.body){
    var sess = req.session;

    //noinspection JSUnresolvedFunction
    (async () => {
      var user = await User.find({
      where: {
        username: req.body.username,
        password: req.body.password
      }
    });
    if (user){
      req.session.regenerate(function(err) {
        req.session.loginUser = user.get('username');
        res.json({"message":"Welcome "+user.get('fname')})
      });
      console.log(user.get("fname"));
    } else {
      res.json({"message":"There seems to be an issue with the username/password combination that you entered"});
    }
  }) ();
  } else {
    res.send('The input is not in json type');
  }
});

router.post('/logout', function(req, res){
  if (!isLogIn(req)){
    res.json({"message":"You are not currently logged in"});
    return;
  }
  req.session.destroy(function(err) {
    res.clearCookie(identityKey);
    return res.json({"message":"You have been successfully logged out"});
  });
});

router.post('/updateInfo', function(req, res){
  if (!isLogIn(req)){
    res.json({"message":"You are not currently logged in"});
    return;
  } else {
    var username = req.session.loginUser;
    User.find({
      where: {
        username: req.body.username,
      }
    }).then(function(user){
      var modifyname = "";
      if (req.body.username && req.body.username.length > 0) {
        modifyname = req.body.username;
      }else {
        modifyname = user.username;
      }
      var password = "";
      if (req.body.password && req.body.password.length > 0) {
        password = req.body.password;
      }else {
        password = user.password;
      }
      var state = "";
      if (req.body.state && req.body.state.length > 0) {
        state = req.body.state;
      }else {
        state = user.state;
      }
      var fname = "";
      if (req.body.fname && req.body.fname.length > 0) {
        fname = req.body.fname;
      }else {
        fname = user.fname;
      }
      var lname = "";
      if (req.body.lname && req.body.lname.length > 0) {
        lname = req.body.lname;
      }else {
        lname = user.lname;
      }
      var address = "";
      if (req.body.address && req.body.address.length > 0) {
        address = req.body.address;
      }else {
        address = user.address;
      }
      var city = "";
      if (req.body.city && req.body.city.length > 0) {
        city = req.body.city;
      }else {
        city = user.city;
      }
      var zip = "";
      if (req.body.zip && req.body.zip.length > 0) {
        zip = req.body.zip;
      }else {
        zip = user.zip;
      }
      var email = "";
      if (req.body.email && req.body.email.length > 0) {
        email = req.body.email;
      }else {
        email = user.email;
      }
      User.update({
        username: username,
        state: state,
        fname: fname,
        lname: lname,
        address: address,
        city: city,
        zip: zip,
        email: email,
        password: password
      }, {
        where: {username: user.username}
      }).then(function(item){
        res.send({"message": fname + " your information was successfully updated"});
      }).catch(function(err){
        res.send({"message" : "The input you provided is not valid"});
      });
    });

  }

});

router.post('/addProducts', function(req, res){
  if (!isLogIn(req)){
    res.json({"message":"You are not currently logged in"});
    return;
  }
  if (!isAdmin(req)){
    res.json({"message":"You must be an admin to perform this action"});
    return;
  }
  var asin = req.body.asin;
  var productName = req.body.productName;
  var productDescription = req.body.productDescription;
  var group = req.body.group;
  Product.create({
    asin: asin,
    productName: productName,
    productDescription: productDescription,
    group: group
  }).then(function(item){
    res.send({"message": productName + " was successfully added to the system"});
  }).catch(function(err){
    res.send({"message" : "The input you provided is not valid"});
  });
});

router.post('/modifyProduct', function(req, res){
  if (!isLogIn(req)){
    res.json({"message":"You are not currently logged in"});
    return;
  }
  if (!isAdmin(req)){
    res.json({"message":"You must be an admin to perform this action"});
    return;
  }
  var asin = req.body.asin;
  var productName = req.body.productName;
  var productDescription = req.body.productDescription;
  var group = req.body.group;
  Product.update({
    productName: productName,
    productDescription: productDescription,
    group: group
  }, {
    where: {asin: asin}
  }).then(function(item){
    res.send({"message": productName + " was successfully updated"});
  }).catch(function(err){
    res.send({"message" : "The input you provided is not valid"});
  });
});

router.post('/viewUsers', function(req, res){
  if (!isLogIn(req)){
    res.json({"message":"You are not currently logged in"});
    return;
  }
  if (!isAdmin(req)){
    res.json({"message":"You must be an admin to perform this action"});
    return;
  }
  var f = "";
  if (req.body.fname && req.body.fname.length>0){
    f = req.body.fname;
  }
  var l = "";
  if (req.body.lname && req.body.lname.length>0){
    l = req.body.lname;
  }
  User.findAll({
    attributes: ['fname', 'lname', ['username', 'userId']],
    where: {
      [Op.and]: [
        {fname: {[Op.like]: '%' + f + '%'}},
        {lname: {[Op.like]: '%' + l + '%'}}
      ]
    }
  }).then(function(users){
    if (users.length > 0){
      return res.json({"message":"The action was successful", "user":users});
    }
    else {
      return res.json({"message": "There are no users that match that criteria"})
    }
  });
});

router.post('/viewProducts', function(req, res){
  var asin = "";
  if (req.body.asin && req.body.asin.length>0){
    asin = req.body.asin;
  } else {
    asin = "%%"
  }
  var key = "";
  if (req.body.key && req.body.key.length>0){
    key = req.body.key;
  }
  var group = "";
  if (req.body.group && req.body.group.length>0){
    group = req.body.group;
  } else {
    group = "%%"
  }


  Product.findAll({
    attributes: ['asin', 'productName'],
    where: {
      asin: {[Op.like]: asin},
      [Op.or]: [
        {productName: {[Op.like]: '%' + key + '%'}},
        {productDescription: {[Op.like]: '%' + key + '%'}}
      ],
      group: {[Op.like]: group}
    }
  }).then(function(product){
    if (product.length > 0){
      return res.json({"product":product});
    } else {
      return res.json({"message": "There are no products that match that criteria"})
    }

  });
});


function isLogIn(req){
  var sess = req.session;
  var loginUser = sess.loginUser;
  var isLogined = !!loginUser;
  return isLogined;
}

function isAdmin(req){
  var sess = req.session;
  var loginUser = sess.loginUser;
  return loginUser == "jadmin";
}

module.exports = router;
