
/**
 * Created by outstudio on 16/3/27.
 */
angular.module('App', ['ionic','ui.router','ngCordova'])


	.config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                cache:'false',
                controller: 'LoginController',
                templateUrl: 'views/login/login.html'
            })
            .state('register',{
                url:'/register',
                cache:'false',
                controller:'RegisterController',
                templateUrl:'views/register/register.html'
            })
            .state('dashboard',{
                url:'/dashboard',
                cache:'false',
                controller:'DashboardController',
                templateUrl:'views/dashboard/dashboard.html'
            })
            .state('sport',{
                url:'/sport',
                cache:'false',
                controller:'SportController',
                templateUrl:'views/sport/sport.html'
            })
            .state('photo',{
                url:'/photo',
                cache:'false',
                controller:'PhotoController',
                templateUrl:'views/photo/photo.html'
            })
            .state('running',{
                url:'/running?type',
                cache:'false',
                controller:'RunningController',
                templateUrl:'views/sport/running/running.html'
            })
            .state('search',{
                url:'/search',
                cache:'false',
                controller:'SearchController',
                templateUrl:'views/search/search.html'
            })

        $urlRouterProvider.otherwise('/login');
    })

    .factory('$UserSetting', function () {
        var Settings = {
            username: '',
            userId:null,
            authenticated:false,
            userDesc:'',
            photo:null
        };
        return Settings;
    })

    .factory('Menus',function() {
        var Menus=null;
        return Menus;
    })
    
    .factory('$dateFormatter',function() {
        var formatter={
          format:function(date){
              var year=date.getFullYear()+"";
              var month=((date.getMonth()+1)+"").length<2?("0"+(date.getMonth()+1)):""+(date.getMonth()+1);
              var day=(date.getDate()+"").length<2?("0"+date.getDate()):""+date.getDate();
              var hour=(""+date.getHours()).length<2?("0"+date.getHours()):""+date.getHours();
              var minute=(""+date.getMinutes()).length<2?("0"+date.getMinutes()):""+date.getMinutes();
              var time=year+"-"+month+"-"+day+" "+hour+":"+minute;
              return time;
          }
        };
        return formatter;
    })

    .factory('$judgePhotoSuffix',function() {
        var judgeSuffix={
            judge:function(imageName)
            {
                if(imageName==undefined|imageName==null)
                    throw "imageName is blank";
                var type=null;
                if(imageName.indexOf('.png')!=-1)
                    type="png";
                if(imageName.indexOf('.jpg')!=-1)
                    type='jpg';
                return type;
            }
        }
        return judgeSuffix;
    })

    /* @example
    /* $scope.createDir=function(){
    /*    $createDir.createDir($cordovaFile,$cordovaDevice,"Document/ionic-react/portrait/","3",
    /*        function(){
    /*            alert("it worked!")
    /*        },function(){
    /*            alert("it failed");
    /*        });
    /*}
    */
    .factory('$createDir',function(){
        var creator={};
        creator.createDir=function($cordovaFile,$cordovaDevice,path,parentPath,outParam,successCb,failCb){
            //判断本机特定平台的文件系统
            var platform=$cordovaDevice.getPlatform().toLowerCase();
            console.log("platform="+platform);
            var platformPath=-1;
            if(platform.indexOf("android")!=-1)
                platformPath=1;
            if(platform.indexOf("iphone")!=-1)
                platformPath=2;
            $cordovaFile.createDir(platformPath==1?cordova.file.externalRootDirectory:platformPath==2?cordova.file.documentsDirectory:cordova.file.dataDirectory,
                path+parentPath, false)
                .then(function (success) {
                    console.log("function createDir scope\r\ncreate dir successfully!");
                    successCb(outParam);
                }, function (error) {
                    console.log("function createDir scope\r\ncreate directory has been existed!");
                    failCb(outParam);
                });
        }
        return creator;
    })

    // @example
    // $scope.checkDir=function(){
    //    $checkDir.checkDir($cordovaFile,$cordovaDevice,"Document/ionic-react/portrait/3",
    //            function(){
    //                alert("path exist!")
    //            },function(){
    //                alert("path doesn't exist");
    //            });
    //}
    .factory('$checkDir',function() {
        var checkor={};
        checkor.checkDir=function($cordovaFile,$cordovaDevice,path,outParam,successCb,failCb){
            //判断本机特定平台的文件系统
            var platform=$cordovaDevice.getPlatform().toLowerCase();
            console.log("function checkDir scope\r\nplatform="+platform);
            var platformPath=-1;
            if(platform.indexOf("android")!=-1)
                platformPath=1;
            if(platform.indexOf("iphone")!=-1)
                platformPath=2;
            $cordovaFile.checkDir(platformPath==1?cordova.file.externalRootDirectory:platformPath==2?cordova.file.documentsDirectory:cordova.file.dataDirectory
                , path).then(function (success) {
                    // success
                    if(successCb!==undefined&&successCb!==null)
                        successCb(outParam);
                }, function (error) {
                    // error
                    if(failCb!==undefined&&failCb!==null)
                        failCb(outParam);
                });
        }

        return checkor;

    })

    //本服务以$createDir和$checkDir为基础
    .factory('$createDirs',function() {
        var creator=this;
        creator.cur=null;
        creator.total=null;
        creator.paths=null;
        creator.prefix="";
        creator.nesting=function($cordovaFile,$cordovaDevice,$createDir,$checkDir){
            alert("enter nesting part");
                var path=this.prefix+this.paths[this.cur];
                $checkDir.checkDir($cordovaFile,$cordovaDevice,path,this,function(instance){//如果本路径已经存在
                    console.log(path+" exist");
                    if(instance.cur<(instance.total-1))
                    {
                        instance.prefix+=instance.paths[instance.cur]+"/";
                        instance.cur++;
                        instance.nesting($cordovaFile,$cordovaDevice,$createDir,$checkDir);
                    }else{
                        console.log("nesting scope,dir create completely!");
                        if(instance.successCb!==undefined&&instance.successCb!==null)
                            instance.successCb();
                        return ;
                    }


                },function(instance){

                    $createDir.createDir($cordovaFile,$cordovaDevice,instance.prefix,instance.paths[instance.cur],instance,function(out){
                        if(out.cur<out.total-1)//如果当前路径子元素不是全路径的最后一个
                        {

                            out.prefix+=out.paths[out.cur]+"/";
                            out.cur++;
                            out.nesting($cordovaFile,$cordovaDevice,$createDir,$checkDir);
                        }
                        else
                        {
                            console.log("nesting  scope,dir create completely");
                            if(out.successCb!==undefined&&out.successCb!==null)
                                out.successCb();
                            return ;
                        }
                    },function(out){
                        console.log("nesting scope,dir create encounter error!");
                        if(out.failCb!==undefined&&out.failCb!==null)
                            out.failCb();
                        return ;
                    });
                });
        };

        creator.createDirs=function($cordovaFile,$cordovaDevice,$createDir,$checkDir,paths,successCb,failCb)
        {
            if(paths==undefined||paths==null||paths=="")
            {
                alert("parameter paths is blank");
                return ;
            }
            var arr=paths.split("/");
            if(arr.length< 1)
            {
                alert("the paths parameter you pass is invalid");
                return ;
            }
            this.paths=arr;
            this.total=arr.length;
            this.cur=0;
            this.prefix="";
            if(successCb!==undefined&&successCb!==null)
                this.successCb=successCb;
            if(failCb!==undefined&&failCb!==null)
                this.failCb=failCb;
            this.nesting($cordovaFile,$cordovaDevice,$createDir,$checkDir);


        }.bind(this);

        return creator;
    })


     //@factiry -> $platformDistribute
     //-1.unknown platform
     //1. android platform
     //2. ios platform
     //@example
     // var sub=$platformDistribute.distribute($cordovaDevice);
     //

    .factory('$platformDistribute',function(){
        var distributor={

        }
        distributor.distribute=function($cordovaDevice){
            var platform=$cordovaDevice.getPlatform().toLowerCase();
            var sub=-1;
            if(platform.indexOf("android")!=-1)
                sub=1;
            if(platform.indexOf("iphone")!=-1)
                sub=2;
            return sub;
        }
        return distributor;
    })



    // @service -> $websocket
    // @example
    // $scope.checkDir=function(){
    //    $checkDir.checkDir($cordovaFile,$cordovaDevice,"Document/ionic-react/portrait/3",
    //            function(){
    //                alert("path exist!")
    //            },function(){
    //                alert("path doesn't exist");
    //            });
    //}
    .service('$websocket', function () {
        //window.ws = new WebSocket('ws://192.168.0.196:8090/ReactJPChatter/websocket.ws/'+ 1 +'/'+ 1);
        WebSocket.pluginOptions ={
            maxConnectTime: 5000
        };
        var self=this;
        self.ws=null;
        self.scopes=new Object();
       /**
        * <!-- 消息传播域集合的注册 -->
        */
        self.register=function(scopeName,scope){
            if(scopeName==undefined||scopeName==null||scope==null||scope==undefined)
            {
                alert("注册域信息缺失");
                return ;
            }
            if(self.scopes[scopeName]!==null&&self.scopes[scopeName]!==undefined)
            {
                alert("本消息域已属于消息传播范围");
            }
            else{
                self.scopes[scopeName]=scope;
            }
        };
        /**
         ** 本域从消息传播范围中注销
         **/
        self.un$register=function(scopeName){
            if(scopeName==undefined||scopeName==null)
            {
                alert("域注销失败");
                return ;
            }
            scopeName[scopeName]=null;
            console.log("域"+scopeName+"注销成功,已从消息传播范围中脱离");
        };
        self.connect=function(host,username,connectCb,closeCb,scope) {
            try{
                if(username==null||username==undefined)
                    throw "your username is blank";
                self.ws=new WebSocket(host+"/"+username);

                //websocket event handle
                self.ws.onopen=function(message){
                    console.log('websocket connection is established');
                    self.scopes["login scope"]=scope;
                    //执行客户端订制的回调
                    connectCb(message);
                };
                self.ws.onmessage=function(evt){
                    //向发起连接的scope域发送消息
                    for(var scopeName in self.scopes)
                    {
                        var scope=self.scopes[scopeName];
                        if(scope!==undefined&&scope!==null)
                            scope.$emit('recv',evt.data);
                    }

                    console.log("got message:"+event.data+" from server");    // will be "hello"
                };
                self.ws.onerr=function(err)
                {
                    console.log('connection with websocket encounter error!')
                };
                self.ws.onclose=function(event)
                {
                    console.log('websocket shutdown from server' + event.code);

                }
            }catch(e)
            {
                alert("websocket create error:"+e);
            }

        };
        self.send=function(message)
        {
            try{
                self.ws.send(message);
            }catch(e)
            {
                alert('websocket send message encounter error:'+e);
            }
        };

        self.close=function(){
            try{
                self.ws.close();
                self.ws=null;
            }catch(e)
            {
                alert("webscoket close encounter error:"+e);
            }
        };

        return self;

    })

    .controller('LeftMenuController',function($scope,$UserSetting){
        $scope.userSetting=$UserSetting;

    })

