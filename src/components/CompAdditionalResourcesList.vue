<template>
    <div style="margin-left: 2px">
        <Row style="margin-bottom: 16px">
            <Col span="12">
                <Select v-model="tableList" style="width: 200px;">
                    <Option :value="1">SIM卡资源列表</Option>
                    <Option :value="2">账号资源列表</Option>
                </Select>
                <Button v-show="(tableList===1)&&(username==='admin')" type="primary" style="margin-left: 16px" @click="onOpenSimModal">添加SIM卡资源</Button>
                <Button v-show="(tableList===2)&&(username==='admin')" type="primary" style="margin-left: 16px" @click="onOpenAppModal">添加账号资源</Button>
                <Button v-show="(tableList===2)&&(username==='admin')" type="default" style="margin-left: 16px;width: 80px" @click="showCreateAppName=true">添加App</Button>
            </Col>

            <Col span="12" style="text-align: right" v-show="username==='admin'">
                <Button type="warning" style="margin-right: 16px;" @click="cancelSelected">取消选择 ( {{ selectedNum }} )</Button>
                <Dropdown trigger="click" style="margin-right: 2px;">
                    <Button>
                        更多操作
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list" style="text-align: left">
                        <Upload :action="importResourcesUrl" name="import_file" :show-upload-list="false"
                                :on-success="importResourcesSuccess" :on-error="importResourcesFailed">
                            <DropdownItem>导入资源</DropdownItem>
                        </Upload>
                        <span @click="exportResources"><DropdownItem>导出资源</DropdownItem></span>
                        <span @click="deleteMore"><DropdownItem>批量删除</DropdownItem></span>
                    </DropdownMenu>
                </Dropdown>
            </Col>
        </Row>

        <div v-if="tableList===1">
            <comp-sim-list :prop-multi-select="true" ref="simTable" @selected-count="getSelectedNum"></comp-sim-list>
        </div>
        <div v-if="tableList===2">
            <comp-app-table :prop-multi-select="true" ref="appTable" @selected-count="getSelectedNum"></comp-app-table>
        </div>

        <Modal v-model="showAddSimModal" :mask-closable="false" :footer-hide="true">
            <comp-add-sim-msg ref="addSim" @after-success="onAfterAddSim"></comp-add-sim-msg>
        </Modal>

        <Modal v-model="showAddAppModal" :mask-closable="false" :footer-hide="true">
            <comp-add-app-card-msg ref="addApp" @after-succrss="onAfterAddApp"></comp-add-app-card-msg>
        </Modal>
        <Modal v-model="showCreateAppName" footer-hide :closable="false" :mask-closable="false" width="420">
            <Input v-model="appName" style="margin-top: 16px" placeholder="请输入要添加的App名称"></Input>
            <Row style="text-align: right;margin-top: 20px;">
                <Button type="text" @click="showCreateAppName=false;appName = ''">取消</Button>
                <Button type="primary" @click="createAppName">确认</Button>
            </Row>
        </Modal>
    </div>
</template>

