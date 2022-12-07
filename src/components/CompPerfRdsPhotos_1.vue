<template>
    <div class="p-container">
        <div>
            <span>测试用例：<b>{{ rdsInfo.job.job_name }}</b></span>
            <span style="margin-left: 16px">RdsID：<b>{{ rdsInfo.id }}</b></span>
            <span style="margin-left: 16px">起点：<b>{{ startPoint }} ({{ startMethod }})</b></span>
            <span style="margin-left: 16px">终点：<b>{{ endPoint }} ({{ endMethod }})</b></span>
            <span style="margin-left: 16px">实际帧率：<b>{{ rdsInfo.fps }} fps</b></span>
            <span style="margin-left: 16px">设置帧率：<b>{{ rdsInfo.set_fps }} fps</b></span>
            <span style="margin-left: 16px">最大时长：<b>{{ rdsInfo.set_shot_time }} s</b></span>
        </div>
        <div class="photo-box">
            <div class="photo-left">
                <Row style="line-height: 32px;margin-bottom: 10px">
                    <b>测试结果：{{ job_duration }}<span v-show="typeof job_duration==='number'"> s</span></b>
                    <Dropdown placement="bottom-end" v-show="tableData.length!==0">
                        <span><Icon type="md-more" size="16"/></span>
                        <DropdownMenu slot="list">
                            <span @click="quickJump(parseInt(startPoint))"><DropdownItem>起点</DropdownItem></span>
                            <span @click="quickJump(parseInt(endPoint))"><DropdownItem>终点</DropdownItem></span>
                            <span @click="quickJump(1)"><DropdownItem>顶部</DropdownItem></span>
                            <span @click="quickJump(tableData.length)"><DropdownItem>底部</DropdownItem></span>
                        </DropdownMenu>
                    </Dropdown>
                    <div v-show="tableData.length!==0" style="float: right;">
                        <Button type="primary" style="margin-right: 16px;" :disabled="!isDisabled('start')" @click="setPoint(true)">
                        设为起点
                        </Button>
                        <Button type="error" :disabled="!isDisabled('end')" @click="setPoint(false)">设为终点</Button>
                    </div>
                </Row>
                <div class="table-container" v-show="tableData.length!==0">
                    <div style="background: #f2f2f2">
                        <table style="width: 100%;border:1px solid #dcdcdc;border-bottom: none;border-spacing:0 2px;">
                            <tr>
                                <th style="width: 50px">帧</th>
                                <th style="width: 150px">拿图时间</th>
                                <th style="width: 75px">停留/ms</th>
                                <th>参数值</th>
                            </tr>
                        </table>
                    </div>
                    <div class="table-body-box">
                        <table style="width: 100%;text-align: center;border-spacing:0 2px;" border="0">
                            <tr :id="'p'+index" v-for="(item,index) in tableData" @click="onTableClick(item,index)" :class="{'highlight':index===selectedIndex}">
                                <td style="width: 50px" :class="{'startPoint':index===startPoint-1,'endPoint':index===endPoint-1}">{{ item.frame_num }}</td>
                                <td style="width: 150px">{{ item.time_stamp }}</td>
                                <td style="width: 75px">{{ item.frame_duration }}</td>
                                <td>{{ item.parameter }}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            <div class="photo-right">
                <div style="display:flex;align-items: center;justify-content: center;height: calc(100vh - 159px);">
                    <img :src="selectedUrl" alt="图片走丢了" style="max-height: 96%;max-width: 100%;">
                </div>
            </div>
        </div>

        <Spin fix size="large" v-if="showLoading"></Spin>
    </div>
</template>

