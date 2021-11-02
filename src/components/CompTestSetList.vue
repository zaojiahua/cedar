<template>
    <div>
        <Table :columns="columns" :data="data" border @on-row-click="onRowClick" @on-selection-change="onSelectionChange"></Table>
        <Page :total="dataTotal" :current="currentPage" :page-size="pageSize" simple @on-change="onPageChange" style="margin-top:20px;text-align: center "/>

        <Modal v-model="showViewModal" width="90" :mask-closable="false" :footer-hide="true">
            <Row style="text-align-last: center;margin-top: 20px;">
                <h2>测试集：{{ viewName }}</h2>
            </Row>
            <Row style="text-align: right;margin: 10px 0">
                <Button @click="onRefreshJobList" style="margin-right: 16px">刷新列表</Button>
                <Button type="primary" @click="openJobModal">添加用例</Button>
            </Row>
            <comp-test-set-job-table ref="testSetJobList" :prop-show-remove="true" @on-remove-success="onRemoveSuccess"></comp-test-set-job-table>
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

    export default{
        components:{ CompTestSetJobTable, CompTestSetAddJob },
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
                        key: 'update_time'
                    },
                    {
                        title:"操作",
                        key:"action",
                        width:100,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('span', {
                                    style: {
                                        color:"#1bbc9c",
                                        cursor:"pointer"
                                    },
                                    on: {
                                        click: () => {
                                            event.stopPropagation()
                                            this.showViewModal = true
                                            this.viewName = params.row.name
                                            this.viewId = params.row.id
                                            this.$refs.testSetJobList.refresh(params.row.id,true)
                                            // this.showUserInfo(params.index);
                                        }
                                    }
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
            }
        },
        methods:{
            refresh(){
                let keyCondition = ""
                if(this.keywords.length>0)
                    keyCondition = "&name__icontains=" +  this.keywords
                this.$ajax.get("api/v1/cedar/test_gather/?ordering=-update_time" +
                    "&limit=" + this.pageSize +
                    "&offset=" + this.offset +
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
            // 用例移除以后刷新外层测试集列表
            onRemoveSuccess(){
                this.refresh()
            },
            onRefreshJobList(){
                this.$refs.testSetJobList.onPageChange(1)
            },
            getJobCount(count){
                this.selectJobCount = count
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
