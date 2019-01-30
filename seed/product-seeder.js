var Product = require('../models/product');

var mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_DB_URI);

var products = [
  new Product({
    imagePath: '1.jpg',
    title: 'ssd',
    description: 'ssd',
    price: 269
  }),
  new Product({
    imagePath: '2.jpg',
    title: 'ssd',
    description: 'ssd',
    price: 209
  }),
  new Product({
    imagePath: '3.jpg',
    title: 'ssd',
    description: 'ssd',
    price: 169
  }),
  new Product({
    imagePath: '4.jpg',
    title: 'ssd',
    description: 'ssd',
    price: 79
  }),
  new Product({
    imagePath: '5.jpg',
    title: 'ssd',
    description: 'ssd',
    price: 108
  }),
  new Product({
    imagePath: '6.jpg',
    title: 'ssd',
    description: 'ssd',
    price: 99
  })
];

var done = 0;
for (var i = 0; i < products.length; i++) {
  products[i].save(function(err, result) {
    done++;
    if (done === products.length) {
      exit();
    }
  });
}

function exit() {
  mongoose.disconnect();
}
