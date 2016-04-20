
/**
 * Created by outstudio on 16/3/29.
 * return response,
 * when response.type==1,it worked!
 * when response.type!=1,it is invalid!
 * when response doesn't have property type,server encounter error!
 *
 */
angular.module('App')

    .controller('RegisterController', function ($scope, $http,$ionicLoading,$UserSetting) {

        $scope.formBean=new Object();


        /**
         * fetch the menus from server
         */
        $scope.register=function fetchMenus(){
            var formBean=$scope.formBean;
            //黑屏开始
            $ionicLoading.show();
            $http({
                method:"post",
                url:"http://192.168.0.196:8090/ReactJPChatter/register/addRegisterUserWithApp.do",
                data:{
                    username:formBean.username,
                    password:formBean.password,
                    rePassword:formBean.rePassword,
                    email:formBean.email,
                    phone:formBean.phone
                }
            })
                .success(function(response) {
                    //TODO:injest data into dashboard panel
                    if(response.type!==undefined&&response.type!==null) {
                        $ionicLoading.hide();
                        if(response.type==1)//注册成功
                        {
                            $ionicLoading.show({
                                template: response.content,
                                duration: 1000
                            });
                        }
                        else if(response.type==-1||response.type==2||response.type==0)//填写信息有误或者注册失败或po生成失败或系统错误
                        {

                            $ionicLoading.show({
                                template: response.content,
                                duration: 1000
                            });
                        }
                        else{
                            $ionicLoading.show({
                                template:'your session is invalid,please login again!',
                                duration:1000
                            });

                        }
                    }else{//无type字段返回

                        $ionicLoading.show({
                            template:'could not fetch the property type in response',
                            duration:2000
                        });
                    }
                }).error(function(err) {
                    $ionicLoading.show({
                        template:'could not connect to server',
                        duration:2000
                    });
                    console.log("connect err:" + err);
                });
        }






    })

