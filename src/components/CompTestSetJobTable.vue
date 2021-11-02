<template>
    <div>
        <Table :columns="columns" :data="data" border @on-row-click="onRowClick" @on-selection-change="onSelectionChange">
            <template slot-scope="{row, index}" slot="delete">
                <Button type="default" shape="circle" icon="md-trash"
                        @click="deleteJob(index,row)">
                </Button>
            </template>
        </Table>
        <Page :total="dataTotal" :current="currentPage" :page-size="pageSize" simple @on-change="onPageChange" style="margin-top:20px;text-align: center "/>
    </div>
</template>

<script>
    const getJobSerializer =  [
        {
            id: "number",
            job_label: "string",
            job_name: "string",
            job_type:"string",
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
            cabinet_type: "string",
            process_time:"string",
        }
    ]

    import utils from "../lib/utils";
    import config from "../lib/config"
    export default{
        props:{
          propShowRemove:{
              type:Boolean,
              default:false
          }
        },
        data(){
            return{
                columns: [
                    {
                        title: "用例名称",
                        key: "job_name",
                        width:250
                    },
                    {
                        title: "caseNo",
                        key: "case_number",
                    },
                    {
                        title: "用例类型",
                        key: "job_type",
                        sortable: true
                    },
                    {
                        title: "测试用途",
                        key: "display_job_test_area"
                    },
                    {
                        title: "自定义标签",
                        key: "display_custom_tag"
                    },
                    {
                        title: "用例耗时",
                        key: "process_time",
                    },
                    {
                        title: "测试柜类型",
                        key: "cabinet_type",
                    },
                    {
                        title: "更新时间",
                        key: "updated_time",
                    }
                ],
                data:[],
                dataTotal:0,
                currentPage:1,
                offset: 0,
                selection: [],
                currentPageSelection:{},
                selectionList:{},
                testSetId:null,
                pageSize:config.DEFAULT_PAGE_SIZE,
            }
        },
        methods:{
            refresh(id,reset){
                if(reset){
                    this.offset = 0
                    this.currentPage = 1
                }
                this.testSetId = id
                this.$ajax.get("api/v1/cedar/job/" +
                    "?fields=id,job_name," +
                    "job_type," +
                    "case_number," +
                    "priority," +
                    "test_area," +
                    "test_area.id," +
                    "test_area.description," +
                    "custom_tag," +
                    "custom_tag.id," +
                    "custom_tag.custom_tag_name," +
                    "updated_time," +
                    "process_time," +
                    "cabinet_type" +
                    "&testgather=" + id +
                    "&ordering=-updated_time" +
                    "&limit=" + this.pageSize +
                    "&offset=" + this.offset)
                    .then(response=>{
                        this.dataTotal = parseInt(response.headers["total-count"])
                        this.data = utils.validate(getJobSerializer, response.data.jobs)
                        this.data.forEach(job => {
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

                            if(job.process_time){
                                //计算分钟数
                                let minutes=Math.floor(job.process_time/60)
                                //计算相差秒数
                                let leave=job.process_time%60    //计算分钟数后剩余的毫秒数
                                let seconds=Math.round(leave)
                                job.process_time = minutes+" min "+seconds+" s"
                            }else
                                job.process_time = "暂无数据"
                        })
                    }).catch(error=>{
                        if (config.DEBUG) console.log(reason)
                        this.$Message.error("用例信息获取失败")
                })
            },
            onRowClick(row){
                this.$emit("on-row-click",row)
            },
            onPageChange(page) {
                this.offset = this.pageSize * (page-1)
                this.currentPage = page
                this.refresh(this.testSetId)
            },
            getData() {
                return this.data
            },
            getSelection() {                   //转换成id对比以后可以不用forEach
                return this.selection
            },
            // 以后用例列表如果多选可能会用到 => 现在赞暂时不看
            onSelectionChange(selection){
                selection.forEach((value) => {
                    if (this.selectionList[value.id] === undefined ) {
                        //console.log('勾选了id为' + value.id + '的job')
                        this.$set(this.selectionList, value.id, value)    //所有的已选择job  包括新选择的job
                        this.$set(this.currentPageSelection, value.id, 'exist')    //currentPageSelectedJobs  当前页已选择job
                    }
                })
                //用上个步骤得到的当前页已选择的job-id 和 实际表格返回的 selection做比对，如果对上，则不做任何操作
                // 如果对不上，则表示多了一个，即用户点击了一次取消，就用$delete方法将多出来的这条数据删除this.$delete(obj,key);
                for (let item in this.currentPageSelection) {
                    let i = 0
                    for (i; i < selection.length; i++) {
                        if (parseInt(item) === selection[i].id) {
                            break
                        }
                    }
                    if (i === selection.length) {
                        //console.log('不再勾选id为' + item + '的job')
                        this.$delete(this.selectionList, item)
                        this.$delete(this.currentPageSelection, item)
                    }
                }
                //对象提取所有的value
                this.selection = _.values(this.selectionList)
                this.$emit("get-job-count",this.selection.length)
            },
            deleteJob(index,row){
                let root = this
                this.$Modal.confirm({
                    title: "确认移除该用例吗?",
                    onOk() {
                        let id = []
                        id.push(row.id)
                        this.$ajax.post('api/v1/cedar/update_test_gather/',{
                            id: root.testSetId,
                            job_ids: id,
                            operate: "delete"
                        }).then(response=>{
                            this.$Message.success("用例移除成功")
                            root.data.splice(index, 1)
                            root.$emit("on-remove-success")
                        }).catch(error=>{
                            if(config.DEBUG) console.log(error)
                            this.$Message.error({content:"用例移除失败"+error.response.data.description,duration:6})
                        })
                    }
                })
            },

        },
        mounted(){
            this.pageSize = utils.getPageSize();
            if (this.propShowRemove){
                this.columns.push({
                    title: "移除",
                    slot: "delete",
                    align:"center",
                    width:100
                })
            }
        }
    }
</script>
<style scoped>

</style>
