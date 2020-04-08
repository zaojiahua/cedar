<template>
    <div>
        <div id="device" style="height: 400px;"></div>
    </div>
</template>

<script>
    import echarts from "echarts"

    export default {
        data(){
            return{
                histogram: null,

                // number: 0,

                heapX: 0,
                preX: 0,
                nextDataCache: {
                    // Example for data structure
                    // xAxis: ["item1", "item2"],
                    // data1: [["label1", 1], ["label2", 2]],
                    // data2: [["label1", 1], ["label2", 2]]
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
                cacheSize: 20, //一次最少缓存几笔数据
                dataLock: false,  // 如果正在加载资料，上锁避免更多资料被加载
                batchSize: 1,  // 一次加载几笔数据到图中
                xAxis: ["item1", "item2"],
                data1: [["label1", 1], ["label2", 2]],
                data2: [["label1", 1], ["label2", 2]],

                dataOffset:20,  //当前最后一笔数据是第几笔
                dataLimit:20,   //当前视图可视部分总共加载多少笔数据
                prevIndex:null, //当前电机的数据是哪一笔

                testIdx: 0
            }
        },
        methods:{
            getDefaultData(){
                this.setDefaultOption();
                this.histogram.showLoading();
                let dummy = this.getDummyData(0);

                this.xAxis = dummy.xAxis;
                this.data1 = dummy.data1;
                this.data2 = dummy.data2;
                this.applyDataIntoGraph();

                this.histogram.hideLoading();
            },
            setDefaultOption(){
                // 指定图表的配置项和数据
                let option = {
                    tooltip:{
                        trigger: "axis",
                    },
                    legend:{
                        itemGap: 50,
                        top:20
                    },
                    grid:{
                        left:"50px",
                    },
                    xAxis: {
                        type: "category",
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
                    color:["#D04B40","#28d290"],
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
            //判断当前记载的最后一笔的数据位置
            getDataOffset(dataCache,flag){
                let getStartNum = 0
                if(dataCache.length ===0)
                    getStartNum = this.dataOffset
                else
                    if(flag)
                        getStartNum = this.dataOffset+this.cacheSize
                    else
                        getStartNum = this.dataOffset-this.cacheSize

                return getStartNum

            },

            dispatcher(touchEvent){
                if(this.dataLock) return;
                if(touchEvent.offsetX - this.preX > this.xPxThreshold){
                    // process pre event
                    this.loadPreDataIntoGraph()
                    this.preX = touchEvent.offsetX;
                    console.log("pre event")
                } else if(touchEvent.offsetX - this.preX < -this.xPxThreshold){
                    // process next event
                    this.loadNextDataIntoGraph();
                    this.preX = touchEvent.offsetX;
                    console.log("next event")
                }
            },

            loadNextCache(){
                console.log("Load new data...");
                this.dataLock = true;

                let limit = 0;
                let offset = 0;
                offset = this.getDataOffset(this.nextDataCache["xAxis"],true)
                this.getDummyDataCallback("这应该要给他一些url什么的").then(response=>{
                    this.nextDataCache['xAxis'] = this.nextDataCache['xAxis'].concat(response.data.xAxis);
                    this.nextDataCache['data1'] = this.nextDataCache['data1'].concat(response.data.data1);
                    this.nextDataCache['data2'] = this.nextDataCache['data2'].concat(response.data.data2);

                    this.dataLock = false;
                })
            },
            loadNextDataIntoGraph(){
                if(this.nextDataCache["xAxis"].length>0) {
                    this.xAxis.splice(0, this.batchSize);  //移除旧数据
                    this.xAxis = this.xAxis.concat(
                        this.nextDataCache["xAxis"].splice(0, this.batchSize)
                    );

                    this.data1.splice(0, this.batchSize);
                    let newData = this.nextDataCache["data1"].splice(0, this.batchSize);
                    this.data1 = this.data1.concat(
                        newData
                    );


                    this.data2.splice(0, this.batchSize);
                    this.data2 = this.data2.concat(
                        this.nextDataCache["data2"].splice(0, this.batchSize)
                    );

                    this.dataOffset += this.batchSize
                    this.prevIndex -= this.batchSize

                    this.applyDataIntoGraph();

                    this.preDataCache ={
                        xAxis: [],
                        data1: [],
                        data2: []
                    }
                }

                // 如果缓存的数据 < 目标阈值 加载更多数据
                if(this.nextDataCache["xAxis"].length < this.cacheSize){
                    this.loadNextCache()
                }

            },

            loadPreCache(){
                console.log("Load pre new data...");
                this.dataLock = true;
                let limit = 0;
                let offset = 0;
                offset = this.getDataOffset(this.preDataCache["xAxis"],false)

                this.getDummyDataCallback("这应该要给他一些url什么的").then(response=>{
                    this.preDataCache['xAxis'] = response.data.xAxis.concat(this.preDataCache['xAxis']);
                    this.preDataCache['data1'] = response.data.data1.concat(this.preDataCache['data1']);
                    this.preDataCache['data2'] = response.data.data2.concat(this.preDataCache['data2']);

                    this.dataLock = false;
                })
            },
            loadPreDataIntoGraph(){
                if(this.preDataCache["xAxis"].length>0) {
                    this.xAxis.splice(-this.batchSize, this.batchSize);  //移除旧数据

                    this.xAxis = this.preDataCache["xAxis"].splice(-this.batchSize, this.batchSize).concat(
                        this.xAxis
                    );

                    this.data1.splice(-this.batchSize, this.batchSize);
                    let newData = this.preDataCache["data1"].splice(-this.batchSize, this.batchSize);
                    this.data1 = newData.concat(
                        this.data1
                    );


                    this.data2.splice(-this.batchSize, this.batchSize);
                    this.data2 = this.preDataCache["data2"].splice(-this.batchSize, this.batchSize).concat(
                        this.data2
                    );

                    this.dataOffset -= this.batchSize
                    this.prevIndex += this.batchSize

                    this.applyDataIntoGraph();

                    this.nextDataCache = {
                        xAxis: [],
                        data1: [],
                        data2: []
                    }
                }

                // 如果缓存的数据 < 目标阈值 加载更多数据
                if(this.preDataCache["xAxis"].length < this.cacheSize){
                    this.loadPreCache()
                }

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
                                            return '#ff9100';
                                        }else{
                                            return '#28d290';
                                        }
                                    }
                                }
                            }
                        }]
                });
            },

            getDummyData(idx){
                let ret = {
                    xAxis: [],
                    data1: [],
                    data2: []
                };
                for(let i=idx; i<idx+20; ++i){
                    ret['xAxis'].push("d" + (i+1));
                    ret['data1'].push(["d"+ (i+1), i]);
                    ret['data2'].push(["d"+ (i+1), i]);
                }
                return ret
            },
            getDummyDataCallback(url){
                // 模拟请求
                let cb = null;
                let req = {
                    then(func){
                        cb = func
                    }
                };
                setTimeout(()=>{
                    this.testIdx += 20;
                    cb(
                        {
                            data: this.getDummyData(this.testIdx)
                        }
                    )
                },2);
                return req
            }
        },
        mounted(){
            this.$nextTick(() => {
                this.histogram = echarts.init(document.getElementById("device"));

                this.getDefaultData();

                //监听柱状图点击事件
                this.histogram.on('click',params=> {
                    this.prevIndex = params.dataIndex
                    this.onStyleRender();
                    this.$emit("on-chart-click",params.data[0])
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
            })
        },
        beforeDestroy(){
            window.removeEventListener('resize',this.onResize)
        }
    }
</script>
