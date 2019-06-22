var app = angular.module('app', ['ngSanitize', 'ui.router']);
/* Configuração de Rotas */
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');
  
    $stateProvider
    .state('characters', {
        url: '/',
        templateUrl: 'index.html',
        controller: 'appCtrl',
        controllerAs: '$ctrl'
    })
    .state('episodies', {
        url: '/episodies',
        templateUrl: 'episodios.html',
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

/* Controller */
app.controller('appCtrl', ['$scope', '$http','$state', function($scope, $http, $state){
    let $ctrl = this;

    $ctrl.getChars=function(){
        debugger;
    };

    $ctrl.getEpis=function(){

    };

    $ctrl.construct=function(){
        if($state.current.name==='characters'){
            $ctrl.getChars();
        }else if($state.current.name==='episodes'){

        }
    };

    $ctrl.construct();

}]);