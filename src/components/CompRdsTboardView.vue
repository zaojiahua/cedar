<template>
    <div class="content" style="position: relative">
        <Modal v-model="showSelectTboardModal" :fullscreen="true" :closable="false"
               @on-ok="getTboardSelection">
            <comp-tboard-list ref="selectTboard" :prop-show-header="false"
                              @on-row-click="onSelectTboardModalRowClick"></comp-tboard-list>
        </Modal>
        <Row v-show="!showView" style="margin-top: 100px;text-align: center">
            <Button type="primary" @click="openTboardList">{{$t('rdsTboardView.selBtn')}}</Button>
            <p style="color: rgb(194, 194, 194); font-size: larger; font-weight: bold;margin-top: 16px;">{{$t('rdsTboardView.selTips')}}</p>
        </Row>

        <div v-if="showView">
            <div v-if="propTabName===$t('rdsManagement.view_4')">
                <RadioGroup v-model="groupType" type="button">
                    <Radio style="width: 100px;text-align: center;" :label="1">{{$t('rdsDeviceView.failData')}}</Radio>
                    <Radio style="width: 100px;text-align: center;" :label="2">{{$t('rdsDeviceView.invalidData')}}</Radio>
                </RadioGroup>
                <Button type="primary" style="float: right;" @click="openTboardList">{{$t('rdsTboardView.selBtn_2')}}</Button>

                <!--   无效/失败总统计切换  Card   -->
                <Card :bordered="false" style="margin-top: 16px;box-shadow:2px 2px 5px #f2f2f2">
                    <b style="border-left: 3px solid #1bbc9c;padding-left: 10px;font-size: 16px">{{ data.board_name }}（ {{data.end_time===null?$t('rdsTboardView.status_1'):$t('rdsTboardView.status_2')}} ）</b><span style="color: #979797;font-size: 12px"> x{{data.repeat_time}}$t('rdsTboardView.pcs')</span>
                    <Row class="t-font" style="margin-top: 5px;">
                        <span class="dot"></span><span>{{ data.author.username }}</span>
                        <!--<Tag type="dot" style="border: none!important;padding: 0!important;">{{ data.author.username }}</Tag>-->
                        <span class="tit">{{$t('rdsTboardView.tit_1')}}</span><span>{{ data.board_stamp }}</span>
                        <span class="tit">{{$t('rdsTboardView.tit_2')}}</span><span>{{ data.end_time!==null?data.end_time:new Date().format("yy-MM-dd hh:mm:ss")}}</span>
                        <span class="tit" style="margin-left: 50px"><span class="dot"></span>{{$t('rdsTboardView.tit_3')}}</span><span>{{ diffTime(data.board_stamp,data.end_time) }}</span>
                    </Row>

                    <div style="width: 200px;float: left;">
                        <comp-statistic-pie v-show="groupType===1" :prop-data="pieData" :prop-failure="statistics.fail_rds_percentage" :prop-id="-99" :prop-type="1"></comp-statistic-pie>
                        <comp-statistic-pie v-if="groupType===2" :prop-data="pieData" :prop-invalid-rate="statistics.invalid_rds_percentage" :prop-id="-98" :prop-type="2"></comp-statistic-pie>
                    </div>

                    <div style="margin-left: 200px;height:170px;margin-top: 30px">
                        <Table stripe width="500" :columns="columns" :data="tableData"></Table>
                    </div>
                    <Row  v-show="showMsg" >
                        <p style="border-left: 3px solid #1bbc9c;padding-left: 10px;margin-bottom: 10px">{{$t('tboardDetail.testJob')}}({{data.job.length}})</p>
                        <ButtonGroup>
                            <Tooltip v-for="(job,index) in data.job" :content="job.job_label" :key="index" placement="bottom" transfer>
                                <Button @click="showJobDetail=true;$refs.jobDetail.refresh(job.id)">
                                    {{job.job_name}}
                                </Button>
                            </Tooltip>
                        </ButtonGroup>
                    </Row>
                    <Row  v-show="showMsg" >
                        <p style="border-left: 3px solid #1bbc9c;padding-left: 10px;margin: 10px 0">{{$t('tboardDetail.testDev')}}({{data.device.length}})</p>
                        <ButtonGroup>
                            <Tooltip v-for="(device,index) in data.device" :content="device.device_label" :key="index" placement="bottom" transfer>
                                <Button @click="showDeviceDetail=true;$refs.deviceDetail.refresh(device.id)">
                                    {{device.device_name}}
                                </Button>
                            </Tooltip>
                        </ButtonGroup>
                    </Row>
                    <Row>
                        <span v-show="showMsg" style="float: right;color: #1296db;cursor: pointer" @click="showMsg=false"><Icon type="ios-arrow-up" />{{$t('tboardDetail.up')}}</span>
                        <span v-show="!showMsg" style="float: right;color: #1296db;cursor: pointer" @click="showMsg=true"><Icon type="ios-arrow-down" />{{$t('tboardDetail.down')}}</span>
                    </Row>
                </Card>

                <!--     图表统计部份    失败    -->
                <div class="device-statistic" style="margin-top: 16px" v-if="showStatistic&&(groupType===1)">
                    <Tabs v-model="tabName" type="card" name="inside" v-if="groupType===1">
                        <TabPane :label="$t('rdsTboardView.tabs_1')" name="deviceStatistic" tab="inside">
                            <comp-rds-tboard-device-statistic ref="rdsDeviceStatistic"
                                                              :prop-device-url="compDeviceUrl"
                                                              :prop-tboard-id="tboardId"
                                                              :prop-filter-date-range="filterDateRange"
                                                              @rds-mouse-enter="onRdsMouseEnter"
                                                              @rds-mouse-leave="onRdsMouseLeave">
                            </comp-rds-tboard-device-statistic>
                        </TabPane>
                        <TabPane :label="$t('rdsTboardView.tabs_2')" name="jobStatistic" tab="inside">
                            <comp-rds-tboard-job-statistic ref="rdsJobStatistic"
                                                           :prop-job-url="compJobUrl"
                                                           :prop-tboard-id="tboardId"
                                                           :prop-filter-date-range="filterDateRange"
                                                           @rds-mouse-enter="onRdsMouseEnter"
                                                           @rds-mouse-leave="onRdsMouseLeave">
                            </comp-rds-tboard-job-statistic>
                        </TabPane>
                    </Tabs>
                </div>
                <!--     图表统计部份    无效    -->
                <div class="device-statistic" style="margin-top: 16px" v-if="showStatistic&&(groupType===2)">
                    <Tabs v-model="tabName" type="card" name="inside" v-if="groupType===2">
                        <TabPane :label="$t('rdsTboardView.tabs_1')" name="deviceStatistic" tab="inside">
                            <comp-rds-tboard-device-statistic ref="rdsDeviceStatistic"
                                                              :prop-device-url="compDeviceUrl"
                                                              :prop-tboard-id="tboardId"
                                                              :prop-type="2"
                                                              :prop-filter-date-range="filterDateRange"
                                                              @rds-mouse-enter="onRdsMouseEnter"
                                                              @rds-mouse-leave="onRdsMouseLeave">
                            </comp-rds-tboard-device-statistic>
                        </TabPane>
                        <TabPane :label="$t('rdsTboardView.tabs_2')" name="jobStatistic" tab="inside">
                            <comp-rds-tboard-job-statistic ref="rdsJobStatistic"
                                                           :prop-job-url="compJobUrl"
                                                           :prop-tboard-id="tboardId"
                                                           :prop-filter-date-range="filterDateRange"
                                                           :prop-type="2"
                                                           @rds-mouse-enter="onRdsMouseEnter"
                                                           @rds-mouse-leave="onRdsMouseLeave">
                            </comp-rds-tboard-job-statistic>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
            <div v-if="propTabName===$t('rdsManagement.view_3')">
                <RadioGroup v-model="groupTypeSwitch" type="button" style="margin-bottom: 16px">
                    <Radio style="width: 100px;text-align: center;" :label="1">{{$t('rdsTboardView.tabs_2')}}</Radio>
                    <Radio style="width: 100px;text-align: center;" :label="2">{{$t('rdsTboardView.tabs_1')}}</Radio>
                </RadioGroup>
                <div style="float: right;">
                    <span>{{$t('tboardList.board_name')}}：{{ data.board_name }}</span>
                    <span style="margin: 0 20px">{{$t('tboardDetail.jobNum')}}：{{data.job.length}}</span>
                    <span>{{$t('tboardDetail.devNum')}}：{{data.device.length}}</span>
                    <span style="margin:0 20px">{{$t('rdsTboardView.rdsNum')}}：{{rdsNum}}</span>
                </div>
                <comp-rds-tboard-job-statistic-switch v-show="groupTypeSwitch===1" :tboard="tboardId"
                                                      @rds-mouse-enter="onRdsMouseEnter"
                                                      @rds-mouse-leave="onRdsMouseLeave">
                </comp-rds-tboard-job-statistic-switch>
                <comp-rds-tboard-device-statistic-switch v-show="groupTypeSwitch===2" :tboard="tboardId"
                                                         @rds-mouse-enter="onRdsMouseEnter"
                                                         @rds-mouse-leave="onRdsMouseLeave">
                </comp-rds-tboard-device-statistic-switch>
            </div>
        </div>

        <div v-show="tipData.id"  style="float: right;margin-top: -100px; background-color: #434343; border-radius: 5px;opacity: 0.9; color: #ebf7ff; padding: 8px;">
            <span>ID：</span>
            <span>{{tipData.id}}</span>
            <br>
            <span>{{$t('tboardDetail.devName')}}：</span>
            <span>{{tipData.device.device_name}}</span>
            <br>
            <span>{{$t('tboardDetail.jobName')}}：</span>
            <span>{{tipData.job.job_name}}</span>
            <br>
            <span>{{$t('rdsDeviceView.result')}}：</span>
            <span>{{tipData.job_assessment_value}}</span>
        </div>

        <Modal v-model="showDeviceDetail" transfer :closable="false" footer-hide :styles="{top: '16px'}">
            <comp-device-detail ref="deviceDetail"></comp-device-detail>
        </Modal>
        <Modal v-model="showJobDetail" transfer :closable="false" footer-hide :styles="{top: '16px'}">
            <comp-job-detail ref="jobDetail" :prop-close-btn="false"></comp-job-detail>
        </Modal>
        <Spin size="large" fix v-if="showLoading"></Spin>
    </div>

