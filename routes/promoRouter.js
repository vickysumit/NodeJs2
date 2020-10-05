const express = require('express');
const bodyParser = require('body-parser');
const Promotions = require('../models/promotions');
const promoRouter = express.Router();
var authenticate = require('../authenticate');
promoRouter.use(bodyParser.json());

promoRouter.route('/')
.get((req,res,next) =>{
    Promotions.find({})
     .then((promos) =>{
         res.statusCode = 200;
         res.setHeader('Content-Type','application/json');
         res.json(promos);
     },(err) => next(err))
     .catch((err) => next(err));
})
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>{
    res.statusCode=403;
    res.end('PUT operation not supported on /promo')
})
.post(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>{
    Promotions.create(req.body)
     .then((promos) => {
         console.log('Promotion created',promos);
         res.statusCode = 200;
         res.setHeader('Content-Type','application/json');
         res.json(promos);
     }, (err) => next(err))
     .catch((err) => next(err));
    //res.end('Will add the promo: ' + req.body.name + ' with details ' + req.body.description);
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>{
    Promotions.remove({})
     .then((resp) => {
         res.statusCode=200;
         res.setHeader('Content-Type','application/json');
         res.json(resp);
     },(err) => next(err))
     .catch((err) => next(err));
    //res.end('Deleting all promos');
});

promoRouter.route('/:promoId')
.get((req,res,next) =>{
    Promotions.findById(req.params.promoId)
      .then((promos) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promos);
      },(err) => next(err))
       .catch((err) => next(err));
    // res.end('Will send details of the promo: ' + req.params.promoId +' to you');
})
.post( authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /promo/'+ req.params.promoId);
   })
.put( authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Promotions.findOneAndUpdate(req.params.promoId,{
        $set: req.body
    },{new: true})
    .then((promos) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promos);
    },(err) => next(err))
    .catch((err) => next(err));
    
    /*res.write('Updating the promo: ' + req.params.promoId + '\n');
    res.end('Will update  the promo: ' + req.body.name + 
          ' with details: ' + req.body.description);*/
   })
.delete(authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    Promotions.findByIdAndRemove(req.params.promoId)
     .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
     }, (err) => next(err))
     .catch((err) => next(err));
    //res.end('Deleting promo: ' + req.params.promoId);
  }); 

  module.exports = promoRouter;