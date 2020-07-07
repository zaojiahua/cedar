<template>
    <div style="margin-left: 2px">
        <Row style="margin-bottom: 15px;">
            <span>设备情况：</span>
            <Tag type="dot" color="#CBD0D3">暂无设备</Tag>
            <Tag type="dot" color="#85D700">正常</Tag>
            <Tag type="dot" color="#D04B40"><span style="padding: 10px 0" @click="openErrorDevice=true">异常 ( {{ errorCount }} )</span></Tag>
        </Row>
        <div v-for="(item,index) in paneList" :key="index" class="pane-list">
            <comp-pane-card v-if="item.type==='matrix'" :prop-pane="item" :prop-index="index" @remove-pane="onRemovePane"  @on-add-device="onAddDevice" @after-remove-pane-slot="afterRemovePaneSlot"></comp-pane-card>
            <CompMechanicalArmCard v-if="item.type==='test_box'"  :prop-pane="item" :prop-index="index" @remove-pane="onRemovePane"  @on-mechanical-arm-add-device="onMechanicalArmAddDevice" @after-remove-pane-slot="afterRemovePaneSlot"></CompMechanicalArmCard>
        </div>
        <div class="add-pane">
            <Icon type="ios-add" size="180" style="cursor: pointer;margin: 35px auto;" @click="onOpenModal"/>
            <p>添加Pane</p>
        </div>

        <Modal v-model="showAddPane" :closable="false" :footer-hide="true" :mask-closable="false" width="550">
            <Card>
                <p slot="title">添加Pane</p>
                <Icon slot="extra" @click.prevent="showAddPane=false;" type="md-close" />
                <Form :model="pane" :label-width="100">
                    <FormItem>
                        <b slot="label">选择机柜：</b>
                        <Select v-model="CabinetSelected" style="width:150px">
                            <Option v-for="item in cabinetList" :value="item.id">{{ item.cabinet_name}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem>
                        <b slot="label">Pane名称：</b>
                        <Input v-model="pane.pane_name" placeholder=" 例： pane001@2X3" v-show="paneType==='matrix'"></Input>
                        <Input v-model="pane.pane_name" placeholder="请输入pane名称" v-show="paneType==='test_box'"></Input>
                        <p v-show="paneType==='matrix'">
                            注：名称由字母、数字或下划线组成，不允许输入特殊字符<br/>
                            格式：名称 @ 规格行 X 规格列，最大规格不能超过 7 x 9
                        </p>
                    </FormItem>
                    <FormItem v-show="paneType==='test_box'">
                        <b slot="label">机械臂：</b>
                        <Input v-model="pane.robot_arm" placeholder="请输入机械臂的串口号"></Input>
                    </FormItem>
                    <FormItem v-show="paneType==='test_box'">
                        <b slot="label">相机：</b>
                        <InputNumber :min="0" v-model="pane.camera" style="width: 100%" placeholder="请输入相机的串口号"></InputNumber>
                    </FormItem>
                    <FormItem>
                        <b slot="label">类型：</b>
                        <RadioGroup v-model="paneType" type="button">
                            <Radio label="matrix" class="pane-type">matrix</Radio>
                            <Radio label="test_box" class="pane-type">Test Box</Radio>
                        </RadioGroup>
                    </FormItem>
                </Form>
                <p style="text-align: center">
                    <Button type="primary" @click="addPane">提交</Button>
                </p>
            </Card>
        </Modal>
        <Modal v-model="openModal" :footer-hide="true" :mask-closable="false" width="450">
            <p style="font-size: 16px;margin: 0 0 5px;">注：请在灰色位置区域添加要添加的设备！</p>
            <comp-pane-card :prop-pane="propPane" :prop-show-remove-btn="false" @on-slot-click="onSlotClick"></comp-pane-card>
        </Modal>

        <Modal v-model="openDevice" fullscreen :mask-closable="false" :closable="false" @on-ok="setDevice">
            <comp-device-list v-if="openDevice" ref="selectDevice" :prop-device-slot="true" :prop-high-light="true" :prop-add-mode="false"
                              :prop-device-status="true" :prop-cabinet="cabinetId"
                              @on-row-click="onSelectDeviceModalRowClick"></comp-device-list>
        </Modal>

        <Modal v-model="openErrorDevice" fullscreen :mask-closable="false" :closable="false">
            <comp-device-list ref="errorDevice" :prop-device-slot-error="true" :prop-add-mode="false"
                              @on-row-click="onErrorDeviceRowClick">
                <Drawer slot="detail" v-model="showDeviceDetail" :transfer="false" :inner="true" :draggable="true" :closable="false" width="50">
                    <comp-device-detail ref="deviceDetail"></comp-device-detail>
                </Drawer>
            </comp-device-list>
            <div slot="footer">
                <Button type="primary" @click="openErrorDevice=false;showDeviceDetail=false;">返回</Button>
            </div>
        </Modal>
        <Modal v-model="showConfirmModal" :closable="false" :footer-hide="true" :mask-closable="false">
            <Card>
                <p slot="title" style="font-weight: bold">确认机型属性</p>
                <Icon slot="extra" @click.prevent="showConfirmModal=false" type="md-close" />
                <Form :model="pane" :label-width="100">
                    <FormItem>
                        <b slot="label">手机型号：</b>
                        <Input disabled v-model="phoneModel.phone_model_name" class="disabled-input"></Input>
                    </FormItem>
                    <FormItem>
                        <b slot="label">Xdpi：</b>
                        <Input disabled v-model="phoneModel.x_dpi" class="disabled-input"></Input>
                    </FormItem>
                    <FormItem>
                        <b slot="label">Ydpi：</b>
                        <Input disabled v-model="phoneModel.y_dpi" class="disabled-input"></Input>
                    </FormItem>
                    <FormItem>
                        <b slot="label">X边框厚度：</b>
                        <Input disabled v-model="phoneModel.x_border" class="disabled-input"></Input>
                    </FormItem>
                    <FormItem>
                        <b slot="label">Y边框厚度：</b>
                        <Input disabled v-model="phoneModel.y_border" class="disabled-input"></Input>
                    </FormItem>
                </Form>
                <p style="text-align: center">
                    <Button @click="showConfirmModal=false" style="margin-right: 50px;width: 100px">取消</Button>
                    <Button type="primary" @click="onConfirmDevice" style="width: 100px">确认</Button>
                </p>
                <Spin v-show="showSpin" fix size="large"></Spin>
            </Card>
        </Modal>


    </div>

</template>

<script>

    import CompPaneCard from "./CompPaneCard"
    import config from "../lib/config"
    import CompDeviceList from "../components/CompDeviceList";
    import CompDeviceDetail from "../components/CompDeviceDetail"
    import CompMechanicalArmCard from "../components/CompMechanicalArmCard"



    export default {
        components:{ CompPaneCard ,CompDeviceList,CompDeviceDetail, CompMechanicalArmCard },
        data(){
            return{
                paneList:[],
                showAddPane:false,
                paneType:"matrix",
                pane:{
                    pane_name:"",
                    robot_arm:"",
                    camera:null,
                },
                propPane:{},
                openModal:false,
                paneIndex:null,
                openDevice:false,
                selectDevice:null,
                slotKey:"",
                slotId:null,
                errorCount:0,
                openErrorDevice:false,
                showDeviceDetail:false,
                cabinetList:"",
                CabinetSelected:null,
                cabinetId:null,
                showSpin:false,
                showConfirmModal:false,
                phoneModel:{
                    id: null,
                    phone_model_name: "",
                    x_border: null,
                    y_border: null,
                    x_dpi: null,
                    y_dpi: null,
                }
            }
        },
        methods:{
            refresh(){
                this.$ajax.get("api/v1/cedar/get_paneview/")
                    .then(response=>{
                        let paneList = response.data
                        response.data.forEach(paneListObj=>{
                            let slotList = [];
                            paneListObj.paneslots.forEach(item=>{
                                let key = item.row + ',' + item.col
                                slotList[key] = item
                            })
                            this.$set(paneListObj, 'slotList' , slotList )
                        })
                        this.paneList = paneList;
                    }).catch(error=>{
                        if(config.DEBUG) console.log(error)
                        this.$Message.error("取得paneView信息列表失败")
                })
                this.getErrorCount()
            },

            //添加pane
            addPane(){
                if(this.pane.pane_name.replace(/\s+/g,"").length === 0){
                    alert('请输入项目名称！')
                    return
                }
                if(this.CabinetSelected===null){
                    alert('请选择机柜！')
                    return
                }
                if(this.paneType==="matrix"){
                    //去除前后两端的空格
                    this.pane.pane_name = this.pane.pane_name.replace(/(^\s*)|(\s*$)/g, "");
                    if(!/^\w+@[1-7](x|X)[1-9]$/.test(this.pane.pane_name)){
                        this.$Message.error('格式错误')
                        return
                    }
                    let str = this.pane.pane_name.split("@")
                    let size = str[1].replace("X","x").split("x")

                    this.$ajax.post("api/v1/cedar/create_paneview/",{
                        name:this.pane.pane_name,
                        type:this.paneType,
                        cabinet:this.CabinetSelected,
                        width:parseInt(size[1]),
                        height:parseInt(size[0]),
                        ret_level:0
                    }).then(response=>{
                        this.refresh()
                        this.getCabinet()
                        this.showAddPane = false
                    }).catch(error=>{
                        if(config.DEBUG) console.log(error)
                        if(error.status===400)
                            this.$Message.error("该项目名称已存在，请重新输入！")
                        else
                            this.$Message.error("项目添加失败,请检查后再重新添加！")
                    })
                }else if(this.paneType==="test_box") {
                    let paramObj = {
                        name:this.pane.pane_name,
                        type:this.paneType,
                        cabinet:this.CabinetSelected,
                        width:1,
                        height:1,
                        robot_arm:this.pane.robot_arm,
                    }
                    if(this.pane.camera!==null){
                        paramObj["camera"] = this.pane.camera
                    }

                    this.$ajax.post("api/v1/cedar/create_test_box_paneview/",paramObj)
                        .then(response=>{
                            this.refresh()
                            this.getCabinet()
                            this.showAddPane = false
                        }).catch(error=>{
                            if(config.DEBUG) console.log(error)
                            this.$Message.error("项目添加失败,请检查后再重新添加！")
                        })
                }
            },
            onOpenModal(){
                this.showAddPane=true;
                this.pane.pane_name = "";
                this.paneType = "matrix";
                this.pane.robot_arm = "";
                this.pane.camera = null;
            },
            onRemovePane(index){
                this.paneList.splice(index,1)
                this.getCabinet()
            },
            //基于pane添加device
            onAddDevice(paneObj,index){
                this.paneIndex = index
                this.openModal = true;
                this.propPane = this.paneList[index];
            },
            //基于机械臂添加device
            onMechanicalArmAddDevice(paneObj,index){
                this.paneIndex = index
                this.cabinetId = paneObj.cabinet
                this.slotId = paneObj.paneslots[0].id
                this.openDevice = true
                this.slotKey = "1,1"
            },
            onSlotClick(row,col,id){
                let key = row + "," + col
                this.slotKey = key
                this.slotId = id
                if(this.paneList[this.paneIndex].slotList[key].status!=="empty"){
                    this.$Message.info("该区域已有设备，请在未放置设备区域添加设备！")
                    return
                }
                let root = this;
                let x = row+1;
                let y = col+1;
                this.$Modal.confirm({
                    title:"提示：",
                    content:"您确定要在该位置("+ x + "," + y +")处添加设备吗？",
                    onOk(){
                        root.cabinetId = root.paneList[root.paneIndex].cabinet
                        root.openDevice = true
                    }
                })
            },
            setDevice(){
                if(this.paneList[this.paneIndex].type==="test_box"){
                    this.showConfirmModal = true
                    this.$ajax.get("api/v1/cedar/device/"+ this.selectDevice +"/?fields=" +
                        "phone_model,phone_model.id,phone_model.phone_model_name," +
                        "phone_model.x_border,phone_model.y_border,phone_model.x_dpi,phone_model.y_dpi"
                    ).then(response=>{
                        this.phoneModel = response.data.phone_model
                    }).catch(error=>{
                        if(config.DEBUG) console.log(error)
                        this.$Message.error("获取机型信息失败")
                    })
                    return
                }
                if(this.selectDevice!==null){
                    let str = "添加设备成功，请继续添加或关闭弹窗！"
                    this.sendRequest(str)
                }
            },
            onConfirmDevice(){
                if(this.phoneModel.x_border===null||this.phoneModel.y_border===null||this.phoneModel.x_dpi===null||this.phoneModel.y_dpi===null){
                    this.$Message.warning("机型属性不能为空，请先设置再进行绑定")
                    return
                }
                let str = "添加设备成功！"
                this.sendRequest(str)
            },
            sendRequest(str){
                this.showSpin = true
                let paneId = this.paneList[this.paneIndex].id
                this.$ajax.post("api/v1/cedar/link_paneview_device/",{
                    paneslot: this.slotId,
                    device: this.selectDevice,
                    paneview: paneId,
                    ret_level: 1
                }).then(response=>{
                    let slotListItem = this.paneList[this.paneIndex].slotList[this.slotKey];
                    this.$set(slotListItem,"device",response.data.device)
                    this.$set(slotListItem,"status",response.data.status)
                    this.showSpin = false
                    this.showConfirmModal = false
                    this.$Message.success(str)
                }).catch(error=>{
                    if (config.DEBUG) console.log(error)
                    this.showSpin = false
                    this.$Message.error("添加设备失败")
                })
            },
            onSelectDeviceModalRowClick(row){
                this.selectDevice = row.id
            },
            afterRemovePaneSlot(){
                this.refresh()
            },
            onErrorDeviceRowClick(row) {
                this.showDeviceDetail = true
                this.$refs.deviceDetail.refresh(row.id)
            },
            getErrorCount(){
                this.$ajax.get("api/v1/cedar/device/?fields=id&paneslot__isnull=False&status=error")
                    .then(response=>{
                        this.errorCount = response.headers["total-count"]
                    })
                    .catch(error=>{
                        if(config.DEBUG) console.log(error)
                        this.$Message.error("获取异常数据失败")
                    })
            },
            getCabinet() {
                this.$ajax.get("api/v1/cedar/cabinet/?fields=ip_address,cabinet_name,id&paneview__isnull=True")
                    .then(response => {
                        this.cabinetList = response.data.cabinets
                    })
                    .catch(error => {
                        if (config.DEBUG) console.log(error)
                        this.$Message.error("取得机柜信息出错")
                    })
            }
        },
        mounted(){
            this.refresh();
            this.getCabinet()
        }
    }
</script>


<style scoped>
    .pane-list{
        position:relative;
        float:left;
        width: 420px;
        height: 400px;
        margin:0 20px 20px 0;
    }
    .add-pane{
        float: left;
        width: 420px;
        height: 350px;
        text-align: center;
        padding-top: 30px;
        margin-left: 2px;
        color: #02A7F0;
        border:1px solid #02A7F0;
    }
    .pane-type{
        margin-right: 20px!important;
        border-radius: 5px!important;
    }
    .disabled-input >>> input {
        background-color: #0000;
        color: #515a6e;
        border: #eee dotted 1px;
    }
</style>







