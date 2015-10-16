var todoModule = angular.module('todo', []).factory('todoService', function($rootScope, $http) {
    var todo = {};
    var readyForGetTodo = function() {
        $rootScope.$broadcast('readyForGetTodo');
    };
    var refreshTodos = function() {
        $rootScope.$broadcast('refreshTodos');
    }
    return {
        // 传递数据
        getTodo: function() {
            return this.todo;
        },
        setTodo: function(todo) {
            this.todo = todo;
            readyForGetTodo();
        },
        // 查
        getAlltodos: function(thisScope) {
            $http.get('/todos').success(function(data) {
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
    $scope.todo = {};
    // 回车发送事件
    $scope.sendData = function($event) {
        if ($event.keyCode === 13) {
            $scope.todo.title = $scope.todoTitle;
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
            todoService.updateTodo(data, function(){
                todo.isDone = !todo.isDone;
            });
        }
    // 删除todo
    $scope.delTodo = function(todo) {
        console.log(todo);
        todoService.removeTodo(todo,function(){
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
        todoService.updateTodo(todo,function(){
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