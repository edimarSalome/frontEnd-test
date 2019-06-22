var app = angular.module('app', ['ngSanitize', 'ui.router']);
/* Configuração de Rotas */
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');
  
    $stateProvider
    .state('characters', {
        url: '/',
        templateUrl: 'views/characters.html',
        controller: 'appCtrl',
        controllerAs: '$ctrl'
    })
    .state('character', {
        url: '/character/:name',
        templateUrl: 'views/characters.html',
        controller: 'appCtrl',
        controllerAs: '$ctrl'
    })
    .state('episodes', {
        url: '/episodes',
        templateUrl: 'views/episodes.html',
        controller: 'appCtrl',
        controllerAs: '$ctrl'
    })
    .state('sugestion', {
        url: '/sugestion',
        templateUrl: 'views/sugestion.html',
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
app.controller('appCtrl', ['$rootScope', '$scope', '$http','$state','$filter','$stateParams', function($rootScope, $scope, $http, $state, $filter, $stateParams){
    let $ctrl = this;

    $ctrl.get=(url)=>{return $http({method: 'GET',url: url});};
    $ctrl.post=(url, param)=>{return $http({method: 'POST',url: url, data:param});};

    /* Characters */
    $ctrl.getChars=()=>{
        $scope.loaded=false;
        if(!$rootScope.characters){
            $ctrl.get('https://www.breakingbadapi.com/api/characters', '')
            .then((res)=>{
                $rootScope.characters = $filter('orderBy')(res.data, 'name');
                $ctrl.setPagination('chars');
                $scope.loaded=true;
            },(error)=>{alert('Ops, não conseguimos obter os personagens, tente novamente mais tarde.'); $scope.loaded=true;});
        }else{$ctrl.setPagination('chars'); $scope.loaded=true;}
    };

    $ctrl.setPagination=(list)=>{
        $scope.pagination={step:12, activePage:1};
        if(list==='chars'){
            $scope.pagination.pages = Math.ceil($rootScope.characters.length/$scope.pagination.step);
            $scope.setCharPage(1);
        }else if(list==='episodes'){
            $scope.pagination.pages = Math.ceil($rootScope.episodes.length/$scope.pagination.step);
            $scope.setEpisodesPage(1);
        }
    };

    $scope.setCharPage=(page)=>{
        $scope.charList=$stateParams.name?$rootScope.characters:[];

        for(let i=$scope.charList.length; i <($scope.pagination.step*page); i++){
            if($rootScope.characters[i])$scope.charList.push($rootScope.characters[i]);
        };

        $scope.pagination.activePage=page;
    };

    $scope.checkFilter=()=>{
        if($ctrl.filter.name.length){
            $scope.charList=$rootScope.characters;
        }else{$scope.setCharPage($scope.pagination.activePage);}
    };

    $scope.getActivePage=()=>{return $scope.pagination.activePage;}
    $scope.getTotalPages=()=>{return $scope.pagination.pages;}
    $scope.setFilterStatus=(status)=>{$ctrl.filter.status=status; $ctrl.searching();};
    $scope.getFilterStatus=()=>{return $ctrl.filter.status;};
    $ctrl.searching=()=>{if($scope.getFilterStatus()===''){$scope.setCharPage($scope.pagination.activePage);}else{$scope.charList=$rootScope.characters;};};

    $scope.getStatus=(status)=>{
        if(status==='Alive')return 'Vivo';
        else if(status==='Deceased')return 'Morto'
        else if(status==='Presumed dead')return 'Supostamente Morto';
        else return status;
    };


    /* Episodes */
    $ctrl.getEpisodes=()=>{
        $scope.loaded=false;

        if(!$rootScope.episodes){
            $ctrl.get('https://www.breakingbadapi.com/api/episodes', '')
            .then((res)=>{
                $rootScope.episodes = [];
                res.data.forEach((value)=>{
                    value.air_date = new Date(value.air_date);
                    $rootScope.episodes.push(value);
                });
                
                $rootScope.episodes = $filter('orderBy')($rootScope.episodes, 'air_date', true);
                $ctrl.setPagination('episodes');
                $scope.loaded=true;

            },(error)=>{alert('Ops, não conseguimos obter os personagens, tente novamente mais tarde.'); $scope.loaded=true;});
        }else{$ctrl.setPagination('episodes'); $scope.loaded=true;}
    };

    $scope.setEpisodesPage=(page)=>{
        $scope.epList=[];

        for(let i=$scope.epList.length; i <($scope.pagination.step*page); i++){
            if(!!$rootScope.episodes[i])$scope.epList.push($rootScope.episodes[i]);
        };

        $scope.pagination.activePage=page;
    };

    /* Suggestion */
    $scope.sendSuggestion=()=>{
        $scope.loaded=false;
        $ctrl.post('https://frontendtestesamba.free.beeceptor.com/breaking-bad/suggestions', $scope.suggestion).then((res)=>{
            alert('Sugestão enviada, muito obrigado!');
            $scope.suggestion={};
            $scope.loaded=true;
        }, (error)=>{
            $scope.loaded=true;
            alert("Não conseguimos enviar a mensagem. Por favor, tente novamente mais tarde.");
        });
    };

    /* find */
    $scope.find=(name)=>{if(!!name)$state.go('character', {name:name});}

    $ctrl.construct=()=>{
        if($state.current.name==='characters'){
            $ctrl.getChars();
            $ctrl.filter={status:'', name:''};
        }else if($state.current.name==='character'){
            $ctrl.getChars();
            $ctrl.filter={status:'', name:$stateParams.name};
        }else if($state.current.name==='episodes'){$ctrl.getEpisodes();}
        else{$scope.loaded=true;}
    };

    $ctrl.construct();

}]);