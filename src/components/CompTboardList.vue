<template>
    <Card dis-hover>
        <Row>
            <slot name="header-top"></slot>
        </Row>
        <Row>
            <RadioGroup v-model="filterCondition" type="button" @on-change="onConditionChange">
                <Radio label="all">全部任务</Radio>
                <Radio label="running">在测任务</Radio>
                <Radio label="history">历史任务</Radio>
            </RadioGroup>
        </Row>
        <Row style="margin-top: 16px;">
            <DatePicker v-model="filterDateRange" type="daterange" placeholder="选择创建日期范围" :transfer="true"
                        @on-change="onConditionChange"></DatePicker>
        </Row>
        <Row>
            <slot name="header-bottom"></slot>
        </Row>
        <Table :loading="showLoading" ref="table" :columns="columns" :data="data" border style="margin-top: 16px;" @on-row-click="onRowClick" @on-selection-change="onSelectionChange">
            <template slot-scope="{row, index}" slot="pauseOrDelete">
                <Button shape="circle" type="default" :icon="row.finished_flag?'md-trash':'md-square'"
                        @click="pauseOrDeleteTboard(index)">
                </Button>
            </template>
        </Table>
        <Page :total="dataTotal" :current="currentPage" :page-size="pageSize" simple @on-change="onPageChange" style="margin-top:20px;text-align: center "/>
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
                data: [
                    {
                        board_stamp: "2018-01-01 20:20:20",
                        board_name: "board_name",
                        success_ratio: 0
                    }
                ],
                filterCondition: "all",
                filterDateRange: null,
                dataTotal:0,
                currentPage:1,
                offset: 0,
                showLoading:false,
                selection:[],
                progressList:[],
                timer:null,
                pageSize:config.DEFAULT_PAGE_SIZE,
            }
        },
        methods: {
            refresh() {
                let finishedCondition = ""
                if (this.filterCondition === "all") {
                    finishedCondition = ""
                } else if (this.filterCondition === "running") {
                    finishedCondition = "&finished_flag=False"
                } else if (this.filterCondition === "history") {
                    finishedCondition = "&finished_flag=True"
                }

                let dateRangeCondition = ""
                if (this.filterDateRange && this.filterDateRange[0] && this.filterDateRange[1]) {
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
                        this.filterDateRange[1].getDate()
                }
                let userId = localStorage.getItem('id');
                this.showLoading = true;
                this.$ajax.get(
                    "api/v1/cedar/tboard/?fields=" +
                    "id," +
                    "board_stamp," +
                    "board_name," +
                    "finished_flag," +
                    "success_ratio" +
                    "&author__id=" + userId +
                    "&ordering=-board_stamp" +
                    '&limit=' + this.pageSize +
                    "&offset=" + this.offset +
                    finishedCondition +
                    dateRangeCondition
                ).then(response => {
                    let tboardIdList=[];
                    this.dataTotal = parseInt(response.headers["total-count"])
                    this.data = utils.validate(getTboardSerializer, response.data).tboards
                    this.data.forEach(item=>{
                        item.success_ratio = (item.success_ratio *100).toFixed(2) + "%";
                        tboardIdList.push(item.id)
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
                    let tboardIdStr = tboardIdList.join(",");
                    if(tboardIdStr.length>0)
                        this.getProgress(tboardIdStr)
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
                    title: "您确认要删除任务 " + row.board_name + " 吗?",
                    onOk() {
                        root.$ajax.delete(
                            "api/v1/cedar/tboard/" + row.id + "/"
                        ).then(response => {
                            root.data.splice(index, 1)
                            root.$Message.success("删除成功")
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
                let coralUrl = utils.getCoralUrl(config.CREATETBOARD_PORT)
                let userId = localStorage.getItem('id');
                let boardStamp = row.board_stamp.replace(/\-/g, '_').replace(/\:/g, '_').replace(/\ /g, '_')
                this.$Modal.confirm({
                    title: "您确认要停止任务 " + row.board_name + " 吗?",
                    onOk() {
                        root.$ajax.post(coralUrl, {
                            requestName: "removeTBoard",
                            boardName: boardStamp,
                            ownerID: userId
                        }).then(response => {
                            if (response.data.state === "OK") {
                                root.$Message.success("停止任务成功!")
                                root.onConditionChange();
                            } else {
                                root.$Message.error("停止任务失败!")
                                if (response.data.state) {
                                    root.$Message.error(response.data.state);
                                }
                            }
                        }).catch(reason => {
                            if (config.DEBUG) console.log(reason)
                            root.$Message.error("停止任务失败!")
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
                        root.progressList = [];
                        let progresses = response.data.tboards.reverse()
                        progresses.forEach(item => {
                            if(item.finished_flag)
                                item.progress = 1.000;
                            this.$set(root.progressList,item.id,parseInt((item.progress * 100).toFixed(1)))
                        })
                        clearTimeout(root.timer);
                        root.timer = setTimeout(function (){
                            root.getProgress(tboardIdStr)
                        },5000)
                    })
                    .catch(error => {
                        if (config.DEBUG) console.log(error)
                        root.$Message.error("进度读取失败！")
                    })
            },

        },
        created() {
            this.pageSize = utils.getPageSize();
            if (this.propShowActionColumn)
                this.columns.push({
                    width: 100,
                    align: "center",
                    title: "停止 / 删除",
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
        }
    }
</script>

<style scoped>

</style>