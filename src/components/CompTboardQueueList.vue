<template>
    <div>

        <DatePicker v-model="timeRange" type="date" placeholder="Select date" style="width: 200px;margin-bottom: 16px" />



        <div class="draw-contain">
            <Row class="draw-box">
                <div class="draw-box-left"></div>

                <div v-for="time in axisTime" style="display: inline-block" :style="{'width':setTimeAxis(time)}">{{time.space>1?time.time:""}}</div>
                <!--<div v-for="i in 96" style="border-bottom: 1px solid #ccc;border-right: 1px solid #ccc;width: 25px;display: inline-block"></div>-->

            </Row>
            <Row class="draw-box" style="margin-bottom: 5px;line-height: 5px;margin-top: -10px">
                <div class="draw-box-left"></div>
                <!--  24h  / 15 min -->
                <div v-for="i in 96" style="display: inline-block;width: 25px;height:5px;border-bottom: 1px solid #ccc;border-right: 1px solid #ccc;"></div>

                <!--<div v-for="time in drawData.time" class="draw-box-div1" style="border-bottom: 1px solid #ccc">{{ time }}</div>-->
            </Row>
            <Row class="draw-box" style="margin-bottom: 16px" v-for="(data,key,Index) in drawData2.data" @contextmenu.prevent.native="twoStep(data,key)">
                <div class="draw-box-left" style="float: left;">{{key}}</div>
                <div class="under-row"><div v-for="m in 96" class="under-row-box"></div></div>
                <div v-for="(item, index) in data" :class="[item.isTiming ? 'timing':'normal','draw-box-div-list']" :style="{'width':setWidth(item)}"
                     @click="oneStep">{{ item.tboard?item.tboard:'' }}</div>
            </Row>
        </div>


        <Row style="margin-top:20px;text-align: center ">
            <Page :current="currentPage" :total="dataTotal" :page-size="pageSize" simple style="display: inline-flex"/>
            <Select v-model="pageSize" style="width:100px;margin-left: 30px" size="small">
                <Option :value="10">10 条/页</Option>
                <Option :value="30">30 条/页</Option>
                <Option :value="50"> 50 条/页</Option>
                <Option :value="100"> 100 条/页</Option>
            </Select>
        </Row>





        <Modal v-model="showQueue" draggable :reset-drag-position="true" footer-hide :title=queueDevice >

            <div>
                <SlickList :lockToContainerEdges="true" :useDragHandle="true" class="list" lockAxis="y" v-model="queueList">
                    <SlickItem  v-for="(item, index) in queueList" :index="index" :key="index">
                        <div >
                            <div>{{item.tboard}}</div>
                            <div style="width: 20%; text-align: right">
                                <Icon v-show="index!==0" type="md-arrow-up" :size="iconSize" />
                                <Icon v-show="queueList.length !== 1" type="ios-trash" :size="iconSize" style="margin-left: 8px"/>
                                <Icon v-handle type="ios-menu" :size="iconSize" style="margin-left: 8px"/>
                            </div>

                        </div>
                    </SlickItem>
                </SlickList>
            </div>

        </Modal>

    </div>
</template>

