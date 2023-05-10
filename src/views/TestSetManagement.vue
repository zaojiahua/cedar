<template>
    <div @click="showContextMenu=false">
        <div class="layout_left">
            <Row class="title_left">
                <b>{{$t('testSetManagement.topTit')}}</b>
                <Button size="small" style="float: right;margin-top: 14px;color: #1bbc9c" @click="showNewModal=true;isNewProject=true;projectName = ''">{{$t('testSetManagement.newPro')}}</Button>
            </Row>
            <div class="search">
                <Input v-model="allKeyword" clearable search :placeholder="$t('testSetManagement.enterName')"
                       @on-change="projectSearch(allKeyword,false)"/>
            </div>
            <div class="project-list all-pro" :class="{ active: projectIndex===-1 }" @click="projectIndex=-1;">
                <Icon type="ios-folder-open-outline" size="18" style="font-weight: bold;margin-right: 5px"/>
                <b>{{$t('testSetManagement.allTestSet')}}（{{ allTestcount }}）</b>
            </div>

            <div style="overflow: auto;max-height: calc(100% - 91px)">
                <div class="project-list" v-for="item in allProjectList" :key="item.id" :class="{ active: projectIndex===item.id }"
                     @click="projectIndex=item.id;projectMsg=item;projectName=item.name" @click.right="onContextClick(item)">
                    <Icon type="ios-folder-open-outline" size="18" style="margin-right: 5px"/>
                    <span class="text-hidden">{{ item.name }}</span>
                    <span>（{{ item.test_gather_count }}）</span>
                </div>
            </div>

        </div>
        <!--<div class="layout_right_top">-->

        <!--</div>-->
        <div class="layout_right_bottom">
            <Row style="height: 32px;line-height: 32px;margin: 10px 0">
                <Col style="text-align: right">
                    <span style="padding-left: 5px;border-left: 3px solid #1bbc9c;float: left">{{$t('testSetManagement.testSetList')}}( {{$t('testSetManagement.sel')}} {{ testCount }} {{$t('testSetManagement.units')}} )</span>
                <!--</Col>-->
                <!--<Col span="20" style="text-align: right">-->
                    <Button type="primary" style="margin-right: 10px;" @click="onAddTestSet">{{$t('testSetManagement.newTestSet')}}</Button>
                    <Button style="margin-right: 10px;" :disabled="projectIndex===-1" @click="onOpenAddTestModal">{{$t('testSetManagement.add')}}</Button>
                    <Dropdown trigger="click" style="margin-right: 10px;">
                        <Button>
                            {{$t('public.moreAction')}}
                            <Icon type="ios-arrow-down"></Icon>
                        </Button>
                        <DropdownMenu slot="list" style="text-align: left">
                            <span @click="menuClick(true)"><DropdownItem>{{$t('testSetManagement.copy')}}</DropdownItem></span>
                            <span v-show="projectIndex!==-1" @click="menuClick(false)"><DropdownItem>{{$t('testSetManagement.move')}}</DropdownItem></span>
                            <span v-show="projectIndex!==-1" @click="removeTestSet"><DropdownItem>{{$t('testSetManagement.remove')}}</DropdownItem></span>
                            <span v-show="username==='admin'" @click="deleteTestSet"><DropdownItem>{{$t('testSetManagement.del')}}</DropdownItem></span>
                        </DropdownMenu>
                    </Dropdown>
                    <div style="float: right;width:250px;">
                        <Input v-model="keyword" clearable search enter-button :placeholder="$t('testSetManagement.enterName_2')"
                               class="search-input" @on-change="testSearch(keyword)"/>
                    </div>
                </Col>
            </Row>
            <comp-test-set-list ref="testList" :prop-project="projectIndex" @on-row-click="onOpenTestDetail" @get-test-count="getTestCount"></comp-test-set-list>
        </div>

        <div id="context-menu" v-show="showContextMenu">
            <ButtonGroup vertical style="width: 100px">
                <Button @click="showNewModal=true;isNewProject=false;projectName=projectMsg.name">{{$t('testSetManagement.reName')}}</Button>
                <Button @click="deleteProject" :disabled="username!=='admin'">{{$t('public.btn_del')}}</Button>
            </ButtonGroup>
        </div>

        <Drawer v-model="showDetail" :draggable="true" :closable="false" width="50">
            <comp-test-set-detail ref="testDetail" @on-save="onSaveClick"></comp-test-set-detail>
        </Drawer>

        <Modal v-model="showAddTestModal" width="90" :mask-closable="false" :footer-hide="true">
            <div>
                <Row style="margin-bottom: 15px;">
                    <h2>{{$t('testSetManagement.addTo')}}【{{ projectName }}】</h2>
                </Row>
                <Row style="margin-bottom: 16px">
                    <Col span="8">
                        <div style="float: left;margin-right: 50px;">
                            <span>{{$t('testSetManagement.pro')}}：</span>
                            <Select v-model="projectSelected" style="width:200px" clearable  @on-change="onSelectedChange">
                                <Option v-for="project in allProject" :value="project.id" :key="project.id">{{ project.name }}</Option>
                            </Select>
                        </div>
                    </Col>
                    <Col span="16" style="text-align: right">
                        <Button  style="margin-right: 15px;" type="warning" @click="cancelTestSetList">{{$t('public.cancelSelect')}}（{{ selection.length }}）</Button>
                        <div style="width: 250px;float: right;">
                            <Input v-model="testKeyword" clearable search enter-button :placeholder="$t('testSetManagement.enterName_2')"
                                   class="search-input" @on-change="onPageChange(1)"/>
                        </div>
                    </Col>
                </Row>
                <Table ref="addTestTable" :columns="testColumns" :data="testData" border @on-row-click="onRowClick" @on-selection-change="onSelectionChange"></Table>
                <Page :total="dataTotal" :current="currentPage" :page-size="pageSize" simple @on-change="onPageChange" style="margin-top:20px;text-align: center "/>
                <Row style="text-align: right;margin-top: 30px;">
                    <Button @click="showAddTestModal=false;">{{$t('public.btn_cancel')}}</Button>
                    <Button type="primary" style="margin-left: 20px" @click="addTestToProject">{{$t('public.btn_ok')}}</Button>
                </Row>
            </div>
        </Modal>

        <Modal v-model="showCopyModal" footer-hide :closable="false" :mask-closable="false" width="420">
            <Row style="margin: 12px 0 10px 0;line-height: 32px">
                <b>{{$t('testSetManagement.remove_2')}}</b>
                <div style="width: 250px;float: right;">
                    <Input v-model="projectKeyword" clearable search enter-button :placeholder="$t('testSetManagement.enterName')"
                           class="search-input" @on-change="projectSearch(projectKeyword)"/>
                </div>
            </Row>
            <div style="border: 1px solid #ccc;max-height:310px;overflow: auto">
                <div class="project-list" v-for="item in allProject" :key="item.id" :class="{ active: operateTargetProject===item.id }"
                     @click="operateTargetProject=item.id;">
                    <Icon type="ios-folder-open-outline" size="18" style="margin-right: 5px"/>
                    <span>{{ item.name }}</span>
                </div>
            </div>
            <Row style="text-align: right;margin-top: 30px;">
                <Button @click="showCopyModal=false;">{{$t('public.btn_cancel')}}</Button>
                <Button type="primary" style="margin-left: 20px" @click="operateTestSet">{{$t('public.btn_ok')}}</Button>
            </Row>
        </Modal>

        <Modal v-model="showNewModal" footer-hide :closable="false" :mask-closable="false" width="420">
            <p style="margin: 12px 0 10px 0"><b>{{$t('testSetManagement.enterName')}}</b></p>
            <Input v-model="projectName" maxlength="20"></Input>
            <Row style="text-align: right;margin-top: 30px;">
                <Button @click="showNewModal=false;">{{$t('public.btn_cancel')}}</Button>
                <Button type="primary" style="margin-left: 20px" @click="newProject">{{$t('public.btn_ok')}}</Button>
            </Row>
        </Modal>

    </div>
