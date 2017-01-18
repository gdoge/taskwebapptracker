var app = angular.module('myapp', [ 'ngMaterial' ]);


app.controller('myCtrl', function($scope, $http) {
  var socket = io.connect('http://localhost:3001');

  socket.on('tasksWereUpdated', function () {
    updateSite();
    console.log("socket updated the Site")
  });
  // $scope.sendTask={
  //   group:"all"
  // }

  $scope.tabdata = {
    selectedIndex: 0
  };
  $scope.next = function() {
    $scope.tabdata.selectedIndex = Math.min($scope.tabdata.selectedIndex + 1, 2) ;
  };
  $scope.previous = function() {
    $scope.tabdata.selectedIndex = Math.max($scope.tabdata.selectedIndex - 1, 0);
  };

  $scope.groups = ["Developers", "Designers", "Managers"];
  $scope.priority = ["High", "Medium", "Low"];



  $http({
    method: 'GET',
    url: "/db/tasklist"}
  ).then(function success(response) {
    console.log("populate table success")
    console.log(response)
    response.data.date = new Date().toDateString(response.data.date);
    console.log("RESPONSE DATE:"+  response.data.date)
    $scope.Tasks = response.data;
  }, function error(response) {
    console.log("populate table error")
    console.log(response)
  });

  $http({
    method: 'GET',
    url: "/api/user_data"}
  ).then(function success(response) {
    console.log("get user name")
    console.log(response)
    $scope.user = response.data;
    $scope.currentUser = $scope.user.user.firstName + " " + $scope.user.user.lastName;
  }, function error(response) {
    console.log("get user name error")
    console.log(response)
  });



  $scope.addTask = function () {
    $scope.sendTask.creator =   $scope.currentUser;
    $scope.sendTask.date = new Date(Date.now()).toISOString();
    console.log("DATUM:" +   $scope.sendTask.date);
    console.log("GROuP: " + $scope.sendTask.group);
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

      console.log("task added")
    }, function error(response) {
      console.log("task could not be added")
    });

  }
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

$scope.moveTask = function (taskId, taskStatus) {

  var task = {};
  console.log("status to move " + taskStatus)


  switch (taskStatus) {
    case "open":
    task.status = 'progress';
    task.assignedTo = $scope.user.user.firstName + " " + $scope.user.user.lastName;
    console.log("move from open to " + task.status);
    break;
    case "progress":
    task.status  = 'done';
    console.log("move from progress to " + task.status);
    break;
    case "done":
    task.status  = 'progress';
    console.log("move from done to " + task.status);
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


app.controller("userContr", function($scope, $http) {

})
