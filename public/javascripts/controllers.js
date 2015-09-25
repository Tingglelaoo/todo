
var todoModule = angular.module('todo',['ngResource','ngMessages']);



var todos = [
{
    isDone: false,
    status: 'hell',
    desc: 'this is the first data',
    __v: 0,
    time: '1442996322042',
    title: 'hell world'
},
{
    isDone: true,
    status: 'easy',
    desc: 'this is the second data',
    __v: 0,
    time: '1442996322042',
    title: 'hell world2'
},
{
    isDone: false,
    status: 'hard',
    desc: 'this is the third data',
    __v: 0,
    time: '1442996322042',
    title: 'hell world'
},
{
    isDone: true,
    status: '',
    desc: 'this is the second data',
    __v: 0,
    time: '1442996322042',
    title: 'hell world2'
}
];
todoModule.controller('todoListCtrl',function($scope){
    $scope.todos = todos;
    $scope.popDetail = function(){
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
todoModule.controller('todoDetailCtrl',function($scope){
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
    $scope.editable = true;
});
todoModule.controller('todoBoardCtrl',function($scope){
    $scope.sendData = function($event){
        if ($event.keyCode === 13){
            alert($scope.todoInput + '发送成功！');
        }
    }
});