</template>

<script>
    import config from "../lib/config";
    import utils from "../lib/utils";
    import CompTboardList from "../components/CompTboardList";
    import CompStatisticPie from "../components/CompStatisticPie";
    import CompJobDetail from "./CompJobDetail";
    import CompDeviceDetail from "./CompDeviceDetail";
    import CompRdsTboardDeviceStatistic from "./CompRdsTboardDeviceStatistic";
    import CompRdsTboardJobStatistic from "./CompRdsTboardJobStatistic";
    import CompRdsTboardDeviceStatisticSwitch from "./CompRdsTboardDeviceStatisticSwitch";
    import CompRdsTboardJobStatisticSwitch from "./CompRdsTboardJobStatisticSwitch";

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
    const tipDataSerializer = {
        id: "number",
        device: {
            device_name: "string"
        },
        job: {
            job_name: "string"
        },
        job_assessment_value: "string"
    }
    const lang = localStorage.getItem("lang")

    export default {
        components:{ CompTboardList, CompStatisticPie,CompDeviceDetail,CompJobDetail,CompRdsTboardDeviceStatistic,CompRdsTboardJobStatistic,
            CompRdsTboardDeviceStatisticSwitch, CompRdsTboardJobStatisticSwitch },
        props:{
            propTabName:{
                type: String,
                default: lang ==='zh' ? "任务数据统计" : "Task data statistics"
            }
        },
        data(){
            return{
                filterDateRange:[],
                showStatistic:false,
                groupType:1,
                showSelectTboardModal:false,
                tboardId:null,
                showView:false,
                data:utils.validate(getTboardSerializer, {}),
                statistics:{
                    pass_rds_count:null,
                    fail_rds_count:null,
                    invalid_rds_count:null,
                    rds_count:null,
                    pass_rds_percentage:null,
                    fail_rds_percentage:null,
                    invalid_rds_percentage:null,
                    rds_percentage:null,
                },
                pieData:[0,0,0],
                columns: [
                    {
                        title: this.$t('tboardDetail.pass'),
                        key: 'pass'
                    },
                    {
                        title: this.$t('tboardDetail.fail'),
                        key: 'fail'
                    },
                    {
                        title: this.$t('tboardDetail.invalid'),
                        key: 'na'
                    },
                    {
                        title: this.$t('tboardDetail.total'),
                        key: 'total'
                    }
                ],
                tableData:[],
                showJobDetail:false,
                showDeviceDetail:false,
                showLoading:false,
                showMsg:true,
                tabName:"deviceStatistic",
                compDeviceUrl:"",
                compJobUrl:"",
                tipData:utils.validate(tipDataSerializer, null),
                groupTypeSwitch:1,
                rdsNum:0,
            }
        },
        methods:{
            openTboardList(){
                this.showSelectTboardModal = true
            },
            onSelectTboardModalRowClick(row, index){
                this.tboardId = row.id
            },
            getTboardSelection(){
                this.showView = true
                this.showStatistic = false
                let requests = [
                    this.$ajax.post("api/v1/cedar/get_rds_statistics_data/",{ tboard:this.tboardId } ),
                    this.$ajax.get("/api/v1/cedar/tboard/"+ this.tboardId +"/?fields=id,board_name," +
                        "job,job.id,job.job_name,job.job_label," +
                        "device,device.id,device.device_name,device.device_label," +
                        "repeat_time," +
                        "author,author.id,author.username," +
                        "board_stamp," +
                        "end_time")
                ]
                this.$ajax.all(requests)
                    .then(this.$ajax.spread((statistics_resp,tboard_resp) => {
                        //    统计数据
                        this.pieData = []
                        this.statistics = statistics_resp.data
                        this.pieData.push(statistics_resp.data.pass_rds_count,statistics_resp.data.fail_rds_count,statistics_resp.data.invalid_rds_count)
                        this.rdsNum = statistics_resp.data.rds_count
                        this.tableData = [{
                            pass:statistics_resp.data.pass_rds_count,
                            fail:statistics_resp.data.fail_rds_count,
                            na:statistics_resp.data.invalid_rds_count,
                            total:statistics_resp.data.rds_count
                        },{
                            pass:(statistics_resp.data.pass_rds_percentage*100).toFixed(1)+"%",
                            fail:(statistics_resp.data.fail_rds_percentage*100).toFixed(1)+"%",
                            na:(statistics_resp.data.invalid_rds_percentage*100).toFixed(1)+"%",
                            total:statistics_resp.data.rds_percentage + "%"
                        }]

                        if(statistics_resp.data.rds_count!==0)
                            this.showStatistic = true
                        //tboard信息
                        this.filterDateRange = []
                        this.data = tboard_resp.data

                        let end = tboard_resp.data.end_time!==null?tboard_resp.data.end_time:new Date().format("yyyy-MM-dd hh:mm:ss")
                        this.filterDateRange.push(this.data.board_stamp,end)
                        // set  prop  url
                        this.setRequestUrl()

                    })).catch(reason => {
                        if (config.DEBUG) console.log(reason)
                        this.$Message.error(this.$t('rdsTboardView.err_1'))
                        this.showLoading = false;
                })
            },
            setRequestUrl(){
                let order = "fail_ratio"
                if(this.groupType===1)
                    order = "fail_ratio"
                else if(this.groupType===2)
                    order = "na_ratio"
                this.compDeviceUrl = "api/v1/cedar/get_data_view/?tboard_id="+ this.tboardId +
                    "&group_by=device&page=0&ordering=-" + order
                this.compJobUrl = "api/v1/cedar/get_data_view/?tboard_id="+ this.tboardId +
                    "&group_by=job&page=0&ordering=-" + order
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
                return hours+this.$t('rdsDetail.hours')+minutes+this.$t('rdsDetail.minutes')+seconds+this.$t('rdsDetail.seconds')
            },
            onRdsMouseEnter(rds) {
                this.tipData = utils.validate(tipDataSerializer, rds)
            },
            onRdsMouseLeave() {
                this.tipData = utils.validate(tipDataSerializer, null)
            },
        },
        watch:{
            groupType:{
                handler: function(val){
                    this.setRequestUrl()
                },
                immediate: true
            }
        },
        mounted(){
            let tboardId = NaN
            if(this.$route.query.hasOwnProperty("tboard")) {
                tboardId = _.parseInt(this.$route.query.tboard)
            }
            if(isNaN(tboardId)) return
            this.tboardId = tboardId
            this.getTboardSelection()

        }
    }
</script>

<style scoped>
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
    .device-statistic .ivu-tabs-bar{
        margin-bottom: 0;
        border-bottom: none;
    }
</style>
