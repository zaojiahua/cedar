<template>
    <Card dis-hover>
        <Row>
            <slot name="header-top"></slot>
        </Row>
        <Row v-show="propShowHeader">
            <RadioGroup v-model="filterCondition" type="button" @on-change="onConditionChange">
                <Radio label="all">全部任务</Radio>
                <Radio label="running">在测任务</Radio>
                <Radio label="history">历史任务</Radio>
            </RadioGroup>
            <Button v-show="!notHistory" type="error" style="float: right;" @click="onDelete">批量删除</Button>
        </Row>
        <Row style="margin-top: 16px;" v-show="!propIsPerf">
            <DatePicker v-model="filterDateRange" style="width: 220px;" type="daterange" placeholder="选择创建日期范围" :transfer="true"
                        @on-change="onConditionChange"></DatePicker>
        </Row>
        <Row>
            <slot name="header-bottom"></slot>
        </Row>
        <Row style="margin-top: 10px">
            <Input style="width: calc(100% - 70px)" v-model="keyword" :clearable="true"
                   placeholder="输入任务名称搜索..."
                   @on-enter="onPageChange(1)" @on-clear="keyword='';onPageChange(1)"></Input>
            <Button style="height: 32px;" @click="onPageChange(1)" type="primary">search</Button>
        </Row>
        <Table v-show="notHistory" :loading="showLoading" :highlight-row="true" ref="table" :columns="columns" :data="data" border style="margin-top: 16px;" @on-row-click="onRowClick" @on-selection-change="onSelectionChange">
            <template slot-scope="{row, index}" slot="pauseOrDelete">
                <Button shape="circle" type="default" :icon="row.finished_flag?'md-trash':'md-square'"
                        @click="pauseOrDeleteTboard(index)">
                </Button>
                <Button v-show="showRepeatTboard(index)" shape="circle" type="default" icon="md-add" style="margin-left: 16px;"
                        @click="repeatTboard(row)">
                </Button>
            </template>
        </Table>
        <Table v-show="!notHistory" :loading="showLoading" ref="table" :columns="columns1" :data="data" border style="margin-top: 16px;" @on-row-click="onRowClick" @on-selection-change="onSelectionChange">
            <template slot-scope="{row, index}" slot="pauseOrDelete">
                <Button shape="circle" type="default" :icon="row.finished_flag?'md-trash':'md-square'"
                        @click="pauseOrDeleteTboard(index)">
                </Button>
            </template>
        </Table>
        <Page :total="dataTotal" :current="currentPage" :page-size="pageSize" simple @on-change="onPageChange" style="margin-top:20px;text-align: center "/>

        <Modal v-model="showTestAgain" :closable="false" title="启动失败" width="450">
            <div style="height: 30px;">
                <div style="height: 24px;display: inline-block;line-height: 24px">
                    <Icon type="md-close-circle" size="20" color="red" />
                </div>
                <span style="font-size: 15px;margin-left: 2px;font-weight: 500">{{ errorModalMessage }}</span>
            </div>

        </Modal>

    </Card>
</template>

