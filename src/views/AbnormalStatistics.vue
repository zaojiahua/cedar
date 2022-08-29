<template>
    <div>
        <Modal v-model="showSelectDeviceModal" :fullscreen="true" :closable="false" @on-ok="getDeviceSelection">
            <comp-device-list ref="selectDevice" :prop-add-mode="false" :prop-multi-select="true"
                              @on-row-click="onSelectDeviceModalRowClick"></comp-device-list>
        </Modal>
        <Modal v-model="showSelectTboardModal" :fullscreen="true" :closable="false" @on-ok="getTboardSelection">
            <comp-tboard-list ref="selectTboard" :prop-show-header="false"
                              @on-row-click="onSelectTboardModalRowClick"></comp-tboard-list>
        </Modal>

        <Row style="margin-bottom: 5px;">异常统计</Row>
        <div v-show="!showContent" class="out-box">
            <Row style="padding-top: 150px;text-align: center">
                <p style="color: rgb(170, 170, 170); font-size: larger; font-weight: bold;">请先选择任务或设备</p>
                <div>
                    <div class="grey-box" @click="openTboardList">
                        <Icon type="ios-folder-open-outline" size="40"/>
                        <p>选择任务</p>
                    </div>
                    <div class="grey-box" style="margin-left: 50px;" @click="openDeviceList">
                        <Icon type="ios-phone-portrait" size="40"/>
                        <p>选择设备</p>
                    </div>
                </div>
            </Row>
        </div>
        <div v-if="showContent">
            <!-- 设备入口顶部差异 -->
            <Card v-show="devices.length!==0" :bordered="false" dis-hover style="box-shadow: 0 0 2px 1px #eee;">
                <Row>
                    <b>设备列表</b>
                    <Button type="primary" style="float: right;" @click="openDeviceList">选取设备( {{ devices.length }} )</Button>
                    <DatePicker style="float: right;margin-right: 20px;width: 220px;" v-model="deviceFilterDateRange" @on-change="onDateChange" type="daterange" placeholder="测试开始时间" :transfer="true" :clearable="false"></DatePicker>
                </Row>
                <div style="max-height: 100px;overflow: auto;margin-top: 16px">
                    <Tag type="border" v-for="(item,index) in devices" :key="index" style="margin: 0 5px 5px 0"> {{ item.device_name }} </Tag>
                </div>
            </Card>
            <!-- 任务入口顶部差异 -->
            <Card v-show="tboardId!==null" :bordered="false" dis-hover style="box-shadow: 0 0 2px 1px #eee;">
                <b style="border-left: 3px solid #1bbc9c;padding-left: 10px;font-size: 16px">{{ tboardData.board_name }}（ {{tboardData.end_time===null?"进行中":"已完成"}} ）</b><span style="color: #979797;font-size: 12px"> x{{tboardData.repeat_time}}轮</span>
                <Button type="primary" style="float: right;" @click="openTboardList">重选任务</Button>
                <Row class="t-font" style="margin-top: 5px;margin-bottom: 10px">
                    <span class="dot"></span><span>{{ tboardData.author.username }}</span>
                    <!--<Tag type="dot" style="border: none!important;padding: 0!important;">{{ data.author.username }}</Tag>-->
                    <span class="tit">创建</span><span>{{ tboardData.board_stamp }}</span>
                    <span class="tit">截止</span><span>{{ tboardData.end_time!==null?tboardData.end_time:new Date().format("yy-MM-dd hh:mm:ss")}}</span>
                    <span class="tit" style="margin-left: 50px"><span class="dot"></span>历时</span><span>{{ diffTime(tboardData.board_stamp,tboardData.end_time) }}</span>
                </Row>
                <Row  v-show="showMsg" >
                    <p style="border-left: 3px solid #1bbc9c;padding-left: 10px;margin-bottom: 10px">测试用例</p>
                    <ButtonGroup>
                        <Tooltip v-for="(job,index) in tboardData.job" :content="job.job_label" :key="index" placement="bottom" transfer>
                            <Button @click="showJobDetail=true;$refs.jobDetail.refresh(job.id)">
                                {{job.job_name}}
                            </Button>
                        </Tooltip>
                    </ButtonGroup>
                </Row>
                <Row  v-show="showMsg" >
                    <p style="border-left: 3px solid #1bbc9c;padding-left: 10px;margin: 10px 0">测试设备</p>
                    <ButtonGroup>
                        <Tooltip v-for="(device,index) in tboardData.device" :content="device.device_label" :key="index" placement="bottom" transfer>
                            <Button @click="showDeviceDetail=true;$refs.deviceDetail.refresh(device.id)">
                                {{device.device_name}}
                            </Button>
                        </Tooltip>
                    </ButtonGroup>
                </Row>
                <Row style="text-align: center">
                    <span v-show="showMsg" style="color: #1296db;cursor: pointer" @click="showMsg=false"><Icon type="ios-arrow-up" />收起详细信息</span>
                    <span v-show="!showMsg" style="color: #1296db;cursor: pointer" @click="showMsg=true"><Icon type="ios-arrow-down" />展开详细信息</span>
                </Row>
            </Card>
            <!-- 统计部分概括 -->
            <Card :bordered="false" dis-hover style="box-shadow: 0 0 2px 1px #eee;margin: 16px 0;">
                <div class="abs-tit" v-for="(item,index) in abnormalList" :key="item.code" :class="{ active: isActive===index }" @click="isActive=index;abnormalType=item.code">
                    <p class="blue-tag"></p>
                    <b>{{ item.abnm_type_name }}</b>
                    <p>{{ item.abnm_num }}</p>
                    <span>设备数  {{ item.abnm_device_num }}</span>
                </div>
            </Card>
           <!-- 统计详情 -->
            <comp-power-abnormal v-if="abnormalType===1" :key="1"
                                 :prop-devices="devices"
                                 :prop-tboard-id="tboardId"
                                 :prop-filter-date-range="deviceFilterDateRange">
            </comp-power-abnormal>
            <comp-abnormal-other v-if="abnormalType===2" :key="2"
                                 :prop-devices="devices"
                                 :prop-tboard-id="tboardId"
                                 :prop-abnormal-type="abnormalType"
                                 :prop-filter-date-range="deviceFilterDateRange">
            </comp-abnormal-other>
            <comp-abnormal-other v-if="abnormalType===3" :key="3"
                                 :prop-devices="devices"
                                 :prop-tboard-id="tboardId"
                                 :prop-abnormal-type="abnormalType"
                                 :prop-filter-date-range="deviceFilterDateRange">
            </comp-abnormal-other>
            <comp-abnormal-other v-if="abnormalType===4" :key="4"
                                 :prop-devices="devices"
                                 :prop-tboard-id="tboardId"
                                 :prop-abnormal-type="abnormalType"
                                 :prop-filter-date-range="deviceFilterDateRange">
            </comp-abnormal-other>
        </div>

        <Modal v-model="showDeviceDetail" transfer :closable="false" footer-hide :styles="{top: '16px'}">
            <comp-device-detail ref="deviceDetail"></comp-device-detail>
        </Modal>
        <Modal v-model="showJobDetail" transfer :closable="false" footer-hide :styles="{top: '16px'}">
            <comp-job-detail ref="jobDetail" :prop-close-btn="false"></comp-job-detail>
        </Modal>
    </div>