<script>

    import CompAppTable from "./CompAppTable";
    import CompSimList from "./CompSimList";
    import CompAddSimMsg from "./CompAddSimCardMsg"
    import CompAddAppCardMsg from "./CompAddAppCardMsg"
    import config from "../lib/config"

    export default {
        components:{ CompAppTable, CompSimList, CompAddSimMsg, CompAddAppCardMsg,  },
        data(){
            return{
                tableList:1,
                showAddSimModal:false,
                showAddAppModal:false,
                username:"",
                selectedNum:0,
                importResourcesUrl:"http://"+config.REEF_HOST+":"+config.REEF_PORT + "/api/v1/cedar/resource_import/",
                appName:"",
                showCreateAppName:false,
            }
        },
        methods:{
            onOpenSimModal(){
                this.showAddSimModal = true;
                this.$refs.addSim.reset()
            },
            onOpenAppModal(){
                this.showAddAppModal = true;
                this.$refs.addApp.reset()
            },
            onAfterAddSim(){
                this.showAddSimModal = false;
                this.$refs.simTable.getData()
            },
            onAfterAddApp(){
                this.showAddAppModal = false;
                this.$refs.appTable.getData()
            },
            //取得已选数量
            getSelectedNum(number){
                this.selectedNum = number
            },
            //取消全选
            cancelSelected(){
                if(this.tableList===1){  //sim
                    this.$refs.simTable.resetSimList()
                }else if(this.tableList===2) {   //app
                    this.$refs.appTable.resetAppList()
                }
            },
            //批量删除
            deleteMore(){
                if(this.tableList===1){  //sim
                    let sims = this.$refs.simTable.getThisSelection()
                    if(sims.length===0){
                        this.$Message.info("请选择要删除的SIM卡资源！")
                        return
                    }
                    let _this = this
                    this.$Modal.confirm({
                        title:"警告！",
                        content:"确认要删除已选择的资源吗？",
                        onOk(){
                            let ajaxObj = [];
                            sims.forEach(info=>{
                                ajaxObj.push(_this.$ajax.delete("api/v1/cedar/simcard/" + info.id + "/"))
                            })
                            _this.$ajax.all(ajaxObj)
                                .then(response=>{
                                    _this.$Message.success("SIM卡资源删除成功！")
                                    _this.$refs.simTable.resetSimList()
                                    _this.$refs.simTable.getData()

                                }).catch(error=>{
                                    if (config.DEBUG) console.log(error)
                                    _this.$refs.simTable.resetSimList()
                                    _this.$Message.error({content:"SIM卡资源删除失败;"+error.response.data.message,duration:7})
                            })
                        }
                    })
                }else if(this.tableList===2) {   //app
                    let apps = this.$refs.appTable.getThisSelection()
                    if(apps.length===0){
                        this.$Message.info("请选择要删除的APP账号资源！")
                        return
                    }
                    let _this = this
                    this.$Modal.confirm({
                        title:"警告！",
                        content:"确认要删除已选择的资源吗？",
                        onOk(){
                            let ajaxObj = [];
                            apps.forEach(info=>{
                                ajaxObj.push(_this.$ajax.delete("api/v1/cedar/account/" + info.id + "/"))
                            })
                            _this.$ajax.all(ajaxObj)
                                .then(response=>{
                                    _this.$Message.success("app账号资源删除成功！")
                                    _this.$refs.appTable.resetAppList()
                                    _this.$refs.appTable.getData()
                                }).catch(error=>{
                                if (config.DEBUG) console.log(error)
                                    _this.$refs.appTable.resetAppList()
                                    _this.$Message.error({content:"app账号资源删除失败;"+error.response.data.message,duration:7})
                            })
                        }
                    })
                }
            },
            //导入资源 success/ fail
            importResourcesSuccess(response, file, fileList){
                this.$Message.success("资源导入成功！")
                if(this.tableList===1) {  //sim
                    this.$refs.simTable.resetSimList()
                    this.$refs.simTable.getData()
                }else if(this.tableList===2) {   //app
                    this.$refs.appTable.resetAppList()
                    this.$refs.appTable.getData()
                }
            },
            importResourcesFailed(error, file, ){  // 两个参数对应的是=>Error/response
                if (config.DEBUG) console.log(error);
                if(this.tableList===1) {  //sim
                    this.$refs.simTable.resetSimList()
                }else if(this.tableList===2) {   //app
                    this.$refs.appTable.resetAppList()
                }
                this.$Notice.error({
                    title: '资源导入失败！',
                    desc:  file.data_info.join("<br>"),
                    duration: 60
                });
            },
            //导出资源数据
            exportResources(){
                if(this.tableList===1){  //sim
                    let sims = this.$refs.simTable.getThisSelection()
                    if(sims.length===0){
                        this.$Message.info("请选择需要导出的SIM卡资源！")
                        return
                    }
                    let simIds = []
                    sims.forEach(info=>{
                        simIds.push(info.id)
                    })
                    console.log(sims)
                    let _this = this
                    this.$Modal.confirm({
                        title:"提示！",
                        content:"确认要导出已选择的SIM卡资源吗？",
                        onOk(){
                            _this.$ajax.post("api/v1/cedar/resource_export/",{
                                resource_type: "SIMCard",
                                sim_card: simIds
                            }).then(response=>{
                                console.log(response.data)
                                window.open("http://"+config.REEF_HOST+":"+config.REEF_PORT + response.data)
                                _this.$Message.success("正在导出...")
                                _this.$refs.simTable.resetSimList()
                                _this.$refs.simTable.getData()
                            }).catch(error=>{
                                if (config.DEBUG) console.log(error)
                                _this.$refs.simTable.resetSimList()
                                _this.$Message.error({content:"SIM卡资源导出失败;"+error.response.data.message,duration:7})
                            })
                        }
                    })

                }else if(this.tableList===2) {   //app
                    let apps = this.$refs.appTable.getThisSelection()
                    if(apps.length===0){
                        this.$Message.info("请选择需要导出的APP账号资源！")
                        return
                    }
                    let appsIds = []
                    apps.forEach(info=>{
                        appsIds.push(info.id)
                    })
                    let _this = this
                    this.$Modal.confirm({
                        title:"提示！",
                        content:"确认要导出已选择的账号资源吗？",
                        onOk(){
                            _this.$ajax.post("api/v1/cedar/resource_export/",{
                                resource_type: "Account",
                                account: appsIds
                            }).then(response=>{
                                window.open("http://"+config.REEF_HOST+":"+config.REEF_PORT + response.data)
                                _this.$Message.success("正在导出...")
                                _this.$refs.appTable.resetAppList()
                                _this.$refs.appTable.getData()
                            }).catch(error=>{
                                if (config.DEBUG) console.log(error)
                                _this.$refs.appTable.resetAppList()
                                _this.$Message.error({content:"app账号资源导出失败;"+error.response.data.message,duration:7})
                            })
                        }
                    })
                }
            },
            createAppName(){
                if(this.appName.trim().length===0){
                    this.$Message.warning("请输入要添加的App名称！")
                    return
                }
                this.$ajax.post("api/v1/cedar/appgather/",{
                    name:this.appName
                }).then(response=>{
                    this.showCreateAppName = false
                    this.$Message.success("App名称添加成功")
                    this.$refs.addApp.getAppNameList()
                    this.$refs.appTable.getAppNameList()
                }).catch(error=>{
                    if(error.response.data.name){
                        this.$Message.error({content:error.response.data.name.join(","),duration:5})
                    }else {
                        this.$Message.error("App名称添加失败")
                    }
                })

            }
        },
        watch:{
            tableList:{
                handler: function(val){
                    this.selectedNum = 0
                },
                immediate: true
            }
        },
        mounted(){
            this.username = sessionStorage.getItem('username');
        }
    }
</script>

<style>
    .ivu-notice{
        width: 385px!important;
    }
</style>
<style scoped>
    /deep/.ivu-modal-close{
        margin: 18px;
    }

</style>
