/**
 * Created by outstudio on 16/3/29.
 * return response,
 * when response.type==1,it worked!
 * when response.type!=1,it is invalid!
 * when response doesn't have property type,server encounter error!
 *
 */
angular.module('App')

    .controller('DashboardController', function ($scope, $http,$ionicLoading,$UserSetting,$state,Menus,$ionicSideMenuDelegate) {


        /**
         * compare whether the panel belongs to sport
         */
        $scope.compare=function(menu){
            if(menu.authorityName=='Sport$record$upload')
            {
                $state.go('sport');

            }
        }


        /**
         * fetch the menus from server
         */
        function fetchMenus(){
            $http({
                method:"post",
                url:"http://121.42.35.218:8080/ReactJPChatter/menu/getPersonalMenuWithApp.do",
                data:{
                    username:$UserSetting.username,
                    password:$UserSetting.password
                }
            })
                .success(function(response) {
                    //TODO:injest data into dashboard panel
                    if(response.type!==undefined&&response.type!==null) {
                        if(response.type==1&&response.menus!==undefined&&response.menus!==null)
                        {
                            try{
                                Menus=new Array();
                                var menus=eval(response.menus);
                                menus.map(function(item,i) {
                                    Menus.push(item);
                                });
                                $scope.menus=Menus;

                            }catch(e)
                            {
                                console.log("json convert error:"+e);
                                $ionicLoading.hide();
                            }finally{
                                $ionicLoading.hide();
                            }


                        }
                        else{
                            $ionicLoading.show({
                                template:'your session is invalid,please login again!',
                                duration:1000
                            });
                            //clean Menus array
                            Menus=null;
                        }
                    }else{

                        $ionicLoading.show({
                            template:'could not fetch the property type in response',
                            duration:2000
                        });
                    }
                }).error(function(err) {
                    $UserSetting.username='';
                    $UserSetting.authenticated=false;

                    $ionicLoading.show({
                        template:'could not connect to server',
                        duration:2000
                    });
                    console.log("connect err:" + err);
                });
        }

        //fetch every time when this state has been invoked
        if( $scope.menus!==null&&$scope.menus!==undefined&&$scope.menus.length>0)
        {
            $scope.menus=Menus;
        }
        else
            fetchMenus();

    })
