var todoModule = angular.module('todo',[]).factory('todoService',function($rootScope){
    var todo = {};
    var broadcastItem = function(){
        $rootScope.$broadcast('handleBroadcast');
    }
    return {
        getTodo: function(){
            return this.todo;
        },
        setTodo: function(todo){
            this.todo = todo;
            broadcastItem();
        }
    };
});



todoModule.controller('todoListCtrl',function($scope,$http,todoService){
    // 获取数据
    $http.get('/todos').success(function(data){
        $scope.todos = data;
    });
    // 暴露函数
    $scope.popDetail = function(todo){
        todoService.setTodo(todo);
        document.querySelectorAll('.mod_alert_layer')[0].style.display= "block";
        setTimeout(function(){document.querySelectorAll('.todo_detail_board')[0].classList.add('fixed');},100);
    }
    $scope.closeDetail = function(){
        document.querySelectorAll('.mod_alert_layer')[0].style.display= "none";
        document.querySelectorAll('.todo_detail_board')[0].classList.remove('fixed');
    }
    $scope.tickStatus = function(){
        this.todo.isDone = !this.todo.isDone;
    }
});
todoModule.controller('todoDetailCtrl',function($scope,todoService){
    $scope.todo = todoService.getTodo();
    $scope.$on('handleBroadcast', function() {
        $scope.todo = todoService.getTodo();
        console.log($scope.todo);
    });
    function close(){
        document.querySelectorAll('.todo_detail_board')[0].classList.remove('fixed');
        setTimeout(function(){
            document.querySelectorAll('.mod_alert_layer')[0].style.display= "none";
        },300);
    }
    $scope.closeDetail = function(){
        close();
    }
    $scope.commitDatail = function(){
        close();
    }
});
todoModule.controller('todoBoardCtrl',function($scope){
    $scope.sendData = function($event){
        if ($event.keyCode === 13){
            alert($scope.todoInput + '发送成功！');
        }
    }
});

