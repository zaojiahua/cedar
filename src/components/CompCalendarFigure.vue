<template>
    <div :id="'calendar'+propId" style="height:500px;"></div>
</template>


<script>
    import echarts from "echarts"
    import config from "../lib/config";

    export default {
        props:{
            propId:{
                type:Number
            },
            propMonth:{
                type:Date
            },
            propDeviceId:{
                type:Number
            },
            propJobId:{
                type:Number
            },
            propType:{
                type:Number,
                default:1   //1：失败 2：无效
            },
            propFilterDateRange:{
                type: Array,
                default:()=>{ return []}
            },
        },
        data(){
            return{
                histogram:null,
                rdsDataCont:[],
                startTime:null,
                endTime:null,
                visualMapPieces:[],


            }
        },
        methods:{
            setDefaultOption(){
                let type = "失败数"
                if(this.propType===2)
                    type = "无效数"
                // 指定图表的配置项和数据
                let option = {
                    tooltip: {
                        formatter: function (params) {
                            if(params.seriesIndex===1)
                                return type + ": " + params.value[1];
                        }
                    },
                    visualMap: {     //数据的映射（条状指示）
                        type: "piecewise",
                        show: true,
                        pieces: this.visualMapPieces,
                        // calculable: true,   //拖拽手柄
                        seriesIndex: [1],
                        orient: 'horizontal',
                        left: 'center',
                        bottom: 20,
                        inRange: {    //表示 目标系列 的视觉样式 和 visualMap-piecewise 共有的视觉样式
                            color: ['#e0ffff', '#006edd'],
                            colorAlpha: 0.5
                        },
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
                        range:this.propMonth.format("yyyy-MM")     //参数输入-----++++++++
                    }],

                    series: [{
                        type: 'custom',
                        coordinateSystem: 'calendar',     //该系列使用的坐标系
                        renderItem:this.renderItem,
                        data: this.getVirtulData(this.propMonth.getFullYear())      //   年份参数输入+++++
                    },
                    {
                        name: type,
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
                            fill: '#333',
                            textFont: api.font({fontSize: 14}),
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
            applyDataIntoGraph(){
                this.histogram.setOption(
                    {
                        visualMap: {
                            pieces: this.visualMapPieces
                        },
                        calendar:[{
                            range:this.propMonth.format("yyyy-MM")     //参数输入-----++++++++
                        }],
                        series: [
                            {
                                data: this.getVirtulData(this.propMonth.getFullYear())      //   年份参数输入+++++
                            },
                            {
                                data: this.rdsDataCont
                            }
                        ]
                    }
                );
            },
            //一个月的最后一天
            daysInMonth (month, year) {
                return new Date(year, month, 0).format("yyyy-MM-dd");
            },
            //获取当月数据
            getMonthData(){
                this.histogram.showLoading();
                let target= "fail"
                if(this.propType===2)
                    target= "na"
                this.$ajax.get("api/v1/cedar/get_data_view_calendar/?start_date="+ this.startTime +
                    "&end_date=" + this.endTime +
                    "&target="+ target +
                    "&devices=" + this.propDeviceId +
                    "&jobs="+ this.propJobId
                ).then(({data: {data,intervals}})=>{
                    this.rdsDataCont = data.filter((item) => {
                        let startDate = new Date(this.propFilterDateRange[0]).format('yyyy-MM-dd')
                        let endDate = new Date(this.propFilterDateRange[1]).format('yyyy-MM-dd')
                        return item[0] >= startDate && item[0] <= endDate
                    })
                    this.visualMapPieces = []
                    intervals.forEach((item)=>{
                        this.visualMapPieces.push({min: item[0], max: item[1]})
                    })
                    this.applyDataIntoGraph()
                    this.histogram.hideLoading();
                }).catch(error=>{
                    if(config.DEBUG) console.log(error)
                    this.$Message.warning("月历数据获取失败")
                    this.histogram.hideLoading();
                })
            },
            onResize(){
                this.histogram.resize()
            },

        },
        watch:{
            propMonth:{
                handler: function(val){
                    let year = val.getFullYear()
                    let month = val.getMonth()+1
                    this.startTime = new Date(year,month-1,1).format("yyyy-MM-dd")
                    this.endTime = this.daysInMonth (month, year)
                    this.getMonthData()
                },
                // immediate: true
            },
            propJobId:{
                handler: function(val){
                    this.getMonthData()
                },
            },
            propDeviceId:{
                handler: function(val){
                    this.getMonthData()
                },
            },
            propType:{
                handler: function(val){
                    this.getMonthData()
                    this.setDefaultOption()
                },
            }
        },
        mounted(){
            let year = this.propMonth.getFullYear()
            let month = this.propMonth.getMonth()+1
            this.startTime = new Date(year,month-1,1).format("yyyy-MM-dd")
            this.endTime = this.daysInMonth (month, year)

            this.histogram = echarts.init(document.getElementById("calendar"+this.propId));
            this.histogram.showLoading();
            this.getMonthData()
            this.setDefaultOption()

            //窗口大小监听
            window.addEventListener('resize', this.onResize);
            //监听柱状图点击事件
            this.histogram.on('click',params=> {
                if(params.seriesIndex===1)
                    this.$emit("on--click",params.data[0])
            })
        },
        beforeDestroy(){
            window.removeEventListener('resize',this.onResize);
        }
    }



</script>