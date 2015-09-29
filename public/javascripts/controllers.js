var todoModule = angular.module('todo',[]);



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


todoModule.factory('DataShareService',function(){
    return {
        _id: 0
    }
})

todoModule.controller('todoListCtrl',function($scope,$http,DataShareService){
    // 获取数据
    $http.get('/todos').success(function(data){
        $scope.todos = data;
    });
    // 暴露函数
    $scope.popDetail = function(todo){

        DataShareService._id = todo._id;

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
todoModule.controller('todoDetailCtrl',function($scope,$http,DataShareService){


    console.log(DataShareService._id);
    // 获取数据
    $http.get('/todo/'+ DataShareService._id).success(function(data){
        $scope.todo = data;
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

