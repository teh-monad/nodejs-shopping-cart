# ADDED 
- products uploading;
- roles managing;

### Install
``` shell
    git clone https://github.com/teh-monad/nodejs-shopping-cart.git
    export MONGO_DB_URI=mongodb://localhost:27017/cart_mongo
    npm install
    node seed/product-seeder.js 
```

### Run
#### register admin and add permissions manually
```
$ npm run dev
```
[http://localhost:3000/user/signup][1]
```
$ mongo
> use cart_mongo
> db.users.update({name: "admin"}, {$set :{state: "admin"}})
```
[1]: http://localhost:3000/user/signup
