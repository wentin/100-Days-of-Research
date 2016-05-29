var jq = $.noConflict();
var app = angular.module("researchApp", ['ngCookies', 'ngRoute']);
app.controller("MainCtrl", ['$scope', '$cookies', '$http', '$route', '$routeParams', '$location', function($scope, $cookies, $http, $route, $routeParams, $location) {
  $scope.data = [];
  // $http.get('https://api.jsoneditoronline.org/v1/docs/755438b3cca8dea3cf8e16d9ffd355bb/data').success(function(data) {
  $http.get('js/research.json').success(function(data) {
    $scope.data = data;
  });

  // $scope.$route = $route;
  // $scope.$location = $location;
  // $scope.$routeParams = $routeParams;

  $scope.swatch = $cookies.getObject("swatch")?$cookies.getObject("swatch"):5;
  $scope.zoom = $cookies.getObject("zoom")?$cookies.getObject("zoom"):0.8;
  
  var now = new window.Date(),
      exp = new window.Date(now.getFullYear(), now.getMonth()+6, now.getDate());
  
  $scope.updateSwatch = function(swatch) {
    $scope.swatch = swatch;
    $cookies.remove('swatch');
    $cookies.putObject("swatch", $scope.swatch, {
      expires: exp
    });
  }

  $scope.updateZoom = function() {
    if ($scope.zoom != 0.8) {
      $cookies.remove('zoom');
      $cookies.putObject("zoom", $scope.zoom, {
        expires: exp
      });
    }
  }
  $scope.switchZoom = function() {
    if ($scope.zoom != 0.8) {
      $scope.zoom = 0.8;
    } else {
      $scope.zoom = $cookies.getObject("zoom")?$cookies.getObject("zoom"):0.7;
    }
  }
  $scope.showConnected = function($event, link) {
    var number = link.number.toString();
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

app.controller('DayController', function($scope, $routeParams) {
  $scope.params = $routeParams;
  $scope.dayId = Number($routeParams.dayId);

  if ($scope.dayId == 1) {
    $scope.prevDay = false;
  } else {
    $scope.prevDay =  $scope.dayId - 1; 
  }
  $scope.nextDay = $scope.dayId + 1; 
  
  jq("body").unbind('keydown').keydown(function(e) {
		if(e.keyCode == 37) {
      e.preventDefault();
			if (jq('.prev')[0]) {
				jq('.prev')[0].click();
			}
		}
		else if(e.keyCode == 39) { 
      e.preventDefault();
			if (jq('.next')[0]) {
				jq('.next')[0].click();
			}
		}
	});

})

app.controller('UserController', function($scope, $routeParams, $http) {
  $scope.params = $routeParams;
  var userId = $routeParams.userId;
  jq("body").unbind('keydown');
  
  $scope.data = [];
  $http.get('http://api.jsoneditoronline.org/v1/docs/'+userId+'/data').success(function(data) {
    $scope.data = data;
  });
})

app.controller('HomeController', function($scope, $routeParams) {
  $scope.params = $routeParams;
  jq("body").unbind('keydown');
})

app.config(function($routeProvider, $locationProvider){
  $routeProvider
    .when('/',{
      templateUrl: 'views/home.html',
      controller: 'HomeController'
    })
    .when('/about',{
      templateUrl: 'views/about.html' 
    })
    .when('/day/:dayId', {
      templateUrl: 'views/day.html',
      controller: 'DayController'
    })
    .when('/user/:userId', {
      templateUrl: 'views/user.html',
      controller: 'UserController'
    })
    .otherwise({
        redirectTo: '/'
    });
  // $locationProvider.html5Mode(true);
});