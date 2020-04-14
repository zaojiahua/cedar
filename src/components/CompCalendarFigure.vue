<template>
    <div :id="'calendar'+propMonth" style="height:500px;"></div>
</template>


<script>
    import echarts from "echarts"

    export default {
        props:{
            propMonth:{
                type:Number
            }
        },
        data(){
            return{
                histogram:null,
                rdsDataCont:[
                    ['2020-4-1',30],
                    ['2020-4-2',520],
                    ['2020-4-3',350],
                    ['2020-4-4',450],
                    ['2020-4-5',550],
                    ['2020-4-6',650],
                    ['2020-4-7',570],
                    ['2020-4-8',509],
                    ['2020-4-9',150],
                    ['2020-4-10',20],
                    ['2020-4-11',30],
                    ['2020-4-12',40],
                    ['2020-4-13',60],
                    ['2020-4-14',250],
                    ['2020-4-15',530],
                    ['2020-4-16',500],
                    ['2020-4-17',756],
                    ['2020-4-18',50],
                    ['2020-4-19',1150],
                    ['2020-4-20',190],
                    ['2020-4-21',200],
                    ['2020-4-22',300],
                    ['2020-4-23',240],
                    ['2020-4-24',146],
                    ['2020-4-25',914],
                    ['2020-4-26',140],
                    ['2020-4-27',40],
                    ['2020-4-28',40],
                    ['2020-4-29',10],
                ]

            }
        },
        methods:{
            setDefaultOption(){
                // 指定图表的配置项和数据
                let option = {
                    tooltip: {
                        formatter: function (params) {
                            if(params.seriesIndex===1)
                                return '失败数: ' + params.value[1];
                        }
                    },
                    visualMap: {     //数据的映射（条状指示）
                        type: "piecewise",
                        show: true,
                        min: 0,
                        max: 1000,
                        // calculable: true,   //拖拽手柄
                        seriesIndex: [1],
                        orient: 'horizontal',
                        left: 'center',
                        bottom: 20,
                        inRange: {    //表示 目标系列 的视觉样式 和 visualMap-piecewise 共有的视觉样式
                            color: ['#e0ffff', '#006edd'],
                            opacity: 0.3
                        },
                        controller: {     //表示 visualMap-piecewise 本身的视觉样式，会覆盖共有的视觉样式。
                            inRange: {
                                opacity: 0.5
                            }
                        }
                    },

                    calendar: [{
                        left: 'center',
                        top: 'middle',
                        cellSize: [60],
                        yearLabel: {show: false},
                        orient: 'vertical',
                        dayLabel: {
                            firstDay: 1,
                            nameMap: 'cn'
                        },
                        monthLabel: {
                            show: false
                        },
                        range: '2020-04'     //参数输入-----++++++++
                    }],

                    series: [{
                        type: 'custom',
                        coordinateSystem: 'calendar',     //该系列使用的坐标系
                        renderItem:this.renderItem,
                        data: this.getVirtulData(2020)      //   年份参数输入+++++
                    },
                    {
                        name: '失败数',
                        type: 'heatmap',
                        coordinateSystem: 'calendar',
                        data: this.rdsDataCont
                    }]
                };

                // 使用刚指定的配置项和数据显示图表。
                this.histogram.setOption(option)
            },
            renderItem(params, api) {
                let cellPoint = api.coord(api.value(0));
                let cellWidth = params.coordSys.cellWidth;
                let cellHeight = params.coordSys.cellHeight;
                if (isNaN(cellPoint[0]) || isNaN(cellPoint[1])) {
                    return;
                }
                return {
                    type: 'group',
                    children: [{
                        type: 'text',
                        style: {
                            x: cellPoint[0] - cellWidth / 2 + 15,
                            y: cellPoint[1] - cellHeight / 2 + 15,
                            text: echarts.format.formatTime('dd', api.value(0)),
                            fill: '#666',
                            textFont: api.font({fontSize: 14})
                        }
                    }]
                };
            },
            getVirtulData(year) {
                year = year || '2020';
                let date = +echarts.number.parseDate(year + '-01-01');
                let end = +echarts.number.parseDate((+year + 1) + '-01-01');
                let dayTime = 3600 * 24 * 1000;
                let data = [];
                for (let time = date; time < end; time += dayTime) {
                    data.push(echarts.format.formatTime('yyyy-MM-dd', time));
                }
                return data;
            },
            onResize(){
                this.histogram.resize()
            },

        },
        mounted(){
            this.histogram = echarts.init(document.getElementById("calendar"+this.propMonth));
            this.setDefaultOption()

            //窗口大小监听
            window.addEventListener('resize', this.onResize);
            //监听柱状图点击事件
            this.histogram.on('click',params=> {
                console.log(params)
                if(params.seriesIndex===1)
                    this.$emit("on--click",params.data[0])
            })
        },
        beforeDestroy(){
            window.removeEventListener('resize',this.onResize);
        }
    }



</script>