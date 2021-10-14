export default {
    rdsBarEcharts(Y_data,suc,fail,na){   //统计rds数据的数量 柱状图
        return {
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: ['成功', '失败','无效'],
                right:20
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis:  [
                {
                    position:'top',
                    splitLine:{show: true},
                    type: 'value'
                },
                {
                    splitLine:{show: true},
                    type: 'value'
                }
            ],
            yAxis: {
                type: 'category',
                data: Y_data,
            },
            series: [
                {
                    barWidth:30,
                    name: '通过',
                    type: 'bar',
                    stack: '总量',
                    itemStyle: {
                        normal: {
                            color: '#1BBC9C'
                        }
                    },
                    data: suc
                },
                {
                    barWidth:30,
                    name: '未通过',
                    type: 'bar',
                    stack: '总量',
                    itemStyle: {
                        normal: {
                            color: '#FFAE25'
                        }
                    },
                    data: fail
                },
                {
                    barWidth:30,
                    name: '无效',
                    type: 'bar',
                    stack: '总量',
                    itemStyle: {
                        normal: {
                            color: '#BDC3C7'
                        }
                    },
                    data: na
                }

            ]
        }
    },
    temper(X_data,Y_data,tit_arr,max,min){   //温度数据
        return{
            title:{
                left:50,
                textStyle:{
                    fontWdight:'bold',
                    color:'black'
                }
            },
            legend:{
                textStyle:{
                    color:'black'
                },
                data:tit_arr//图例的数据数组，如产品ID1,2,3,4,5
            },
            xAxis:{
                // show:false,
                type:'category',
                boundaryGap: false,
                name:'时间',
                data:X_data,
                axisLine:{
                    lineStyle:{
                        color:'black',
                        width:1,
                    }
                },
                axisLabel : {
                    formatter: function(){
                        return "";
                    }
                }
            },
            yAxis:{
                type:'value',
                name:'温度℃            ',
                // nameRotate: 90,
                nameGap: 8,
                // left:25,
                // nameLocation: 'middle',
                max:max,
                min:min,

                axisLine:{
                    lineStyle:{
                        color:'black',
                        width:1
                    }
                }
            },
            grid: {
                left: '5%',
                right: '10%',
                bottom: '3%',
                top:'15%',
                containLabel: true
            },
            dataZoom:[
                {
                    height: 8,
                    bottom: 10,
                    // show:false,
                    type:'slider',
                    handleIcon:'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z'
                },
                {
                    type:'inside'
                }
            ],
            tooltip:{//提示框组件
                trigger:'axis',
                formatter: "{b} <br/> {a}: {c} ℃"
            },
            //    series:[
            //     {
            //     	type:'line',
            //     // name:proId,//在图表的上方显示jobId
            //      data:Y_data
            //  }
            // ]
            series:Y_data
        }
    }
}