<script>
    import config from "../lib/config"
    import utils from "../lib/utils"

    export default {
        name: "CompPerfRdsPhotos",
        props:{
            propRdsId:{
                type:Number
            }
        },
        data() {
            return {
                rdsInfo:{
                    id:null,
                    job:{
                        job_name:""
                    },
                    start_point:null,
                    end_point:null,
                    set_fps:null,
                    fps:null,
                    set_shot_time:null,
                    start_method:null,
                    end_method:null,
                },
                tableData:[],
                selectRowData:null,
                showLoading: false,
                selectedIndex: null,   //选中的图
                selectedUrl: "",     //大图url
                startPoint: null,
                endPoint: null,
                job_duration: "暂无数据",
                rdsId:null,
                baseUrl:"http://"+config.REEF_HOST+":"+config.REEF_PORT,
            }
        },
        computed:{
            startMethod(){
                if(this.rdsInfo.start_method===1)
                    return '按下算法'
                else if(this.rdsInfo.start_method===2)
                    return '按下压感'
                else if(this.rdsInfo.start_method===3)
                    return '抬起压感'
                else if(this.rdsInfo.start_method===4)
                    return '图片变化'
                else if(this.rdsInfo.start_method===5)
                    return '点击自定义按键'
            },
            endMethod(){
                if(this.rdsInfo.end_method===1)
                    return '特征出现'
            }
        },
        methods: {
            refresh(id) {
                this.showLoading = true
                this.rdsId = id
                this.$ajax.get("api/v1/cedar/rds/" + id + "/?fields=" +
                    "id," +
                    "job,job.job_name," +
                    "job_duration," +
                    "start_point," +
                    "end_point," +
                    "set_fps," +
                    "fps," +
                    "set_shot_time," +
                    "start_method," +
                    "end_method," +
                    "frame_data")
                    .then(response => {
                        this.showLoading = false
                        this.rdsInfo = response.data
                        this.tableData = response.data.frame_data ? response.data.frame_data : []
                        this.tableData.forEach(item=>{
                            this.$set(item,'time_stamp',new Date(item.timestamp).format("hh:mm:ss.S"))
                        })

                        this.startPoint = this.rdsInfo.start_point
                        this.endPoint = this.rdsInfo.end_point
                        this.job_duration = this.rdsInfo.job_duration ? this.rdsInfo.job_duration : "暂无数据"

                        if(this.startPoint){
                            this.selectedIndex = this.rdsInfo.start_point-1
                            this.selectRowData = this.tableData[this.selectedIndex]
                            this.$nextTick(function () {
                                document.querySelector("#p" + (this.startPoint-1)).scrollIntoView(true);
                            })
                        }
                        if(this.tableData.length!==0){
                            let showImgName = this.rdsInfo.start_point ? this.rdsInfo.start_point + ".jpg" : "1.jpg"
                            this.$ajax.get("api/v1/cedar/rds_screenshot/?rds="+id+"&is_resource_file=True&file_name="+showImgName+"&fields=file_name,img_file")
                                .then(response=>{
                                    this.selectedUrl = this.baseUrl + response.data.rdsscreenshots[0].img_file
                                }).catch(error=>{
                                    if(error.response.status>=500)
                                        this.$Message.error("服务器错误")
                                    else
                                        this.$Message.error("图片获取失败")
                                })
                        }
                    }).catch(error => {
                        if (config.DEBUG) console.log(error)
                        this.$Message.error("图集信息获取失败")
                    })
            },
            //点击列表出来大图
            onTableClick(row,index) {
                this.selectedIndex = index;
                this.selectRowData = row
                let imgName = row.frame_num + ".jpg"
                this.getPic(imgName)
            },
            //获取图片
            getPic(imgName){
                this.$ajax.get("api/v1/cedar/rds_screenshot/?rds="+this.rdsId+"&is_resource_file=True&file_name="+imgName+"&fields=file_name,img_file")
                    .then(response=>{
                        this.selectedUrl = this.baseUrl + response.data.rdsscreenshots[0].img_file
                    }).catch(error=>{
                    this.selectedUrl = ""
                        if(error.response.status>=500)
                            this.$Message.error("服务器错误")
                        else
                            this.$Message.error("图片获取失败")
                    })
            },
            //按钮是否可点击
            isDisabled(point) {
                if (point === "start")       //设为起点
                    return (this.selectedIndex !== this.startPoint-1) && ((this.selectedIndex < this.endPoint-1)||this.endPoint===null)
                if (point === "end")
                    return (this.selectedIndex !== this.endPoint-1) && (this.selectedIndex > this.startPoint-1)
            },
            //点击按钮作为起点或者终点
            setPoint(flag) {
                if (flag){  //true:设为起点    false:设为终点
                    this.startPoint = this.selectRowData.frame_num
                } else{
                    this.endPoint = this.selectRowData.frame_num
                }
                if(this.startPoint&&this.endPoint)
                    this.job_duration = (this.tableData[this.endPoint-1].timestamp - this.tableData[this.startPoint-1].timestamp)/1000   //   单位：s
                else
                    this.job_duration = "暂无数据"
            },
            //点击快捷跳转到起点终点，顶部底部
            quickJump(point) {
                if(!point){
                    this.$Message.warning("未找到起点或终点！")
                    return
                }
                this.selectedIndex = point-1;
                this.selectRowData = this.tableData[point-1]
                let imgName = this.tableData[point-1].frame_num + ".jpg"
                this.getPic(imgName)
                document.querySelector("#p" + (point-1)).scrollIntoView(true);
            },
            getPointMsg() {
                return {
                    startPoint: this.startPoint,
                    endPoint: this.endPoint,
                    job_duration: this.job_duration
                }
            },
            //按键控制上下切换  + :下  -：上
            onKeyUpList(event) {
                if (event.keyCode === 189) {
                    if (this.selectedIndex === 0) return
                    this.selectedIndex--;
                    let imgName = this.tableData[this.selectedIndex].frame_num + ".jpg"
                    this.getPic(imgName)
                    document.querySelector("#p" + this.selectedIndex).scrollIntoView(true);
                } else if (event.keyCode === 187) {
                    if (this.selectedIndex === this.tableData.length-1) return
                    this.selectedIndex++;
                    let imgName = this.tableData[this.selectedIndex].frame_num + ".jpg"
                    this.getPic(imgName)
                    document.querySelector("#p" + (this.selectedIndex)).scrollIntoView(true);
                }
            },
        },
        watch:{
            propRdsId:{
                handler: function(val){
                    this.refresh(val)
                },
            }
        },
        created() {
            window.addEventListener('keyup', this.onKeyUpList)
        },
        beforeDestroy() {
            window.removeEventListener('keyup', this.onKeyUpList)
        }
    }
</script>

<style scoped>
    /deep/.ivu-table td{
        height: 32px;
    }
    .p-container {
        border: 1px solid #dcdcdc;
        height: calc(100vh - 95px);
        display: flex;
        padding: 16px;
        flex-direction: column;
    }
    .photo-box{
        display: flex;
        flex-direction: row;
        margin-top: 10px;
    }
    .photo-left{
        flex: 2;
    }
    .photo-right{
        flex: 4;
    }
    .startPoint {
        background: #B4EEB4;
    }
    .endPoint {
        background: rgba(255,160,122,1);
    }

    .table-body-box{
        border:1px solid #dcdcdc;
        height: calc(100vh - 230px);
        overflow-y: auto;
    }
    .table-body-box tr:hover{
        background: #f2f2f2;
        cursor: pointer;
    }
    .highlight {
        background: #bddbf7!important;
    }
</style>