<script>
    import utils from "../lib/utils";
    import config from "../lib/config";

    const getTboardSerializer = {
        tboards: [
            {
                id: "number",
                board_stamp: "date",
                board_name: "string",
                finished_flag: "boolean",
                username:"",
                success_ratio: "number"
            }
        ]
    }


    export default {
        name: "CompTboardList",
        props: {
            propAutoLoad: {
                type: Boolean,
                default: true
            },
            propShowActionColumn: {
                type: Boolean,
                default: false
            },
            propMultiSelect: {
                type: Boolean,
                default: false
            },
            propPoll:{
                type: Boolean,
                default: false
            },
            propTboard:{
                type: Array,
                default: ()=>{
                    return []
                }
            },
            propDeleteMore:{
                type: Boolean,
                default:false
            },
            propShowHeader:{
                type: Boolean,
                default:true
            },
            propIsPerf:{
                type: Boolean,
                default:false
            },
            propFilterDateRange:{
                type: Array,
                default:()=>{ return []}
            }
        },
        data() {
            return {
                // Table control
                columns: [
                    {
                        width: 150,
                        title: "创建日期",
                        key: "board_stamp",
                        sortable: true
                    },
                    {
                        title: "任务名称",
                        key: "board_name",
                        sortable: true
                    },
                    {
                        title:"任务进度",
                        key:"progress",
                        align: 'center',
                        render: (h, params) => {
                            return h('Progress',
                                {
                                    props: {
                                        percent : this.progressList[params.row.id]
                                    }
                                }
                            );
                        }
                    },
                    {
                        title: "任务成功率",
                        key: "success_ratio",
                        sortable: true
                    }
                ],
                columns1: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        width: 150,
                        title: "创建日期",
                        key: "board_stamp",
                        sortable: true
                    },
                    {
                        title: "任务名称",
                        key: "board_name",
                        sortable: true
                    },
                    {
                        title:"任务进度",
                        key:"progress",
                        align: 'center',
                        render: (h, params) => {
                            return h('Progress',
                                {
                                    props: {
                                        percent : this.progressList[params.row.id]
                                    }
                                }
                            );
                        }
                    },
                    {
                        title: "任务成功率",
                        key: "success_ratio",
                        sortable: true
                    }
                ],
                data: [],
                filterCondition: "all",
                filterDateRange: null,
                dataTotal:0,
                currentPage:1,
                offset: 0,
                showLoading:false,
                selection:[],
                progressList:[],
                timer:null,
                successRatioTimer:null,
                pageSize:config.DEFAULT_PAGE_SIZE,
                tboardIdList:[],
                tboard:[],
                notHistory:true,
                socket:null,
                path:"ws://"+config.REEF_HOST+":"+config.WEBSOCKET+"/ws/tboard_delete/",
                showTestAgain:false,
                errorModalMessage:"",
                userFilterList:[],
                hisUserFilterList:[],
                keyword:"",
            }
        },
        methods: {
            refresh() {
                let finishedCondition = ""
                if (this.filterCondition === "all") {
                    finishedCondition = ""
                    this.notHistory = true
                } else if (this.filterCondition === "running") {
                    finishedCondition = "&finished_flag=False"
                    this.notHistory = true
                } else if (this.filterCondition === "history") {
                    finishedCondition = "&finished_flag=True"
                    if(this.propDeleteMore){
                        this.notHistory = false
                    }
                }

                let keywordCondition = ""
                if(this.keyword.trim().length!==0){
                    keywordCondition = "&board_name__icontains=" +  encodeURIComponent(this.keyword)
                }

                let tboardCondition = ""
                if(this.tboard.length>0)
                    tboardCondition = "&id=" + this.tboard[0].id;

                let perfCondition = ""
                if(this.propIsPerf)
                    perfCondition = "&tboard_type=PerfJob&tboard_second_type=TimeJob";

                let dateRangeCondition = ""
                if(this.propFilterDateRange && this.propFilterDateRange[0] && this.propFilterDateRange[1])
                    dateRangeCondition = "&board_stamp__gte="+ this.propFilterDateRange[0].format("yyyy-MM-dd") + " 00:00:00&board_stamp__lte="+
                        this.propFilterDateRange[1].format("yyyy-MM-dd") + " 23:59:59"
                else if (this.filterDateRange && this.filterDateRange[0] && this.filterDateRange[1]) {
                    dateRangeCondition = "&board_stamp__gte=" +
                        this.filterDateRange[0].getFullYear() +
                        "-" +
                        (this.filterDateRange[0].getMonth() + 1) +
                        "-" +
                        this.filterDateRange[0].getDate() +
                        " 00:00:00&board_stamp__lte=" +
                        this.filterDateRange[1].getFullYear() +
                        "-" +
                        (this.filterDateRange[1].getMonth() + 1) +
                        "-" +
                        this.filterDateRange[1].getDate() +
                        " 23:59:59"
                }
                let userId = sessionStorage.getItem('id');
                let userCondition = ""
                if(sessionStorage.getItem('username')==='admin'){
                    if (this.filterCondition === "history"){
                        if(this.hisUserFilterList.length>0)
                            userCondition = "&author__id__in=ReefList[" + this.hisUserFilterList.join("{%,%}") + "]"
                    }else {
                        if(this.userFilterList.length>0)
                            userCondition = "&author__id__in=ReefList[" + this.userFilterList.join("{%,%}") + "]"
                    }
                } else
                    userCondition = "&author__id=" + userId

                this.showLoading = true;
                this.$ajax.get(
                    "api/v1/cedar/tboard/?fields=" +
                    "id," +
                    "board_stamp," +
                    "board_name," +
                    "device,job,repeat_time," +
                    "finished_flag," +
                    "author,author.id,author.username," +
                    "success_ratio" +
                    "&ordering=-board_stamp" +
                    "&is_to_delete=False" +
                    '&limit=' + this.pageSize +
                    "&offset=" + this.offset +
                    userCondition +
                    finishedCondition +
                    dateRangeCondition +
                    perfCondition +
                    keywordCondition +
                    tboardCondition
                ).then(response => {
                    this.tboardIdList=[];
                    this.dataTotal = parseInt(response.headers["total-count"])
                    this.data = utils.validate(getTboardSerializer, response.data).tboards
                    this.data.forEach(item=>{
                        item.username = item.author.username
                        item.success_ratio = (item.success_ratio *100).toFixed(1) + "%";
                        this.tboardIdList.push(item.id)
                        // //判断是否可以重来一次
                        // let isRepeat = (item.device.length === 1) && (item.job.length === 1) && (item.repeat_time === 1) && (new Date()-new Date(item.board_stamp)<=24*60*60*1000)
                        // this.$set(item,"is_repeat",isRepeat)
                    })
                    this.showLoading = false;
                    /* 将之前已经选中的选项重新勾选 */
                    if(this.selection[this.currentPage] !== undefined){
                        let ids = []
                        this.selection[this.currentPage].forEach(item=>{
                            ids.push(item.id)
                        })
                        for(let i=0; i<this.data.length; ++i){
                            if(ids.includes(this.data[i].id)){
                                this.data[i]._checked = true
                            }
                        }
                    }
                    //准备任务进度条
                    let tboardIdStr = this.tboardIdList.join(",");
                    if(tboardIdStr.length>0) {
                        this.getProgress(tboardIdStr)
                        this.getSuccessRatio(tboardIdStr)
                    }
                }).catch(reason => {
                    if (config.DEBUG) console.log(reason)
                    this.$Message.error("载入失败")
                    this.showLoading = false;
                })
            },
            getDate() {
                return this.data
            },
            onConditionChange() {
                this.currentPage=1;
                this.offset = 0;
                this.refresh()
            },
            pauseOrDeleteTboard(index) {
                let isPauseOrDelete = this._isPauseOrDelete(index)
                if (isPauseOrDelete === "pause") {
                    this._pauseTboard(index)
                } else if (isPauseOrDelete === "delete") {
                    this._deleteTboard(index)
                }
            },
            _isPauseOrDelete(index) {
                // return pause when row data is true or null or undefined
                if (this.data[index]["finished_flag"] === false) {
                    return "pause"
                } else {
                    return "delete"
                }
            },
            _deleteTboard(index) {
                event.stopPropagation();
                let row = this.data[index]
                let root = this
                this.$Modal.confirm({
                    title: "确认删除任务 " + row.board_name + "吗?",
                    onOk() {
                        let id = []
                        id.push(row.id)
                        root.$ajax.post("api/v1/cedar/delete_tboard/",{
                            tboard_id:id
                        }).then(response => {
                            root.tboardIdList.splice(root.tboardIdList.indexOf(root.data[index].id),1)
                            root.data.splice(index, 1)
                            clearTimeout(root.timer);
                            clearTimeout(root.successRatioTimer);
                            let tboardIdStr = root.tboardIdList.join(",");
                            if(tboardIdStr.length>0) {
                                root.getProgress(tboardIdStr)
                                root.getSuccessRatio(tboardIdStr)
                            }
                            root.$Message.success({content:"正在删除...该操作可能需要点时间，如需查看进度可进入清理中心页面！",duration:5})
                        }).catch(reason => {
                            if (config.DEBUG) console.log(reason)
                            root.$Message.error("删除失败")
                        })
                    }
                })
            },
            _pauseTboard(index) {
                event.stopPropagation();
                let row = this.data[index]
                let root = this
                let boardId = row.id
                this.$Modal.confirm({
                    title: "确认停止任务 " + row.board_name + "吗?",
                    onOk() {
                        root.$ajax.post("api/v1/coral/remove_tboard/",
                            {
                                tboard_id:boardId
                            })
                        .then(response => {
                            console.log(response)
                            let str = ""
                            if(response.data.fail_cabinet){
                                response.data.fail_cabinet.forEach(item=>{
                                    str = str + item+"服务器停止任务失败；"
                                })
                            }
                            if (response.data.status === "success") {
                                root.$Message.success("停止任务成功!")
                                root.onConditionChange();
                            } else {
                                this.$Modal.warning({
                                    title:"停止失败！",
                                    content:str,
                                })
                            }
                        }).catch(reason => {
                            if (config.DEBUG) console.log(reason)
                            root.$Message.error("停止任务失败!")
                        })
                    }
                })
            },
            showRepeatTboard(index){
                let row = this.data[index]
                return row.finished_flag && (row.device.length === 1) && (row.job.length === 1) && (row.repeat_time === 1) && (new Date()-new Date(row.board_stamp)<=24*60*60*1000);
            },
            repeatTboard(row){
                //再来一次 API
                event.stopPropagation();
                let root = this
                this.$Modal.confirm({
                    title: "确认再来一次任务 " + row.board_name + "吗?",
                    onOk() {
                        root.showLoading = true
                        root.$ajax.post("api/v1/cedar/repeat_execute_tboard/",
                            {
                                id:row.id
                            })
                            .then(response => {
                                root.showLoading = false
                                this.$Message.success("任务启动成功")
                                root.refresh()
                            }).catch(error => {
                                root.showLoading = false
                                if (config.DEBUG) console.log(error)
                                root.showTestAgain = true
                                if(error.response.data.custom_code==="204001")
                                    root.errorModalMessage = "当前设备非idle状态，请检查设备状态"
                                else if(error.response.data.custom_code==="203001")
                                    root.errorModalMessage = "未找到所选用例，请检查用例状态"
                                else
                                    root.errorModalMessage = "该任务无法再来一次"

                            })
                    }
                })
            },
            onRowClick(row, index) {
                this.$emit("on-row-click", row, index)
            },
            getSelection(){
                let selection = []
                this.selection.forEach(items=>{
                    selection = selection.concat(items)
                })
                return selection
            },
            clearSelection(){
                this.$refs.table.selectAll(false)
            },
            clearSelectionAll(){
                this.selection = []
            },
            toggleSelect(_index){
                return this.$refs.table.toggleSelect(_index)
            },
            onPageChange(page){
                this.offset = this.pageSize*(page-1);
                this.currentPage = page;
                this.refresh()
            },
            onSelectionChange(selection){
                this.selection[this.currentPage] = selection
            },
            getProgress(tboardIdStr){
                let root = this;
                clearTimeout(root.timer);
                root.$ajax.get("api/v1/statistics/get_tboard_progress/?tboards=" + tboardIdStr)
                    .then(response => {
                        let progresses = response.data.tboards.reverse()
                        let runningList = [];
                        progresses.forEach(item => {
                            if(item.finished_flag) {
                                item.progress = 1.000;
                            }else {
                                runningList.push(item.id)
                            }
                            this.$set(root.progressList,item.id,parseInt((item.progress * 100).toFixed(1)))
                        })
                        //只轮询未完成的tboard
                        clearTimeout(root.timer);
                        if(runningList.length !== 0&&this.propPoll)
                            root.timer = setTimeout(function (){
                                root.getProgress(runningList.join(","))
                            },5000)
                    })
                    .catch(error => {
                        if (config.DEBUG) console.log(error)
                        root.$Message.error("进度读取失败！")
                    })
            },
            getSuccessRatio(tboardIdStr){
                let root = this;
                clearTimeout(this.successRatioTimer);
                this.$ajax.get("api/v1/statistics/get_tboard_success_ratio/?tboards=" + tboardIdStr)
                    .then(response=>{
                        let successRatio = response.data.tboards;
                        let runningList = [];
                        successRatio.forEach(item => {
                            if(!item.finished_flag)
                                runningList.push(item.id)
                            this.data.forEach(tboard=>{
                                if(item.id === tboard.id) {
                                    this.$set(tboard, "success_ratio", (item.success_ratio * 100).toFixed(1) + "%")
                                    this.$set(tboard, "finished_flag", item.finished_flag)
                                }
                            })
                        })
                        //只轮询未完成的tboard
                        clearTimeout(this.successRatioTimer);
                        if(runningList.length !== 0&&this.propPoll)
                            this.successRatioTimer = setTimeout(function (){
                                root.getSuccessRatio(runningList.join(","));
                            },5000)
                    })
                    .catch(error=>{
                        if (config.DEBUG) console.log(error)
                        this.$Message.error("成功率获取失败！")
                    })
            },
            getThisSelection(){
                return this.selection;
            },
            setSelection(selection){
                this.selection = selection;
            },
            onDelete(){
                let selection = this.getSelection()
                if(selection.length===0){
                    this.$Modal.confirm({
                        title:"提示：",
                        content:"请先选择要删除的任务！",
                    })
                    return
                }
                let selectId = []
                selection.forEach(item=>{
                    selectId.push(item.id)
                })
                let root = this
                this.$Modal.confirm({
                    title: "警告！",
                    content: "您确定要删除这些任务吗?",
                    onOk(){
                        this.$ajax.post("api/v1/cedar/delete_tboard/",{
                            tboard_id:selectId
                        }).then(response=>{
                            this.$Message.info("正在删除...该操作可能需要点时间，如需查看进度可进入清理中心页面！")
                            root.clearSelectionAll()
                            root.refresh()
                        }).catch(error=>{
                            if(config.DEBUG) console.log(error)
                            this.$Message.error("删除任务失败，请检查后重试!")
                        })
                    }
                })
            },

        },
        watch:{
            propTboard:{
                handler: function(val){
                    this.tboard = _.cloneDeep(val)
                },
                immediate: true
            },
        },
        async created() {
            this.pageSize = utils.getPageSize();
            let userList = []
            let defaultFilterValue = []
            await this.$ajax.get(
                "api/v1/cedar/reefuser/?fields=" +
                "id," +
                "username," +
                "last_name" +
                "&ordering=username" +
                "&is_active=True"
            ).then(response=>{
                response.data.reefusers.forEach(item=>{
                    userList.push({
                        label:item.username,
                        value:item.id
                    })
                    if(item.username==='admin')
                        defaultFilterValue = [].concat(item.id)
                })
                this.userFilterList = defaultFilterValue
                this.hisUserFilterList = defaultFilterValue
            }).catch(error=>{
                this.$Message.error("获取用户列表失败!")
            })

            let _this = this
            if(sessionStorage.getItem('username')==='admin'){
                this.columns.push({
                    title: "操作人员",
                    key:"username",
                    sortable: true,
                    filteredValue:_this.userFilterList,
                    filters: userList,
                    filterRemote(value){
                        _this.userFilterList = value
                        _this.onPageChange(1)
                    }
                })
                this.columns1.push({
                    title: "操作人员",
                    key:"username",
                    sortable: true,
                    filteredValue:_this.hisUserFilterList,
                    filters: userList,
                    filterRemote(value){
                        _this.hisUserFilterList = value
                        _this.onPageChange(1)
                    }
                })
            }

            if (this.propShowActionColumn)
                this.columns.push({
                    width: 180,
                    align: "center",
                    title: "停止 / 删除 / 再来一次",
                    slot: "pauseOrDelete"
                })
            if (this.propMultiSelect)
                this.columns.splice(0, 0, {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                })
            if (this.propAutoLoad)
                this.refresh()

        },
        destroyed(){
            clearTimeout(this.timer);
            clearTimeout(this.successRatioTimer);
        }
    }
</script>

<style scoped>
    /deep/.ivu-page-simple .ivu-page-simple-pager input{
        width: 45px;
    }
</style>
