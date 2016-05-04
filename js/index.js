var jq = $.noConflict();
var app = angular.module("researchApp", ['ngCookies', 'ngRoute']);
app.controller("MainCtrl", ['$scope', '$cookies', '$http', '$route', '$routeParams', '$location', function($scope, $cookies, $http, $route, $routeParams, $location) {
  $scope.data = [];
  // $http.get('https://api.jsoneditoronline.org/v1/docs/755438b3cca8dea3cf8e16d9ffd355bb/data').success(function(data) {
  $http.get('js/research.json').success(function(data) {
    $scope.data = data;
  });

  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;

  $scope.zoom = 1;
  
  var now = new window.Date(),
      exp = new window.Date(now.getFullYear(), now.getMonth()+6, now.getDate());
  $scope.updateZoom = function() {
    if ($scope.zoom != 1) {
      $cookies.remove('zoom');
      $cookies.putObject("zoom", $scope.zoom, {
        expires: exp
      });
    }
  }
  $scope.switchZoom = function() {
    if ($scope.zoom != 1) {
      $scope.zoom = 1;
    } else {
      $scope.zoom = $cookies.getObject("zoom")?$cookies.getObject("zoom"):0.7;
    }
  }
  $scope.showConnected = function($event, link) {
    var number = link.number;
    var numberLength = number.length;
    var treeArray = [];
    jq('.hover').removeClass('hover');
    jq($event.target).parents('.day').find('.link').each(function(index) {
      var thisNumber = jq('.number', this).text();
      var thisNumberlength = thisNumber.length;
      if (thisNumberlength >= numberLength) {
        //thisNumber has to include number, from the first character
        var re = new RegExp("^" + number);
        var res = thisNumber.search(re);
        if (res == 0) {
          treeArray.push(jq(this)[0]);
        }
      } else {
        //number has to include thisNumber, from the first character
        var re = new RegExp("^" + thisNumber);
        var res = number.search(re);
        if (res == 0) {
          treeArray.push(jq(this)[0]);
        }
      }
    });
    jq(treeArray).addClass('hover');
  }
}]);

app.controller('DayController', function($scope, $routeParams, $location) {
  $scope.params = $routeParams;
  var dayId = $routeParams.dayId;
  if (dayId == 1) {
    $scope.prevDay = false;
  } else {
    $scope.prevDay = parseInt(dayId) - 1; 
  }
  $scope.nextDay = parseInt(dayId) + 1; 
  
  jq("body").keydown(function(e) {
		if(e.keyCode == 37) {
			if (jq('.prev')[0]) {
				jq('.prev')[0].click();
			}
		}
		else if(e.keyCode == 39) { 
			if (jq('.next')[0]) {
				jq('.next')[0].click();
			}
		}
	});
})


app.controller('UserController', function($scope, $routeParams, $http) {
  $scope.params = $routeParams;
  var userId = $routeParams.userId;
  
  $scope.data = [];
  $http.get('http://api.jsoneditoronline.org/v1/docs/'+userId+'/data').success(function(data) {
    $scope.data = data;
  });
})

app.controller('HomeController', function($scope, $routeParams) {
   $scope.params = $routeParams;
})

app.config(function($routeProvider, $locationProvider){
  $routeProvider
    .when('/',{
      templateUrl: 'home.html',
      controller: 'HomeController'
    })
    .when('/about',{
      templateUrl: 'about.html' 
    })
    .when('/day/:dayId', {
      templateUrl: 'day.html',
      controller: 'DayController'
    })
    .when('/user/:userId', {
      templateUrl: 'user.html',
      controller: 'UserController'
    })
    .otherwise({
        redirectTo: '/'
    });

  // $locationProvider.html5Mode(true);
});