<script>
    import { HandleDirective,SlickList, SlickItem } from 'vue-slicksort'


    export default {
        name: "CompTboardQueueList",
        components: { SlickItem, SlickList },
        data () {
            return {
                timeRange: new Date(),
                drawData2:{
                    device:['dev1','dev2','dev3','dev4','dev5'],
                    data:{
                        dev1:[{ start:'7:00',end:'8:00',isRun:true, tboard:'tb1',isTiming:false },{ start:'8:00',end:'8:30',isRun:false, tboard:'tb2',isTiming:false },{ start:'10:00',end:'11:30',isRun:false, tboard:'tb3',isTiming:true,last:'8:30' },{ start:'12:00',end:'13:00',isRun:false, tboard:'tb4',isTiming:false },
                            { start:'13:00',end:'13:30',isRun:false, tboard:'tb5',isTiming:false },{ start:'14:00', tboard:'tb8',end:'16:00',isRun:false,isTiming:true,last:'13:30' }, { start:'16:00',end:'17:00',isRun:false, tboard:'tb10',isTiming:false },{ start:'17:00',end:'17:30',isRun:false, tboard:'tb6',isTiming:true,last:'17:00' }],
                        dev2:[{ start:'7:00',end:'8:00',isRun:true, tboard:'tb1',isTiming:false },{ start:'8:00',end:'8:30',isRun:false, tboard:'tb2',isTiming:false },{ start:'10:00', tboard:'tb3',end:'11:30',isRun:false,isTiming:true,last:'8:30' },{ start:'11:30',end:'15:00',isRun:false, tboard:'tb9',isTiming:false },
                            { start:'15:00',end:'17:00',isRun:false, tboard:'tb15',isTiming:false },{ start:'17:00',end:'17:30',isRun:false, tboard:'tb6',isTiming:true,last:'17:00' }],
                        dev3:[{ start:'10:00', end:'12:00',isRun:false,tboard:'tb3',isTiming:true,last:null },{ start:'12:00',end:'16:00',isRun:false, tboard:'tb4',isTiming:false },{ start:'16:00',end:'17:00',isRun:false, tboard:'tb10',isTiming:false }],
                        dev4:[{ start:'7:00',end:'8:00',isRun:false, tboard:'tb11',isTiming:false },{ start:'8:00',end:'8:30',isRun:false, tboard:'tb2',isTiming:false }, { start:'14:00',end:'16:30',isRun:false, tboard:'tb8',isTiming:true,last:'8:30' }, ],
                        dev5:[{ start:'7:00',end:'8:00',isRun:false, tboard:'tb11',isTiming:false },{ start:'10:00',end:'12:30',isRun:false, tboard:'tb3',isTiming:true,last:'8:00' }],
                        dev13:[{ start:'7:00',end:'8:00',isRun:true, tboard:'tb1',isTiming:false },{ start:'8:00',end:'8:30',isRun:false, tboard:'tb2',isTiming:false },{ start:'10:00',end:'11:30',isRun:false, tboard:'tb3',isTiming:true,last:'8:30' },{ start:'12:00',end:'13:00',isRun:false, tboard:'tb4',isTiming:false },
                            { start:'13:00',end:'13:30',isRun:false, tboard:'tb5',isTiming:false },{ start:'14:00', tboard:'tb8',end:'16:00',isRun:false,isTiming:true,last:'13:30' }, { start:'16:00',end:'17:00',isRun:false, tboard:'tb10',isTiming:false },{ start:'17:00',end:'17:30',isRun:false, tboard:'tb6',isTiming:true,last:'17:00' }],
                        dev24:[{ start:'7:00',end:'8:00',isRun:true, tboard:'tb1',isTiming:false },{ start:'8:00',end:'8:30',isRun:false, tboard:'tb2',isTiming:false },{ start:'10:00', tboard:'tb3',end:'11:30',isRun:false,isTiming:true,last:'8:30' },{ start:'11:30',end:'15:00',isRun:false, tboard:'tb9',isTiming:false },
                            { start:'15:00',end:'17:00',isRun:false, tboard:'tb15',isTiming:false },{ start:'17:00',end:'17:30',isRun:false, tboard:'tb6',isTiming:true,last:'17:00' }],
                        dev35:[{ start:'10:00', end:'12:00',isRun:false,tboard:'tb3',isTiming:true,last:null },{ start:'12:00',end:'16:00',isRun:false, tboard:'tb4',isTiming:false },{ start:'16:00',end:'17:00',isRun:false, tboard:'tb10',isTiming:false }],
                        dev46:[{ start:'7:00',end:'8:00',isRun:false, tboard:'tb11',isTiming:false },{ start:'8:00',end:'8:30',isRun:false, tboard:'tb2',isTiming:false }, { start:'14:00',end:'16:30',isRun:false, tboard:'tb8',isTiming:true,last:'8:30' }, ],
                        dev57:[{ start:'7:00',end:'8:00',isRun:false, tboard:'tb11',isTiming:false },{ start:'10:00',end:'12:30',isRun:false, tboard:'tb3',isTiming:true,last:'8:00' }],
                    }
                },
                nowTime:null,
                axisTime:[],//时间轴

                currentPage:1,
                dataTotal:0,
                pageSize:10,
                showQueue:false,

                // 排序
                queueList:[],
                queueDevice:"",

            }
        },
        directives: {
            handle: HandleDirective
        },
        methods: {
            setWidth(item){
                // console.log(item.start)
                // console.log(item.end)
                // console.log(this.nowTime)

                if(item.isRun){
                    item.start = this.nowTime
                }

                let sMin = parseInt(item.start.split(':')[0])*60+parseInt(item.start.split(':')[1])
                let eMin = parseInt(item.end.split(':')[0])*60+parseInt(item.end.split(':')[1])

                let subMin = eMin-sMin

                console.log(item.tboard,sMin,eMin,subMin)

                return subMin/15*25 + 'px'
                /*
                用两个时间点之间的相差分钟数除以15来算div的宽度，
                暂时不管定时任务，不管margin，（普通任务没有margin，定时任务才需要）
                后续加上定时任务的时候，看能不能定时数据中加上上一个任务的结束时间，来算margin
                * */
            },
            setTimeAxis(item){
                return item.space*25 + 'px'
            },
            setMargin(item){
                let subMin = 0
                if(item.isTiming){
                    if(item.last){
                        let start = parseInt(item.start.split(':')[0])*60+parseInt(item.start.split(':')[1])
                        let last = parseInt(item.last.split(':')[0])*60+parseInt(item.last.split(':')[1])
                        subMin = start - last
                    }else {
                        let start = parseInt(item.start.split(':')[0])*60+parseInt(item.start.split(':')[1])
                        let last = parseInt(this.nowTime.split(':')[0])*60+parseInt(this.nowTime.split(':')[1])
                        subMin = start - last
                    }
                }
                return subMin/15*25 + 'px'
            },
            //  显 示 的 时 间 间 隔
            getTimeSplit(){
                let start = new Date().format('hh:mm')
                // console.log(start)
                // console.log(typeof start)
                let time = start.split(':')

                let min = parseInt(time[1]/15)

                this.nowTime = time[0] + ':' + (min*15 ? min*15 : '00')
                this.axisTime = []
                // console.log(min)
                // console.log(this.nowTime)

                // let end =  new Date(new Date().getTime() + 24*60*60*1000).format('hh:mm')
                // end.format('yy-MM-dd hh:mm:ss')
                // console.log(end)



                this.axisTime.push({time:this.nowTime,space:((60-parseInt(this.nowTime.split(":")[1]))/15)})

                for (let i =1;i<=24;i++) {
                    let timeStr = ""
                    if(parseInt(time[0])+i<24){
                        timeStr = parseInt(time[0])+i + ":00"
                        this.axisTime.push({time:timeStr,space:4})
                    }else {
                        timeStr = parseInt(time[0])+i-24 + ":00"
                        if(i===24){

                            let now = parseInt(this.nowTime.split(':')[0])*60+parseInt(this.nowTime.split(':')[1])
                            let end = parseInt(timeStr.split(':')[0])*60+parseInt(timeStr.split(':')[1])
                            console.log(now,end);
                            if(now!==end)
                                this.axisTime.push({time:timeStr,space:parseInt(this.nowTime.split(":")[1])?parseInt(this.nowTime.split(":")[1])/15 : 4})
                        }else {
                            this.axisTime.push({time:timeStr,space:4})
                        }
                    }
                }

                console.log(this.axisTime)




            },



            oneStep(){
                alert("点击111111111")
            },
            twoStep(data,key){
                this.showQueue = true
                this.queueList = data
                this.queueDevice = key
            },
        },
        created(){
            this.getTimeSplit()

        },
        mounted(){


        }
    }
</script>

<style scoped>

    .draw-contain{
        overflow-x: auto;
        overflow-y: hidden;
    }
    .draw-box{
        white-space: nowrap;
    }

    .draw-box-left{
        display: inline-block;
        width: 50px;
    }
    /*  网格背景  */
    .under-row{
        position: absolute;
        margin-left: 50px;
        margin-top: -1px;
        height: 22px;
        z-index: -1
    }
    .under-row-box{
        display: inline-block;
        width: 25px;
        height:22px;
        border: 1px solid #ccc;
        border-left: none
    }

    .draw-box-div-list {
        display:inline-block;
        border-right: 1px solid #333;
    }




    .draw-box .draw-box-div-list:hover{
        background: rgba(255,20,0,0.5);
    }



    /*.draw-box div{*/
        /*display: inline-block;*/
        /*width: 50px;*/
    /*}*/
    /*.draw-box div:hover{*/
        /*background: red;*/
    /*}*/



    .timing{
        /*background: lightpink;*/
        background: rgba(255,255,0,0.5);
        height: 21px;
        border-bottom: 1px solid #ccc;
    }
    .normal{
        background: rgba(255,0,255,0.5);
        height: 21px;
        border-bottom: 1px solid #ccc;
    }





</style>
