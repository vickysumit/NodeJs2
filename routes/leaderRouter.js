const express = require('express');
const bodyParser = require('body-parser');
var authenticate = require('../authenticate');
const leaderRouter = express.Router();
const Leaders = require('../models/leaders');
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.get((req,res,next) =>{
    //res.end('Will send all the leaders to you!')
    Leaders.find({})
     .then((lead) =>{
         res.statusCode = 200;
         res.setHeader('Content-Type','application/json');
         res.json(lead);
     },(err) => next(err))
     .catch((err) => next(err));
})
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>{
    res.statusCode=403;
    res.end('PUT operation not supported on /leader')
})
.post(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>{
    //res.end('Will add the leader: ' + req.body.name + ' with details ' + req.body.description);
    Leaders.create(req.body)
     .then((lead) => {
         console.log('Promotion created',lead);
         res.statusCode = 200;
         res.setHeader('Content-Type','application/json');
         res.json(lead);
     }, (err) => next(err))
     .catch((err) => next(err));
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>{
    Leaders.remove({})
     .then((resp) => {
         res.statusCode=200;
         res.setHeader('Content-Type','application/json');
         res.json(resp);
     },(err) => next(err))
     .catch((err) => next(err));
    //res.end('Deleting all leaders');
});

leaderRouter.route('/:leaderId')
.get((req,res,next) =>{
    Leaders.findById(req.params.leaderId)
      .then((lead) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(lead);
      },(err) => next(err))
       .catch((err) => next(err));
   // res.end('Will send details of the leader: ' + req.params.leaderId +' to you');
})
.post( authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /leader/'+ req.params.leaderId);
   })
.put(authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    Leaders.findOneAndUpdate(req.params.leaderId,{
        $set: req.body
    },{new: true})
    .then((lead) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(lead);
    },(err) => next(err))
    .catch((err) => next(err));
    /*res.write('Updating the leader: ' + req.params.leaderId + '\n');
    res.end('Will update  the leader: ' + req.body.name + 
          ' with details: ' + req.body.description);*/
   })
.delete(authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
     .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
     }, (err) => next(err))
     .catch((err) => next(err));
    //res.end('Deleting leader: ' + req.params.leaderId);
  }); 

  module.exports = leaderRouter;