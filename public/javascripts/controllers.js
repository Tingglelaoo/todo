var todoModule = angular.module('todo', ['ui.router', 'ngMessages']);
// 视图路由

todoModule.config(function($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/login');
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'page-login.html'
        })
        .state('todo', {
            url: '/todo',
            templateUrl: 'page-todo.html'
        })
});


// todoModule.config(function($routeProvider){
//    $routeProvider
//    .when('/',{
//      templateUrl:'page-login.html',
//      controller: 'loginCtrl'
//    })
//    .when('/todo',{
//     templateUrl:'page-todo.html',
//     controller: 'todoBoardCtrl'
//    })
//    .otherwise({
//     redirectTo:'/'
//    });
// });


// 创建服务
todoModule.factory('todoService', function($rootScope, $http) {
    var todo = {};
    var user = JSON.parse(localStorage.todoCurUser) || {};
    var readyForGetTodo = function() {
        $rootScope.$broadcast('readyForGetTodo');
    };
    var refreshTodos = function() {
        $rootScope.$broadcast('refreshTodos');
    }
    return {
        // 传递数据
        getUser: function(){
            return this.user;
        },
        setUser:function(user){
            this.user = user;
            localStorage.todoCurUser = JSON.stringify(user);
        },
        getTodo: function() {
            return this.todo;
        },
        setTodo: function(todo) {
            this.todo = todo;
            readyForGetTodo();
        },
        // 查
        getAlltodos: function(thisScope) {
            var curUser = JSON.parse(localStorage.todoCurUser);
            $http.get('/todos/'+ curUser._id ).success(function(data) {
                thisScope.todos = data;
            });
        },
        // 增
        addTodo: function(todo, callback) {
            $http.post('/todo/add', todo).success(function() {
                refreshTodos();
                if (typeof callback === 'function') {
                    callback();
                }
                console.log(todo.title + " add");
            }).error(function() {
                console.log(todo.title + " has error: add");
            });
        },
        //改
        updateTodo: function(todo, callback) {
            console.log(todo);
            $http.post('/todo/update', todo).success(function() {
                if (typeof callback === 'function') {
                    callback();
                }
                console.log(todo._id + " update");
                return true;
            });
        },
        // 删
        removeTodo: function(todo, callback) {
            $http.post('/todo/remove', todo).success(function() {
                if (typeof callback === 'function') {
                    callback();
                }
                console.log(todo.title + 'delete');
                return true;
            }).error(function() {
                console.log(todo.title + 'has error: delete');
                return false;
            });
        }
    };
});

todoModule.controller('todoBoardCtrl', function($scope, todoService) {
    $scope.user = todoService.getUser();
    $scope.todo = {};
    // 回车发送事件
    $scope.sendData = function($event) {
        if ($event.keyCode === 13) {
            $scope.todo.userId = $scope.user._id;
            $scope.todo.title = $scope.todoTitle;
            console.log($scope.todo);
            todoService.addTodo($scope.todo, function() {
                $scope.todoTitle = '';
            });
        }
    }

});


todoModule.controller('todoListCtrl', function($scope, todoService) {
    // 获取数据
    todoService.getAlltodos($scope);
    // 同步数据
    $scope.$on('refreshTodos', function() {
        todoService.getAlltodos($scope);
    });
    // 勾选切换是否完成
    $scope.tickStatus = function(todo) {
            var data = {
                _id: todo._id,
                isDone: !todo.isDone
            };
            todoService.updateTodo(data, function() {
                todo.isDone = !todo.isDone;
            });
        }
        // 删除todo
    $scope.delTodo = function(todo) {
            console.log(todo);
            todoService.removeTodo(todo, function() {
                todoService.getAlltodos($scope);
            });
        }
        // 打开弹窗并且发送当前todo
    $scope.popDetail = function(todo) {
        todoService.setTodo(todo);
        open();
    }

});


todoModule.controller('todoDetailCtrl', function($scope, todoService) {
    var preTodo = {
        desc: '',
        status: ''
    }
    $scope.todo = todoService.getTodo();
    // 接收当前todo
    $scope.$on('readyForGetTodo', function() {
        $scope.todo = todoService.getTodo();
        preTodo.desc = $scope.todo.desc;
        preTodo.status = $scope.todo.status;
        console.log($scope.todo);
    });
    // 取消修改并关闭弹窗
    $scope.closeDetail = function() {
            $scope.todo.desc = preTodo.desc;
            $scope.todo.status = preTodo.status;
            close();
        }
        // 确认修改并关闭弹窗
    $scope.commitDatail = function(todo) {
        todoService.updateTodo(todo, function() {
            close();
        });

    }
});


// 交互
function open() {
    document.querySelectorAll('.mod_alert_layer')[0].style.display = "block";
    setTimeout(function() {
        document.querySelectorAll('.todo_detail_board')[0].classList.add('fixed');
    }, 100);
}

function close() {
    document.querySelectorAll('.todo_detail_board')[0].classList.remove('fixed');
    setTimeout(function() {
        document.querySelectorAll('.mod_alert_layer')[0].style.display = "none";
    }, 300);
}


// Users
todoModule.controller('logSignCtrl', function($scope, $http, $location, todoService) {
    $scope.canNotSign = false;
    var user = {};
    $scope.logIn = function() {
        if ( $scope.canNotSign ) {
            user = $scope.user;
            console.log(user);
            $http.post('/logIn',user).success(function(data) {
                console.log('User: ' + user.username + ' Log In ');
                user = data;
                todoService.setUser(user);
                $location.path('/todo');
            }).error(function() {
                $scope.res = "WRONG Password";
            });
        }
    }
    $scope.signUp = function() {
        if ( !$scope.canNotSign ) {
            user = $scope.user;
            $http.post('/signUp', user).success(function(data) {
                console.log('User: ' + user.username + ' Sign Up ');
                user = data;
                todoService.setUser(user);
                $location.path('/todo');
            });
        }
    }

});

// 自定义 ng-messages
todoModule.directive('userValidator', ['$http', function($http) {
    return {
        require: 'ngModel',
        link: function($scope, element, attrs, ngModel) {
            var apiUrl = attrs.userValidator;

            function setLoading(bool) {
                ngModel.$setValidity('checkNameLoading', !bool);
            }

            function setAvailable(bool) {
                ngModel.$setValidity('checkNameError', !bool);
            }
            ngModel.$parsers.push(function(value) {
                if (!value || value.length == 0) {
                    return false;
                }
                setLoading(true);
                setAvailable(false);
                $http.get(apiUrl + value).
                    success(function() {
                        setLoading(false);
                        setAvailable(true);
                        $scope.canNotSign = true;
                    })
                    .error(function() {
                        setLoading(false);
                        setAvailable(false);
                        $scope.canNotSign = false;
                    });
                return value;
            });
        }
    }
}]);