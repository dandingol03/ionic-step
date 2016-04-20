/**
 * Created by outstudio on 16/3/30.
 */
/**
 * Created by outstudio on 16/3/29.
 * return response,
 * when response.type==1,it worked!
 * when response.type!=1,it is invalid!
 * when response doesn't have property type,server encounter error!
 *
 */
angular.module('App')

    .controller('PhotoController', function ($scope, $http,$ionicLoading,$UserSetting,$state,$cordovaImagePicker,
                                             $ionicActionSheet,$cordovaFileTransfer,$cordovaDevice,$cordovaCamera,
                                            $interval,$dateFormatter,$cordovaFile,$judgePhotoSuffix,$ionicModal,
                                             $websocket,$timeout,$platformDistribute,$createDirs,$createDir,$checkDir,
                                             $createDirs) {

        /**
         * <!--inception part-->
         */
        //默认头像,此头像在编译时进行插入,故无法在android本地找到
        $scope.portrait="img/ionic.png";

        //this used for phone
        //$scope.platform=($cordovaDevice.getPlatform()+"").toLowerCase();
        $scope.platform='';

        $scope.keepon_images=[];

        $scope.keepons=null;
        $scope.user=$UserSetting;
        $scope.uploadImg=null;


        //按照用户名为键在keepon_portraits中寻找头像的src
        $scope.keepon_portraits=new Object();

        //websocket的动态消息存储部分
        $scope.websocket$message=null;






        //"拍照"
        $scope.takePicture=function(){
            var options = {
                quality: 100,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.PNG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: true,
                correctOrientation:true
            };

            $cordovaCamera.getPicture(options).then(function(imageURI) {

                $scope.uploadImg = imageURI;
            }, function(err) {
                // error
            });

        }





        $scope.download={};

        //"下载头像"
        //1.拉取关注好友的图片(该接口未开放),该接口应实现让用户自主选择路径,并用进度条提示用户
        //2.本地头像的更新
        //3.本地文件夹的创建是根据姓名还是id号(暂且根据姓名)
        //4.本功能必须以本地文件系统的成功创建为前提
        $scope.downloadPhoto=function(type,imageType,target,filename,callCb){
            //TODO:injest data into dashboard panel
                    //目前仅支持iphone\android\blackberry
                    var url=$scope.download.dir;
                    var host="http://121.42.35.218:8080";
                    var serverDo=host+"/ReactJPChatter/download/downloadPhoto.do";
                    var platformPath=$platformDistribute.distribute($cordovaDevice);
                    var targetPath=null;
                    var suffix=imageType;
                    //更新头像

                    if(type=="portrait")
                    {
                        if($UserSetting.photo!=undefined&&$UserSetting.photo!=null&$UserSetting.photo!='')
                            suffix=$judgePhotoSuffix.judge($UserSetting.photo);
                        url="portrait/"+$UserSetting.userId+"/portrait"+"."+suffix;
                        targetPath="Document/ionic-react/portrait/"+$UserSetting.username;
                    }else{
                        targetPath=target;
                    }
                    var trustHosts = true;

                    $createDirs.createDirs($cordovaFile,$cordovaDevice,$createDir,$checkDir,targetPath,function(){
                        //成功创建目录
                        $cordovaFileTransfer.download(serverDo+"?"+"username="+$UserSetting.username+"&"+"url="+url +
                            "&"+"suffix="+imageType
                            , (platformPath==1?cordova.file.externalRootDirectory:platformPath==2?cordova.file.documentsDirectory:cordova.file.dataDirectory)+targetPath+"/"+filename+
                                "."+suffix
                            , {}, trustHosts)
                            .then(function() {
                                alert("image download success");
                                if(type=="portrait")
                                    $scope.portrait=targetPath;
                                else{
                                    if(callCb!==undefined&&callCb!==null&&callCb!="")
                                        callCb();
                                }
                                // Success!
                            }, function(err) {
                                alert("error occured!");
                                var result="";
                                for(var field in err)
                                {
                                    result+=field+":"+err[field]+"\r\n";
                                }
                                alert("detail:"+result);
                                // Error
                            }, function (progress) {
                                $timeout(function () {
                                    $scope.downloadProgress = (progress.loaded / progress.total) * 100;
                                });
                            });
                    },function(){
                        //创建目录失败
                        alert("directory initial encounter error");
                    });
        }/*<!-- 下载头像 -->*/




        // "添加附件"Event
        $scope.addAttachment = function() {
            $ionicActionSheet.show({
                buttons: [
                    { text: '图库' }
                ],
                cancelText: '关闭',
                cancel: function() {
                    return true;
                },
                buttonClicked: function(index) {

                    switch (index){
                        case 0:
                            pickImage();
                            break;
                        default:
                            break;
                    }
                    return true;
                }
            });
        }

        /**
         * 拉取关注好友的最新动态
         * 1.插件$cordovaFileTransfer的download不能在webroot中订制
         * 2.改进:开.do，对应不同param读取本地的不同文件路径
         */
        $scope.keepon=function(){
            $http({
                method:"post",
                url:"http://121.42.35.218:8080/ReactJPChatter/sysFollow/searchKeeponsPhotos.do",
                data:{
                    username:$UserSetting.username
                }
            })
                .success(function(response) {

                    if(response.type!==undefined&&response.type!==null) {
                        if(response.type==1||response.type=='1')//拉取成功
                        {
                            try {
                                alert('response list='+response.list);
                                $scope.keepons = eval(response.list);
                            }catch(e)
                            {
                                alert('e='+e);
                            }
                            alert("keepons="+$scope.keepons);
                            //更新所有关注用户所上传的照片
                            var platformPath=($scope.platform.indexOf('android')!=-1)?
                                cordova.file.externalRootDirectory:($scope.platform.indexOf('iphone')!=-1)?
                                cordova.file.documentsDirectory:cordova.file.applicationDirectory;
                            /**
                             *
                             * 在内存卡的根目录创建ionic-react目录
                             */
                            // $cordovaFile.createDir(cordova.file.externalRootDirectory, "ionic-react"
                            //api1
                            $cordovaFile.createDir(cordova.file.externalRootDirectory, "Document/ionic-react/portrait/"+$UserSetting.userId, false)
                                .then(function (success) {

                                    alert("create dir successfully!");
                                }, function (error) {
                                    alert("directory has been existed!");
                                });



                            $scope.keepons.map(function(item,i) {

                                //目前仅支持iphone\android\blackberry

                                //下载被关注用户的头像
                                if($scope.keepon_portraits[item.ownerName]==undefined||$scope.keepon_portraits[item.ownerName]==null)
                                {
                                    var portrait$url="http://121.42.35.218:8080"+item.ownerPortrait;
                                    var type=$judgePhotoSuffix.judge(item.ownerPortrait);
                                    var portraitName="portrait"+"."+type;
                                    var portrait$targetPath=cordova.file.externalRootDirectory+"Document/ionic-react/portrait/"+item.ownerId+"/"+portraitName;
                                    var trustHosts = true;
                                    var options = {};
                                    $cordovaFileTransfer.download(portrait$url, portrait$targetPath, options, trustHosts)
                                        .then(function(result) {
                                            alert("image download success");
                                            $scope.keepon_portraits[item.ownerName]=portrait$targetPath;
                                            // Success!
                                        }, function(err) {
                                            alert("error occured!");
                                            var result="";
                                            for(var field in err)
                                            {
                                                result+=field+":"+err[field]+"\r\n";
                                            }
                                            alert("detail:"+result);
                                            // Error
                                        }, function (progress) {
                                            $timeout(function () {
                                                $scope.downloadProgress = (progress.loaded / progress.total) * 100;
                                            });
                                        });
                                }







                                //url,为被关注用户特定时刻上传的照片的特定路径
                                var url = "http://121.42.35.218:8080"+item.url;
                                //tag,为被关注用户对此张照片的命名
                                var imageName=item.tag;
                                //we need a service to check whether the file is existed
                                var targetPath = cordova.file.externalRootDirectory+"Document/ionic-react/"+item.type+"/"+item.ownerId+"/"+imageName;
                                var trustHosts = true;
                                var options = {};
                                $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
                                    .then(function(result) {
                                        alert("iamge download success");
                                        alert("result="+result);
                                        $scope.keepon_images.push(targetPath);
                                        // Success!
                                    }, function(err) {
                                        alert("error occured!");
                                        var result="";
                                        for(var field in err)
                                        {
                                            result+=field+":"+err[field]+"\r\n";
                                        }
                                        alert("detail:"+result);
                                        // Error
                                    }, function (progress) {
                                        $timeout(function () {
                                            $scope.downloadProgress = (progress.loaded / progress.total) * 100;
                                        });
                                    });
                            });
                            $ionicLoading.hide();
                        }
                        else if(response.type==-1||response.type==-2)//好友动态同步失败
                        {
                            $ionicLoading.hide();
                            $ionicLoading.show({
                                template: response.content,
                                duration: 2000
                            });
                        }else{
                            $ionicLoading.hide();
                        }

                    }else{
                    }
                }).error(function(err) {
                    alert("error"+err);
                    $ionicLoading.show({
                        template:'could not connect to server',
                        duration:2000
                    });
                    console.log("connect err:" + err);
                });


        }/*<!-- keepon -->*/


        //image picker
        var pickImage = function () {
            var options = {
                maximumImagesCount: 1,
                width: 800,
                height: 800,
                quality: 80
            };

            $cordovaImagePicker.getPictures(options)
                .then(function (results) {
                    $scope.uploadImg=[];
                    $scope.uploadImg.push(results[0]);
                    alert("local path:"+$scope.uploadImg[0]);
                }, function (error) {
                    alert("error="+error)
                    // error getting photos
                });

        }

        /**
         * photo的提交部分
         **/

        /***photo的本页面存储***/
        $scope.photo=new Object();
        /*** modal的本页面存储***/
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
         * function showModal in customization;
         * 模态框在$scope的存储订制化
         */
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




        $scope.pop$photo$config=function(){
            $scope.showModalInCustomization('photo-modal.html','slide-in-up','photo modal',false);
        }


        //"上传照片",根据选择的类型来判定是头像或者照片
        $scope.upload$photo=function(modalName){
            if($scope.uploadImg==null)
            {
                alert("请先选择要上传的照片")
                $scope.hideModalInCustomization(modalName);
                return ;
            }
            if($scope.photo.name==''||$scope.photo.name==undefined||$scope.photo.name==null)
            {
                alert("请为您所要上传的照片命名");
                return ;
            }
            var server="http://121.42.35.218:8080/ReactJPChatter/photoComment/updatePersonalPhotoWithApp.do";
            var options=new Object();
            alert("username="+$UserSetting.username);
            options.fileKey = "file";
            options.mimeType = "text/plain";
            options.dataType="json";
            options.params=new Object();
            options.params.username=$UserSetting.username;
            options.params.type=$scope.photo.type;
            options.params.mandatory=$scope.photo.name;
            options.params.date=$dateFormatter.format(new Date());
            options.params.desc=$scope.photo.desc;
            $cordovaFileTransfer.upload(server, $scope.uploadImg[0],options)
                .then(function(result) {
                    //this return ob{'result'} has been capulated
                    var response=result.response;
                    var json=eval('('+response+')');
                    if(json.type!==undefined&&json.type!==null)
                    {
                        $ionicLoading.show({
                            template: json.content,
                            duration: 2000
                        });
                        //TODO:将本用户更新照片的消息通过websocket发送给其他用户
                        if($websocket.ws!=null&&$websocket.ws.readyState==1)
                        {
                            var json={
                                region:"broadcast",
                                message:$UserSetting.username+" have just upload a photo named "+$scope.photo.name
                            }
                            $websocket.ws.send(JSON.stringify(json));
                        }
                    }else{
                        $ionicLoading.show({
                            template: "field type doesn't exist in response",
                            duration: 2000
                        });
                    }
                    $scope.hideModalInCustomization(modalName);
                }, function(err) {
                    // Error
                    alert("err:"+err);
                }, function (progress) {
                    // constant progress updates
                });

        }

        /**
         * <!--websocket部分-->
         *
         */
        if($websocket.ws!==null&&$websocket.ws.readyState==1)
        {
           $websocket.register('photo scope',$scope);
        }

        $scope.$on('recv',function(evt,data){
            try{
                var json=eval('('+data+')');
                var region=json["region"];
                if(region=="broadcast")
                {
                    var message=json["message"];
                    $scope.websocket$message=message;
                    $scope.showModalInCustomization('message-modal.html','slide-in-left','message modal',true);
                }
            }catch(e)
            {
                alert("服务器返回消息结构有误");
                alert("error="+e);
            }
        });




        /**
         * function createDirs
         *
         */
        $scope.test={};
        $scope.testDirs=function(){
            $createDirs.createDirs($cordovaFile,$cordovaDevice,$createDir,$checkDir,$scope.test.dirs,function(){
                alert("dirs create successfully!");
            },function(){
                alert("dirs create encounter failed!");
            });
        }




        $scope.$on('$destroy', function() {

            //将本域从websocket的消息传播范围中清除
            if($websocket.ws!=null&&$websocket.readyState==1)
            {
                $websocket.un$register('photo scope');
            }
        });

        /**
         * photo页面添加计时器,不断从服务器上刷新数据
         */
        //
        //$scope.proxy='dddd';
        //var promise = $interval(function(){
        //    console.log("time= "+new Date().toString());
        //    console.log("proxy= "+$scope.proxy);
        //},1000);
        //$scope.$on('$destroy',function(){
        //    $interval.cancel(promise);
        //})





    })
