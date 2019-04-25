<template>
    <div>
        <Table ref="table" :columns="columns" :data="data" @on-row-click="onRowClick">
            <template slot-scope="{row, index}" slot="counter">
                <InputNumber :min="1" v-model="data[index].counter"></InputNumber>
            </template>
            <template slot-scope="{row, index}" slot="delete">
                <Button shape="circle" type="default" icon="md-trash" size="large" @click="deleteRow(index)">
                </Button>
            </template>
        </Table>
        <Page v-if="propShowPage" :current="currentPage" :total="dataTotal" :page-size="propPageSize" simple @on-change="onPageChange"
              style="margin-top:20px;text-align: center "/>
    </div>
</template>

<script>
    import utils from "../lib/utils";
    import config from "../lib/config";

    const getJobSerializer = {
        jobs: [
            {
                id: "number",
                job_label: "string",
                job_name: "string",
                test_area: [
                    {
                        id: "number",
                        description: "string"
                    }
                ],
                custom_tag: [
                    {
                        id: "number",
                        custom_tag_name: "string"
                    }
                ],
                counter: "number"
            }
        ]
    }

    export default {
        name: "CompJobList",
        props: {
            propAutoLoad: {
                type: Boolean,
                default: true
            },
            propShowCounter: {
                type: Boolean,
                default: false
            },
            propMultiSelect: {
                type: Boolean,
                default: false
            },
            propDeletable: {
                type: Boolean,
                default: false
            },
            propShowPage: {
                type: Boolean,
                default: true
            },
            propPageSize: {
                type: Number,
                default: config.PAGE_SIZE
            }
        },
        data() {
            return {
                columns: [
                    {
                        title: "用例名称",
                        key: "job_name"
                    },
                    {
                        title: "测试用途",
                        key: "display_job_test_area"
                    },
                    {
                        title: "自定义标签",
                        key: "display_custom_tag"
                    }
                ],
                data: [],
                dataTotal: 0,
                offset: 0,
                urlParam: "",
                currentPage: 1
            }
        },
        methods: {
            _requestErrorHandle(reason) {
                if (config.DEBUG) console.log(reason)
                this.$Message.error("载入失败")
            },
            _responseHandle(response) {
                this.dataTotal = parseInt(response.headers["total-count"])
                this.data = utils.validate(getJobSerializer, response.data).jobs
                this.data.forEach(job => {
                    if (job.counter === null) job.counter = 1
                    let job_test_areas = []
                    job.test_area.forEach(job_test_area => {
                        job_test_areas.push(job_test_area.description)
                    })
                    let custom_tags = []
                    job.custom_tag.forEach(custom_tag => {
                        custom_tags.push(custom_tag.custom_tag_name)
                    })

                    job.display_job_test_area = job_test_areas.join(', ')
                    job.display_custom_tag = custom_tags.join(', ')
                })
            },
            _setUrlParam(param){
                this.urlParam = param
            },
            refreshWithData(data) {
                if (data !== undefined) {
                    this.data = data
                }
            },
            refreshWithParam(param){
                this._setUrlParam(param)
                this.onPageChange(1)
            },
            refresh() {
                let url =
                    "api/v1/cedar/job/?fields=" +
                    "id," +
                    "job_label," +
                    "job_name," +
                    "test_area," +
                    "test_area.id," +
                    "test_area.description," +
                    "custom_tag," +
                    "custom_tag.id," +
                    "custom_tag.custom_tag_name" +
                    "&job_deleted=False" +
                    "&ordering=id" +
                    this.urlParam

                if(this.propShowPage){
                    url = url +
                        "&limit=" + config.PAGE_SIZE +
                        "&offset=" + this.offset
                }

                this.$ajax.get(url)
                    .then(this._responseHandle)
                    .catch(this._requestErrorHandle)
            },
            getData() {
                return this.data
            },
            getSelection() {
                return this.$refs.table.getSelection()
            },
            toggleSelect(_index) {
                this.$refs.table.toggleSelect(_index)
            },
            deleteRow(index) {
                this.data.splice(index, 1)
            },
            onRowClick(row, index) {
                this.$emit("on-row-click", row, index)
            },
            onPageChange(page) {
                this.offset = this.propPageSize * (page-1)
                this.currentPage = page
                this.refresh()
            },
            clearSelection() {
                this.$refs.table.selectAll(false)
            }

        },
        created() {
            if (this.propAutoLoad) this.refresh()
            if (this.propShowCounter)
                this.columns.splice(0, 0, {
                    title: "运行次数",
                    slot: "counter",
                })
            if (this.propMultiSelect)
                this.columns.splice(0, 0, {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                })
            if (this.propDeletable)
                this.columns.push({
                    align: "center",
                    title: "删除",
                    slot: "delete"
                })
        }
    }
</script>

<style scoped>

</style>