</template>

<script>
    import CompDeviceList from "../components/CompDeviceList";
    import CompTboardList from "../components/CompTboardList";
    import utils from "../lib/utils";
    import config from "../lib/config";
    import CompJobDetail from "../components/CompJobDetail";
    import CompDeviceDetail from "../components/CompDeviceDetail";
    import CompPowerAbnormal from "../components/CompPowerAbnormal";
    import CompAbnormalOther from "../components/CompAbnormalOther";



    const getTboardSerializer = {
        id: "number",
        board_stamp: "date",
        board_name: "string",
        author:{
            id: "number",
            username: "string"
        },
        end_time: "date",
        repeat_time:"number",
        device:[{
            device_label: "string",
            device_name: "string",
            id: "number",
        }],
        job: [{
            id: "number",
            job_label: "string",
            job_name: "string"
        }]
    }
    const abnormalListSerializer = [{
        abnm_device_num: "number",
        abnm_id: "number",
        code: "number",
        abnm_num: "number",
        abnm_type_name: "string"
    }]

    export default {
        components:{ CompDeviceList, CompTboardList, CompJobDetail, CompDeviceDetail, CompPowerAbnormal, CompAbnormalOther  },
        data(){
            return{
                showSelectDeviceModal:false,
                devices: [],
                deviceSelection:[],
                showSelectTboardModal:false,
                tboardId:null,
                tboard:null,
                showContent:false,
                deviceFilterDateRange:[new Date(new Date(new Date().getTime()-24*60*60*1000*2).setHours(0,0,0,0)), new Date()],
                tboardData:utils.validate(getTboardSerializer, {}),
                tboardFilterDateRange:[],
                showMsg:false,
                showJobDetail:false,
                showDeviceDetail:false,
                isActive:-1,
                abnormalList:utils.validate(abnormalListSerializer, []),
                abnormalType:null,
            }
        },
        methods:{
            //  选取device
            onSelectDeviceModalRowClick(data, index) {
                this.$refs.selectDevice.toggleSelect(index)
            },
            getDeviceSelection() {
                this.devices = this.$refs.selectDevice.getSelection()
                this.deviceSelection = this.$refs.selectDevice.getThisSelection()    //记录当前选取设备的位置
                this.getAbnormalTypeList()
                this.showContent = this.devices.length!==0
            },
            openDeviceList(){
                this.showSelectDeviceModal=true
                this.$nextTick(function(){
                    this.$refs.selectDevice.setSelection(this.deviceSelection)
                })
            },
            //  选取tboard
            onSelectTboardModalRowClick(row, index){
                this.tboard = row
            },
            getTboardSelection(){
                this.tboardId = this.tboard.id
                this.showContent = this.tboardId!==null
                this.getAbnormalTypeList()
                let requests = [
                    this.$ajax.get("/api/v1/cedar/tboard/"+ this.tboardId +"/?fields=id,board_name," +
                        "job,job.id,job.job_name,job.job_label," +
                        "device,device.id,device.device_name,device.device_label," +
                        "repeat_time," +
                        "author,author.id,author.username," +
                        "board_stamp," +
                        "end_time")
                ]
                this.$ajax.all(requests)
                    .then(this.$ajax.spread((tboard_resp) => {
                        //tboard信息
                        this.tboardFilterDateRange = []
                        this.tboardData = tboard_resp.data
                        let end = tboard_resp.data.end_time!==null?tboard_resp.data.end_time:new Date().format("yyyy-MM-dd hh:mm:ss")
                        this.tboardFilterDateRange.push(this.tboardData.board_stamp,end)
                    })).catch(reason => {
                        if (config.DEBUG) console.log(reason)
                        this.$Message.error("获取任务信息失败！")
                        this.showLoading = false;
                })
            },
            openTboardList(){
                this.showSelectTboardModal = true
            },
            //  时间选择控件
            onDateChange(){
                this.getAbnormalTypeList()
            },
            diffTime(start,end){
                if(end===null)
                    end = new Date()
                let date = new Date(end).getTime() - new Date(start).getTime();   //时间差的毫秒数
                // //计算出小时数
                let hours=Math.floor(date/(3600*1000))
                //计算相差分钟数
                let leave=date%(3600*1000)        //计算小时数后剩余的毫秒数
                let minutes=Math.floor(leave/(60*1000))
                //计算相差秒数
                let leave2=leave%(60*1000)      //计算分钟数后剩余的毫秒数
                let seconds=Math.round(leave2/1000)
                return hours+" 小时 "+minutes+" 分钟"+seconds+" 秒"
            },
            //异常类型列表  电量/屏幕/温度...
            getAbnormalTypeList(){
                let ids = []
                if(this.devices.length>0){
                    this.devices.forEach(item=>{
                        ids.push(item.id)
                    })
                    ids = ids.join(",")
                }
                let url = ""
                if((this.devices.length>0)&&(this.tboardId===null))
                    url = "api/v1/cedar/get_abnormity_count/?devices="+ ids +"&start_time="+ this.deviceFilterDateRange[0].format("yyyy-MM-dd hh:mm:ss")
                        +"&end_time="+this.deviceFilterDateRange[1].format("yyyy-MM-dd")+" 23:59:59"
                else if((this.devices.length===0)&&(this.tboardId!==null))
                    url = "api/v1/cedar/get_abnormity_count/?tboard="+ this.tboardId

                this.$ajax.get(url)
                    .then(response=>{
                        this.abnormalList = utils.validate(abnormalListSerializer,response.data.results)
                        // this.abnormalType = this.abnormalList[0].code
                    })
                    .catch(error=>{
                        if (config.DEBUG) console.log(error)
                        this.$Message.error("异常类型获取失败！")
                    })
            },

        },
        mounted(){

        }
    }
