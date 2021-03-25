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
                            格式：名称 @ 规格行 X 规格列，最大规格不能超过 9 x 9
                        </p>
                    </FormItem>
<!--                    <FormItem v-show="paneType==='test_box'">-->
<!--                        <b slot="label">机械臂：</b>-->
<!--                        <Input v-model="pane.robot_arm" placeholder="请输入机械臂的串口号"></Input>-->
<!--                    </FormItem>-->
<!--                    <FormItem v-show="paneType==='test_box'">-->
<!--                        <b slot="label">相机：</b>-->
<!--                        <InputNumber :min="0" v-model="pane.camera" style="width: 100%" placeholder="请输入相机的串口号"></InputNumber>-->
<!--                    </FormItem>-->
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
                              :prop-device-status="true" :prop-cabinet="cabinetId" :prop-show-cabinet-select="false"
                              @on-row-click="onSelectDeviceModalRowClick"></comp-device-list>
        </Modal>

        <Modal v-model="openErrorDevice" v-if="openErrorDevice" fullscreen :mask-closable="false" :closable="false">
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
        <Modal v-model="showConfirmModal" :closable="false" :footer-hide="true" :mask-closable="false" width="80">
            <!-- <Card>
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
            </Card> -->

            <div class="container">
                <div class="panel">
                    <h4 style="font-weight: bold; font-size: 2rem; margin-bottom: 20px;">确认机型属性</h4>
                    <Form :model="pane" :label-width="100">
                        <FormItem>
                            <b slot="label">屏幕边框：</b>
                            <div class="input-box">
                                <Input disabled v-model="phoneModel.inner_top_left" class="disabled-input"></Input>&mdash;
                                <Input disabled v-model="phoneModel.inner_bottom_right" class="disabled-input"></Input>
                                <div v-show="phoneModel.inner_top_left && phoneModel.inner_bottom_right">
                                    <Button icon="ios-eye-outline" v-show="showScreenArea" @click="showScreenArea=!showScreenArea"></Button>
                                    <Button icon="ios-eye-off-outline" v-show="!showScreenArea" @click="showScreenArea=!showScreenArea"></Button>
                                </div>
                            </div>
                        </FormItem>
                        <FormItem>
                            <b slot="label">手机边框：</b>
                            <div class="input-box">
                                <Input disabled v-model="phoneModel.outer_top_left" class="disabled-input"></Input>&mdash;
                                <Input disabled v-model="phoneModel.outer_bottom_right" class="disabled-input"></Input>
                                <div v-show="phoneModel.outer_top_left && phoneModel.outer_bottom_right">
                                    <Button icon="ios-eye-outline" v-show="showPhoneArea" @click="showPhoneArea=!showPhoneArea"></Button>
                                    <Button icon="ios-eye-off-outline" v-show="!showPhoneArea" @click="showPhoneArea=!showPhoneArea"></Button>
                                </div>
                            </div>
                        </FormItem>
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
                    </Form>
                    <div class="panel__footer">
                        <Button size="large" class="panel_btn" @click="showConfirmModal=false">取消</Button>
                        <Button size="large" type="success" class="panel_btn" @click="saveAreaInfo">完成</Button>
                    </div>
                </div>
                <div class="area-selector">
                    <div class="area-selector__header">
                        <h4 style="font-weight: bold; font-size: 2em;">请在图中框选手机边框与屏幕边框</h4>
                        <p class="area-selector_desc">按下鼠标按键并拖动来框选区域，按下Ctrl可遮罩图片外的内容</p>
                    </div>
                    <div class="area-selector__main">
                        <div class="area-selector__loading" v-if="!imgSrc">
                            <h5 class="title">请打开柜门，确保光线充足</h5>
                            <div class="loading">
                                <div class="loading__item"></div>
                                <div class="loading__item"></div>
                                <div class="loading__item"></div>
                                <div class="loading__desc">正在努力获取图像...</div>
                            </div>
                        </div>
                        <AreaSelector
                            v-else
                            :imgSrc="imgSrc"
                            @on-select="selectArea"
                            @on-load="setImgInfo"
                        ></AreaSelector>
                    </div>
                </div>
                <div class="coordinate-confirm">
                    <div class="top">
                        <Button type="success" long @click="setBorder('screen')">屏幕边框</Button>
                        <Button type="success" long @click="setBorder('phone')">手机边框</Button>
                        <Button type="success" long @click="showAllAreas=!showAllAreas">{{showAllAreas ? "关闭所有区域" : "显示所有区域"}}</Button>
                    </div>
                    <Button type="success" long @click="getImg">重新获取图片</Button>
                </div>
            </div>
        </Modal>


    </div>

