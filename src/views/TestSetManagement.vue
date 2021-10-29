<template>
    <div>
        <div class="layout_left">
            <Row class="title_left">
                <b>项目列表</b>
                <!--<Button size="small" style="float: right;margin-top: 14px;color: #1bbc9c">新建项目</Button>-->
            </Row>
            <Row style="padding: 10px;margin-left: 24px">
                <Icon type="ios-folder-open-outline" size="18" style="font-weight: bold;margin-right: 5px"/>
                <b>全部测试集（{{ allTestNameList.length }}）</b>
            </Row>

        </div>
        <!--<div class="layout_right_top">-->

        <!--</div>-->
        <div class="layout_right_bottom">
            <Row style="height: 50px;line-height: 50px;">
                <Col span="4">
                    <span style="padding-left: 5px;border-left: 3px solid #1bbc9c">测试集列表</span>
                </Col>
                <Col span="20" style="text-align: right">
                    <Button type="primary" style="margin-right: 10px;" @click="onAddTestSet">新建测试集</Button>
                    <!--<Button style="margin-right: 10px;">添加测试集</Button>-->
                    <Dropdown trigger="click" style="margin-right: 10px;">
                        <Button>
                            更多操作
                            <Icon type="ios-arrow-down"></Icon>
                        </Button>
                        <DropdownMenu slot="list" style="text-align: left">
                            <!--<span><DropdownItem>移动</DropdownItem></span>-->
                            <!--<span><DropdownItem>复制</DropdownItem></span>-->
                            <span @click="deleteTestSet"><DropdownItem>删除</DropdownItem></span>
                        </DropdownMenu>
                    </Dropdown>
                    <AutoComplete style="width:250px;text-align: left"
                                   v-model="keyword"
                                   :clearable="true"
                                   @on-select="testSearch"
                                   @on-search="handleSearch"
                                   @on-clear="clearSearch"
                                   @keyup.enter.native="testSearch(keyword)"
                                   placeholder="请输入要查找的测试集名称">
                        <Option v-for="(item,index) in filterNameList" :value="item" :key="index">{{ item }}</Option>
                    </AutoComplete>
                    <Button style="height: 32px;" type="primary" @click="testSearch(keyword)">search</Button>
                </Col>
            </Row>
            <comp-test-set-list ref="testList" @on-row-click="onOpenTestDetail"></comp-test-set-list>
        </div>

        <Drawer v-model="showDetail" :draggable="true" :closable="false" width="50">
            <comp-test-set-detail ref="testDetail" @on-save="onSaveClick"></comp-test-set-detail>
        </Drawer>

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
                filterNameList: [],  // 跟输入的想匹配的
                allTestNameList:[],  //所有的
                pageSize:config.DEFAULT_PAGE_SIZE,
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
                this.$refs.testDetail.reset()
            },
            onSaveClick(flag){
                this.showDetail = flag
                this.$refs.testList.refresh()
                this.getJobNameList()
            },
            deleteTestSet(){
                let list = this.$refs.testList.getSelection()
                let root = this
                if(list.length===0){
                    this.$Modal.confirm({
                        title: "提示",
                        content: "请选择要删除的测试集！"
                    });
                }else{
                    this.$Modal.confirm({
                        title: "提示！",
                        content: "您确定要删除这些测试集吗?",
                        onOk(){
                            let ajaxObj = [];
                            list.forEach(item=>{
                                ajaxObj.push(this.$ajax.delete("api/v1/cedar/test_gather/"+ item.id +"/"));
                            })
                            this.$ajax.all(ajaxObj)
                                .then(response=>{
                                    this.$Message.success("测试集删除成功！")
                                    root.$refs.testList.onPageChange(1)
                                    root.$refs.testList.resetSelection()
                                    root.getJobNameList()
                                })
                                .catch(error=>{
                                    if (config.DEBUG) console.log(error)
                                    this.$Message.error({content:"测试集删除失败，请刷新页面重试！"+ error.res.data.description,duration:5})
                                })
                        }
                    });
                }
            },
            //以下是搜索准备条件
            getJobNameList(){
                this.$ajax.get("api/v1/cedar/test_gather/?fields=id,name" )
                    .then(response=>{
                        let nameList = [];
                        response.data.test_gather.forEach(item=>{
                            nameList.push(item.name)
                        })
                        this.allTestNameList = nameList;
                    })
                    .catch(error=>{
                        if (config.DEBUG) console.log(error)
                        this.$Message.error("用例名称获取失败")
                    })
            },
            handleSearch (value) {  //搜索补全项的时候调用//输入框输入实时改变option
                let list = [];
                if(this.allTestNameList.toString().toUpperCase().indexOf(value.toUpperCase())!==-1){
                    this.allTestNameList.forEach(item=>{
                        if(item.toUpperCase().indexOf(value.toUpperCase())!==-1)
                            list.push(item)
                    })
                }
                this.filterNameList = list
            },
            testSearch(value){  // 开始搜索
                if(value.indexOf("&")!==-1){
                    value = value.replace(/\&/g,"%26")
                }
                value= encodeURIComponent(value)
                this.$refs.testList.setKeywords(value)
            },
            clearSearch(){
                this.$refs.testList.setKeywords()
            },
        },
        mounted(){
            this.pageSize = utils.getPageSize();
            this.getJobNameList()
        }
    }
</script>
<style scoped>
    /deep/.ivu-auto-complete.ivu-select-dropdown{
        max-height: 280px
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
        height: 250px;
        padding: 10px;
        background: #fff;
    }
</style>
