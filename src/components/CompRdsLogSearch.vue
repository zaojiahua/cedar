<template>
    <div>
        <Row type="flex" style="margin-bottom: 16px;">
            <DatePicker v-model="filterDateRange" type="daterange" placeholder="测试开始时间" :transfer="true" @on-change="refresh"></DatePicker>
        </Row>
        <Row type="flex" style="margin-bottom: 16px;">
            <Input v-model="keyword" style="width: 100%;" search enter-button placeholder="请输入关键字..." @on-search="onSearch" />
        </Row>
        <Spin fix size="large" v-if="showLoading"></Spin>
        <div class="content">
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
        <Drawer v-model="showLogDetail" :draggable="true" :closable="false" width="50" :title=fileName>
            <comp-rds-log-search-detail ref="logDetail"></comp-rds-log-search-detail>
        </Drawer>
    </div>
</template>

<script>
    import config from "../lib/config";
    import CompRdsLogSearchDetail from "./CompRdsLogSearchDetail";

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
            }
        },
        methods:{
            refresh(){
                this.showLoading = true;
                this.showTip=false;
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
                    keywordCondition
                ).then(response=>{
                    this.logList = response.data;
                    this.showLoading = false;
                    if(Object.keys(this.logList).length===0)
                        this.showTip = true;
                }).catch(error=>{
                    if(config.DEBUG) console.log(error)
                    this.$Message.error("文件搜索失败！")
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
                this.refresh();
            },
            openLogDetail(name,path){
                this.showLogDetail = true;
                this.fileName = name;
                this.$refs.logDetail.refresh(path)
            }
        }
    }
</script>

<style scoped>
    .content{
        height: calc(100vh - 245px);
        overflow: auto;
    }
    .ivu-spin-fix{
        left: inherit;
    }

</style>