</template>

<script>
    import utils from "../lib/utils";
    import config from "../lib/config"
    import CompTestSetList from "../components/CompTestSetList"
    import CompTestSetDetail from "../components/CompTestSetDetail"
    export default{
        components:{ CompTestSetList, CompTestSetDetail },
        data(){
            return{
                keyword:"",
                showDetail:false,
                allTestcount:0,
                showNewModal:false,
                projectName:"",
                projectIndex:-1,  //-1代表全部测试集，其余则是各个项目的id
                projectList:[],
                allProjectList:[],
                showContextMenu:false,
                projectMsg:{},    //项目点击（左右键）操作记录当前的项目信息
                isNewProject:true,
                testCount:0,
                allKeyword:"",
                username:sessionStorage.getItem('username'),
                //以 是 添 加 测 试 集 相 关 的 变 量 （ 如 有 需 要 可 打 包 成 组 件 ）
                showAddTestModal:false,
                pageSize:config.DEFAULT_PAGE_SIZE,
                offset: 0,
                testColumns:[
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: this.$t('testSetList.name'),
                        key: 'name',
                    },
                    {
                        title: this.$t('testSetList.cabinet_version_list'),
                        key: 'cabinet_version_list'
                    },
                    {
                        title: this.$t('testSetList.update_time'),
                        key: 'update_time'
                    }],
                testData:[],
                currentPage:1,
                dataTotal:0,
                selection: [],
                currentPageSelection:{},
                selectionList:{},
                allProject:[],
                projectSelected:null,
                testKeyword:"",
                // 下 面 是 测 试 集 的 移动 、 复 制 、 移 除
                showCopyModal:false,
                operateTargetProject:0,
                isCopy:true,   //true:copy ;  false:remove
                projectKeyword:""
            }
        },
        methods:{
            onOpenTestDetail(row){
                this.showDetail = true
                this.$refs.testDetail.showOther(true)
                this.$refs.testDetail.refresh(row.id)
            },
            onAddTestSet(){
                this.showDetail = true
                this.$refs.testDetail.showOther(false)
                this.$refs.testDetail.reset(this.projectIndex)
                this.$refs.testDetail.getAllProjectList()
            },
            onSaveClick(flag){
                this.showDetail = flag
                this.getProjectList()
                this.getAllTestCount()
                this.$refs.testList.refresh()
            },
            getTestCount(count){
                this.testCount = count
            },
            //  新 建 （ 重 命 名 ） 项 目
            newProject(){
                let name = this.projectName.trim()
                if(name.length===0){
                    this.$Message.warning(this.$t('testSetManagement.proWarn_1'))
                    return
                }
                if(name.length>20){
                    this.$Message.warning(this.$t('testSetManagement.proWarn_2'))
                    return
                }
                if(this.isNewProject){
                    this.$ajax.post("api/v1/cedar/test_project/",{
                        name:this.projectName.trim()
                    }).then(response=>{
                        this.$Message.success(this.$t('testSetManagement.addProSuccess'))
                        this.getProjectList()
                        this.showNewModal = false
                    }) .catch(error=>{
                        if (config.DEBUG) console.log(error)
                        if(error.response.data.name)
                            this.$Message.error({content: this.$t('testSetManagement.proWarn_3'),duration:3})
                        else
                            this.$Message.error({content: error.response.data.description,duration:5})
                    })
                }else {
                    this.$ajax.patch("api/v1/cedar/test_project/" + this.projectMsg.id + "/",{
                        name:this.projectName.trim()
                    }).then(response=>{
                        this.$Message.success(this.$t('testSetManagement.reNameSuccess'))
                        this.getProjectList()
                        this.showNewModal = false
                    }) .catch(error=>{
                        if (config.DEBUG) console.log(error)
                        if(error.response.data.name)
                            this.$Message.error({content: this.$t('testSetManagement.proWarn_3'),duration:3})
                        else
                            this.$Message.error({content: error.response.data.description,duration:5})
                    })
                }
            },
            // 删 除 项 目
            deleteProject(){
                let _this = this
                this.$Modal.confirm({
                    title:this.$t('public.modal_info'),
                    content:this.$t('testSetManagement.sureDel')+"【"+ this.projectMsg.name +"】？",
                    onOk(){
                        this.$ajax.delete("api/v1/cedar/test_project/" + _this.projectMsg.id + "/").then(response=>{
                            _this.$Message.success(_this.$t('testSetManagement.delSuccess'))
                            _this.getProjectList()
                            _this.projectIndex = -1
                        }) .catch(error=>{
                            if (config.DEBUG) console.log(error)
                            _this.$Message.error({content: error.res.data.description,duration:5})
                        })
                    }
                })
            },
            //  删 除 测 试 集
            deleteTestSet(){
                if(this.username!=='admin'){
                    this.$Message.warning({content:this.$t('testSetManagement.delTit'),duration:3})
                    return
                }
                let list = this.$refs.testList.getSelection()
                let root = this
                if(list.length===0){
                    this.$Message.warning(this.$t('testSetManagement.delOne'))
                }else{
                    this.$Modal.confirm({
                        title: this.$t('public.modal_info'),
                        content: this.$t('testSetManagement.delTit_2'),
                        onOk(){
                            let ajaxObj = [];
                            list.forEach(item=>{
                                ajaxObj.push(this.$ajax.delete("api/v1/cedar/test_gather/"+ item.id +"/"));
                            })
                            this.$ajax.all(ajaxObj)
                                .then(response=>{
                                    this.$Message.success(root.$t('testSetManagement.delSuccess_2'))
                                    root.$refs.testList.onPageChange(1)
                                    root.$refs.testList.resetSelection()
                                    root.getProjectList()
                                    root.getAllTestCount()
                                })
                                .catch(error=>{
                                    if (config.DEBUG) console.log(error)
                                    this.$Message.error({content:root.$t('testSetManagement.delFail_2')+ error.res.data.description,duration:5})
                                })
                        }
                    });
                }
            },
            // 复 制 、 移 动 、 从当 前 项 目 移 除
            menuClick(flag){
                this.isCopy = flag
                let list = this.$refs.testList.getSelection()
                if(list.length===0){
                    this.$Message.warning(this.$t('testSetManagement.delOne'))
                    return
                }
                this.getAllProjectList()
                if(this.allProject.length>0){
                    this.operateTargetProject = 0
                    this.showCopyModal = true
                    this.projectKeyword = ""
                }else
                    this.$Message.warning(this.$t('testSetManagement.copyTit'))
            },
            operateTestSet(){    // 确 认 操 作
                if(this.operateTargetProject===0){
                    this.$Message.warning(this.$t('testSetManagement.delOne'))
                    return
                }
                let list = this.$refs.testList.getSelection()
                let ids = []
                list.forEach(item=>{
                    ids.push(item.id)
                })
                let params = {}
                if(this.isCopy){
                    params = {
                        test_gather_list:ids,
                        operate:"copy",
                        target_test_project:this.operateTargetProject
                    }
                }else {
                    params = {
                        test_gather_list:ids,
                        operate:"remove",
                        source_test_project:this.projectIndex,
                        target_test_project:this.operateTargetProject
                    }
                }
                this.$ajax.post("api/v1/cedar/operate_test_gather/",params)
                .then(response=>{
                    this.showCopyModal = false
                    this.getProjectList()
                    this.$refs.testList.onPageChange(1)
                    this.$refs.testList.resetSelection()
                    this.$Message.success({content:this.$t('testSetManagement.operateSuccess_1')+response.data.change_num +this.$t('testSetManagement.operateSuccess_2'),duration:3})
                }).catch(error=>{
                    if(config.DEBUG) console.log(error)
                    if(error.response.status>=500)
                        this.$Message.error({content:this.$t('public.error_500'),duration:3})
                    else
                        this.$Message.error({content: error.response.data.description,duration:6})
                })
            },
            // 复制 /移动到项目时可搜索项目名称
            projectSearch(value,isCopy=true){
                let searchList = []
                this.projectList.forEach(item=>{
                    if(item.name.includes(value.trim())){
                        searchList.push(item)
                    }
                })
                if(isCopy){
                    if(this.projectIndex!==-1) {
                        for (let i in searchList) {
                            if (searchList[i].id === this.projectIndex) {
                                searchList.splice(i, 1)
                                break;
                            }
                        }
                    }
                    this.allProject = searchList
                }else
                    this.allProjectList = searchList
            },
            // 从 当 前 项 目 移 除
            removeTestSet(){
                let list = this.$refs.testList.getSelection()
                if(list.length===0){
                    this.$Message.warning(this.$t('testSetManagement.delOne'))
                    return
                }
                let ids = []
                list.forEach(item=>{
                    ids.push(item.id)
                })
                let _this = this
                this.$Modal.confirm({
                    title:this.$t('public.modal_info'),
                    content:this.$t('testSetManagement.removeTit'),
                    onOk(){
                        this.$ajax.post("api/v1/cedar/operate_test_gather/",{
                            test_gather_list:ids,
                            operate:"quit",
                            source_test_project:_this.projectIndex,
                        }).then(response=>{
                            _this.showCopyModal = false
                            _this.getProjectList()
                            _this.$refs.testList.onPageChange(1)
                            _this.$refs.testList.resetSelection()
                            _this.$Message.success({content:_this.$t('testSetManagement.removeSuccess'),duration:3})
                        }).catch(error=>{
                            if(config.DEBUG) console.log(error)
                            if(error.response.status>=500)
                                _this.$Message.error({content:_this.$t('public.error_500'),duration:3})
                            else
                                _this.$Message.error({content: error.response.data.description,duration:6})
                        })
                    }
                })
            },
            testSearch(value){  // 开始搜索
                value= encodeURIComponent(value.trim())
                this.$refs.testList.setKeywords(value)
            },
            // 页 面 左 边 部 分 展 示的 项 目 列 表
            getProjectList(){
                this.$ajax.get("api/v1/cedar/test_project/?fields=id,test_gather_count,name&ordering=-update_time")
                .then(response=>{
                    this.allKeyword = ""
                    this.projectList = response.data.test_project
                    this.allProjectList = response.data.test_project
                }) .catch(error=>{
                    if (config.DEBUG) console.log(error)
                    this.$Message.error({content: error.res.data.description,duration:5})
                })
            },
            getAllTestCount(){
                this.$ajax.get("api/v1/cedar/test_gather/?fields=id,name" )
                    .then(response=>{
                        this.allTestcount = response.data.test_gather.length;
                    })
                    .catch(error=>{
                        if (config.DEBUG) console.log(error)
                        this.$Message.error(this.$t('testSetManagement.getFailed'))
                    })
            },
            // 右 键 点 击 项 目
            onContextClick(msg){
                event.preventDefault()
                this.showContextMenu = true
                this.projectMsg = msg
                this.projectIndex=msg.id;
                let menu = document.querySelector('#context-menu')
                menu.style.left = event.clientX + 'px'
                menu.style.top = event.clientY + 'px'
            },
            // ---------------------     分     割     线   ------------------------ （添加测试集相关的一些方法）
            // 添 加 测 试 集 到 项 目
            onOpenAddTestModal(){
                this.showAddTestModal = true
                this.getAllProjectList()
                this.cancelTestSetList()
                this.projectSelected = null
                this.testKeyword = ""
                this.onPageChange(1)
            },
            onRowClick(row,index){
                this.$refs.addTestTable.toggleSelect(index)
            },
            addTestToProject(){  //添 加
                if(this.selection.length===0){
                    this.$Message.warning(this.$t('testSetManagement.delOne'))
                    return
                }
                let ids = []
                this.selection.forEach(item=>{
                    ids.push(item.id)
                })
                this.$ajax.post("api/v1/cedar/operate_test_gather/",{
                    test_gather_list:ids,
                    operate:"add",
                    target_test_project:this.projectIndex
                }).then(response=>{
                    this.showAddTestModal = false
                    this.getProjectList()
                    this.$refs.testList.onPageChange(1)
                    this.$refs.testList.resetSelection()
                    this.$Message.success({content:this.$t('testSetManagement.addSuccess')+response.data.change_num+this.$t('testSetManagement.operateSuccess_2'),duration:3})
                }).catch(error=>{
                    if(config.DEBUG) console.log(error)
                    if(error.response.status>=500)
                        this.$Message.error({content:this.$t('public.error_500'),duration:3})
                    else
                        this.$Message.error({content: error.response.data.description,duration:6})
                })
            },
            //获取所有项目信息    --->  剔除当前项目的其他所有项目
            getAllProjectList(){
                let arr =  _.cloneDeep(this.projectList)
                if(this.projectIndex!==-1) {
                    for (let i in arr) {
                        if (arr[i].id === this.projectIndex) {
                            arr.splice(i, 1)
                            break;
                        }
                    }
                }
                this.allProject = arr
            },
            //获取测试集列表信息 （剔除当前项目的测试集，可筛选项目，可模糊搜索）
            getTestSetList(){
                let projectCondition = ""
                if(this.projectSelected!==null)
                    projectCondition = "&test_project=" + this.projectSelected
                let keyCondition = ""
                if(this.testKeyword.trim()!=="")
                    keyCondition = "&contains=" + encodeURIComponent(this.testKeyword.trim())
                this.$ajax.get("api/v1/cedar/get_test_gather/?exclude_test_project=" + this.projectIndex +
                    "&limit=" + this.pageSize +
                    "&offset=" + this.offset +
                    projectCondition +
                    keyCondition)
                    .then(response=>{
                        this.currentPageSelection = {}
                        this.testData = response.data
                        this.dataTotal = parseInt(response.headers["total-count"])
                        this.testData.forEach(item=>{
                            item.cabinet_version_list = item.cabinet_version ? item.cabinet_version.cabinet_version_list.join(",") : ""
                            /* 将之前已经选中的选项重新勾选 */
                            this.selection.forEach(selected=>{
                                if (item.id === selected.id){
                                    item._checked = true
                                    this.$set(this.currentPageSelection, item.id, 'exist')
                                }
                            })
                        })
                    }).catch(error=>{
                        this.$Message.error({content:error.response.data.description,duration:6})
                })
            },
            // 多 选
            onSelectionChange(selection){
                selection.forEach((value) => {
                    if (this.selectionList[value.id] === undefined ) {
                        //console.log('勾选了id为' + value.id + '的job')
                        this.$set(this.selectionList, value.id, value)    //所有的已选择id  包括新选择的id
                        this.$set(this.currentPageSelection, value.id, 'exist')    //currentPageSelectedJobs  当前页已选择id
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
            // 翻 页
            onPageChange(page){
                this.offset = this.pageSize * (page-1)
                this.currentPage = page
                this.getTestSetList()
            },
            // 项 目 筛 选
            onSelectedChange(val){
                if(val===undefined)
                    this.projectSelected = null
                this.onPageChange(1)
            },
            //取 消 全 选
            cancelTestSetList(){
                this.selectionList = {}
                this.currentPageSelection = {}
                this.selection = []
                this.testData.forEach(item=>{
                    this.$set(item,"_checked",false)
                    this.$delete(item, "_checked")
                })
            }
        },
        mounted(){
            this.pageSize = utils.getPageSize();
            this.getAllTestCount()
            this.getProjectList()
        }
    }
</script>
<style scoped>
    /deep/.ivu-auto-complete.ivu-select-dropdown{
        max-height: 280px
    }
    /deep/.search-input .ivu-input-icon-clear{
        margin-right: 45px!important;
    }
    /deep/.search .ivu-input{
        border-radius: 0;
        box-shadow: none;
    }
    .layout_left {
        position: absolute;
        width: 300px;
        top: 80px;
        bottom: 10px;
        background: #fff;
    }
    .title_left{
        height: 50px;
        line-height:50px;
        padding:0 15px;
        background: #ccc
    }
    .layout_right_top{
        margin-left: 310px;
        margin-bottom: 10px;
        padding: 10px;
        height: 250px;
        background: #ff9900;
    }
    .layout_right_bottom{
        margin-left: 310px;
        padding: 10px;
        background: #fff;
    }
    .text-hidden{
        /*display: inline-block;*/
        /*vertical-align: middle;*/
        /*max-width: 200px;*/
        /*white-space: nowrap;*/
        /*text-overflow: ellipsis;*/
        /*overflow: hidden;*/
        /*word-break: break-all;*/
    }
    .project-list{
        padding: 5px 10px 5px 15px;
        cursor: pointer;
    }
    .all-pro{
        background: #f8f8f9;
    }
    .project-list:hover{
        background: #ebf7ff;
    }
    #context-menu{
        /*display: none;*/
        position: absolute;
        z-index: 100;
    }
    .active{
        background: #b6e2ff!important;
    }
</style>
