<template>
    <div style="position: relative">
        <p style="position: absolute;top: 20px;left: 0;right: 0;text-align: center">
            <Icon type="ios-git-commit" size="20" style="color: #2f83e4"/><span style="margin-left: 5px">失败率</span>
            <span style="display: inline-block;width: 25px;height: 14px;border-radius: 4px;background: #81e1ff;margin: 0 5px 0 50px"></span><span>失败数</span>
        </p>
        <div :id="'device'+deviceId" :style="{ height: propWidth+'px'}"></div>
        <p style="text-align: center;margin-top: 16px;font-size: 12px;color: #aaa">点击柱状图切换数据，左右拖拽加载更多数据</p>
    </div>
</template>

<script>
    import echarts from "echarts"
    import config from "../lib/config";

    export default {
        props:{
            deviceId:{
                type:Number,
            },
            propWidth:{
                type:Number,
                default:500
            },
            propUrl:{
                type:String,
                default:""
            }

        },
        data(){
            return{
                histogram: null,
                preX: 0,
                nextDataCache: {
                    xAxis: [],
                    data1: [],
                    data2: []
                },
                preDataCache: {
                    xAxis: [],
                    data1: [],
                    data2: []
                },
                xPxThreshold: 50,  //一次滑动多少像素会触发加载
                cacheSize: 5, //一次最少缓存几笔数据
                dataLock: false,  // 如果正在加载资料，上锁避免更多资料被加载
                batchSize: 1,  // 一次加载几笔数据到图中
                xAxis: ["item1", "item2"],
                data1: [["label1", 1], ["label2", 2]],   //失败数
                data2: [["label1", 1], ["label2", 2]],   //失败率

                prevIndex:null, //当前点击的数据是哪一笔
                nextUrl:null,
                firstTimer: null,
                lastTimer: null,
                loadingTimer: null,
                timerStep: 80
            }
        },
        methods:{
            loadData(){
                this.prevIndex = 0
                this.nextDataCache = {
                    xAxis: [],
                    data1: [],
                    data2: []
                },
                this.preDataCache = {
                    xAxis: [],
                    data1: [],
                    data2: []
                },
                this.$ajax.get(this.propUrl).then(response=>{
                    this.xAxis = [],this.data1=[],this.data2=[]
                    response.data.data.forEach(item=>{
                        this.xAxis.push(item[2])
                        this.data1.push([item[2],item[5],item[0],item[1],item[3],item[4],item[5],item[6],item[7],item[8]])
                        this.data2.push([item[2],(item[8]*100).toFixed(0),item[0],item[1],item[3],item[4],item[5],item[6],item[7],item[8]])
                    })
                    this.nextUrl = response.data.next

                    this.applyDataIntoGraph();
                    this.histogram.hideLoading();

                    if(this.data1.length>0)
                        this.$emit("after-load-data",this.data1[0][2],this.data1[0][4],this.data1[0][5],this.data1[0][6],this.data1[0][7],this.data1[0][8],this.data1[0][9],this.data1[0][0],this.data1[0][3])
                    else
                        this.$emit("after-load-data",null)

                    if(this.nextUrl)
                        this.loadNextCache()

                }).catch(error=>{
                    if(config.DEBUG) console.log(error)
                    this.histogram.hideLoading();
                    this.$Message.warning("图表数据加载失败")
                })
            },
            getDefaultData(){
                this.setDefaultOption();
                this.histogram.showLoading();

                this.loadData()
            },
            setDefaultOption(){
                // 指定图表的配置项和数据
                let option = {
                    tooltip:{
                        trigger: "axis",
                        formatter: function (obj) {
                            return obj[1].value[0] + '<br>'
                                + 'ID：' + obj[1].value[2] + '<br>'
                                + '自定义名称：' + obj[1].value[3] + '<br>'
                                + '失败数：' + obj[1].value[1] + '<br>'
                                + '失败率：' + obj[0].value[1] + '%<br>'
                        }
                    },
                    // grid:{
                    //     bottom:"50px",
                    // },
                    xAxis: {
                        type: "category",
                        axisLabel: {
                            rotate: 50,
                            interval: 0,
                            formatter: function (value) {   //关键代码
                                let res = value
                                if (res.length > 10) {
                                    res = res.substring(0, 9) + '..'
                                }
                                return res
                            }
                        },
                    },
                    yAxis: [
                        {
                            type: 'value',
                            name: '失败率',
                            // min: 0,
                            // max: 100,
                            axisLabel: {
                                formatter: '{value} %'
                            }
                        },
                        {
                            type: "value",
                            name: '失败数',
                            show: true
                        },
                    ],
                    color:["#2f83e4","#81e1ff"],
                    barMaxWidth: 40,
                    series:[
                        {
                            name:'失败率',
                            type:'line',
                        },
                        {
                            name:'失败数',
                            yAxisIndex: 1,
                            type:'bar',
                        },
                    ]
                };
                // 使用刚指定的配置项和数据显示图表。
                this.histogram.setOption(option)
            },
            onResize(){
                this.histogram.resize()
            },

            dispatcher(touchEvent){
                if(touchEvent.offsetX - this.preX > this.xPxThreshold){
                    // process pre event
                    this.loadPreDataIntoGraph()
                    this.preX = touchEvent.offsetX;
                } else if(touchEvent.offsetX - this.preX < -this.xPxThreshold){
                    // process next event
                    this.loadNextDataIntoGraph();
                    this.preX = touchEvent.offsetX;
                }
            },

            loadNextCache(){
                this.dataLock = true;

                if(this.nextUrl===null)
                    return
                this.$ajax.get(this.nextUrl).then(response=>{
                    let xAxis=[],data1=[],data2=[]
                    response.data.data.forEach(item=>{
                        xAxis.push(item[2])
                        data1.push([item[2],item[5],item[0],item[1],item[3],item[4],item[5],item[6],item[7],item[8]])
                        data2.push([item[2],(item[8]*100).toFixed(0),item[0],item[1],item[3],item[4],item[5],item[6],item[7],item[8]])
                    })
                    this.nextDataCache['xAxis'] = this.nextDataCache['xAxis'].concat(xAxis);
                    this.nextDataCache['data1'] = this.nextDataCache['data1'].concat(data1);
                    this.nextDataCache['data2'] = this.nextDataCache['data2'].concat(data2);

                    this.nextUrl = response.data.next

                    this.dataLock = false;
                })
            },
            loadNextDataIntoGraph(){
                if(this.nextUrl===null&&this.nextDataCache["xAxis"].length===0){
                    if (this.lastTimer) {
                        clearTimeout(this.lastTimer)
                    }
                    this.lastTimer = setTimeout(() => {
                        this.$Message.info("已是最后一笔数据，没有更多了 ")
                    }, this.timerStep)
                    return
                }
                if(this.dataLock&&this.nextDataCache["xAxis"].length===0){
                    if (this.loadingTimer) {
                        clearTimeout(this.loadingTimer)
                    }
                    this.loadingTimer = setTimeout(() => {
                        this.$Message.info("正在请求数据，请稍等！")
                    }, this.timerStep)
                    return
                }
                let loadLen = this.batchSize
                //数据已经全部取完，缓存数量不够的情况下
                if(this.nextUrl===null&&this.nextDataCache["xAxis"].length<this.batchSize){
                    loadLen = this.nextDataCache["xAxis"].length
                }
                if(this.nextDataCache["xAxis"].length>0) {
                    this.preDataCache.xAxis = this.preDataCache.xAxis.concat(this.xAxis.splice(0, loadLen));  //移除旧数据,将移除的数据加入前段缓存
                    this.xAxis = this.xAxis.concat(
                        this.nextDataCache["xAxis"].splice(0, loadLen)
                    );

                    this.preDataCache["data1"] = this.preDataCache["data1"].concat(this.data1.splice(0, loadLen));
                    let newData = this.nextDataCache["data1"].splice(0, loadLen);
                    this.data1 = this.data1.concat(
                        newData
                    );

                    this.preDataCache["data2"] = this.preDataCache["data2"].concat(this.data2.splice(0, loadLen));
                    this.data2 = this.data2.concat(
                        this.nextDataCache["data2"].splice(0, loadLen)
                    );
                    this.prevIndex -= loadLen

                    this.applyDataIntoGraph();

                }

                // 如果缓存的数据 < 目标阈值 加载更多数据
                if(this.nextDataCache["xAxis"].length < this.cacheSize){
                    if(this.dataLock) return;
                    if(this.nextUrl)
                        this.loadNextCache()
                }

            },

            // //向前的缓存起始应为空，向后加载时去除的数据直接放于前位缓存，前位缓存的数据来源始终为向后加载时溢出的数据
            loadPreDataIntoGraph(){
                let loadLen = this.batchSize
                if(this.preDataCache["xAxis"].length===0){
                    if (this.firstTimer) {
                        clearTimeout(this.firstTimer)
                    }
                    this.firstTimer = setTimeout(() => {
                        this.$Message.info("已是第一笔数据")
                        return
                    }, this.timerStep)
                }
                if(this.preDataCache["xAxis"].length<this.batchSize){
                    loadLen = this.preDataCache["xAxis"].length
                }

                this.nextDataCache.xAxis = this.xAxis.splice(-loadLen, loadLen).concat(this.nextDataCache.xAxis);  //移除旧数据,将移除的数据拼接到后段部分缓存

                this.xAxis = this.preDataCache["xAxis"].splice(-loadLen, loadLen).concat(
                    this.xAxis
                );

                this.nextDataCache["data1"] = this.data1.splice(-loadLen, loadLen).concat(this.nextDataCache["data1"]);
                let newData = this.preDataCache["data1"].splice(-loadLen, loadLen);
                this.data1 = newData.concat(
                    this.data1
                );


                this.nextDataCache["data2"] = this.data2.splice(-loadLen, loadLen).concat(this.nextDataCache["data2"]);
                this.data2 = this.preDataCache["data2"].splice(-loadLen, loadLen).concat(
                    this.data2
                );

                this.prevIndex += loadLen

                this.applyDataIntoGraph();

            },

            applyDataIntoGraph(){
                this.histogram.setOption(
                    {
                        xAxis: {
                            data: this.xAxis
                        },
                        series: [
                            {
                                data: this.data2
                            },
                            {
                                data: this.data1
                            }
                        ]
                    }
                );
            },

            //突出样式显示
            onStyleRender(){
                this.histogram.setOption({
                    series: [
                        {
                            symbolSize:(data,param)=>{
                                if((this.prevIndex === param.dataIndex) )
                                    return 10
                                else
                                    return 4
                            },
                        },
                        {
                            itemStyle:{
                                normal:{
                                    color: param =>{
                                        if((this.prevIndex === param.dataIndex) ){
                                            return '#ffb381';
                                        }else{
                                            return '#81e1ff';
                                        }
                                    }
                                }
                            }
                        }]
                });
            },

        },
        watch:{
            propUrl:{
                handler: function(val){
                    this.loadData()
                },
            }
        },
        mounted(){
            this.$nextTick(() => {
                this.histogram = echarts.init(document.getElementById("device"+this.deviceId));

                this.getDefaultData();

                //监听柱状图点击事件
                this.histogram.on('click',params=> {
                    this.prevIndex = params.dataIndex
                    this.onStyleRender();
                    this.$emit("on-chart-click",params.data[2],params.data[4],params.data[5],params.data[6],params.data[7],params.data[8],params.data[9],params.data[0],params.data[3])
                })
                //窗口大小监听
                window.addEventListener('resize', this.onResize);

                this.histogram.getZr().on('mousedown', (params) => {
                    this.flag = true;
                    this.preX = params.offsetX;
                });
                this.histogram.getZr().on('mouseup', (params) => {
                    this.flag = false
                });
                this.histogram.on('globalout', (params) => {
                    this.flag = false
                });
                this.histogram.getZr().on('mousemove', (params) => {
                    if (this.flag) {
                        this.dispatcher(params)
                    }

                });

                this.loadNextCache();
                this.prevIndex = 0
                this.onStyleRender();
            })
        },
        beforeDestroy(){
            window.removeEventListener('resize',this.onResize)
        }
    }
</script>
