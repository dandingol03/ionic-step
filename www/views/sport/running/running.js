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

    .controller('RunningController', function ($scope, $http,$ionicLoading,$UserSetting,$state,
                                             $ionicActionSheet,$stateParams,$cordovaDatePicker) {

        $scope.type=$stateParams.type||'';
        $scope.running=new Object();
        $scope.running.distance=0;
        $scope.running.date=dateFormatter(new Date());
        $scope.running.scale=2;//为了增大最小刻度,除了时间字段的其他字段值都*running.scale
        $scope.running.speed=5*$scope.running.scale;


        function dateFormatter(date){
            var year=date.getFullYear()+"";
            var month=((date.getMonth()+1)+"").length<2?("0"+(date.getMonth()+1)):""+(date.getMonth()+1);
            var day=(date.getDate()+"").length<2?("0"+date.getDate()):""+date.getDate();
            var hour=(""+date.getHours()).length<2?("0"+date.getHours()):""+date.getHours();
            var minute=(""+date.getMinutes()).length<2?("0"+date.getMinutes()):""+date.getMinutes();

            var time=year+"-"+month+"-"+day+" "+hour+":"+minute;
            return time;
        }



        /**
         * 选择日期控件调用
         */
        $scope.datePick=function(){
            var options = {
                date: new Date(),
                mode: 'time', // or 'time'
                minDate: new Date() - 10000,
                allowOldDates: true,
                allowFutureDates: false,
                doneButtonLabel: 'DONE',
                doneButtonColor: '#F2F3F4',
                cancelButtonLabel: 'CANCEL',
                cancelButtonColor: '#000000'
            };
            $cordovaDatePicker.show(options).then(function(date){
                alert("Date time:"+date);
                var year=date.getFullYear()+"";
                var month=((date.getMonth()+1)+"").length<2?("0"+(date.getMonth()+1)):""+(date.getMonth()+1);
                var day=(date.getDate()+"").length<2?("0"+date.getDate()):""+date.getDate();
                var hour=(""+date.getHours()).length<2?("0"+date.getHours()):""+date.getHours();
                var minute=(""+date.getMinutes()).length<2?("0"+date.getMinutes()):""+date.getMinutes();

                var time=year+"-"+month+"-"+day+" "+hour+":"+minute;
               $scope.running.date=time;
            });

        }

        /**
         * 跑步记录上传
         */
        $scope.uploadRecord = function () {
            var user=$UserSetting;
            $ionicLoading.show();
            $http({
                method:"post",
                url:"http://121.42.35.218:8080/ReactJPChatter/running/addRunningRecordWithApp.do",
                data:{
                    username:user.username,
                    distance:$scope.running.distance/$scope.running.scale,
                    speed:$scope.running.speed/$scope.running.scale,
                    date:$scope.running.date
                }
            })
                .success(function(response) {
                    $ionicLoading.hide();
                    if(response.type!==undefined&&response.type!==null) {
                        if(response.type==1||response.type==2||response.type==-1)
                        {
                            $ionicLoading.show({
                                template:response.content,
                                duration:2000
                            });
                        }
                        else{}
                    }else{

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
        };


    })