</template>

<script>

    import CompPaneCard from "./CompPaneCard"
    import config from "../lib/config"
    import CompDeviceList from "../components/CompDeviceList";
    import CompDeviceDetail from "../components/CompDeviceDetail"
    import CompMechanicalArmCard from "../components/CompMechanicalArmCard"
    import AreaSelector from "../components/common/AreaSelector"
    import Utils from "../lib/utils"
import JobManagementVue from '../views/JobManagement.vue';



    export default {
        components:{ CompPaneCard ,CompDeviceList,CompDeviceDetail, CompMechanicalArmCard, AreaSelector },
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
                    x_dpi: null,
                    y_dpi: null,
                    outer_top_left: "",
                    outer_bottom_right: "",
                    inner_top_left: "",
                    inner_bottom_right: ""
                },
                areaInfo: {
                    pane_view: 0,
                    phone_model: 0,
                    outside_upper_left_x: 0,
                    outside_upper_left_y: 0,
                    outside_under_right_x: 0,
                    outside_under_right_y: 0,
                    inside_upper_left_x: 0,
                    inside_upper_left_y: 0,
                    inside_under_right_x: 0,
                    inside_under_right_y: 0
                },
                coordinate: null,
                cabinetIP: null,
                imgSrc: null,
                imgInfo: null,
                showScreenArea: false,
                showPhoneArea: false,
                showAllAreas: false,
                // cameraId: null,
                // armId: null,
                deviceLabel: null
            }
        },
        watch: {
            areaInfo: {
                handler: function(val) {
                    if (this.showScreenArea) {
                        this.showSelectedArea("ScreenArea", val.inside_upper_left_x, val.inside_upper_left_y, val.inside_under_right_x, val.inside_under_right_y)
                    }
                    if (this.showPhoneArea) {
                        this.showSelectedArea("PhoneArea", val.outside_upper_left_x, val.outside_upper_left_y, val.outside_under_right_x, val.outside_under_right_y)
                    }
                    if (this.areaInfo.outside_upper_left_x !== 0 && this.areaInfo.inside_under_right_x !== 0) {
                        this.phoneModel.outer_top_left = `${val.outside_upper_left_x},${val.outside_upper_left_y}`
                        this.phoneModel.outer_bottom_right = `${val.outside_under_right_x},${val.outside_under_right_y}`
                        this.phoneModel.inner_top_left = `${val.inside_upper_left_x},${val.inside_upper_left_y}`
                        this.phoneModel.inner_bottom_right = `${val.inside_under_right_x},${val.inside_under_right_y}`
                    }

                },
                deep: true,
                immediate: true
            },
            showScreenArea(val) {
                if (val) {
                    if (this.showPhoneArea) this.showAllAreas = val
                    if (this.areaInfo.inside_upper_left_x !== this.areaInfo.inside_under_right_x) {
                        this.showSelectedArea("ScreenArea", this.areaInfo.inside_upper_left_x, this.areaInfo.inside_upper_left_y, this.areaInfo.inside_under_right_x, this.areaInfo.inside_under_right_y)
                    }
                } else {
                    if (!this.showPhoneArea) this.showAllAreas = val
                    let selector = document.querySelector('.selector')
                    let area = document.querySelector('.screenarea')
                    if (area) selector.removeChild(area)
                }
            },
            showPhoneArea(val) {
                if (val) {
                    if (this.showScreenArea) this.showAllAreas = val
                    if (this.areaInfo.outside_upper_left_x !== this.areaInfo.outside_under_right_x) {
                        this.showSelectedArea("PhoneArea", this.areaInfo.outside_upper_left_x, this.areaInfo.outside_upper_left_y, this.areaInfo.outside_under_right_x, this.areaInfo.outside_under_right_y)
                    }
                } else {
                    if (!this.showScreenArea) this.showAllAreas = val
                    let selector = document.querySelector('.selector')
                    let area = document.querySelector('.phonearea')
                    if (area) selector.removeChild(area)
                }
            },
            showAllAreas(val) {
                this.showScreenArea = val
                this.showPhoneArea = val
            },
            phoneModel: {
                handler: function(newVal, oldVal) {
                    if (this.areaInfo.outside_upper_left_x === this.areaInfo.outside_under_right_x) {
                         this.$ajax.get(`/api/v1/cedar/control_device_cut_coordinate/?pane_view=${this.paneList[this.paneIndex].id}&phone_model=${newVal.id}`)
                        .then(res => {
                            Object.assign(this.areaInfo, res.data[0])
                        }).catch(err => {
                            console.log(err)
                        })
                    }
                },
                deep: true
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
                    if(!/^\w+@[1-9](x|X)[1-9]$/.test(this.pane.pane_name)){
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
                        // robot_arm:this.pane.robot_arm,
                    }
                    // if(this.pane.camera!==null){
                    //     // todo pass throuth "pane.camera" to coral when request for picture
                    //     paramObj["camera"] = this.pane.camera
                    // }

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
            async setDevice() {
                if (this.paneList[this.paneIndex].type === "test_box")
                {
                    // await this.$ajax.get("api/v1/cedar/paneview?id=" + this.paneList[this.paneIndex].id)
                    //     .then(res => {
                    //         this.cameraId = res.data.paneview[0].camera
                    //         this.armId = res.data.paneview[0].robot_arm
                    //     })
                    await this.$ajax.get("api/v1/cedar/device/" + this.selectDevice + "/?fields=" +
                        "cabinet,cabinet.ip_address,phone_model,phone_model.id,phone_model.phone_model_name," +
                        "phone_model.x_border,phone_model.y_border,phone_model.x_dpi,phone_model.y_dpi"
                    ).then(response => {
                        Object.assign(this.phoneModel, response.data.phone_model)
                        this.cabinetIP = response.data.cabinet.ip_address
                    }).catch(error => {
                        if (config.DEBUG) console.log(error)
                        this.$Message.error("获取机柜ip失败")
                    })
                    // if (this.cameraId === null) {
                    //     this.$ajax.post(`http://${this.cabinetIP}:5000/pane/device_arm_camera/`, {
                    //         "arm_id": this.armId,
                    //         "device_label": this.deviceLabel
                    //     })
                    //     // this.showConfirmModal = true
                    //
                    // } else
                    this.showConfirmModal = true
                    this.getImg()
                    return
                }
                if (this.selectDevice !== null) {
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
                this.deviceLabel = row.device_label
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
            },
            selectArea(coordinate) {
                this.coordinate = coordinate
            },
            getImg() {
                this.imgSrc = ''
                this.showAllAreas = false
                let url = `http://${this.cabinetIP}:5000/pane/original_picture/?device_label=${this.deviceLabel}`
                let xhr = new XMLHttpRequest()
                xhr.open('GET', url, true)
                xhr.responseType = 'blob'
                xhr.send()
                xhr.onload = () => {
                    Utils.blobToDataURL(xhr.response).then(res => {
                        this.imgSrc = res
                    })
                }
                xhr.onerror = (err) => {
                    console.log(err)
                }
            },
            setBorder(type) {
                if (!this.coordinate || !this.coordinate.absoluteCoordinate) return
                let { absoluteCoordinate: { topLeft, bottomRight } } = this.coordinate
                topLeft = {
                    x: topLeft.x.toFixed(2),
                    y: topLeft.y.toFixed(2)
                }
                bottomRight = {
                    x: bottomRight.x.toFixed(2),
                    y: bottomRight.y.toFixed(2)
                }
                switch (type) {
                    case "screen":
                        this.phoneModel.inner_top_left = `${topLeft.x},${topLeft.y}`
                        this.phoneModel.inner_bottom_right = `${bottomRight.x},${bottomRight.y}`
                        this.areaInfo.inside_upper_left_x = topLeft.x
                        this.areaInfo.inside_upper_left_y = topLeft.y
                        this.areaInfo.inside_under_right_x = bottomRight.x
                        this.areaInfo.inside_under_right_y = bottomRight.y
                        break
                    case "phone":
                        this.phoneModel.outer_top_left = `${topLeft.x},${topLeft.y}`
                        this.phoneModel.outer_bottom_right = `${bottomRight.x},${bottomRight.y}`
                        this.areaInfo.outside_upper_left_x = topLeft.x
                        this.areaInfo.outside_upper_left_y = topLeft.y
                        this.areaInfo.outside_under_right_x = bottomRight.x
                        this.areaInfo.outside_under_right_y = bottomRight.y
                        break
                }
            },
            setImgInfo (val) {
                this.imgInfo = val
                this.showAllAreas = true
            },
            showSelectedArea(text, tlx, tly, brx, bry) {
                let selector = document.querySelector('.selector')
                let selectorRect = selector.getBoundingClientRect()
                let selectorImgRect = document.querySelector('.selector__img').getBoundingClientRect()
                let offsetX = (selectorRect.width - selectorImgRect.width) / 2
                let offsetY = (selectorRect.height - selectorImgRect.height) / 2
                let left = offsetX + tlx / this.imgInfo.width * selectorImgRect.width
                let top = offsetY + tly / this.imgInfo.height * selectorImgRect.height
                let width = (brx - tlx) / this.imgInfo.width * selectorImgRect.width
                let height = (bry - tly) / this.imgInfo.height * selectorImgRect.height
                let area = document.createElement('div')
                area.classList.add('area')
                area.classList.add(text.toLowerCase())
                area.style.display = 'flex'
                area.style.fontSize = '24px'
                area.style.fontWeight = 'bolder'
                area.style.position = 'absolute'
                area.style.left = `${left}px`
                area.style.top = `${top}px`
                area.style.width = `${width}px`
                area.style.height = `${height}px`
                area.style.overflow = 'hidden'
                area.style.textIndent = '0.4em'
                if (text.toLowerCase() === 'screenarea') {
                    area.style.zIndex = 900
                    area.style.background = 'rgba(87, 250, 0, .4)'
                    area.style.justifyContent = 'flex-start'
                    area.style.alignItems = 'flex-end'
                }
                if (text.toLowerCase() === 'phonearea') {
                    area.style.zIndex = 800
                    area.style.background = 'rgba(87, 250, 255, .4)'
                    area.style.justifyContent = 'flex-start'
                    area.style.alignItems = 'flex-start'
                }
                area.innerText = text
                selector.appendChild(area)
            },
            saveAreaInfo() {
                this.areaInfo.pane_view = this.paneList[this.paneIndex].id
                this.areaInfo.phone_model = this.phoneModel.id
                this.$ajax.post("/api/v1/cedar/control_device_cut_coordinate/", this.areaInfo)
                .then(res => {
                    this.$Message.success("参数保存成功")
                }).catch(err => {
                    console.log(err)
                    this.$Message.error("参数保存失败")
                })
                let _this = this
                let url = `http://${this.cabinetIP}:5000/pane/device_border/`
                let xhr = new XMLHttpRequest()
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            _this.onConfirmDevice()
                        }
                        if (xhr.status === 400) {
                            console.error(xhr)
                        }
                    }
                }
                let areaInfo = JSON.stringify(Object.assign({device_label: this.deviceLabel}, this.areaInfo), null, 2)
                console.log(areaInfo)
                xhr.open('POST', url, true)
                xhr.setRequestHeader('content-type', 'application/json');
                xhr.send(areaInfo)
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
        height: 480px;
        margin:0 20px 20px 0;
    }
    .add-pane{
        float: left;
        width: 420px;
        height: 430px;
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
    .container {
        display: flex;
        flex-direction: row;
    }
    .panel {
        flex: 1;
        padding: 10px;
        position: relative;
    }
    .panel__footer {
        position: absolute;
        bottom: 10px;
        width: calc(100% - 20px);
        display: flex;
        justify-content: space-around;
    }
    .panel_btn {
        width: 46%;
    }
    .input-box {
        display: flex;
        justify-content: space-between;
    }
    .input-box Button {
        border: none;
        font-size: 2em;
        margin-top: -14px;
    }
    .input-box Button:focus {
        outline: none;
        border: none;
    }

    .area-selector {
        flex: 3;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 10px;
        background-color: #eeeeee;
    }
    .area-selector__main {
        display: flex;
        flex: 1;
        max-height: 755px;
        justify-content: center;
        padding: 10px;
    }
    .area-selector__loading {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
    }
    .title {
        font-size: 1.4rem;
        margin-bottom: 1.6em;
    }
    .coordinate-confirm {
        flex: .5;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
    }
    .top {
        display: flex;
        width: 100%;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
    }
    .top > Button + Button {
        margin-top: 10px;
    }

    .loading {
        position: relative;
        width: 100px;
        height: 100px;
        z-index: 5;
    }
    .loading__item {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        transform-origin: 48% 48%;
        mix-blend-mode: screen;
    }
    .loading__item:nth-child(1) {
        background-color: #0000ff;
        animation: turn 3s linear 0s infinite;
    }
    .loading__item:nth-child(2) {
        background-color: #00ff00;
        animation: turn 3s linear -1s infinite;
    }
    .loading__item:nth-child(3) {
        background-color: #ff0000;
        animation: turn 3s linear -2s infinite;
    }
    .loading__desc {
        position: absolute;
        width: 100%;
        height: 100%;
        padding: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        line-height: 1.4;
        border-radius: 50%;
    }
    @keyframes turn {
        to {
            transform: rotate(360deg);
        }
    }
</style>







