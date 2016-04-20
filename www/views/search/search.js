/**
 * Created by outstudio on 16/4/2.
 */
angular.module('App')
    .controller('SearchController', function ($scope, $http,$ionicModal,$UserSetting,$ionicLoading) {


        /**
         * scope field
         */
        $scope.followedId=null;




        /**
         * 搜索好友的长按弹窗
         */
        $scope.model = {term: ''};
        $scope.search = function () {
            $http.post('http://192.168.0.196:8090/ReactJPChatter/sysUser/searchUserWithApp.do',
                {
                        term: $scope.model.term,
                        username:$UserSetting.username
                }).success(function (response) {
                    if(response.type==1)
                    {
                        $scope.results = response.results;
                    }else if(response.type==-2||response.type==-1)
                    {
                        $ionicLoading.show({
                            template: response.content,
                            duration: 1000
                        });
                    }else{
                       alert('you just cannot connect to server');
                    }

                }).error(function(err) {

                    alert("err:"+err);
                    console.log("connect err:" + err);
                });
        };


        /**
         * change the li style in order to make it outstand
         */
        $scope.btn$press=function(followedId){
            $scope.followedId=followedId;
            $scope.showModal();
        }

        /**
         * function showModal
         */
        $scope.showModal = function () {
            if ($scope.modal) {
                $scope.modal.show();
            } else {
                $ionicModal.fromTemplateUrl('search-modal.html', {
                    scope: $scope,
                    animation:'slide-in-up'
                }).then(function (modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                });
            }
        };

        /**
         * function hideModal
         */
        $scope.hideModal=function(){
            $scope.modal.hide();
        }

        /**
         * function addFriend
         */
        $scope.addFriend=function(){
            var followId=$UserSetting.userId;
            var followedId=$scope.followedId;
            var username=$UserSetting.username;
            $http.post('http://192.168.0.196:8090/ReactJPChatter/sysUser/addFollowWithApp.do',
                {
                    followId: followId,
                    followedId:followedId,
                    username:$UserSetting.username
                }).success(function (response) {
                    if(response.type==1)
                    {
                        $scope.results = response.results;

                    }else if(response.type==-2||response.type==-1)
                    {

                    }else{
                    }
                    $scope.hideModal();
                    $ionicLoading.show({
                        template: response.type!==undefined&&response.type!==null?response.content:'you cannot connect to server',
                        duration: 1000
                    });

                }).error(function(err) {

                    alert("err:"+err);
                    console.log("connect err:" + err);
                });
        }

        /**
         * function deleteFriend
         */
        $scope.deleteFriend=function(){
            var followId=$UserSetting.userId;
            var followedId=$scope.followedId;
            $http.post('http://192.168.0.196:8090/ReactJPChatter/sysUser/deleteFollowWithApp.do',
                {
                    followId: followId,
                    followedId:followedId,
                    username:$UserSetting.username
                }).success(function (response) {
                    if(response.type==1)
                    {
                        $scope.results = response.results;
                    }else if(response.type==-2||response.type==-1)
                    {
                        $ionicLoading.show({
                            template: response.content,
                            duration: 1000
                        });
                    }else{
                        alert('you just cannot connect to server');
                    }

                }).error(function(err) {

                    alert("err:"+err);
                    console.log("connect err:" + err);
                });
        }

    });