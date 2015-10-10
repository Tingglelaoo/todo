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


todoModule.controller('todoBoardCtrl',function($scope,$http,$location){
    $scope.todo = {};
    // 发送
    $scope.sendData = function($event){
        if ($event.keyCode === 13){
            $scope.todo.title = $scope.todoTitle;


            $http.post('/todo/add',$scope.todo).success(function(){
                $scope.todoTitle = '';
                console.log($scope.todoTitle + " send successfully!");
                $scope.$broadcast('addSuccess');
            }).error(function() {
                console.log($scope.todoTitle + " fail!");
            });
        }
    }

});


todoModule.controller('todoListCtrl',function($scope,$http,todoService,$location){
    // 获取数据
    $http.get('/todos').success(function(data){
        $scope.todos = data;
    });
    $scope.$on('addSuccess',function(){
        $http.get('/todos').success(function(data){
            $scope.todos = data;
        });
    });
    // 勾选切换是否完成
    $scope.tickStatus = function(todo){
        var data = {
            _id: todo._id,
            isDone: !todo.isDone
        };
        $http.post('/todo/update',data).success(function(){
            todo.isDone = !todo.isDone;
            console.log(todo.title + ' update successfully!');
        });
    }
    // 删除
    $scope.delTodo = function(todo) {
        console.log(todo);
        $http.post('/todo/remove',todo).success(function(){
            $http.get('/todos').success(function(data){
                $scope.todos = data;
            });
            console.log(todo.title + 'delete successfully!');
        });
    }
    $scope.popDetail = function(todo){
        todoService.setTodo(todo);
        document.querySelectorAll('.mod_alert_layer')[0].style.display= "block";
        setTimeout(function(){document.querySelectorAll('.todo_detail_board')[0].classList.add('fixed');},100);
    }
    $scope.closeDetail = function(){
        document.querySelectorAll('.mod_alert_layer')[0].style.display= "none";
        document.querySelectorAll('.todo_detail_board')[0].classList.remove('fixed');
    }
});


todoModule.controller('todoDetailCtrl',function($scope,$http,todoService){
    var preDesc = '';
    $scope.todo = todoService.getTodo();

    $scope.$on('handleBroadcast', function() {
        $scope.todo = todoService.getTodo();
        preDesc = $scope.todo.desc;
        console.log($scope.todo);
    });
    function close(){
        document.querySelectorAll('.todo_detail_board')[0].classList.remove('fixed');
        setTimeout(function(){
            document.querySelectorAll('.mod_alert_layer')[0].style.display= "none";
        },300);
    }
    $scope.closeDetail = function(){
        $scope.todo.desc = preDesc;
        close();
    }
    // 修改备注
    $scope.commitDatail = function(todo){
        $http.post('/todo/update',todo).success(function(){
            close();
            console.log( todo.desc+" successfully!");
        });
    }
});


