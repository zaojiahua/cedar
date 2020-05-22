<template>
    <div>
        <Modal v-model="showSelectTboardModal" :fullscreen="true" :closable="false"
               @on-ok="getTboardSelection">
            <comp-tboard-list ref="selectTboard" :prop-show-header="false"
                              @on-row-click="onSelectTboardModalRowClick"></comp-tboard-list>
        </Modal>
        <Row v-show="!showView" style="margin-top: 100px;text-align: center">
            <Button type="primary" @click="openTboardList">选取任务</Button>
            <p style="color: rgb(194, 194, 194); font-size: larger; font-weight: bold;margin-top: 16px;">您还没有选择任何任务!</p>
        </Row>

        <div v-if="showView">
            <RadioGroup v-model="groupType" type="button">
                <Radio style="width: 100px;text-align: center;" :label="1">失败数据</Radio>
                <Radio style="width: 100px;text-align: center;" :label="2">无效数据</Radio>
            </RadioGroup>
            <Button type="primary" style="float: right;" @click="openTboardList">重选任务</Button>

            <!--   无效/失败总统计切换  Card   -->
            <Card :bordered="false" style="margin-top: 16px;box-shadow:2px 2px 5px #f2f2f2">
                <b style="border-left: 3px solid #1bbc9c;padding-left: 10px;font-size: 16px">{{ data.board_name }}（ {{data.end_time===null?"进行中":"已完成"}} ）</b><span style="color: #979797;font-size: 12px"> x{{data.repeat_time}}轮</span>
                <Row class="t-font" style="margin-top: 5px;">
                    <span class="dot"></span><span>{{ data.author.username }}</span>
                    <!--<Tag type="dot" style="border: none!important;padding: 0!important;">{{ data.author.username }}</Tag>-->
                    <span class="tit">创建</span><span>{{ data.board_stamp }}</span>
                    <span class="tit">截止</span><span>{{ data.end_time!==null?data.end_time:new Date().format("yy-MM-dd hh:mm:ss")}}</span>
                    <span class="tit" style="margin-left: 50px"><span class="dot"></span>历时</span><span>{{ diffTime(data.board_stamp,data.end_time) }}</span>
                </Row>

                <div style="width: 200px;float: left;">
                    <comp-statistic-pie v-show="groupType===1" :prop-data="pieData" :prop-failure="statistics.fail_rds_percentage" :prop-id="-1" :prop-type="1"></comp-statistic-pie>
                    <comp-statistic-pie v-if="groupType===2" :prop-data="pieData" :prop-invalid-rate="statistics.invalid_rds_percentage" :prop-id="-2" :prop-type="2"></comp-statistic-pie>
                </div>

                <div style="margin-left: 200px;height:170px;margin-top: 30px">
                    <Table stripe width="500" :columns="columns" :data="tableData"></Table>
                </div>
                <Row  v-show="showMsg" >
                    <p style="border-left: 3px solid #1bbc9c;padding-left: 10px;margin-bottom: 10px">测试用例</p>
                    <ButtonGroup>
                        <Tooltip v-for="job in data.job" :content="job.job_label" :key="job.id" placement="bottom" transfer>
                            <Button @click="showJobDetail=true;$refs.jobDetail.refresh(job.id)">
                                {{job.job_name}}
                            </Button>
                        </Tooltip>
                    </ButtonGroup>
                </Row>
                <Row  v-show="showMsg" >
                    <p style="border-left: 3px solid #1bbc9c;padding-left: 10px;margin: 10px 0">测试设备</p>
                    <ButtonGroup>
                        <Tooltip v-for="device in data.device" :content="device.device_label" :key="device.id" placement="bottom" transfer>
                            <Button @click="showDeviceDetail=true;$refs.deviceDetail.refresh(device.id)">
                                {{device.device_name}}
                            </Button>
                        </Tooltip>
                    </ButtonGroup>
                </Row>
                <Row>
                    <span v-show="showMsg" style="float: right;color: #1296db;cursor: pointer" @click="showMsg=false"><Icon type="ios-arrow-up" />收起</span>
                    <span v-show="!showMsg" style="float: right;color: #1296db;cursor: pointer" @click="showMsg=true"><Icon type="ios-arrow-down" />展开</span>
                </Row>

            </Card>


            <!--          =========================                   -->




            <!--     图表统计部份      -->

            <!--<Tabs v-model="tabName" type="card" name="inside">-->
                <!--<TabPane label="设备统计" name="deviceStatistic" tab="inside">-->
                    <!--<comp-rds-device-statistic ref="rdsDeviceStatistic"-->
                                               <!--:prop-filter-date-range="filterDateRange"-->
                                               <!--:prop-device-url="compDeviceUrl"-->
                                               <!--@rds-mouse-enter="onRdsMouseEnter"-->
                                               <!--@rds-mouse-leave="onRdsMouseLeave">-->
                    <!--</comp-rds-device-statistic>-->
                <!--</TabPane>-->
                <!--<TabPane label="用例统计" name="jobStatistic" tab="inside">-->
                    <!--<comp-rds-job-statistic ref="rdsJobStatistic"-->
                                            <!--:prop-filter-date-range="filterDateRange"-->
                                            <!--:prop-job-url="compJobUrl"-->
                                            <!--:prop-device-ids="ids"-->
                                            <!--@rds-mouse-enter="onRdsMouseEnter"-->
                                            <!--@rds-mouse-leave="onRdsMouseLeave">-->
                    <!--</comp-rds-job-statistic>-->
                <!--</TabPane>-->
            <!--</Tabs>-->

            <!--     图表统计部份      -->






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

    export default {
        components:{ CompTboardList, CompStatisticPie,CompDeviceDetail,CompJobDetail, },
        data(){
            return{
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
                pieData:[100,20,5],
                columns: [
                    {
                        title: '通过',
                        key: 'pass'
                    },
                    {
                        title: '失败',
                        key: 'fail'
                    },
                    {
                        title: '无效',
                        key: 'na'
                    },
                    {
                        title: '总共',
                        key: 'total'
                    }
                ],
                tableData:[],
                showJobDetail:false,
                showDeviceDetail:false,
                showLoading:false,
                showMsg:true
            }
        },
        methods:{
            openTboardList(){
                this.showSelectTboardModal = true
            },
            onSelectTboardModalRowClick(row, index){
                this.tboardId = row.id
                console.log(row)
            },
            getTboardSelection(){
                this.showView = true
                this.$ajax.post("api/v1/cedar/get_rds_statistics_data/",{ tboard:this.tboardId } )
                    .then(response=>{
                        console.log(response)
                        this.pieData = []
                        this.statistics = response.data
                        this.pieData.push(response.data.pass_rds_count,response.data.fail_rds_count,response.data.invalid_rds_count)
                        this.tableData = [{
                            pass:response.data.pass_rds_count,
                            fail:response.data.fail_rds_count,
                            na:response.data.invalid_rds_count,
                            total:response.data.rds_count
                        },{
                            pass:(response.data.pass_rds_percentage*100).toFixed(0)+"%",
                            fail:(response.data.fail_rds_percentage*100).toFixed(0)+"%",
                            na:(response.data.invalid_rds_percentage*100).toFixed(0)+"%",
                            total:response.data.rds_percentage + "%"
                        }]

                        console.log(this.pieData)
                        console.log(this.tableData)

                    })
                    .catch(error=>{
                        if(config.DEBUG) console.log(error)
                        this.$Message.warning("获取任务统计数据失败")
                    })

                this.$ajax.get("/api/v1/cedar/tboard/"+ this.tboardId +"?fields=id,board_name," +
                    "job,job.id,job.job_name,job.job_label," +
                    "device,device.id,device.device_name,device.device_label," +
                    "repeat_time," +
                    "author,author.id,author.username," +
                    "board_stamp," +
                    "end_time")
                    .then(response=>{
                        console.log(response)
                        this.data = response.data

                    })
                    .catch(error=>{
                        if(config.DEBUG) console.log(error)
                        this.$Message.warning("获取任务信息失败")
                    })




                //
                // this.$ajax.get("/api/v1/cedar/get_data_view/?tboard_id="+ this.tboardId + "&group_by=device&page=0")
                //     .then(response=>{
                //
                //     })
                //     .catch(error=>{
                //         if(config.DEBUG) console.log(error)
                //         this.$Message.warning("获取任务统计数据失败")
                //     })

            },
            diffTime(start,end){
                if(end===null)
                    end = new Date()
                let date = new Date(end).getTime() - new Date(start).getTime();   //时间差的毫秒数

                // //------------------------------
                //
                // //计算出相差天数
                // var days=Math.floor(date/(24*3600*1000))
                //
                // //计算出小时数
                //
                // var leave1=date%(24*3600*1000)    //计算天数后剩余的毫秒数
                let hours=Math.floor(date/(3600*1000))
                //计算相差分钟数
                let leave=date%(3600*1000)        //计算小时数后剩余的毫秒数
                let minutes=Math.floor(leave/(60*1000))
                //计算相差秒数
                let leave2=leave%(60*1000)      //计算分钟数后剩余的毫秒数
                let seconds=Math.round(leave2/1000)
                return hours+" 小时 "+minutes+" 分钟"+seconds+" 秒"
            },





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
</style>