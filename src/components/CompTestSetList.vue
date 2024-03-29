<template>
    <div>
        <Table :columns="columns" :data="data" border @on-row-click="onRowClick" @on-selection-change="onSelectionChange"
               @on-cell-click="onCellClick" @on-sort-change="onSortChange"></Table>
        <Page :total="dataTotal" :current="currentPage" :page-size="pageSize" simple @on-change="onPageChange" style="margin-top:20px;text-align: center "/>

        <Modal v-model="showViewModal" width="90" :mask-closable="false" :footer-hide="true">
            <div v-if="showViewModal">
                <Row style="text-align-last: center;margin-bottom: 15px;">
                    <h2>测试集：{{ viewName }}</h2>
                </Row>
                <comp-filter-switch ref="filterSwitch" :prop-test-gather="viewId" @on-url-change="onJobFilterParams"></comp-filter-switch>
                <Row style=";margin: 10px 0">
                    <Col style="text-align: right">
                        <Button type="primary" @click="openJobModal">添加用例</Button>
                        <Button  style="margin: 0 15px;" type="warning" @click="cancelJobList">取消选择（{{jobNumbers}}）</Button>
                        <Dropdown trigger="click">
                            <Button>
                                更多操作
                                <Icon type="ios-arrow-down"></Icon>
                            </Button>
                            <DropdownMenu slot="list" style="text-align: left;">
                                <!--<span @click="onRefreshJobList"><DropdownItem>刷新列表</DropdownItem></span>-->
                                <span @click="onRemoveJobs"><DropdownItem>批量移除</DropdownItem></span>
                            </DropdownMenu>
                        </Dropdown>
                    </Col>
                </Row>
                <comp-test-set-job-table ref="testSetJobList" :prop-show-remove="true" @get-job-count="getJobNumbers" @on-row-click="onSelectTestSetJobRowClick"></comp-test-set-job-table>
            </div>

        </Modal>

        <Modal v-model="showSelectJobModal" v-if="showSelectJobModal" :fullscreen="true" :transfer="false" :closable="false">
            <comp-test-set-add-job ref="addJob"  @get-job-count="getJobCount"></comp-test-set-add-job>
            <div slot="footer">
                <Button type="text" @click="showSelectJobModal=false">取消</Button>
                <Button type="primary" @click="getJobSelection">确定 ( {{ selectJobCount }} )</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import utils from "../lib/utils";
    import config from "../lib/config"
    import CompTestSetJobTable from "../components/CompTestSetJobTable"
    import CompTestSetAddJob from "../components/CompTestSetAddJob"
    import CompFilterSwitch from './CompFilterSwitch'


    export default{
        components:{ CompTestSetJobTable, CompTestSetAddJob, CompFilterSwitch },
        props:{
            propProject:{
                type: Number,
            }
        },
        data(){
            return{
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '测试集名称',
                        key: 'name',
                    },
                    {
                        title: '用例数量',
                        width: 100,
                        align: 'center',
                        key: 'job_count'
                    },
                    {
                        title: '涉及测试柜',
                        key: 'cabinet_version_list'
                    },
                    {
                        title: '预计耗时',
                        key: 'duration_time'
                    },
                    {
                        title: '更新时间',
                        key: 'update_time',
                        sortable:'custom'
                    },
                    {
                        title:"操作",
                        key:"action",
                        width:100,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('div', {
                                    style: {
                                        color:"#1bbc9c",
                                        padding:"15px 0",
                                        cursor:"pointer"
                                    },
                                }, '查看用例')
                            ]);
                        }
                    }
                ],
                data:[],
                dataTotal:0,
                currentPage:1,
                offset: 0,
                selection: [],
                currentPageSelection:{},
                selectionList:{},
                showViewModal:false,
                showSelectJobModal:false,
                viewName:'',
                viewId:null,
                selectJobCount:0,
                pageSize:config.DEFAULT_PAGE_SIZE,
                keywords: "",
                jobNumbers: 0,
                sortCondition:"&ordering=-update_time"
            }
        },
        methods:{
            refresh(){
                let projectCondition = ""
                if(this.propProject!==-1)
                    projectCondition = "&testproject=" + this.propProject
                let keyCondition = ""
                if(this.keywords.length>0)
                    keyCondition = "&name__icontains=" +  this.keywords
                this.$ajax.get("api/v1/cedar/test_gather/?" +
                    "&limit=" + this.pageSize +
                    "&offset=" + this.offset +
                    this.sortCondition +
                    projectCondition +
                    keyCondition)
                    .then(response=>{
                        this.currentPageSelection = {}
                        this.data = response.data.test_gather
                        this.dataTotal = parseInt(response.headers["total-count"])
                        this.data.forEach(item=>{
                            item.cabinet_version_list = item.cabinet_version ? item.cabinet_version.cabinet_version_list.join(",") : ""
                            item.duration_time =  (item.duration_time/3600).toFixed(1) + ' 小时'

                            /* 将之前已经选中的选项重新勾选 */
                            this.selection.forEach(selected=>{
                                if (item.id === selected.id){
                                    item._checked = true
                                    this.$set(this.currentPageSelection, item.id, 'exist')
                                }
                            })
                        })
                    }).catch(error=>{
                        if(config.DEBUG) console.log(error)
                        this.$Message.error({content:"测试集信息获取失败"+error.response.data.description,duration:6})
                    })
            },
            //接收传过来的搜索keyword
            setKeywords(keywords){
                this.keywords = keywords ? keywords : ""
                this.onPageChange(1)
            },
            onRowClick(row){
                this.$emit("on-row-click",row)
            },
            onSortChange(column){
                if(column.order==='asc'){  //正 序
                    this.sortCondition = "&ordering=update_time"
                }else {  // 倒 序
                    this.sortCondition = "&ordering=-update_time"
                }
                this.onPageChange(1)
            },
            // 点 击 某 一 个 单 元 格
            onCellClick(row,column){
                if(column.key==="action"){
                    event.stopPropagation()
                    this.showViewModal = true
                    this.viewName = row.name
                    this.viewId = row.id
                    this.jobNumbers = 0
                    this.$nextTick(function () {
                        this.$refs.testSetJobList.refresh(row.id,true)
                    })
                }
            },
            //  测 试 集 里 面 的 用 例 可 点 击 行 选 中
            onSelectTestSetJobRowClick(data, index){
                this.$refs.testSetJobList.toggleSelect(index)
            },
            onPageChange(page) {
                this.offset = this.pageSize * (page-1)
                this.currentPage = page
                this.refresh()
            },
            getData() {
                return this.data
            },
            getSelection() {                   //转换成id对比以后可以不用forEach
                return this.selection
            },
            resetSelection(){
                this.selectionList = {}
                this.currentPageSelection = {}
                this.selection = []
                this.$emit("get-test-count",0)
            },
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
                this.$emit("get-test-count",this.selection.length)
            },
            getJobSelection(){
                let jobSelectList = this.$refs.addJob.getSelection()
                if(jobSelectList.length===0){
                    this.$Message.warning("请选择用例！")
                    return
                }
                let ids = []
                jobSelectList.forEach(item=>{
                    ids.push(item.id)
                })
                this.$ajax.post('api/v1/cedar/update_test_gather/',{
                    id: this.viewId,
                    job_ids: ids,
                    operate: "add"
                }).then(response=>{
                    this.$Message.success("用例添加成功")
                    this.showSelectJobModal = false
                    this.$refs.testSetJobList.refresh(this.viewId)
                    this.$refs.filterSwitch.getFilterData()
                    this.refresh()
                }).catch(error=>{
                    if(config.DEBUG) console.log(error)
                    this.$Message.error({content:"用例添加失败"+error.response.data.description,duration:6})
                })
            },
            openJobModal(){
                this.showSelectJobModal = true
                this.selectJobCount = 0
            },
            onRefreshJobList(){
                this.$refs.testSetJobList.onPageChange(1)
            },
            //添加job到测试集时显示的job数量
            getJobCount(count){
                this.selectJobCount = count
            },
            //------------  分  界  线  ------------ 以下是对当前测试集中的job的操作
            //当前用例集下要操作（删除）的job的数量
            getJobNumbers(count){
                this.jobNumbers = count
            },
            //取消全选 ==> 当前用例集下要操作（删除）的job
            cancelJobList(){
                this.$refs.testSetJobList.resetJobList()
            },
            // job 筛选
            onJobFilterParams(params){
                this.$refs.testSetJobList._setUrlParam(params)
                this.$refs.testSetJobList.onPageChange(1)
            },
            // 批  量  移  除  用  例
            onRemoveJobs(){
                if(this.jobNumbers===0){
                    this.$Message.info("至少选择一个用例！")
                    return
                }
               let jobList = this.$refs.testSetJobList.getSelection();
                let ids = [];
                jobList.forEach(job=>{
                    ids.push(job.id);
                })
                let root = this
                this.$Modal.confirm({
                    title: "确认移除选中的用例吗?",
                    onOk() {
                        this.$ajax.post('api/v1/cedar/update_test_gather/',{
                            id: root.viewId,
                            job_ids: ids,
                            operate: "delete"
                        }).then(response=>{
                            root.$Message.success("用例移除成功")
                            root.refresh()   // 用例移除以后刷新外层测试集列表
                            root.$refs.testSetJobList.onPageChange(1)  //刷新当前的用例列表
                            root.$refs.testSetJobList.resetJobList() //  重置当前用例列表的已选数据
                            // root.$refs.filterSwitch.onClearChange() //走了这一步以后就不需要走用例列表的onPageChange
                            // root.$refs.filterSwitch.getFilterData() //刷新当前的筛选列表
                        }).catch(error=>{
                            if(config.DEBUG) console.log(error)
                            this.$Message.error({content:"用例移除失败"+error.response.data.description,duration:6})
                        })
                    }
                })
            },
        },
        watch:{
            propProject:{
                handler:function () {
                    this.resetSelection()
                    this.onPageChange(1)
                }
            }
        },
        mounted(){
            this.pageSize = utils.getPageSize();
            this.refresh();
        }
    }
</script>
<style scoped>

</style>
