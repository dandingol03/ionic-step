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

    .controller('SportController', function ($scope, $http,$ionicLoading,$UserSetting,$state,$cordovaImagePicker,
                                             $ionicActionSheet,$cordovaFileTransfer) {

        $scope.images_list=[];
        $scope.user=$UserSetting;
        $scope.uploadImg='';

        //"上传附件"
        $scope.uploadAttachment=function(){
            var server="http://121.42.35.218:8080/ReactJPChatter/photoComment/updatePersonalPhotoWithApp.do";
            var options=new Object();
            options.fileKey = "file";
            options.mimeType = "text/plain";
            options.params=new Object();
            options.params.username=$UserSetting.username;
            options.params.type="running";
            $cordovaFileTransfer.upload(server, $scope.uploadImg,options)
                .then(function(result) {
                    if(result.type!==undefined&&result.type!==null)
                    {
                        $ionicLoading.show({
                            template: response.content,
                            duration: 1000
                        });
                    }else{
                        $ionicLoading.show({
                            template: '服务器返回消息有误,您可能需要重新上传照片',
                            duration: 1000
                        });
                    }
                }, function(err) {
                    // Error
                    alert("err:"+err);
                }, function (progress) {
                    // constant progress updates
                });

    }



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
                    $scope.images_list.push(results[0]);
                    $scope.uploadImg=results[0];
                    alert("result="+$scope.uploadImg);
                }, function (error) {
                    // error getting photos
                });

        }




    })