</script>

<style scoped lang="less">
    .out-box{
        height: calc(100vh - 125px);
        background-color: #fff;
        box-shadow: 0 0 2px 2px #eee;
    }
    .grey-box{
        display: inline-block;
        padding-top: 15px;
        width: 100px;
        height: 100px;
        background-color: #f2f2f2;
        margin-top: 30px;
        color: rgb(150, 150, 150);
        cursor: pointer;
    }
    .grey-box p{
        margin-top: 8px;
    }
    .tit{
        color: #979797;
        margin: 0 10px 0 20px;
    }
    .t-font span{
        font-size: 12px;
    }
    .dot{
        background: #ccc;
        display: inline-block;
        width: 8px;
        height: 8px;
        margin-right: 10px;
        border-radius: 50%
    }
    .abs-tit{
        display: inline-block;
        width: 150px;
        height: 150px;
        padding: 22px;
        margin-right: 40px;
        border: 4px solid transparent;
        cursor: default;
    }
    .abs-tit:hover{
        cursor: pointer;
        border: 4px solid #d1f2eb;
    }
    .abs-tit b{
        font-size: 16px;
    }
    .abs-tit p{
        font-size: 36px;
    }
    .abs-tit span{
        color: #979797;
    }
    .active{
        border: 4px solid #2db7f5!important;
    }
    .active .blue-tag{
        float: right;
        width: 0;
        height: 0;
        border-width: 10px;
        border-style: solid;
        border-color:  #2db7f5 #2db7f5 transparent transparent;
        margin: -22px
    }
</style>



