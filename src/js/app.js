var app = angular.module('app', ['ngSanitize', 'ui.router']);
/* Configuração de Rotas */
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');
  
    $stateProvider
    .state('characters', {
        url: '/',
        templateUrl: 'characters.html',
        controller: 'appCtrl',
        controllerAs: '$ctrl'
    })
    .state('episodes', {
        url: '/episodes',
        templateUrl: 'episodes.html',
        controller: 'appCtrl',
        controllerAs: '$ctrl'
    })
    .state('sugestion', {
        url: '/sugestion',
        templateUrl: 'sugestion.html',
        controller: 'appCtrl',
        controllerAs: '$ctrl'
    });
}]);

/* Filtro */
app.filter('range', ()=>{
    return (val, range)=>{
        range = parseInt(range);
        for (let i=0; i<range; i++)val.push(i);

        return val;
    };
});

/* Controller */
app.controller('appCtrl', ['$scope', '$http','$state','$filter', function($scope, $http, $state, $filter){
    let $ctrl = this;

    $ctrl.get=(url, param)=>{return $http({method: 'GET',url: url});};
    $ctrl.post=(url, param)=>{return $http({method: 'POST',url: url});};

    $ctrl.getChars=()=>{
        $ctrl.get('https://www.breakingbadapi.com/api/characters', '')
        .then((res)=>{
            $ctrl.characters = $filter('orderBy')(res.data, 'name');
            $ctrl.setPagination();
        },(error)=>{alert('Ops, não conseguimos obter os personagens, tente novamente mais tarde.');});
    };

    $ctrl.setPagination=()=>{
        $scope.pagination={step:12, activePage:1};
        $scope.pagination.pages = Math.round($ctrl.characters.length/$scope.pagination.step);
        $scope.setCharPage(1);
    };

    $scope.setCharPage=(page)=>{
        $scope.charList=[];

        for(let i=$scope.charList.length; i <($scope.pagination.step*page); i++){
            $scope.charList.push($ctrl.characters[i]);
        };

        $scope.pagination.activePage=page;
    };

    $scope.checkFilter=()=>{
        if($ctrl.filter.name.length){
            $scope.charList=$ctrl.characters;
        }else{$scope.setCharPage($scope.pagination.activePage);}
    };

    $scope.getActivePage=()=>{return $scope.pagination.activePage;}
    $scope.getTotalPages=()=>{return $scope.pagination.pages;}
    $scope.setFilterStatus=(status)=>{$ctrl.filter.status=status; $ctrl.searching();};
    $scope.getFilterStatus=()=>{return $ctrl.filter.status;};
    $ctrl.searching=()=>{if($scope.getFilterStatus()===''){$scope.setCharPage($scope.pagination.activePage);}else{$scope.charList=$ctrl.characters;};};

    $scope.getStatus=(status)=>{
        if(status==='Alive')return 'Vivo';
        else if(status==='Deceased')return 'Morto'
        else if(status==='Presumed dead')return 'Supostamente Morto';
        else return status;
    };

    $ctrl.getEpis=()=>{

    };

    $ctrl.construct=()=>{
        if($state.current.name==='characters'){
            $ctrl.getChars();
            $ctrl.filter={status:'', name:''};
        }else if($state.current.name==='episodes'){

        }
    };

    $ctrl.construct();

}]);