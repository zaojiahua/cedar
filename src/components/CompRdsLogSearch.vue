<template>
    <div>
        <Row type="flex" style="margin-bottom: 16px;">
            <DatePicker v-model="filterDateRange" type="daterange" placeholder="测试开始时间" :transfer="true" @on-change="onPageChange(1)" :options="options"></DatePicker>
        </Row>
        <Row type="flex" style="margin-bottom: 16px;">
            <Input v-model="keyword" style="width: 100%;" search enter-button placeholder="请输入关键字..." @on-search="onSearch" />
        </Row>
        <Spin fix size="large" v-if="showLoading"></Spin>
        <div class="content" id="rdsLogSearch">
            <Card style="margin-bottom: 15px;cursor: default" v-for="item in logList" :key="item.id" @click.native="openLogDetail(item.file_name,item.file_path)">
                <Row>
                    <Col span="18">
                        <b style="font-size: 16px;">{{ item.file_name }}</b>
                    </Col>
                    <Col span="6" style="float: right;text-align: right;font-size: 14px;">
                        <span>设备名称：{{ item.device_name}} </span>
                    </Col>
                </Row>
                <Row>
                    <Col span="18">
                        <span v-html="item.highlight[0]">item.highlight[0]</span>
                    </Col>
                    <Col span="6" style="float: right;text-align: right">
                        <span>{{ item.start_time }}</span>
                    </Col>
                </Row>
            </Card>
            <Row v-if="showTip" style="font-size: 16px;text-align: center;margin-top: 16px;">
                <Col span="24">没有搜索结果，换个关键词试试！</Col>
            </Row>
        </div>
        <Page v-if="showPage" :total="dataTotal" :current="currentPage" :page-size="pageSize" simple @on-change="onPageChange" style="margin-top:20px;text-align: center "/>
        <Drawer v-model="showLogDetail" :draggable="true" :closable="false" width="50" :title=fileName>
            <comp-rds-log-search-detail ref="logDetail"></comp-rds-log-search-detail>
        </Drawer>
    </div>
</template>

<script>
    import config from "../lib/config";
    import utils from  "../lib/utils";
    import CompRdsLogSearchDetail from "./CompRdsLogSearchDetail";

    const getDataSerializer = {
        tboards: [
            {
                id: "number",
                board_stamp: "string",
                end_time: "string",
            }
        ]
    }

    export default {
        name:"CompRdsLogSearch",
        components:{CompRdsLogSearchDetail},
        data(){
            return{
                filterDateRange:null,
                keyword:"",
                logList:{},
                showLoading:false,
                showTip:false,
                fileName:"",
                showLogDetail:false,
                pageSize: config.DEFAULT_PAGE_SIZE,
                currentPage:1,
                dataTotal: 0,
                offset: 0,
                showPage:false,
                options: {},
            }
        },
        methods:{
            refresh(){
                this.showLoading = true;
                this.showTip=false;
                document.getElementById("rdsLogSearch").scrollTop  = 0;
                let dateRangeCondition = ""
                if (this.filterDateRange && this.filterDateRange[0] && this.filterDateRange[1]) {
                    dateRangeCondition = "&start_time=" +
                        this.filterDateRange[0].getFullYear() +
                        "-" +
                        (this.filterDateRange[0].getMonth() + 1) +
                        "-" +
                        this.filterDateRange[0].getDate() +
                        " 00:00:00&end_time=" +
                        this.filterDateRange[1].getFullYear() +
                        "-" +
                        (this.filterDateRange[1].getMonth() + 1) +
                        "-" +
                        this.filterDateRange[1].getDate() +
                        " 23:59:59"
                }
                let keywordCondition = "";
                if(this.keyword!=="")
                    keywordCondition = "&q="+this.keyword
                this.$ajax.get(
                    "api/v1/search/rds_log_search/?" +
                    dateRangeCondition +
                    keywordCondition +
                    "&limit=" + this.pageSize +
                    "&offset=" + this.offset +
                    "&ordering=start_time desc"
                ).then(response=>{
                    this.dataTotal = parseInt(response.headers["total-count"])
                    this.logList = response.data;
                    this.showLoading = false;
                    if(Object.keys(this.logList).length===0) {
                        this.showTip = true;
                        this.showPage = false;
                    }else
                        this.showPage = true;
                }).catch(error=>{
                    if(config.DEBUG) console.log(error)
                    this.$Message.error("文件搜索失败！")
                    if(error.response.status===400)
                        this.$Notice.error({
                            title: "ERROR",
                            desc: error.response.data
                        })
                    this.showLoading = false;
                })
            },
            onSearch(value){
                if(value===""){
                    this.$Modal.warning({
                        title: "请输入要搜索的关键字！"
                    });
                    return;
                }
                this.onPageChange(1);
            },
            openLogDetail(name,path){
                this.showLogDetail = true;
                this.fileName = name;
                this.$refs.logDetail.refresh(path)
            },
            onPageChange(page){
                this.offset = this.pageSize*(page-1);
                this.currentPage = page;
                this.refresh()
            },
        },
        mounted(){
            let tboardId = NaN
            if(this.$route.query.hasOwnProperty("tboard")) {
                tboardId = _.parseInt(this.$route.query.tboard)
            }
            if(isNaN(tboardId)) return
            this.$ajax.get("api/v1/cedar/tboard/?" +
                "fields=" +
                "id," +
                "board_stamp," +
                "end_time" +
                "&id=" + tboardId)
                .then(response=>{
                    let data = utils.validate(getDataSerializer, response.data)
                    if(data.tboards.length > 0){
                        //限制从tboard 跳转到rds 时的可选时间段
                        let start = data.tboards[0].board_stamp.split(" ")
                        let end = data.tboards[0].end_time.split(" ")
                        this.options.disabledDate = function (date) {
                            //判断面板上的时间是否在选定的时间范围（start-end）外，若结果返回true，则该时间点要被禁用，返回false，则该时间点可以被选择
                            return date&&( date.valueOf() > new Date(end[0]) || date.valueOf() < new Date(start[0]) - 86400000 );
                        }
                    }
                })
        },
        created(){
            this.pageSize = utils.getPageSize();
        }
    }
</script>

<style scoped>
    .content{
        height: calc(100vh - 290px);
        overflow: auto;
    }
    .ivu-spin-fix{
        left: inherit;
    }

</style>