/**
 * Created by outstudio on 16/3/28.
 */
angular.module('App')
    .controller('LoginController', function ($scope, $http,$ionicLoading,$UserSetting,$ionicModal,$websocket,
                                                $timeout) {




        $scope.user=new Object();

        $scope.websocket=$websocket;

        $scope.wsMessage=new Object();

        $scope.offTop='';

        $scope.messages=[];


        //this test is used to test jsplugin
        $scope.invokePlugin=function(){
            try{



                stepGit.serviceInvoke("fuck notification",function(){
                    alert("invoke successfully");
                },
                function(){
                    alert("invoke encounter error");
                });
            }catch(e)
            {
                alert("error="+e);
            }

        }





        /*****
         * modals,用于存储初始化后的模态框
         * @function contains,用于搜索$scope.modals.store是否存在相应的modalName
         * @field store:{modal-0:{},modal-1:{}}
         *
         *
         *
         *
         *
         * *****/
        $scope.modals={};
        $scope.modals.store=new Object();
        $scope.modals.contains=function(modalName){
            if($scope.modals.store==undefined||$scope.modals.store==null)
                return false;
            if($scope.modals.store[modalName]!==undefined&&$scope.modals.store[modalName]!==null
            &&(typeof $scope.modals.store[modalName]=="object"))
            {
                return true;
            }else{
                return false;
            }
        }



        /**
         * function login
         */
        $scope.login = function () {
            var user=$scope.user;
            console.log("user="+user);
            //加载动画展现
            $ionicLoading.show();

            $http({
                method:"post",
                url:"http://121.42.35.218:8080/ReactJPChatter/authentic/authenticUserWithApp.do",
                data:{
                    username:user.username,
                    password:user.password
                }
            })
            .success(function(response) {
                    //TODO:injest data into dashboard panel
                    if(response.type!==undefined&&response.type!==null) {
                        if(response.type==1)
                        {
                            $ionicLoading.hide();
                            $UserSetting.username=user.username;
                            $UserSetting.userId=response.userId;
                            $UserSetting.authenticated=true;
                            $UserSetting.userDesc=response.userDesc==undefined?'':response.userDesc;
                            if(response.photo!=null&&response.photo!=undefined)
                                $UserSetting.photo=response.photo;
                            $scope.showModal('login-modal.html','slide-in-left');
                            //加入websocket连接
                            if($scope.websocket.ws==null||$scope.websocket.ws.readyState==3)
                            {
                                $scope.websocket.connect('ws://192.168.0.196:8090/ReactJPChatter/websocket.ws',
                                    $UserSetting.username,function(){
                                        console.log('websocket connect successfully');
                                    },function(){
                                        console.log('websocket connect close');
                                    },
                                    $scope);
                            }

                        }
                        else{
                            $ionicLoading.show({
                                template:'authenticate failed,u are not a valid user',
                                duration:2000
                            });
                            $UserSetting.username='';
                            $UserSetting.authenticated=false;
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
                    alert("err:"+err);
                    $ionicLoading.show({
                        template:'could not connect to server',
                        duration:2000
                    });
                    console.log("connect err:" + err);
                });
        };



        /**
         * websocket part
         * 
         * */
        $scope.websocket$messageCb=new Array();
        $scope.websocket$messageCb.push($scope);
        /** function websocket$connect$cb **/
        $scope.websocket$connect$cb=function(message)
        {
            $scope.showModalInCustomization('websocket-modal.html','slide-in-up','websocket modal',false);
        }

        /**
         * function websocket$close$cb
         * @param message
         */
        $scope.websocket$close$cb=function(message)
        {
            $scope.hideModal();
        }




        //register messageCb part
        $scope.$on('recv',function(evt,data)
        {
            if($scope.messages==null)
                $scope.messages=new Array();
            $scope.$apply($scope.messages.push(data));

        });


        /** function websocket$close **/
        $scope.websocket$close=function(modalName){
            if(modalName!==undefined&&modalName!==null)
                $scope.hideModalInCustomization(modalName);
            if($websocket.ws!==null||$websocket.ws!==undefined)
            {
                $websocket.ws.close();
            }
        }
        $scope.websocket$send=function(){
            if($websocket.ws!==null||$websocket.ws!==undefined)
            {
                alert("message="+JSON.stringify($scope.wsMessage));
                var json={};
                json["region"]=$scope.wsMessage.region;
                json["message"]=$scope.wsMessage.message;
                $websocket.ws.send(JSON.stringify(json));
            }
        }

        $scope.loginWithWebsocket=function(host,username,connectCb,closeCb)
        {
            if($websocket.ws!=null&&$websocket.ws.readyState==1)
            {
                $scope.showModalInCustomization('websocket-modal.html','slide-in-up','websocket modal',false);
            }else{
                if($websocket.ws==null||$websocket.ws.readyState==3)
                {
                    $scope.messages=null;
                    $scope.websocket.connect(host,
                        username,connectCb,closeCb,$scope);
                }
            }

        }




        /** function showModal in customization;
         * 模态框在$scope的存储订制化
         **/
        $scope.showModalInCustomization=function(templateName,animation,modalName,auto)
        {
            if($scope.modals.contains(modalName))
            {
                $scope.modals.store[modalName].modal.show();
                if(auto==true)
                {
                    $scope.timer=$timeout(function(){
                        $scope.modals.store[modalName].modal.hide();
                    },18000);
                }
            }
             else {
                var ani;
                if(animation!==undefined||animation!==null)
                    ani=animation;
                else
                    ani='slide-in-up';
                $ionicModal.fromTemplateUrl(templateName, {
                    scope: $scope,
                    animation:ani
                }).then(function (modal) {
                    //inject additional property of modal
                    if(modalName.indexOf('message')!=-1)
                        modal.el.className+=" small";
                    $scope.modals.store[modalName]=new Object();
                    $scope.modals.store[modalName].modal= modal;
                    $scope.modals.store[modalName].modal.show();
                    if(auto==true)
                    {
                        $scope.timer=$timeout(function(){
                            $scope.modals.store[modalName].modal.hide();
                        },1800);
                    }
                });
            }
        }

        $scope.hideModalInCustomization = function (modalName) {
            $scope.modals.store[modalName].modal.hide();
        };

        $scope.appendFake=function(){
            $scope.messages.push('dddd');
        }






        /** function showModal **/
        $scope.showModal = function (templateName,animation) {
            if ($scope.modal) {
                $scope.modal.show();
            } else {
                var ani;
                if(animation==undefined||animation==null)
                    ani=animation;
                else
                    ani='slide-in-left';
                $ionicModal.fromTemplateUrl(templateName, {
                    scope: $scope,
                    animation:ani
                }).then(function (modal) {
                    modal.el.className+=" small";
                    $scope.modal = modal;
                    $scope.modal.show();
                });
            }
        };
        $scope.hideModal = function () {
            $scope.modal.hide();
        };




        $scope.$on('$ionicView.afterEnter', function() {
            console.log('ionic view load ready');
        }, false);




        $scope.$on('$destroy', function() {
            if($scope.modal!==undefined&&$scope.modal!==null)
                $scope.modal.remove();
            if($scope.modals.store!==undefined&&$scope.modals.store!==null)
            {
                for(var item in $scope.modals.store)
                {
                    if(item.modal!==undefined&&item.modal!==null)
                    {
                        item.modal.remove();
                    }
                }
                $scope.modals.store=null;
            }

            if($scope.timer!==undefined&&$scope.timer!==null)
                $scope.timer.clear();

            //将本域从websocket的消息传播范围中清除
            if($websocket.ws!=null&&$websocket.readyState==1)
            {
                $websocket.un$register('login scope');
            }
        });


        $scope.customer = {
            name: 'Naomi',
            address: '1600 Amphitheatre'
        };

    })


    .directive('myCustomer' ,function() {
            return {
                restrict: 'A',
                link: function(scope, element) {
                    console.log(element[0].offsetHeight);

                }
            };

    });