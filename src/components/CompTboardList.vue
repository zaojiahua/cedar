<template>
    <div>
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
        <Table :columns="columns" :data="data" border style="margin-top: 16px;">
            <template slot-scope="{row, index}" slot="pauseOrDelete">
                <Button shape="circle" type="default" :icon="row.finished_flag?'md-trash':'md-pause'" @click="pauseOrDeleteTboard(index)">
                </Button>
            </template>
        </Table>
    </div>
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
                finished_flag: "boolean"
            }
        ]
    }


    export default {
        name: "CompTboardList",
        props: {
            propAutoLoad: {
                type: Boolean,
                default: true
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
                        width: 100,
                        align: "center",
                        title: "暂停 / 删除",
                        slot: "pauseOrDelete"
                    }
                ],
                data: [
                    {
                        board_stamp: "2018-01-01 20:20:20",
                        board_name: "board_name"
                    }
                ],
                filterCondition: "all",
                filterDateRange: null,
            }
        },
        methods: {
            refresh(data) {
                if (data !== undefined && data !== null)
                    this.data = data
                let finishedCondition = ""
                if (this.filterCondition === "all") {
                    finishedCondition = ""
                } else if (this.filterCondition === "running") {
                    finishedCondition = "&finished_flag=False"
                } else if (this.filterCondition === "history") {
                    finishedCondition = "&finished_flag=True"
                }

                let dateRageCondition = ""
                console.log(this.filterDateRange)
                if (this.filterDateRange && this.filterDateRange[0] && this.filterDateRange[1]) {
                    console.log(this.filterDateRange)
                    dateRageCondition = "&board_stamp__gte=" +
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

                this.$ajax.get(
                    "api/v1/cedar/tboard/?fields=" +
                    "id," +
                    "board_stamp," +
                    "board_name," +
                    "finished_flag" +
                    finishedCondition +
                    dateRageCondition
                ).then(response => {
                    this.data = utils.validate(getTboardSerializer, response.data).tboards
                }).catch(reason => {
                    if (config.DEBUG) console.log(reason)
                    this.$Message.error("载入失败")
                })
            },
            getDate() {
                return this.data
            },
            onConditionChange() {
                this.refresh()
            },
            pauseOrDeleteTboard(index){
                let isPauseOrDelete = this._isPauseOrDelete(index)
                if(isPauseOrDelete==="pause"){
                    this._pauseTboard(index)
                } else if(isPauseOrDelete==="delete"){
                    this._deleteTboard(index)
                }
            },
            _isPauseOrDelete(index){
                // return pause when row data is true or null or undefined
                if(this.data[index]["finished_flag"]===false){
                    return "pause"
                } else {
                    return "delete"
                }
            },
            _deleteTboard(index){
                let row = this.data[index]
                let root = this
                this.$Modal.confirm({
                    title: "您确认要删除任务 " + row.board_name + " 吗?",
                    onOk(){
                        root.$ajax.delete(
                            "api/v1/cedar/tboard/" + row.id + "/"
                        ).then(response=>{
                            root.data.splice(index, 1)
                            root.$Message.success("删除成功")
                        }).catch(reason => {
                            if(config.DEBUG) console.log(reason)
                            root.$Message.error("删除失败")
                        })
                    }
                })
            },
            _pauseTboard(index){

            }

        },
        created() {
            if (this.propAutoLoad)
                this.refresh()
        }
    }
</script>

<style scoped>

</style>