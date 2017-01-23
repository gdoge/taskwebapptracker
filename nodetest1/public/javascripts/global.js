var app = angular.module('myapp', [ 'ngMaterial' ]);


app.controller('myCtrl', function($scope, $http) {
  var socket = io.connect('http://localhost:3001');

  //update tasks for all logged in users
  socket.on('tasksWereUpdated', function () {
    updateSite();
    console.log("socket updated the Site")
  });

  $scope.tabdata = {
    selectedIndex: 0
  };

  // $scope.next = function() {
  //   $scope.tabdata.selectedIndex = Math.min($scope.tabdata.selectedIndex + 1, 2) ;
  // };
  // $scope.previous = function() {
  //   $scope.tabdata.selectedIndex = Math.max($scope.tabdata.selectedIndex - 1, 0);
  // };

  //data for the dropdown tools
  $scope.groups = ["Developers", "Designers", "Managers", "All"];
  $scope.priorities = ["High", "Medium", "Low"];

  //first visit on the site, get the taks
  $http({
    method: 'GET',
    url: "/db/tasklist"}
  ).then(function success(response) {
    console.log("populate table success")
    // console.log(response.data.priority)
    response.data.date = new Date().toDateString(response.data.date);
    console.log("RESPONSE DATE:"+  response.data.date)
    $scope.Tasks = response.data;
  }, function error(response) {
    console.log("populate table error")
    console.log(response)
  });

  //get user data on firs visit
  $http({
    method: 'GET',
    url: "/api/user_data"}
  ).then(function success(response) {
    console.log("get user name")
    console.log(response)
    $scope.user = response.data;
    $scope.currentUser = $scope.user.user.firstName + " " + $scope.user.user.lastName;
    $scope.currentTeam = $scope.user.user.group;
    console.log("User " + $scope.currentUser + " Team:" +   $scope.currentTeam  )
  }, function error(response) {
    console.log("get user name error")
    console.log(response)
  });


  //add task
  $scope.addTask = function () {
    $scope.sendTask.creator =   $scope.currentUser;
    $scope.sendTask.date = new Date(Date.now()).toISOString();
    console.log("DATUM:" +   $scope.sendTask.date);
    console.log("GROuP: " + $scope.sendTask.group);

    if($scope.sendTask.group ===  undefined ){
      return;
    }

    //the color for each priority
    switch ($scope.sendTask.priority) {
      case "High":
      console.log("task color red");
      $scope.sendTask.color = "red";
      break;
      case "Medium":
      console.log("task color green");
      $scope.sendTask.color = "teal";
      break;
      case "Low":
      console.log("task color blue");
      $scope.sendTask.color = "blue"
    }

    //send task to router
    $http({
      method: 'POST',
      data:  $scope.sendTask,
      url: '/db/addtask',
      dataType: 'JSON'}
    ).then(function success(response) {
      $scope.sendTask = null;
      updateSite();
      $scope.addTaskForm.$setPristine();
      $scope.addTaskForm.$setUntouched();
      $scope.sendTask = {}
      $scope.sendTask.priority = "Low"

      console.log("task added")
    }, function error(response) {
      console.log("task could not be added")
    });

  }

  //Delete task
  $scope.deleteTask = function (deleteId) {
    console.log("the id to delete: " + deleteId)
    $http({
      method: 'DELETE',
      url: '/db/deletetask/' + deleteId
    }
  ).then(function success(response) {
    deleteId = null;
    console.log("task deleted")
    updateSite();
  }, function error(response) {
    console.log(response);
    console.log("task could not be deleted")
    });

  }

//move task
$scope.moveTask = function (taskId, taskStatus) {

  var task = {};
  console.log("status to move " + taskStatus)

  //set the task status if the task moves
  switch (taskStatus) {
    case "open":
    task.status = 'progress';
    task.assignedTo = $scope.user.user.firstName + " " + $scope.user.user.lastName;
    console.log("move from open to " + task.status);
    break;
    case "progress":
    task.status  = 'done';
    task.assignedTo = $scope.user.user.firstName + " " + $scope.user.user.lastName;
    console.log("move from progress to " + task.status);
    break;
    case "done":
    task.status  = 'progress';
    task.assignedTo = $scope.user.user.firstName + " " + $scope.user.user.lastName;
    console.log("move from done to " + task.status);
    break;
    case "backToOpen":
    task.status = 'open';
    task.assignedTo = "";

    console.log("move from progress to " + task.status);


    break;
    default:
    console.log("There is no status " + task.status + ".");
  }



  $http({
    method: 'POST',
    data:  task,
    url: '/db/movetask/'+ taskId,
    dataType: 'JSON'
  }
).then(function success(response) {
  //  taskId = null;
  console.log("task moved")
  socket.emit('message', "updated");
}, function error(response) {
  console.log(response);
  console.log("task could not be moved")
});
}

//refresh the tasks
function updateSite(){

  $http({
    method: 'GET',
    url: "/db/tasklist"}
  ).then(function success(response) {
    console.log("populate table success")
    console.log(response)
    $scope.Tasks = response.data;
    return false;
  }, function error(response) {
    console.log("populate table error")
    console.log(response)
  });

}

//get the date format for the tasks
function getDate(){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //Januar ist 0
  var yyyy = today.getFullYear();
  var hh = today.getHours();
  var min = today.getMinutes();

  if(dd<10) {
    dd='0'+dd
  }

  if(mm<10) {
    mm='0'+mm
  }

  return dd+'.'+mm+'.'+yyyy+" "+hh+":"+min;
}

});


//features to come: Teams:you can see who is in your team, Companies, assinging tasks to specific users, sprints,
//order tasklist by teams/dates/priorities. Feature based task grouping

//VERY IMPORTANT: Error messages to the user

// app.controller("userContr", function($scope, $http) {
//
// })
