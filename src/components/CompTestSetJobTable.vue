<template>
    <div>
        <Table ref="table" :columns="columns" :data="data" border @on-row-click="onRowClick" @on-selection-change="onSelectionChange" @on-sort-change="onSortChange"></Table>
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
            author:{
                username:"string"
            },
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
            propMultiSelect:{
                type:Boolean,
                default:true
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
                        title: "用例类型",
                        key: "job_type",
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
                        title: "维护人员",
                        key: "username",
                    },
                    {
                        title: "更新时间",
                        key: "updated_time",
                        sortable:'custom'
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
                urlParam:"",
                sortCondition: "&ordering=-updated_time",
            }
        },
        methods:{
            _setUrlParam(param){
                this.urlParam = param
            },
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
                    "author,author.username," +
                    "updated_time," +
                    "process_time," +
                    "cabinet_type" +
                    "&testgather=" + id +
                    this.urlParam +
                    this.sortCondition +
                    "&limit=" + this.pageSize +
                    "&offset=" + this.offset)
                    .then(response=>{
                        this.currentPageSelection = {}
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
                            job.username = job.author.username

                            if( job.job_type === "Joblib" )
                                job.job_type = '功能'
                            else if( job.job_type === "InnerJob" )
                                job.job_type = '内嵌'
                            else if( job.job_type === "PerfJob" )
                                job.job_type = '性能'

                            if(job.process_time){
                                //计算分钟数
                                let minutes=Math.floor(job.process_time/60)
                                //计算相差秒数
                                let leave=job.process_time%60    //计算分钟数后剩余的毫秒数
                                let seconds=Math.round(leave)
                                job.process_time = minutes+" min "+seconds+" s"
                            }else
                                job.process_time = "暂无数据"

                            /* 将之前已经选中的选项重新勾选 */
                            this.selection.forEach(selected=>{
                                if (job.id === selected.id){
                                    job._checked = true
                                    this.$set(this.currentPageSelection, job.id, 'exist')
                                }
                            })
                        })
                    }).catch(error=>{
                        if (config.DEBUG) console.log(reason)
                        this.$Message.error("用例信息获取失败")
                })
            },
            onRowClick(row,index){
                this.$emit("on-row-click",row,index)
            },
            onPageChange(page) {
                this.offset = this.pageSize * (page-1)
                this.currentPage = page
                this.refresh(this.testSetId)
            },
            //排序
            onSortChange(column){
                if(column.order==='asc'){  //正 序
                    this.sortCondition = "&ordering=updated_time"
                }else {  // 倒 序
                    this.sortCondition = "&ordering=-updated_time"
                }
                this.onPageChange(1)
            },
            toggleSelect(index){
                this.$refs.table.toggleSelect(index)
            },
            getData() {
                return this.data
            },
            getSelection() {                   //转换成id对比以后可以不用forEach
                return this.selection
            },
            //  用例列表 多选
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
            //取消全选
            resetJobList(){
                this.selectionList = {}
                this.currentPageSelection = {}
                this.selection = []
                this.$emit("get-job-count",this.selection.length)
                this.data.forEach(job=>{
                    this.$set(job,"_checked",false)
                    this.$delete(job, "_checked")
                })
            }

        },
        mounted(){
            this.pageSize = utils.getPageSize();
            if (this.propMultiSelect)
                this.columns.splice(0, 0, {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                })
        }
    }
</script>
<style scoped>

</style>
