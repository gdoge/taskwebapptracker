var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');


var Task = require('../models/task');


// var mongoose = require('mongoose');
// mongoose.connect(dbConfig.url);
//
// var db = mongoose.connection;







router.get('/tasklist',  function(req, res) {

 Task.find({}, function (err, tasks) {
  if (err) return console.error(err);
 console.log("tasks succesfully got");
 //return tasks
 res.json( tasks );
})
});


router.post('/movetask/:id', function(req, res){
  console.log("id to move "   + req.params.id);
  console.log("moved to " + req.body.status )
  console.log("assigned user " + req.body.assignedTo)

  Task.findById(req.params.id, function (err, task) {
    if (err) return handleError(err);

    task.status = req.body.status;
    task.assignedTo = req.body.assignedTo;
    task.save(function (err, updatedTask) {
      if (err) return handleError(err);
      res.send((err === null) ? { msg: '' } : { msg:'error'+ err });
    });
  });

})




//
// /*
 // * DELETE task.
 // */
router.delete('/deletetask/:id', function(req, res) {
  console.log("id to delete " + req.params.id)

    Task.remove({ _id : req.params.id }, function (err){
      res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });

    })

});

//  /*
//   * POST task
//   */
 router.post('/addtask', function(req, res) {

   var groupArray = req.body.group.split(",");


    var newTask = new Task({
      taskName : req.body.name,
      content : req.body.content,
      group : groupArray,
      status : "open",
      creator : req.body.creator,
      date : req.body.date
    })

    newTask.save(function (err, data) {
      if (err) {
       console.log(err);
      } else {
        console.log('Saved ', data );
      }

     res.send((err === null) ? { msg: '' } : { msg:'error'+ err });
    });

  });
 module.exports = router;
