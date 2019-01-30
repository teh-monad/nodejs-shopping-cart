var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var multer = require('multer');

var Order = require('../models/order');
var Cart = require('../models/cart');
var User = require('../models/user');
var Product = require('../models/product');

var csrfProtection = csrf();

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images/products')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
});

var upload = multer({storage: storage});

router.post('/removeUser', function(req, res, next) {
  User.findOneAndRemove({email: req.user.email}, function(err, success) {
    if(err) {
      console.log(err.message);
      req.flash('error', 'Falha ao remover usuário!');
    }
    if(success) {
      req.flash('success', 'Usuário removido com sucesso!');
      res.redirect('/');
    }
  });
});

router.use(csrfProtection);

router.get('/profile', isLoggedIn, function(req, res, next) {
  Order.find({
    user: req.user
  }, function(err, orders) {
    if (err) {
      return res.write('Error!');
    }
    var cart;
    orders.forEach(function(order) {
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });
    res.render('user/profile', {
      csrfToken: req.csrfToken(),
      orders: orders,
      user: req.user
    });
  });
});

router.post('/profile', function(req, res, next) {

  if (req.body.email) {
    User.findOne({
      email: req.body.email
    }, function(err, doc) {

      if (err) {
        req.flash('error', 'falhou')
        console.log(err);
      }

      doc.email = req.body.email;
      doc.name = req.body.name;
      doc.state = req.body.state;
      doc.city = req.body.city;
      
      doc.save();

    });
  } else {
    console.log("email invalid");
  }

  if (req.session.oldUrl) {
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    res.redirect('/user/profile');
  }

  res.end();

});

router.get('/logout', isLoggedIn, function(req, res, next) {
  req.logout();
  res.redirect('/');
});

router.get('/signup', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/signup', {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0
  });
});

router.post('/signup', passport.authenticate('local.signup', {
  failureRedirect: '/user/signup',
  failureFlash: true
}), function(req, res, next) {
  if (req.session.oldUrl) {
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    res.redirect('/user/profile');
  }
});

router.get('/signin', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/signin', {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0
  });
});

router.post('/signin', passport.authenticate('local.signin', {
  failureRedirect: '/user/signin',
  failureFlash: true
}), function(req, res, next) {
  if (req.session.oldUrl) {
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    res.redirect('/user/profile');
  }
});

router.get('/upload', function(req, res, next) {
  Order.find({
    user: req.user
  }, function(err, orders) {
    if (err) {
      return res.write('Error!');
    }
    var cart;
    orders.forEach(function(order) {
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });
    res.render('admin_actions/upload', {
      csrfToken: req.csrfToken(),
      orders: orders,
      user: req.user
    });
  });
});

router.post('/upload', upload.single('imagePath'), function(req, res, next) {
  let newProduct = new Product();
  newProduct.title = req.body.title
  newProduct.imagePath = req.file.originalname
  newProduct.description = req.body.description
  newProduct.price = req.body.price
  newProduct.save(err => {
      if (err) {
          return res.sendStatus(400);
      }
       res.redirect('/user/upload');
  });
});


router.get('/user_rights', function(req, res, next) {
  Order.find({
    user: req.user
  }, function(err, orders) {
    if (err) {
      return res.write('Error!');
    }
    var cart;
    orders.forEach(function(order) {
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });
    res.render('admin_actions/user_rights', {
      csrfToken: req.csrfToken(),
      orders: orders,
      user: req.user
    });
  });
});

router.get('/order', function(req, res, next) {
  Order.find({
    user: req.user
  }, function(err, orders) {
    if (err) {
      return res.write('Error!');
    }
    var cart;
    orders.forEach(function(order) {
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });
    res.render('user/order', {
      csrfToken: req.csrfToken(),
      orders: orders,
      user: req.user
    });
  });
});

router.use('/', notLoggedIn, function(req, res, next) {
  next();
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}