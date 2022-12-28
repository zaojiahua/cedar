<template>
    <div>
        <div class="container">
            <div class="panel">
                <Row>
                    <h5 style="font-weight: bold; font-size: 1.4rem;">机型信息
                        <!--    5D    -->
                        <Dropdown v-show="showTestBtn" trigger="click" style="float: right;font-weight: normal;">
                            <Button>
                                更多操作
                                <Icon type="ios-arrow-down"></Icon>
                            </Button>
                            <DropdownMenu slot="list">
                                <!--<DropdownItem @click.native="distanceBtn('调试距离')">调试距离</DropdownItem>-->
                                <DropdownItem @click.native="imageMosaic('拼接图像')">拼接图像</DropdownItem>
                                <DropdownItem @click.native="onOpenCoordinateModal('坐标换算')">坐标换算</DropdownItem>
                                <DropdownItem v-show="user==='admin'" @click.native="onOpenAdjustZModel">调节z值</DropdownItem>
                                <DropdownItem @click.native="onOpenStandbyModel">待命位置</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <!--  5L，5se -->
                        <Dropdown v-show="showLocationBtn" trigger="click" style="float: right;font-weight: normal;">
                            <Button>
                                更多操作
                                <Icon type="ios-arrow-down"></Icon>
                            </Button>
                            <DropdownMenu slot="list">
                                <DropdownItem @click.native="onOpenCoordinateModal">坐标换算</DropdownItem>
                                <DropdownItem v-show="user==='admin'" @click.native="onOpenAdjustZModel">调节z值</DropdownItem>
                                <DropdownItem @click.native="onOpenStandbyModel">待命位置</DropdownItem>
                            </DropdownMenu>
                            <!--<DropdownMenu slot="list" v-show="user==='admin'">-->
                                <!--<DropdownItem @click.native="getMlocation">mlocation调试</DropdownItem>-->
                            <!--</DropdownMenu>-->
                            <!--<DropdownMenu slot="list">-->
                                <!--&lt;!&ndash;<DropdownItem @click.native="">点击准确性测试</DropdownItem>&ndash;&gt;-->
                                <!--<DropdownItem @click.native="showValidationModal=true">点击有效性测试</DropdownItem>-->
                                <!--&lt;!&ndash;<DropdownItem @click.native="">滑动有效性测试</DropdownItem>&ndash;&gt;-->
                            <!--</DropdownMenu>-->
                        </Dropdown>
                        <!--  5， 5pro   -->
                        <Dropdown v-show="showProBtn" trigger="click" style="float: right;font-weight: normal;">
                            <Button>
                                更多操作
                                <Icon type="ios-arrow-down"></Icon>
                            </Button>
                            <DropdownMenu slot="list">
                                <DropdownItem @click.native="imageMosaic">拼接图像</DropdownItem>
                                <DropdownItem @click.native="onOpenCoordinateModal">坐标换算</DropdownItem>
                                <DropdownItem v-show="user==='admin'" @click.native="onOpenAdjustZModel">调节z值</DropdownItem>
                                <DropdownItem @click.native="onOpenStandbyModel">待命位置</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </h5>
                </Row>
                <Form :label-width="90">
                    <FormItem style="margin-top: 20px;">
                        <b slot="label">手机型号:</b>
                        <Input disabled v-model="phone_model.phone_model_name" class="disabled-input"></Input>
                    </FormItem>
                    <FormItem>
                        <b slot="label">机型厚度:</b>
                        <InputNumber style="width: 100%" v-model="phone_model.ply" class="disabled-input" :min="0"></InputNumber>
                    </FormItem>
                    <FormItem>
                        <b slot="label">边框信息:</b>
                        <!--<div class="input-box">-->
                            <!--<Input disabled v-model="pointTopLeft" class="disabled-input"></Input>&mdash;-->
                            <!--<Input disabled v-model="pointBottomRight" class="disabled-input"></Input>-->
                            <!--<Icon type="md-add-circle" size="22" style="margin: 5px 5px 0 0" @click="setBorder('screen')" color="#1bbc9c"/>-->
                            <!--<Button :icon="showScreenArea?'ios-eye-outline':'ios-eye-off-outline'"-->
                                    <!--@click="showScreenArea=!showScreenArea"></Button>-->
                            <!--&lt;!&ndash;<Button type="primary" size="small" icon="ios-search" @click="getScreenArea" style="margin-left: 24px;margin-top: 3px">自动获取</Button>&ndash;&gt;-->
                        <!--</div>-->
                        <div class="input-box">
                            x1:<InputNumber v-model="deviceCutCoordinate.inside_upper_left_x" style="margin-right:12px"
                                            :editable="false" :min="0" :max="deviceCutCoordinate.inside_under_right_x-1" @on-change="onCoordinateChange"></InputNumber>
                            y1:<InputNumber v-model="deviceCutCoordinate.inside_upper_left_y" :editable="false"
                                            :min="0" :max="deviceCutCoordinate.inside_under_right_y-1" @on-change="onCoordinateChange"></InputNumber>
                        </div>
                        <div class="input-box" style="margin-top: 12px">
                            x2:<InputNumber v-model="deviceCutCoordinate.inside_under_right_x" style="margin-right:10px" :editable="false"
                                            :min="0" @on-change="onCoordinateChange"></InputNumber>
                            y2:<InputNumber v-model="deviceCutCoordinate.inside_under_right_y" :editable="false"
                                            :min="0" @on-change="onCoordinateChange"></InputNumber>
                            <Icon type="md-add-circle" size="22" style="margin: 5px 0 0 10px" @click="setBorder('screen')" color="#1bbc9c"/>
                            <Button :icon="showScreenArea?'ios-eye-outline':'ios-eye-off-outline'"
                                    @click="showScreenArea=!showScreenArea"></Button>
                        </div>
                    </FormItem>
                </Form>

                <div class="flex-table">
                    <p></p>
                    <p style="margin-bottom: 5px;font-size: 12px"> x,y 是基于边框左上角点的相对坐标；屏幕水平面 z=0，屏幕朝向方向 z 为正(单位：mm)</p>

                    <Table :columns="tableColumns" :data="tableData" border highlight-row
                           @on-row-click="onRowClick" max-height="345" size="small">
                    </Table>
                    <Row style="text-align: right;margin-top: 20px">
                        <Button style="float: left;width: 100px" icon='md-add' @click="onOpenAddModal">新建</Button>
                        <Button style="border: none;font-size: 2em;margin: -7px 10px 0 0;box-shadow:none;"
                                :icon="showTablePoint ? 'ios-eye-outline':'ios-eye-off-outline'"
                                @click="showTablePoint=!showTablePoint"></Button>
                        <Button style="border: none;font-size: 2em;margin: -7px 10px 0 0;box-shadow:none;"
                                icon="ios-trash-outline"
                                @click="onDeleteRow"></Button>
                    </Row>
                </div>
                <div class="panel__footer">
                    <Button size="large" class="panel_btn" @click="onClose(false)">取消</Button>
                    <Button size="large" type="success" class="panel_btn" @click="saveAreaInfo">完成</Button>
                </div>
            </div>
            <div class="area-selector">
                <div class="area-selector__header">
                    <Row>
                        <h5 style="font-weight: bold; font-size: 1.4rem;">请在图中框选边框或选取坐标点</h5>
                        <div style="float: right;margin-top: -33px;">
                            <!--<span>高曝光：</span>-->
                            <i-switch v-model="highExposureSwitch" false-color="#999">
                                <span slot="open">亮</span>
                                <span slot="close">暗</span>
                            </i-switch>
                            <Button type="success" @click="getImg" style="margin-left: 20px;">重新获取图片</Button>
                        </div>
                    </Row>
                    <p class="area-selector_desc">按下鼠标按键并拖动来框选区域，按下Ctrl可遮罩图片外的内容</p>
                    <p class="area-selector_desc">请点击空白处隐藏边框后，再按下鼠标左键选点</p>
                </div>
                <div class="area-selector__main">
                    <div class="area-selector__loading" v-if="!imgSrc">
                        <h5 class="title">请将手机屏幕调至较亮画面，并摆正手机</h5>
                        <p style="margin-bottom: 10px">若长时间获取不到图片，请尝试重新获取</p>
                        <div class="loading">
                            <div class="loading__item"></div>
                            <div class="loading__item"></div>
                            <div class="loading__item"></div>
                            <div class="loading__desc">正在努力获取图像...</div>
                        </div>
                    </div>
                    <AreaSelector ref="imgTool"
                            v-else
                            :imgSrc="imgSrc"
                            @on-select="selectArea"
                            @on-load="setImgInfo"
                    ></AreaSelector>
                </div>
            </div>
        </div>
        <Spin size="large" fix v-if="showLoading" style="z-index: 5000;"></Spin>

        <Modal v-model="showModal" :closable="false" :footer-hide="true" :mask-closable="false" width="550">
            <Card>
                <Form :label-width="100">
                    <FormItem>
                        <b slot="label">名称：</b>
                        <Input v-model="addInfo.name" placeholder="名称不能为空"></Input>
                    </FormItem>
                    <FormItem>
                        <b slot="label">Z：</b>
                        <Input v-model="addInfo.z_coordinate" type="number"></Input>
                    </FormItem>
                </Form>
                <p style="text-align: center">
                    <Button @click="showModal=false" style="margin-right: 50px;">取消</Button>
                    <Button type="primary" @click="addTableData">添加</Button>
                </p>
            </Card>
        </Modal>

        <Modal v-model="showMlocationModal" :closable="false" :footer-hide="true" :mask-closable="false" width="550">
            <Card>
                <Row>
                    <h3>mlocation 坐标 <span style="font-size:12px;">(精确到0.1mm)</span></h3>
                </Row>
                <Row class="location-box" style="display: flex;margin: 10px 0 30px 0">
                    <InputNumber v-model="mlocation.x" :min="0" style="margin-right: 16px;" placeholder="x"></InputNumber>
                    <InputNumber v-model="mlocation.y" :min="0" style="margin-right: 16px" placeholder="y"></InputNumber>
                    <InputNumber v-model="mlocation.z" placeholder="z"></InputNumber>
                </Row>
                <Row>
                    <Button type="info" @click="testMlocation" style="margin-right: 50px;">测试</Button>
                    <div style="float: right;">
                        <Button @click="showMlocationModal=false" style="margin-right: 24px;">取消</Button>
                        <Button type="primary" @click="setMlocation">完成</Button>
                    </div>

                </Row>
            </Card>
        </Modal>

        <!--    调节z值模态框    -->
        <Modal v-model="showAdjustZModel" :closable="false" :footer-hide="true" :mask-closable="false" width="500">
            <Card>
                <Row style="margin-bottom: 20px;">
                    <p>按压过轻时，请调大机械臂z值，范围：{{ adjustTitle }}</p>
                    <p>x向右为正，范围：[{{adjustTitleX[0]}},{{adjustTitleX[1]}}]，y向下为负，范围：[{{adjustTitleY[0]}},{{adjustTitleY[1]}}]</p>
                </Row>
                <!--   5D  双机械臂  -->
                <div v-show="showTestBtn">
                    <Row>
                        <InputNumber v-model="robotArm.click_xy1[0]" style="width:100px;margin-right: 16px;" placeholder="x"></InputNumber>
                        <InputNumber v-model="robotArm.click_xy1[1]" style="width:100px;margin-right: 16px" placeholder="y"></InputNumber>
                        <InputNumber v-model="robotArm.x1" :min="0" style="width:100px;margin-right: 16px;" placeholder="左机械臂z值"></InputNumber>
                        <Button type="info" @click="onTestRobotArm(true,false)">测试</Button>
                    </Row>
                    <Row style="margin-top: 16px;">
                        <InputNumber v-model="robotArm.click_xy2[0]" style="width:100px;margin-right: 16px;" placeholder="x"></InputNumber>
                        <InputNumber v-model="robotArm.click_xy2[1]" style="width:100px;margin-right: 16px" placeholder="y"></InputNumber>
                        <InputNumber v-model="robotArm.x2" :min="0" style="width:100px;margin-right: 16px;" placeholder="右机械臂z值"></InputNumber>
                        <Button type="info" @click="onTestRobotArm(false,true)">测试</Button>
                    </Row>
                </div>
                <!--   非5D  单个机械臂  -->
                <Row v-show="!showTestBtn">
                    <InputNumber v-model="robotArm.click_xy[0]" style="width:100px;margin-right: 16px;" placeholder="x"></InputNumber>
                    <InputNumber v-model="robotArm.click_xy[1]" style="width:100px;margin-right: 16px" placeholder="y"></InputNumber>
                    <InputNumber v-model="robotArm.x" :min="0" style="width:100px;margin-right: 16px;" placeholder="机械臂z值"></InputNumber>
                    <Button type="info" @click="onTestRobotArm(false,false)">测试</Button>
                </Row>
                <Row>
                    <div style="text-align:left;margin-top: 30px">
                        <Button @click="showAdjustZModel=false" style="margin-right: 24px;width: 80px">取消</Button>
                        <Button type="primary" @click="onSaveRobotArm" style="width: 80px;">完成</Button>
                    </div>
                </Row>
            </Card>
        </Modal>
        <!--待命位置 模态框-->
        <Modal v-model="showStandbyModel" :closable="false" :footer-hide="true" :mask-closable="false" width="500">
            <Card>
                <Row style="margin-bottom: 20px;">
                    <p>机械臂的待命位置</p>
                    <p>x向右为正，范围：[{{standbyRangeX[0]}},{{standbyRangeX[1]}}]，y向下为负，范围：[{{standbyRangeY[0]}},{{standbyRangeY[1]}}]，z向上为正，范围：[{{standbyRangeZ[0]}},{{standbyRangeZ[1]}}]；默认值：[{{ defaultWaitPoint.join(",") }}]</p>
                </Row>
                <!--   5D  双机械臂  -->
                <div v-show="showTestBtn">
                    <Row>
                        <InputNumber v-model="robotArmStandby.xyz[0]" style="width:100px;margin-right: 16px;" placeholder="x"></InputNumber>
                        <InputNumber v-model="robotArmStandby.xyz[1]" style="width:100px;margin-right: 16px" placeholder="y"></InputNumber>
                        <InputNumber v-model="robotArmStandby.xyz[2]" style="width:100px;margin-right: 16px;" placeholder="左机械臂z值"></InputNumber>
                        <Button type="info" @click="onTestWaitPosition(true,false)">测试</Button>
                    </Row>
                    <Row style="margin-top: 16px;">
                        <InputNumber v-model="robotArmStandby.xyz_1[0]" style="width:100px;margin-right: 16px;" placeholder="x"></InputNumber>
                        <InputNumber v-model="robotArmStandby.xyz_1[1]" style="width:100px;margin-right: 16px" placeholder="y"></InputNumber>
                        <InputNumber v-model="robotArmStandby.xyz_1[2]" style="width:100px;margin-right: 16px;" placeholder="右机械臂z值"></InputNumber>
                        <Button type="info" @click="onTestWaitPosition(false,true)">测试</Button>
                    </Row>
                </div>
                <!--   非5D  单个机械臂  -->
                <Row v-show="!showTestBtn">
                    <InputNumber v-model="robotArmStandby.xyz[0]" style="width:100px;margin-right: 16px;" placeholder="x"></InputNumber>
                    <InputNumber v-model="robotArmStandby.xyz[1]" style="width:100px;margin-right: 16px" placeholder="y"></InputNumber>
                    <InputNumber v-model="robotArmStandby.xyz[2]" style="width:100px;margin-right: 16px;" placeholder="机械臂z值"></InputNumber>
                    <Button type="info" @click="onTestWaitPosition(false,false)">测试</Button>
                </Row>
                <Row>
                    <div style="text-align:left;margin-top: 30px">
                        <Button @click="showStandbyModel=false" style="margin-right: 24px;width: 80px">取消</Button>
                        <Button type="primary" @click="onSaveStandby" :loading="isLoading" style="width: 100px;">
                            <span v-if="!isLoading">完成</span>
                            <span v-else>正在发送...</span>
                        </Button>
                    </div>
                </Row>
            </Card>
        </Modal>

        <Modal v-model="showValidationModal" :closable="false" :footer-hide="true" :mask-closable="false" width="450">
            <Card>
                <h3>测试点击次数</h3>
                <InputNumber v-model="testCount" style="width: 380px;margin-top: 16px" :min="1" :max="100" :precision="0"></InputNumber>
                <Row style="text-align: right;margin-top: 30px;">
                    <Button @click="showValidationModal=false;testCount=50" style="margin-right: 30px;">取消</Button>
                    <Button type="primary" @click="onValidationTest">测试</Button>
                </Row>
            </Card>
        </Modal>
        <!--   坐 标 换 算  -->
        <Modal v-model="showCoordinateModal" :closable="false" :footer-hide="true" :mask-closable="false" width="520">
            <Card>
                <p style="margin-top: 16px;">两个换算点的物理x坐标和y坐标，单位mm</p>
                <p>x向右为正，范围[{{coordinateRangeX[0]}}，{{coordinateRangeX[1]}}]，y向下为负，范围[{{coordinateRangeY[0]}}，{{coordinateRangeY[1]}}]</p>
                <Row style="margin-top: 24px">
                    <InputNumber v-model="coordinateChange.x1" style="width:180px;margin-right: 16px;"></InputNumber>
                    <InputNumber v-model="coordinateChange.y" style="width:180px;margin-right: 16px;"></InputNumber>
                    <Button type="info" @click="onTestCoordinateChange(coordinateChange.x1,coordinateChange.y)">测试</Button>
                </Row>
                <Row style="margin-top: 16px">
                    <InputNumber v-model="coordinateChange.x2" style="width:180px;margin-right: 16px;"></InputNumber>
                    <InputNumber v-model="coordinateChange.y" style="width:180px;margin-right: 16px;"></InputNumber>
                    <Button type="info" @click="onTestCoordinateChange(coordinateChange.x2,coordinateChange.y)">测试</Button>
                </Row>
                <Row style="margin-top: 30px;">
                    <Button @click="showCoordinateModal=false" style="margin-right: 30px;">取消</Button>
                    <Button type="primary" @click="coordinateConverting">坐标换算</Button>
                </Row>
            </Card>
        </Modal>
    </div>

</template>

<script>
    import config from "../lib/config"
    import AreaSelector from "../components/common/AreaSelector"
    import Utils from "../lib/utils"


    const defaultTableDate = [
        {
            is_fixed: true,
            name: "菜单",
            x_coordinate: null,
            y_coordinate: null,
            z_coordinate: 0
        },
        {
            is_fixed: true,
            name: "桌面",
            x_coordinate: null,
            y_coordinate: null,
            z_coordinate: 0
        },
        {
            is_fixed: true,
            name: "返回",
            x_coordinate: null,
            y_coordinate: null,
            z_coordinate: 0
        },
        // {
        //     is_fixed: true,
        //     name: "电源键",
        //     x_coordinate: null,
        //     y_coordinate: null,
        //     z_coordinate: 0
        // },
        // {
        //     is_fixed: true,
        //     name: "音量+",
        //     x_coordinate: null,
        //     y_coordinate: null,
        //     z_coordinate: 0
        // },
        // {
        //     is_fixed: true,
        //     name: "音量-",
        //     x_coordinate: null,
        //     y_coordinate: null,
        //     z_coordinate: 0
        // }
    ]

    export default {
        name: "CompPaneDeviceConfig",
        components:{ AreaSelector },
        props:{

        },
        data(){
            return{
                isLoading: false,
                phone_model: {
                    id: null,
                    phone_model_name: "",
                    x_dpi: null,
                    y_dpi: null,
                    ply:null
                },
                //屏幕边框信息
                deviceCutCoordinate: {
                    inside_under_right_x: null,
                    inside_under_right_y: null,
                    inside_upper_left_x: null,
                    inside_upper_left_y: null,
                },
                //右侧图片点击的坐标、区域 的点的信息
                areaInfo: {
                    x_coordinate:null,
                    y_coordinate:null,
                    inside_under_right_x: null,
                    inside_under_right_y: null,
                    inside_upper_left_x: null,
                    inside_upper_left_y: null,
                },
                areaPoint: {
                    x_coordinate:null,
                    y_coordinate:null,
                },
                //右边画布绘制的点（区域）的坐标信息
                coordinate: null,
                cabinetIP: null,
                imgSrc: null,
                imgInfo: null,
                showScreenArea: false,
                showTablePoint: false,
                showLoading:false,
                paneId: null,
                //点击确认以后外层是否需要发送请求
                isSendReq: true,
                deviceLabel: null,
                deviceCabinetType:'',
                deviceCabinetId:'',
                deviceId: null,
                tableColumns:[
                    {
                        title: '名称',
                        key: 'name'
                    },
                    {
                        title: 'X',
                        key: 'x_coordinate',
                        render: (h, params) => {
                            if(params.row.$isEdit){
                                return h('Input',{
                                    props:{
                                        // type:"number",
                                        value:params.row.x_coordinate,
                                    },
                                    on:{
                                        "on-blur":event=>{
                                            if(event.target.value===""){
                                                this.$Message.warning({content:"该项不能为空",duration:3})
                                                event.target.value = this.tableData[params.index].x_coordinate
                                                return
                                            }
                                            if(params.row.x_coordinate===parseFloat(event.target.value)){
                                                this.$set(params.row,"$isEdit",false)
                                                return
                                            }
                                            params.row.x_coordinate = parseFloat(event.target.value);
                                            this.tableData[params.index].x_coordinate = parseFloat(event.target.value)
                                            this.tableData[params.index].update = true
                                            this.$set(params.row,"$isEdit",false)
                                            let selector = document.querySelector('.selector')
                                            let point = document.querySelectorAll('.point')
                                            let content = document.querySelectorAll('.content')
                                            if(point){
                                                point.forEach(item=>{
                                                    selector.removeChild(item)
                                                })
                                                content.forEach(item=>{
                                                    selector.removeChild(item)
                                                })
                                            }
                                            this.showSelectedPoint(params.row.name, params.row.x_coordinate, params.row.y_coordinate,)
                                        }
                                    }
                                })
                            }else {
                                return h('div',{
                                    on:{
                                        dblclick:()=>{
                                            this.$set(params.row,"$isEdit",true)
                                            this.coordinate = {}
                                            this.$refs.imgTool.closeArea()
                                        }
                                    }
                                },params.row.x_coordinate)
                            }
                        }
                    },
                    {
                        title: 'Y',
                        key: 'y_coordinate',
                        render: (h, params) => {
                            if(params.row.$isEdit){
                                return h('Input',{
                                    props:{
                                        // type:"number",
                                        value:params.row.y_coordinate,
                                    },
                                    on:{
                                        "on-blur":event=>{
                                            if(event.target.value===""){
                                                this.$Message.warning({content:"该项不能为空",duration:3})
                                                event.target.value = this.tableData[params.index].y_coordinate
                                                return
                                            }
                                            if(params.row.y_coordinate===parseFloat(event.target.value)){
                                                this.$set(params.row,"$isEdit",false)
                                                return
                                            }
                                            params.row.y_coordinate = parseFloat(event.target.value);
                                            this.tableData[params.index].y_coordinate = parseFloat(event.target.value)
                                            this.tableData[params.index].update = true
                                            this.$set(params.row,"$isEdit",false)
                                            let selector = document.querySelector('.selector')
                                            let point = document.querySelectorAll('.point')
                                            let content = document.querySelectorAll('.content')
                                            if(point){
                                                point.forEach(item=>{
                                                    selector.removeChild(item)
                                                })
                                                content.forEach(item=>{
                                                    selector.removeChild(item)
                                                })
                                            }
                                            this.showSelectedPoint(params.row.name, params.row.x_coordinate, params.row.y_coordinate,)
                                        }
                                    }
                                })
                            }else {
                                return h('div',{
                                    on:{
                                        dblclick:()=>{
                                            this.$set(params.row,"$isEdit",true)
                                            this.coordinate = {}
                                            this.$refs.imgTool.closeArea()
                                        }
                                    }
                                },params.row.y_coordinate)
                            }
                        }
                    },
                    {
                        title: 'Z [-10,10]',
                        key: 'z',
                        maxWidth:90,
                        render: (h, params) => {
                            if(params.row.$isEdit){
                                return h('Input',{
                                    props:{
                                        type:"number",
                                        value:params.row.z_coordinate,
                                    },
                                    on:{
                                        "on-blur":event=>{
                                            if(event.target.value===""){
                                                this.$Message.warning({content:"该项不能为空",duration:3})
                                                event.target.value = this.tableData[params.index].z_coordinate
                                                return
                                            }
                                            if(parseFloat(event.target.value)<-10||parseFloat(event.target.value)>10){
                                                this.$Message.warning({content:"z 坐标范围为[-10,10]",duration:3})
                                                event.target.value = this.tableData[params.index].z_coordinate
                                                return
                                            }
                                            if(params.row.z_coordinate===parseFloat(event.target.value)){
                                                this.$set(params.row,"$isEdit",false)
                                                return
                                            }
                                            params.row.z_coordinate = parseFloat(event.target.value);
                                            this.tableData[params.index].z_coordinate = parseFloat(event.target.value)
                                            this.tableData[params.index].update = true
                                            this.$set(params.row,"$isEdit",false)
                                        }
                                    }
                                })
                            }else {
                                return h('div',{
                                    on:{
                                        dblclick:()=>{
                                            this.$set(params.row,"$isEdit",true)
                                            this.coordinate = {}
                                            this.$refs.imgTool.closeArea()
                                        }
                                    }
                                },params.row.z_coordinate)
                            }
                        }
                    },
                    {
                        title: "操作",
                        key: "action",
                        align: 'center',
                        width:120,
                        render: (h, params) => {
                            return h('div', [
                                h('span', {
                                    class: 'mouse-hover',
                                    style: {
                                        marginRight: '15px',
                                        cursor: 'pointer',
                                    },
                                    on: {
                                        click: (event) => {
                                            event.stopPropagation()
                                            this.currentData = params.row
                                            this.currentIndex = params.index
                                            this.setBorder('point')
                                        }
                                    }
                                }, '确认'),
                                h('span', {
                                    class: 'mouse-hover',
                                    style: {
                                        cursor: 'pointer'
                                    },
                                    on: {
                                        click: (event) => {
                                            event.stopPropagation()
                                            this.currentData = params.row
                                            this.currentIndex = params.index
                                            this.onCoordinateTestClick()
                                        },
                                        contextmenu:(event)=>{
                                            event.preventDefault()
                                            this.currentData = params.row
                                            this.currentIndex = params.index
                                            this.onOpenTestCountModal()
                                        }
                                    }
                                }, '测试')
                            ]);
                        }
                    }
                ],
                tableData:[],
                deleteList:[],
                //边框的值是否做了修改
                // isScreenUpdate:false,
                showModal:false,
                //点击新建按钮初始化的数据
                addInfo:{
                    name:"",
                    z_coordinate:null
                },
                currentData:{},
                currentIndex:null,
                //高曝光开关
                highExposureSwitch:false,
                //测试调试距离按钮是否显示
                showTestBtn:false,
                //调试距离按钮是否可点击：发送请求以后返回较慢
                isDisabled:false,
                //测试有效性/mlocation按钮是否显示
                showLocationBtn:false,
                showProBtn:false,
                isDisabledBtn:false,  //mlocation按钮是否可点击
                mlocation:{
                    x:null,
                    y:null,
                    z:null,
                },
                showMlocationModal:false,
                showValidationModal:false,
                testCount:50,
                user:sessionStorage.getItem('username'),
                showAdjustZModel:false,
                adjustTitle:"",
                adjustTitleX:"",
                adjustTitleY:"",
                robotArm:{
                    x:null,
                    x1:null,
                    x2:null,
                    click_xy:[],
                    click_xy1:[],
                    click_xy2:[],
                },
                showStandbyModel:false,
                // 待命位置z，y，z的信息
                robotArmStandby:{
                    xyz:[],
                    xyz_1:[],
                },
                defaultWaitPoint:[],
                standbyRangeX:[],
                standbyRangeY:[],
                standbyRangeZ:[],
                isSentTestReq:false,
                showCoordinateModal:false,
                coordinateChange:{
                    x1:null,
                    x2:null,
                    y:null,
                },
                coordinateRangeX:[],
                coordinateRangeY:[],
            }
        },
        computed: {
            pointTopLeft: function () {
                if (this.deviceCutCoordinate.inside_upper_left_x!==null && this.deviceCutCoordinate.inside_upper_left_y!==null)
                    return this.deviceCutCoordinate.inside_upper_left_x + ',' + this.deviceCutCoordinate.inside_upper_left_y
            },
            pointBottomRight() {
                if (this.deviceCutCoordinate.inside_under_right_x!==null && this.deviceCutCoordinate.inside_under_right_y!==null)
                    return this.deviceCutCoordinate.inside_under_right_x + ',' + this.deviceCutCoordinate.inside_under_right_y
            }
        },
        watch: {
            areaInfo: {
                handler: function (val) {
                    if (this.areaInfo.inside_under_right_x !== null && this.areaInfo.inside_upper_left_x !== null) {
                        this.deviceCutCoordinate.inside_upper_left_x = val.inside_upper_left_x
                        this.deviceCutCoordinate.inside_upper_left_y = val.inside_upper_left_y
                        this.deviceCutCoordinate.inside_under_right_x = val.inside_under_right_x
                        this.deviceCutCoordinate.inside_under_right_y = val.inside_under_right_y
                    }else {
                        this.$Message.warning({content:"请框选正确的边框信息！",duration:3})
                    }
                },
                deep: true,
                // immediate: true
            },
            areaPoint:{
                handler: function (val) {
                    if (this.areaPoint.x_coordinate !== null) {
                        this.tableData[this.currentIndex].x_coordinate = val.x_coordinate
                        this.tableData[this.currentIndex].y_coordinate = val.y_coordinate
                        this.tableData[this.currentIndex].update = true
                        this.currentData = {}
                        this.currentIndex = null
                    }
                },
                deep: true,
                immediate: true
            },
            showScreenArea(val) {
                if (val) {
                    if (this.deviceCutCoordinate.inside_upper_left_x !== this.deviceCutCoordinate.inside_under_right_x) {
                        this.showSelectedArea("ScreenArea", this.deviceCutCoordinate.inside_upper_left_x, this.deviceCutCoordinate.inside_upper_left_y, this.deviceCutCoordinate.inside_under_right_x, this.deviceCutCoordinate.inside_under_right_y)
                    }
                } else {
                    let selector = document.querySelector('.selector')
                    let area = document.querySelector('.screenarea')
                    if (area) selector.removeChild(area)
                }
            },
            showTablePoint(val){
                if (val) {
                    if (this.tableData.length>0) {
                        this.tableData.forEach(item=>{
                            this.showSelectedPoint(item.name, item.x_coordinate, item.y_coordinate)
                        })
                    }
                } else {
                    let selector = document.querySelector('.selector')
                    let point = document.querySelectorAll('.point')
                    let content = document.querySelectorAll('.content')
                    if(point){
                        point.forEach(item=>{
                            selector.removeChild(item)
                        })
                        content.forEach(item=>{
                            selector.removeChild(item)
                        })
                    }
                }
            },
        },
        methods:{
            // 打开坐标换算模态框，并获取坐标信息
            onOpenCoordinateModal(){
                this.showCoordinateModal = true
                if(["Tcab_5se"].includes(this.deviceCabinetType)){
                    this.coordinateRangeX = [35,130]
                    this.coordinateRangeY = [-210,-50]
                }else if(["Tcab_5","Tcab_5L","Tcab_5pro"].includes(this.deviceCabinetType)){
                    this.coordinateRangeX = [25, 235]
                    this.coordinateRangeY = [-300, -130]
                }else if(["Tcab_5D"].includes(this.deviceCabinetType)){
                    this.coordinateRangeX = [50, 280]
                    this.coordinateRangeY = [-200, 0]
                }
                this.$ajax.get("http://"+ this.cabinetIP +":5000/pane/get_coordinate/")
                    .then(response=>{
                        if(response.data.error_code===0){
                            this.coordinateChange.x1 = response.data.data.start_point[0]
                            this.coordinateChange.x2 = response.data.data.end_point[0]
                            this.coordinateChange.y = response.data.data.end_point[1]
                        }else{
                            this.$Message.error({content:response.data.description,duration: 10})
                        }
                    }).catch(error=>{
                        if(error.response.status>=500)
                            this.$Message.error({content:'服务器错误',duration: 5})
                        else
                            this.$Message.error({content:'坐标获取失败',duration: 5})
                    })
            },
            // 测试坐标点
            onTestCoordinateChange(x,y){
                if(this.isDisabled||this.isSentTestReq){
                    this.$Message.warning({content:"请等待当前操作完成",duration:3})
                    return
                }
                if(x===null||x===''||y===null||y===''){
                    this.$Message.info("坐标点x，y值不能为空！")
                    return
                }
                if( x>this.coordinateRangeX[1] || x<this.coordinateRangeX[0] ||  y>this.coordinateRangeY[1] || y<this.coordinateRangeY[0]){
                    this.$Message.warning({content:"请输入正确范围内的坐标值",duration:3})
                    return
                }
                this.$Message.info({content:"正在发送请求..."})
                this.isDisabled = true
                this.isSentTestReq = true
                this.$ajax.post("http://"+ this.cabinetIP +":5000/pane/click_coordinate/",{
                    device_label: this.deviceLabel,
                    point: [x,y]
                }).then(response=>{
                    this.isDisabled = false
                    this.isSentTestReq = false
                    if(response.data.error_code===0){
                        this.$Message.success({content:"请求成功",duration:3})
                    }else{
                        this.$Message.error({content:response.data.description,duration: 10})
                    }
                }).catch(error=>{
                    this.isDisabled = false
                    this.isSentTestReq = false
                    if(error.response.status>=500)
                        this.$Message.error({content:'服务器错误',duration: 5})
                    else
                        this.$Message.error({content:'请求失败',duration: 5})
                })
            },
            //坐 标 换 算
            coordinateConverting(){
                if(this.coordinateChange.x1===null||this.coordinateChange.x1===''
                    ||this.coordinateChange.x2===null||this.coordinateChange.x2===''
                    ||this.coordinateChange.y===null||this.coordinateChange.y===''){
                    this.$Message.info("坐标点x，y值不能为空！")
                    return
                }
                if(this.coordinateChange.x1===this.coordinateChange.x2){
                    this.$Message.info("两个物理坐标点x坐标不能相同！")
                    return
                }
                if( this.coordinateChange.x1>this.coordinateRangeX[1] || this.coordinateChange.x1<this.coordinateRangeX[0]
                    || this.coordinateChange.x2>this.coordinateRangeX[1] || this.coordinateChange.x2<this.coordinateRangeX[0]
                    || this.coordinateChange.y>this.coordinateRangeY[1] || this.coordinateChange.y<this.coordinateRangeY[0]){
                    this.$Message.warning({content:"请输入正确范围内的坐标值",duration:3})
                    return
                }
                if(this.isDisabled||this.isSentTestReq){
                    this.$Message.warning({content:"请等待当前操作完成",duration:3})
                    return
                }
                this.$Message.info({content:"正在发送请求..."})
                this.isDisabled = true
                this.isSentTestReq = true
                this.$ajax.post("http://"+ this.cabinetIP +":5000/pane/coordinate/",{
                    device_label: this.deviceLabel,
                    start_point: [this.coordinateChange.x1,this.coordinateChange.y],
                    end_point: [this.coordinateChange.x2,this.coordinateChange.y],
                }).then(response=>{
                    this.isDisabled = false
                    this.isSentTestReq = false
                    if(response.data.error_code===0){
                        this.showCoordinateModal = false
                        this.$Message.success({content:response.data.description,duration:8})
                    }else{
                        this.$Message.error({content:response.data.description,duration: 8})
                    }
                }).catch(error=>{
                    this.isDisabled = false
                    this.isSentTestReq = false
                    if(error.response.status>=500)
                        this.$Message.error({content:'服务器错误',duration: 5})
                    else
                        this.$Message.error({content:'坐标换算失败',duration: 5})
                })
            },
            //拼 接 图 像
            imageMosaic(){
                if(this.isDisabled){
                    this.$Message.warning({content:"请等待当前操作完成",duration:3})
                    return
                }
                this.isDisabled = true
                this.$ajax.post("http://"+ this.cabinetIP +":5000/pane/reset_h/")
                    .then(response=>{
                        this.isDisabled = false
                        if(response.data.error_code===0){
                            this.$Message.success({content:"拼接图像成功",duration:3})
                            this.getImg()
                        }else{
                            this.$Message.error({content:response.data.description,duration: 10})
                        }
                    }).catch(error=>{
                    this.isDisabled = false
                    if(error.response.status>=500)
                        this.$Message.error({content:'服务器错误',duration: 5})
                    else
                        this.$Message.error({content:'拼接图像失败',duration: 5})
                })
            },
            //调 试 距 离
            distanceBtn(){
                if(this.isDisabled){
                    this.$Message.warning({content:"请等待当前操作完成",duration:3})
                    return
                }
                this.isDisabled = true
                this.$ajax.post("http://"+ this.cabinetIP +":5000/pane/locate_device/")
                    .then(response=>{
                        this.isDisabled = false
                        if(response.data.error_code===0){
                            this.$Message.success({content:"调试距离成功",duration:3})
                        }else{
                            this.$Message.error({content:response.data.description,duration: 10})
                        }
                    }).catch(error=>{
                    this.isDisabled = false
                    if(error.response.status>=500)
                        this.$Message.error({content:'服务器错误',duration: 5})
                    else
                        this.$Message.error({content:'调试距离失败',duration: 5})
                })
            },
            //  mlocation 坐标点在x,y,z的值的校验
            mlocationValidate(){
                // mlocation 的x,y,z有默认值以及默认范围
                // Tcab_5se, 左上角点对齐  30<x<45     8<y<50    -35<z<5
                // Tcab_5L,Tcab_5 中心点对齐       137<x<177,   180<y <  220,     -35<z<5
                let rangeX = []
                let rangeY = []
                let rangeZ = []
                if(["Tcab_5se"].includes(this.deviceCabinetType)){
                    rangeX = [30,45]
                    rangeY = [8,50]
                    rangeZ = [-35,5]
                }else if(["Tcab_5L","Tcab_5"].includes(this.deviceCabinetType)){
                    rangeX = [137,177]
                    rangeY = [180,220]
                    rangeZ = [-35,5]
                }
                if(this.mlocation.x===null || this.mlocation.x==='' || this.mlocation.x>rangeX[1] || this.mlocation.x<rangeX[0]){
                    this.$Message.warning({content:"x 的取值范围为("+rangeX[0]+","+rangeX[1]+")",duration:3})
                    return true
                }
                if(this.mlocation.y===null || this.mlocation.y==='' || this.mlocation.y>rangeY[1]||this.mlocation.y<rangeY[0]){
                    this.$Message.warning({content:"y 的取值范围为("+rangeY[0]+","+rangeY[1]+")",duration:3})
                    return true
                }
                if(this.mlocation.z===null || this.mlocation.z==='' || this.mlocation.z>rangeZ[1]||this.mlocation.z<rangeZ[0]){
                    this.$Message.warning({content:"z 的取值范围为("+rangeZ[0]+","+rangeZ[1]+")",duration:3})
                    return true
                }
                return false
            },
            // 设置（保存） mlocation 坐标
            setMlocation(){
                if(this.mlocationValidate())
                    return
                this.$ajax.post("api/v1/cedar/update_cabinet_mlocation/",{
                    device_label: this.deviceLabel,
                    cabinet_id: this.deviceCabinetId,
                    m_location_x: this.mlocation.x,
                    m_location_y: this.mlocation.y,
                    m_location_z: this.mlocation.z
                }).then(response=>{
                    this.$Message.success("mlocation保存成功")
                    this.showMlocationModal = false
                }).catch(error=>{
                    if(error.response.status>=500)
                        this.$Message.error("服务器错误")
                    else
                        this.$Message.error({content:error.response.data.description,duration:6})
                })
            },
            // 点击测试 mlocation 的值
            testMlocation(){
                if(this.mlocationValidate())
                    return
                // ......
                this.isDisabledBtn = true
                this.$ajax.post("http://"+ this.cabinetIP +":5000/pane/click_m_location/",{
                    device_label: this.deviceLabel,
                    m_location_x: this.mlocation.x,
                    m_location_y: this.mlocation.y,
                    m_location_z: this.mlocation.z
                }).then(response=>{
                    this.isDisabledBtn = false
                    if(response.data.error_code===0){
                        this.$Message.success({content:"请求成功",duration:3})
                    }else{
                        this.$Message.error({content:response.data.description,duration: 10})
                    }
                }).catch(error=>{
                    this.isDisabledBtn = false
                    if(error.response.status>=500)
                        this.$Message.error({content:'服务器错误',duration: 5})
                    else
                        this.$Message.error({content:'请求失败',duration: 5})
                })
            },
            //  获取 mlocation 的坐标信息
            getMlocation(){
                if(this.isDisabledBtn){
                    this.$Message.warning({content:"请等待当前操作完成",duration:3})
                    return
                }
                this.mlocation = {
                    x:null,
                    y:null,
                    z:null,
                }
                this.$ajax.get("api/v1/cedar/cabinet/?fields=id,m_location_x,m_location_y,m_location_z&id="+ this.deviceCabinetId)
                    .then(response=>{
                        this.mlocation = {
                            x:response.data.cabinets[0].m_location_x,
                            y:response.data.cabinets[0].m_location_y,
                            z:response.data.cabinets[0].m_location_z,
                        }
                        this.showMlocationModal = true
                    }).catch(error=>{
                        if(error.response.status>=500)
                            this.$Message.error("服务器错误")
                        else
                            this.$Message.error({content:error.response.data.description,duration:6})
                    })
            },
            //  对调节z值范围的校验  测试时x1和x2只需一个校验
            robotArmValidate(check_x1=true,check_x2=true){
                /*  不同测试柜的 z 值范围  */
                // Tcab-5se：【15，35】
                // Tcab-5,5pro：【15， 45】
                // Tcab-5L：【15， 45】
                // Tcab-5D：【15， 45】
                let rangeZ = []
                if(["Tcab_5D"].includes(this.deviceCabinetType)){
                    rangeZ = [15,45]
                }else if(["Tcab_5L","Tcab_5","Tcab_5pro"].includes(this.deviceCabinetType)){
                    rangeZ = [15,45]
                }
                else if(["Tcab_5se"].includes(this.deviceCabinetType)){
                    rangeZ = [15,35]
                }
                if(this.showTestBtn){  //5D 双机械臂
                    if(check_x1){
                        if(this.robotArm.x1===null || this.robotArm.x1==='' || this.robotArm.click_xy1[0]===null || this.robotArm.click_xy1[0]===''
                            || this.robotArm.click_xy1[1]===null || this.robotArm.click_xy1[1]===''){
                            this.$Message.warning({content:"左机械臂值不能为空",duration:3})
                            return true
                        }
                        if(this.robotArm.x1>rangeZ[1] || this.robotArm.x1<rangeZ[0]
                            || this.robotArm.click_xy1[0]>this.adjustTitleX[1] || this.robotArm.click_xy1[0]<this.adjustTitleX[0]
                            || this.robotArm.click_xy1[1]>this.adjustTitleY[1] || this.robotArm.click_xy1[1]<this.adjustTitleY[0]){
                            this.$Message.warning({content:"请输入正确范围内的坐标值",duration:3})
                            return true
                        }
                    }
                    if(check_x2){
                        if(this.robotArm.x2===null || this.robotArm.x2==='' || this.robotArm.click_xy2[0]===null || this.robotArm.click_xy2[0]===''
                            || this.robotArm.click_xy2[1]===null || this.robotArm.click_xy2[1]===''){
                            this.$Message.warning({content:"右机械臂值不能为空",duration:3})
                            return true
                        }
                        if(this.robotArm.x2>rangeZ[1] || this.robotArm.x2<rangeZ[0]
                            || this.robotArm.click_xy2[0]>this.adjustTitleX[1] || this.robotArm.click_xy2[0]<this.adjustTitleX[0]
                            || this.robotArm.click_xy2[1]>this.adjustTitleY[1] || this.robotArm.click_xy2[1]<this.adjustTitleY[0]){
                            this.$Message.warning({content:"请输入正确范围内的坐标值",duration:3})
                            return true
                        }
                    }
                }else {
                    if(this.robotArm.x===null || this.robotArm.x==='' || this.robotArm.click_xy[0]===null || this.robotArm.click_xy[0]===''
                        || this.robotArm.click_xy[1]===null || this.robotArm.click_xy[1]===''){
                        this.$Message.warning({content:"机械臂值不能为空",duration:3})
                        return true
                    }
                    if(this.robotArm.x>rangeZ[1] || this.robotArm.x<rangeZ[0]
                        || this.robotArm.click_xy[0]>this.adjustTitleX[1] || this.robotArm.click_xy[0]<this.adjustTitleX[0]
                        || this.robotArm.click_xy[1]>this.adjustTitleY[1] || this.robotArm.click_xy[1]<this.adjustTitleY[0]){
                        this.$Message.warning({content:"请输入正确范围内的坐标值",duration:3})
                        return true
                    }
                }
                return false
            },
            //打开调节z值模态框并且获取现有的z值信息  以及 x，y的信息
            onOpenAdjustZModel(){
                this.robotArm = {
                    x:null,
                    x1:null,
                    x2:null,
                    click_xy:[],
                    click_xy1:[],
                    click_xy2:[],
                }
                this.showAdjustZModel = true
                if(["Tcab_5se"].includes(this.deviceCabinetType)){
                    this.adjustTitle = "[15,35]"
                    this.adjustTitleX = [35,130]
                    this.adjustTitleY = [-210,-50]
                }else if(["Tcab_5","Tcab_5L","Tcab_5pro"].includes(this.deviceCabinetType)){
                    this.adjustTitle = "[15,45]"
                    this.adjustTitleX = [25, 235]
                    this.adjustTitleY = [-300, -130]
                }else if(["Tcab_5D"].includes(this.deviceCabinetType)){
                    this.adjustTitle = "[15,45]"
                    this.adjustTitleX = [50, 280]
                    this.adjustTitleY = [-200, 0]
                }
                this.$ajax.get("http://"+ this.cabinetIP +":5000/pane/get_z_down/").then(response=>{
                    if(response.data.error_code===0){
                        this.showAdjustZModel = true
                        if(Object.keys(response.data.data).length===2){
                            this.robotArm.x = response.data.data.z_down
                            this.robotArm.click_xy = response.data.data.click_xy
                        }else {
                            this.robotArm.x1 = response.data.data.z_down
                            this.robotArm.x2 = response.data.data.z_down_1
                            this.robotArm.click_xy1 = response.data.data.click_xy
                            this.robotArm.click_xy2 = response.data.data.click_xy_1
                        }
                    }else{
                        this.$Message.error({content:response.data.description,duration: 10})
                    }
                }).catch(error=>{
                    if(error.response.status>=500)
                        this.$Message.error({content:'服务器错误',duration: 5})
                    else
                        this.$Message.error({content:'请求失败',duration: 5})
                })
            },
            // 测试机械臂z值
            onTestRobotArm(check_x1,check_x2){
                if(this.robotArmValidate(check_x1,check_x2)) return
                if(this.isSentTestReq){
                    this.$Message.info({content:"请等待当前指令执行完成..."})
                    return
                }
                let param = {}
                if(check_x1&&!check_x2){  //true  false => 左机械臂
                    param = {
                        device_label:this.deviceLabel,
                        z_down: this.robotArm.x1,
                        point:this.robotArm.click_xy1,
                        arm_num: 0
                    }
                }else if(!check_x1&&check_x2){ // false  true =>右机械臂
                    param = {
                        device_label:this.deviceLabel,
                        z_down: this.robotArm.x2,
                        point:this.robotArm.click_xy2,
                        arm_num: 1
                    }
                }else if(!check_x1&&!check_x2){  // false  false => 非5D
                    param = {
                        device_label:this.deviceLabel,
                        z_down: this.robotArm.x,
                        point:this.robotArm.click_xy,
                        arm_num: 0
                    }
                }
                this.$Message.info({content:"正在发送请求..."})
                this.isSentTestReq = true
                this.$ajax.post("http://"+ this.cabinetIP +":5000/pane/click_z_down/",param)
                .then(response=>{
                    this.isSentTestReq = false
                    if(response.data.error_code===0){
                        this.$Message.success({content:"请求成功",duration:3})
                    }else{
                        this.$Message.error({content:response.data.description,duration: 10})
                    }
                }).catch(error=>{
                    this.isSentTestReq = false
                    if(error.response.status>=500)
                        this.$Message.error({content:'服务器错误',duration: 5})
                    else
                        this.$Message.error({content:'请求失败',duration: 5})
                })
            },
            //保存z值
            onSaveRobotArm(){
                if(this.robotArmValidate()) return
                let param = {}
                if(this.showTestBtn){ // 5D  双机械臂
                    param = {
                        device_label:this.deviceLabel,
                        z_down: this.robotArm.x1,
                        z_down_1: this.robotArm.x2,
                        click_xy:this.robotArm.click_xy1,
                        click_xy_1:this.robotArm.click_xy2,
                    }
                }else {
                    param = {
                        device_label:this.deviceLabel,
                        z_down: this.robotArm.x,
                        click_xy:this.robotArm.click_xy,
                    }
                }
                this.$ajax.post("http://"+ this.cabinetIP +":5000/pane/update_z_down/",param)
                    .then(response=>{
                        if(response.data.error_code===0){
                            this.showAdjustZModel = false
                            this.$Message.success({content:"机械臂的值保存成功",duration:3})
                        }else{
                            this.$Message.error({content:response.data.description,duration: 10})
                        }
                    }).catch(error=>{
                    if(error.response.status>=500)
                        this.$Message.error({content:'服务器错误',duration: 5})
                    else
                        this.$Message.error({content:'请求失败',duration: 5})
                })
            },
            //打开【待命位置】模态框并且获取现有的 x，y，z的信息
            onOpenStandbyModel(){
                this.robotArmStandby = {
                    xyz:[],
                    xyz_1:[],
                }
                this.showStandbyModel = true
                if(["Tcab_5D"].includes(this.deviceCabinetType)){
                    this.standbyRangeX = [0, 160]
                    this.standbyRangeY = [-200, 0]
                    this.standbyRangeZ = [-35, 0]
                    this.defaultWaitPoint = [0,0,0]
                }else if(["Tcab_5L","Tcab_5","Tcab_5pro"].includes(this.deviceCabinetType)){
                    this.standbyRangeX = [0, 235]
                    this.standbyRangeY = [-380, 0]
                    this.standbyRangeZ = [-10, 0]
                    this.defaultWaitPoint = [10,-175,0]
                }
                else if(["Tcab_5se"].includes(this.deviceCabinetType)){
                    this.standbyRangeX = [0, 130]
                    this.standbyRangeY = [-210, 0]
                    this.standbyRangeZ = [-15, 0]
                    this.defaultWaitPoint = [10,-95,0]
                }
                this.$ajax.get("http://"+ this.cabinetIP +":5000/pane/wait_position/").then(response=>{
                    if(response.data.error_code===0){
                        this.showStandbyModel = true
                        if(Object.keys(response.data.data).length===1){
                            this.robotArmStandby.xyz = response.data.data.arm_wait_point
                        }else {
                            this.robotArmStandby.xyz = response.data.data.arm_wait_point
                            this.robotArmStandby.xyz_1 = response.data.data.arm_wait_point_1
                        }
                    }else{
                        this.$Message.error({content:response.data.description,duration: 10})
                    }
                }).catch(error=>{
                    if(error.response.status>=500)
                        this.$Message.error({content:'服务器错误',duration: 5})
                    else
                        this.$Message.error({content:'请求失败',duration: 5})
                })
            },
            //  对 待命位置 范围的校验  测试时x1和x2只需一个校验
            standbyValidate(check_x1=true,check_x2=true){
                if(this.showTestBtn){  //5D 双机械臂
                    if(check_x1){
                        if(this.robotArmStandby.xyz[0]===null || this.robotArmStandby.xyz[0]==='' || this.robotArmStandby.xyz[1]===null || this.robotArmStandby.xyz[1]===''
                            || this.robotArmStandby.xyz[2]===null || this.robotArmStandby.xyz[2]===''){
                            this.$Message.warning({content:"左机械臂值不能为空",duration:3})
                            return true
                        }
                        if(this.robotArmStandby.xyz[0]>this.standbyRangeX[1] || this.robotArmStandby.xyz[0]<this.standbyRangeX[0]
                            || this.robotArmStandby.xyz[1]>this.standbyRangeY[1] || this.robotArmStandby.xyz[1]<this.standbyRangeY[0]
                            || this.robotArmStandby.xyz[2]>this.standbyRangeZ[1] || this.robotArmStandby.xyz[2]<this.standbyRangeZ[0]){
                            this.$Message.warning({content:"请输入正确范围内的坐标值",duration:3})
                            return true
                        }
                    }
                    if(check_x2){
                        if(this.robotArmStandby.xyz_1[0]===null || this.robotArmStandby.xyz_1[0]==='' || this.robotArmStandby.xyz_1[1]===null || this.robotArmStandby.xyz_1[1]===''
                            || this.robotArmStandby.xyz_1[2]===null || this.robotArmStandby.xyz_1[2]===''){
                            this.$Message.warning({content:"右机械臂值不能为空",duration:3})
                            return true
                        }
                        if(this.robotArmStandby.xyz_1[0]>this.standbyRangeX[1] || this.robotArmStandby.xyz_1[0]<this.standbyRangeX[0]
                            || this.robotArmStandby.xyz_1[1]>this.standbyRangeY[1] || this.robotArmStandby.xyz_1[1]<this.standbyRangeY[0]
                            || this.robotArmStandby.xyz_1[2]>this.standbyRangeZ[1] || this.robotArmStandby.xyz_1[2]<this.standbyRangeZ[0]){
                            this.$Message.warning({content:"请输入正确范围内的坐标值",duration:3})
                            return true
                        }
                    }
                }else {
                    if(this.robotArmStandby.xyz[0]===null || this.robotArmStandby.xyz[0]==='' || this.robotArmStandby.xyz[1]===null || this.robotArmStandby.xyz[1]===''
                        || this.robotArmStandby.xyz[2]===null || this.robotArmStandby.xyz[2]===''){
                        this.$Message.warning({content:"机械臂值不能为空",duration:3})
                        return true
                    }
                    if(this.robotArmStandby.xyz[0]>this.standbyRangeX[1] || this.robotArmStandby.xyz[0]<this.standbyRangeX[0]
                        || this.robotArmStandby.xyz[1]>this.standbyRangeY[1] || this.robotArmStandby.xyz[1]<this.standbyRangeY[0]
                        || this.robotArmStandby.xyz[2]>this.standbyRangeZ[1] || this.robotArmStandby.xyz[2]<this.standbyRangeZ[0]){
                        this.$Message.warning({content:"请输入正确范围内的坐标值",duration:3})
                        return true
                    }
                }
                return false
            },
            // 测试 【 待命位置 】
            onTestWaitPosition(check_x1,check_x2){
                if(this.standbyValidate(check_x1,check_x2)) return
                if(this.isSentTestReq){
                    this.$Message.info({content:"请等待当前指令执行完成..."})
                    return
                }
                let param = {}
                if(check_x1&&!check_x2){  //true  false => 左机械臂
                    param = {
                        device_label:this.deviceLabel,
                        arm_wait_point:this.robotArmStandby.xyz,
                        arm_num: 0
                    }
                }else if(!check_x1&&check_x2){ // false  true =>右机械臂
                    param = {
                        device_label:this.deviceLabel,
                        arm_wait_point:this.robotArmStandby.xyz_1,
                        arm_num: 1
                    }
                }else if(!check_x1&&!check_x2){  // false  false => 非5D
                    param = {
                        device_label:this.deviceLabel,
                        arm_wait_point:this.robotArmStandby.xyz,
                        arm_num: 0
                    }
                }
                this.$Message.info({content:"正在发送请求..."})
                this.isSentTestReq = true
                this.$ajax.post("http://"+ this.cabinetIP +":5000/pane/wait_position/",param)
                    .then(response=>{
                        this.isSentTestReq = false
                        if(response.data.error_code===0){
                            this.$Message.success({content:"请求成功",duration:3})
                        }else{
                            this.$Message.error({content:response.data.description,duration: 10})
                        }
                    }).catch(error=>{
                    this.isSentTestReq = false
                    if(error.response.status>=500)
                        this.$Message.error({content:'服务器错误',duration: 5})
                    else
                        this.$Message.error({content:'请求失败',duration: 5})
                })
            },
            //保存 待命位置
            onSaveStandby(){
                if(this.standbyValidate()) return
                let param = {}
                if(this.showTestBtn){ // 5D  双机械臂
                    param = {
                        arm_wait_point:this.robotArmStandby.xyz,
                        arm_wait_point_1:this.robotArmStandby.xyz_1,
                    }
                }else {
                    param = {
                        arm_wait_point:this.robotArmStandby.xyz,
                    }
                }
                this.isLoading = true
                this.$ajax.put("http://"+ this.cabinetIP +":5000/pane/wait_position/",param)
                    .then(response=>{
                        this.isLoading = false
                        if(response.data.error_code===0){
                            this.showStandbyModel = false
                            this.$Message.success({content:"机械臂的值保存成功",duration:3})
                        }else{
                            this.$Message.error({content:response.data.description,duration: 10})
                        }
                    }).catch(error=>{
                        this.isLoading = false
                        if(error.response.status>=500)
                            this.$Message.error({content:'服务器错误',duration: 5})
                        else
                            this.$Message.error({content:'请求失败',duration: 5})
                    })
            },
            //点击有效性测试
            onValidationTest(){
                if(!this.testCount){
                    this.$Message.warning("请输入点击次数")
                    return
                }
                if(this.isSentTestReq){
                    this.$Message.info({content:"请等待当前指令执行完成..."})
                    return
                }
                this.$Message.info({content:"正在发送请求..."})
                this.isSentTestReq = true
                this.showValidationModal = false
                let data = new FormData()
                data.append('img', Utils.dataURLtoFile(this.imgSrc,"rawImage.jpg"))
                data.append('device_label', this.deviceLabel)
                data.append('inside_upper_left_x', this.deviceCutCoordinate.inside_upper_left_x)
                data.append('inside_upper_left_y', this.deviceCutCoordinate.inside_upper_left_y)
                data.append('inside_under_right_x', this.deviceCutCoordinate.inside_under_right_x)
                data.append('inside_under_right_y', this.deviceCutCoordinate.inside_under_right_y)
                data.append('x', this.currentData.x_coordinate)
                data.append('y', this.currentData.y_coordinate)
                data.append('z', this.currentData.z_coordinate)
                data.append('click_count', this.testCount)

                this.$ajax.post(`http://${this.cabinetIP}:5000/pane/coordinate_click_test/`,data)
                    .then(response=>{
                        this.isSentTestReq = false
                        if(response.data.error_code===0){
                            this.$Message.success({content:"请求成功",duration:3})
                        }else if(response.data.error_code===3013){
                            let _this = this
                            this.$Modal.confirm({
                                title:"提示",
                                content:"机械臂正在使用无法点击，确定要停止当前的动作吗？",
                                onOk(){
                                    data.append('stop_loop_flag', "1")
                                    _this.$ajax.post(`http://${_this.cabinetIP}:5000/pane/coordinate_click_test/`,data)
                                        .then(response=>{
                                            if(response.data.error_code===0){
                                                this.$Message.success({content:"停止成功",duration:3})
                                            } else {
                                                this.$Message.error({content:response.data.description,duration: 10})
                                            }
                                        }).catch(error=>{
                                            if(error.response.status>=500)
                                                this.$Message.error({content:'服务器错误',duration: 5})
                                            else
                                                this.$Message.error({content:'请求失败',duration: 5})
                                        })
                                }
                            })
                        } else {
                            this.$Message.error({content:response.data.description,duration: 10})
                        }
                    }).catch(error=>{
                    this.isSentTestReq = false
                    if(error.response.status>=500)
                        this.$Message.error({content:'服务器错误',duration: 5})
                    else
                        this.$Message.error({content:'请求失败',duration: 5})
                })
            },
            // 打开有效性测试模态框
            onOpenTestCountModal(){
                if (this.imgSrc === ''){
                    this.$Message.warning("请先获取图片")
                    return
                }
                if(this.currentIndex===null){
                    this.$Message.warning({content: "请先选择一条数据！", duration: 3})
                    return
                }
                if(this.currentData.x_coordinate===null||this.currentData.y_coordinate===null||this.currentData.z_coordinate===null){
                    this.$Message.warning({content: "请将坐标信息填写完整！", duration: 3})
                    return
                }
                if (this.deviceCutCoordinate.inside_under_right_x===null || this.deviceCutCoordinate.inside_under_right_y===null
                    || this.deviceCutCoordinate.inside_upper_left_x===null || this.deviceCutCoordinate.inside_upper_left_y===null) {
                    this.$Message.warning({content: "边框信息不能为空!", duration: 3})
                    return
                }
                this.showValidationModal = true
            },
            //从机型详情页进入到机型配置页面
            onConfig(device, index) {
                this.resetCoordinateInfo()
                this.deviceId = device.id
                this.cabinetIP = device.cabinet.ip_address
                this.deviceLabel = device.device_label
                this.deviceCabinetType = device.cabinet.type
                this.deviceCabinetId = device.cabinet.id
                this.isSendReq = false
                this.getCoordinateInfo()
                this.getImg()
                this.showTestBtn = device.cabinet.type === "Tcab_5D";
                let cabinetList = ['Tcab_5L','Tcab_5se']
                this.showLocationBtn = cabinetList.includes(device.cabinet.type)
                this.showProBtn = ['Tcab_5','Tcab_5pro'].includes(device.cabinet.type)
            },
            setMsg(row){
                this.deviceId = row.id
                this.deviceLabel = row.device_label
                this.cabinetIP = row.cabinet.ip_address
                this.deviceCabinetType = row.cabinet.type
                this.deviceCabinetId = row.cabinet.id
                this.showTestBtn = row.cabinet.type === "Tcab_5D";
                let cabinetList = ['Tcab_5L','Tcab_5se']
                this.showLocationBtn = cabinetList.includes(row.cabinet.type)
                this.showProBtn = ['Tcab_5','Tcab_5pro'].includes(row.cabinet.type)
            },
            setPaneId(id){
                this.paneId = id
            },
            //取回机型和坐标点信息   //表格的自定义按键信息也在这里获取
            async getCoordinateInfo() {
                this.deleteList = []
                // this.isScreenUpdate = false
                await this.$ajax.get(`api/v1/cedar/device/${this.deviceId}/` +
                    '?fields=phone_model.id,phone_model.x_dpi,phone_model.y_dpi,phone_model.phone_model_name,phone_model.ply').then(
                    response => {
                        this.phone_model = response.data.phone_model
                    }
                ).catch(error => {
                    if(error.response.status>=500)
                        this.$Message.error("服务器错误")
                    else
                        this.$Message.error({content:error.response.data.description,duration:6})
                })
                //获取边框坐标
                this.$ajax.get("api/v1/cedar/devicecutcoordinate/" +
                    "?phone_model__device=" + this.deviceId +
                    "&pane_view=" + this.paneId +
                    "&fields=inside_upper_left_x,inside_upper_left_y," +
                    "inside_under_right_x,inside_under_right_y,id"
                ).then(response => {
                    // Object.assign(this.deviceCutCoordinate, response.data.devicecutcoordinate)
                    if (response.data.devicecutcoordinate.length > 0)
                        this.deviceCutCoordinate = response.data.devicecutcoordinate[0]
                }).catch(error => {
                    if (config.DEBUG) console.log(error)
                    if(error.response.status>=500)
                        this.$Message.error("服务器错误")
                    else
                        this.$Message.error({content:error.response.data.description,duration:6})
                })
                //获取表格按键坐标
                this.$ajax.get("api/v1/cedar/phone_model_custom_coordinate/" +
                    "?exclude=pk&phone_model__device=" + this.deviceId
                ).then(response => {
                    if (response.data.phonemodelcustomcoordinate.length > 0){
                        this.tableData = response.data.phonemodelcustomcoordinate
                    }
                    else{
                        this.tableData = _.cloneDeep(defaultTableDate)
                    }
                }).catch(error => {
                    if (config.DEBUG) console.log(error)
                    if(error.response.status>=500)
                        this.$Message.error("服务器错误")
                    else
                        this.$Message.error({content:error.response.data.description,duration:6})
                })
            },
            //初始化机型坐标点信息
            resetCoordinateInfo() {
                this.deviceCutCoordinate = {
                    inside_under_right_x: null,
                    inside_under_right_y: null,
                    inside_upper_left_x: null,
                    inside_upper_left_y: null,
                }
                this.tableData = []
                this.phone_model = {
                    id: null,
                    phone_model_name: "",
                    x_dpi: null,
                    y_dpi: null,
                    ply:null
                }
            },
            resetReq(flag){
                this.isSendReq = flag
            },
            onClose(flag){
                this.$emit('on-close',false,flag)
            },
            selectArea(coordinate) {
                this.coordinate = coordinate
            },
            getImg() {
                this.imgSrc = ''
                // this.showScreenArea = false
                // this.showTablePoint = false
                let _this = this

                let url = `http://${this.cabinetIP}:5000/pane/original_picture/?device_label=${this.deviceLabel}&high_exposure=${this.highExposureSwitch?'1':'0'}`
                let xhr = new XMLHttpRequest()
                xhr.open('GET', url, true)
                xhr.responseType = 'blob'
                xhr.send()
                xhr.onload = () => {
                    if(xhr.status===400){
                        let data = xhr.response
                        let reader = new FileReader()
                        reader.readAsText(data,'utf-8')
                        reader.addEventListener("loadend", function (){
                            data = JSON.parse(reader.result )
                            _this.$Message.error({content:"图片获取失败!"+data.description,duration:8})
                        })
                        return
                    }
                    Utils.blobToDataURL(xhr.response).then(res => {
                        this.imgSrc = res
                        this.$nextTick(function () {
                            setTimeout(()=>{
                                if (this.showScreenArea) {
                                    if (this.deviceCutCoordinate.inside_upper_left_x !== this.deviceCutCoordinate.inside_under_right_x) {
                                        this.showSelectedArea("ScreenArea", this.deviceCutCoordinate.inside_upper_left_x, this.deviceCutCoordinate.inside_upper_left_y, this.deviceCutCoordinate.inside_under_right_x, this.deviceCutCoordinate.inside_under_right_y)
                                    }
                                }
                                if (this.showTablePoint) {
                                    if (this.tableData.length>0) {
                                        this.tableData.forEach(item=>{
                                            this.showSelectedPoint(item.name, item.x_coordinate, item.y_coordinate)
                                        })
                                    }
                                }
                            },200)
                        })
                    })
                }
                xhr.onerror = (err) => {
                    this.$Message.error("图片获取失败")
                }
            },
            async getScreenArea() {
                if (this.imgSrc === ''){
                    this.$Message.warning("请等待获取图片")
                    return
                }
                this.$Message.info({content:"正在自动获取，可能需要一些时间",duration:3})
                let data = new FormData()
                data.append('rawImage', Utils.dataURLtoFile(this.imgSrc,"rawImage.jpg"))
                let url = `http://${this.cabinetIP}:5000/pane/get_roi/`
                await this.$ajax.post(url, data)
                    .then(response => {
                        this.areaInfo.inside_upper_left_x = response.data.upper_left_x
                        this.areaInfo.inside_upper_left_y = response.data.upper_left_y
                        this.areaInfo.inside_under_right_x = response.data.under_right_x
                        this.areaInfo.inside_under_right_y = response.data.under_right_y
                        this.showScreenArea = false
                        // this.isScreenUpdate = true
                        this.$Message.success("边框获取成功")
                    }).catch(error=>{
                        this.$Message.error({content:error.response.data.description,duration:8})
                    })
            },
            //手动微调屏幕边框，并在调整后显示新的屏幕边框
            onCoordinateChange(){
                if(this.deviceCutCoordinate.inside_upper_left_x>=this.deviceCutCoordinate.inside_under_right_x){
                    this.$Message.warning({content:"x1的值必须小于x2的值",duration:3})
                    return false
                }
                if(this.deviceCutCoordinate.inside_upper_left_y>this.deviceCutCoordinate.inside_under_right_y){
                    this.$Message.warning({content:"y1的值必须小于y2的值",duration:3})
                    return false
                }
                if(!this.showScreenArea)
                    this.showScreenArea = true
                else {
                    let selector = document.querySelector('.selector')
                    let point = document.querySelectorAll('.point')
                    let area = document.querySelector('.screenarea')
                    let content = document.querySelectorAll('.content')
                    if (area) selector.removeChild(area)
                    if(point){
                        point.forEach(item=>{
                            selector.removeChild(item)
                        })
                        content.forEach(item=>{
                            selector.removeChild(item)
                        })
                    }
                    if (this.showScreenArea) {
                        if (this.deviceCutCoordinate.inside_upper_left_x !== this.deviceCutCoordinate.inside_under_right_x) {
                            this.showSelectedArea("ScreenArea", this.deviceCutCoordinate.inside_upper_left_x, this.deviceCutCoordinate.inside_upper_left_y, this.deviceCutCoordinate.inside_under_right_x, this.deviceCutCoordinate.inside_under_right_y)
                        }
                    }
                    if (this.showTablePoint) {
                        if (this.tableData.length>0) {
                            this.tableData.forEach(item=>{
                                this.showSelectedPoint(item.name, item.x_coordinate, item.y_coordinate)
                            })
                        }
                    }
                }
            },

            setBorder(type) {
                if (!this.coordinate || !this.coordinate.absoluteCoordinate) return
                let {absoluteCoordinate: {topLeft, bottomRight}} = this.coordinate
                topLeft = {
                    x: parseInt(topLeft.x.toFixed(0)),
                    y: parseInt(topLeft.y.toFixed(0))
                }
                bottomRight = {
                    x: parseInt(bottomRight.x.toFixed(0)),
                    y: parseInt(bottomRight.y.toFixed(0))
                }
                if (type === "screen") {
                    if (topLeft.x === bottomRight.x || topLeft.y === bottomRight.y) {
                        this.$Message.warning("屏幕边框必须是一个区域")
                        return
                    }
                } else {
                    if (topLeft.x !== bottomRight.x || topLeft.y !== bottomRight.y) {
                        this.$Message.warning("该项只能选取一个点，不能选取区域")
                        return
                    }
                }
                switch (type) {
                    case "screen":
                        this.areaInfo.inside_upper_left_x = topLeft.x
                        this.areaInfo.inside_upper_left_y = topLeft.y
                        this.areaInfo.inside_under_right_x = bottomRight.x
                        this.areaInfo.inside_under_right_y = bottomRight.y
                        this.showScreenArea = false
                        // this.isScreenUpdate = true
                        if(!this.showTablePoint){
                            this.showTablePoint = true
                        }else {
                            this.$nextTick(function () {
                                let selector1 = document.querySelector('.selector')
                                let point1 = document.querySelectorAll('.point')
                                let content1 = document.querySelectorAll('.content')
                                if(point1){
                                    point1.forEach(item=>{
                                        selector1.removeChild(item)
                                    })
                                    content1.forEach(item=>{
                                        selector1.removeChild(item)
                                    })
                                }
                                if (this.tableData.length>0) {
                                    this.tableData.forEach(item=>{
                                        this.showSelectedPoint(item.name, item.x_coordinate, item.y_coordinate)
                                    })
                                }
                            })
                        }
                        break
                    case "point":
                        if(this.currentIndex===null){
                            this.$Message.warning({content:"请先选择一条数据！",duration:3})
                            return
                        }
                        if(this.deviceCutCoordinate.inside_upper_left_x===null || this.deviceCutCoordinate.inside_under_right_y===null){
                            this.$Message.warning({content:"请先框选边框信息！",duration:3})
                            return
                        }
                        let screenWidth = this.deviceCutCoordinate.inside_under_right_x - this.deviceCutCoordinate.inside_upper_left_x
                        let screenHeight = this.deviceCutCoordinate.inside_under_right_y - this.deviceCutCoordinate.inside_upper_left_y

                        let x_coordinate = (topLeft.x - this.deviceCutCoordinate.inside_upper_left_x) / screenWidth
                        let y_coordinate = (topLeft.y - this.deviceCutCoordinate.inside_upper_left_y) / screenHeight
                        this.areaPoint.x_coordinate = parseFloat(x_coordinate.toFixed(4))
                        this.areaPoint.y_coordinate = parseFloat(y_coordinate.toFixed(4))
                        let selector = document.querySelector('.selector')
                        let point = document.querySelectorAll('.point')
                        let content = document.querySelectorAll('.content')
                        if(point){
                            point.forEach(item=>{
                                selector.removeChild(item)
                            })
                            content.forEach(item=>{
                                selector.removeChild(item)
                            })
                        }
                        this.showTablePoint = false
                        this.showSelectedPoint(this.currentData.name, this.areaPoint.x_coordinate, this.areaPoint.y_coordinate)
                        this.$refs.imgTool.closeArea()
                        break
                }
            },
            setImgInfo(val) {
                this.imgInfo = val
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
                    area.style.background = 'rgba(250,231,76,0.4)'
                    area.style.justifyContent = 'flex-start'
                    area.style.alignItems = 'flex-end'
                }
                area.innerText = text
                selector.appendChild(area)
            },
            showSelectedPoint(text, tlx, tly,) {
                let selector = document.querySelector('.selector')
                let selectorRect = selector.getBoundingClientRect()
                let selectorImgRect = document.querySelector('.selector__img').getBoundingClientRect()
                // 计算图片和div之间的空白偏移量，从而正确计算点的位置
                // imgInfo： 图片原本的大小
                // selectorImgRect：当前页面显示的图片的大小
                let offsetX = (selectorRect.width - selectorImgRect.width) / 2
                let offsetY = (selectorRect.height - selectorImgRect.height) / 2
                // 框 选 边 框 的 大 小
                let screenWidth = this.deviceCutCoordinate.inside_under_right_x - this.deviceCutCoordinate.inside_upper_left_x
                let screenHeight = this.deviceCutCoordinate.inside_under_right_y - this.deviceCutCoordinate.inside_upper_left_y
                let left = offsetX + (tlx * screenWidth + this.deviceCutCoordinate.inside_upper_left_x) / this.imgInfo.width * selectorImgRect.width
                let top = offsetY + (tly * screenHeight + this.deviceCutCoordinate.inside_upper_left_y) / this.imgInfo.height * selectorImgRect.height
                let point = document.createElement('div')
                point.classList.add('point')
                // point.classList.add(text.toLowerCase())
                point.style.display = 'flex'
                point.style.position = 'absolute'
                point.style.left = `${left - 5}px`
                point.style.top = `${top - 5}px`
                point.style.width = `10px`
                point.style.height = `10px`
                point.style.borderRadius = `50%`
                point.style.background = 'rgb(3,107,234)'
                point.style.border = '1px solid white'
                point.style.zIndex = 1000
                // point.innerText = text
                // point.style.paddingLeft = `7px`
                point.style.color = `red`
                let content = document.createElement('div')
                content.classList.add('content')
                content.style.display = 'flex'
                content.style.position = 'absolute'
                content.style.left = `${left + 10}px`
                content.style.top = `${top - 10}px`
                content.style.height = `auto`
                content.innerText = text
                content.style.color = `red`
                content.style.zIndex = 1000
                selector.appendChild(point)
                selector.appendChild(content)
            },
            async saveAreaInfo() {
                for(let i=0;i<this.tableData.length;i++){
                    if(this.tableData[i].x_coordinate===null||this.tableData[i].y_coordinate===null||this.tableData[i].z_coordinate===null){
                        this.$Message.warning({content: "表格内信息不能为空！", duration: 3})
                        return
                    }
                }
                let paramsObj = {
                    inside_under_right_x: this.deviceCutCoordinate.inside_under_right_x,
                    inside_under_right_y: this.deviceCutCoordinate.inside_under_right_y,
                    inside_upper_left_x: this.deviceCutCoordinate.inside_upper_left_x,
                    inside_upper_left_y: this.deviceCutCoordinate.inside_upper_left_y,
                }
                let phone_model_id = this.phone_model.id
                if (paramsObj.inside_under_right_x===null || paramsObj.inside_under_right_y===null
                    || paramsObj.inside_upper_left_x===null || paramsObj.inside_upper_left_y===null) {
                    this.$Message.warning({content: "边框信息不能为空", duration: 3})
                    return
                }
                if(this.phone_model.ply===null){
                    this.$Message.warning({content: "机型厚度不能为空！", duration: 3})
                    return
                }
                let updateList = []
                this.tableData.forEach(item=>{
                    if(item.update)
                        updateList.push(item)
                })
                updateList.forEach(item=>{
                    item.phone_model = this.phone_model.id
                    if(item.update!==undefined)
                        this.$delete(item,'update')
                })
                this.showLoading = true
                let isContinue = true
                // 机 型 厚 度
                await this.$ajax.patch("api/v1/cedar/phone_model/"+phone_model_id+"/", {
                    ply: this.phone_model.ply
                }) .then(res => {
                    isContinue = true
                }).catch(error => {
                    this.showLoading = false
                    isContinue = false
                    if (config.DEBUG) console.log(error)
                    if(error.response.status>=500)
                        this.$Message.error("服务器错误")
                    else
                        this.$Message.error({content:error.response.data.description,duration:6})
                })
                // 边 框 信 息 修 改
                if(isContinue){
                    await this.$ajax.post("api/v1/cedar/control_device_cut_coordinate/", Object.assign({
                        pane_view: this.paneId,
                        phone_model: phone_model_id
                    }, paramsObj))
                        .then(res => {
                            isContinue = true
                            this.$Message.success("边框信息保存成功")
                        }).catch(error => {
                            if (config.DEBUG) console.log(error)
                            this.showLoading = false
                            isContinue = false
                            if(error.response.status>=500)
                                this.$Message.error("服务器错误")
                            else
                                this.$Message.error({content:error.response.data.description,duration:6})
                        })
                }
                // 表 格 按 键 坐 标 点 信 息
                if(updateList.length>0||this.deleteList.length>0&&isContinue){
                    await this.$ajax.post("api/v1/cedar/update_phone_model_custom_coordinate/", {
                        create_or_update_list:updateList,
                        delete_list: this.deleteList
                    }) .then(res => {
                        this.deleteList = []
                        this.tableData.forEach(item=>{
                            this.$delete(item,'update')
                        })
                        this.$Message.success("按键坐标保存成功")
                    }).catch(error => {
                        if (config.DEBUG) console.log(error)
                        this.showLoading = false
                        if(error.response.status>=500)
                            this.$Message.error("服务器错误")
                        else
                            this.$Message.error({content:error.response.data.description,duration:6})
                    })
                }
                this.showLoading = false
                if (this.isSendReq)
                    this.onClose(this.isSendReq)
                else
                    this.onClose(false)
            },
            //------   以 下 是 对 表 格 的 一 些 需 求 操 作 -----------
            onRowClick(row,index){
                this.currentData = row
                this.currentIndex = index
                let selector = document.querySelector('.selector')
                let point = document.querySelectorAll('.point')
                let content = document.querySelectorAll('.content')
                if(point){
                    point.forEach(item=>{
                        selector.removeChild(item)
                    })
                    content.forEach(item=>{
                        selector.removeChild(item)
                    })
                }
                this.showSelectedPoint(row.name, row.x_coordinate, row.y_coordinate,)
            },
            // 点击新建按钮，重置信息。
            onOpenAddModal(){
                this.showModal = true
                this.addInfo = {
                    name:"",
                    z_coordinate:0
                }
            },
            //添加自定义按键信息到表格
            addTableData(){
                if(this.addInfo.name.trim().length===0){
                    this.$Message.warning({content:"名称不能为空！",duration:3})
                    return
                }
                let nameList = []
                this.tableData.forEach(item=>{
                    nameList.push(item.name)
                })
                if(nameList.includes(this.addInfo.name.trim())){
                    this.$Message.warning({content:"名称已存在！",duration:3})
                    return
                }
                if(this.addInfo.z_coordinate==='' || this.addInfo.z_coordinate>10||this.addInfo.z_coordinate<-10){
                    this.$Message.warning({content:"z 的取值范围为[-10,10]！",duration:3})
                    return
                }
                this.tableData.push({
                    name:this.addInfo.name,
                    x_coordinate:null,
                    y_coordinate:null,
                    z_coordinate:this.addInfo.z_coordinate,
                    is_fixed:false,
                    update:true
                })
                this.showModal = false
            },
            //删除某一行的信息
            onDeleteRow(){
                if(this.currentIndex===null){
                    this.$Message.warning("请选择要删除的数据！")
                    return
                }
                if(this.currentData.is_fixed){
                    this.$Message.warning("当前项不允许删除！")
                    return
                }
                let _this = this
                this.$Modal.confirm({
                    title:"提示",
                    content:"确定要删除这条数据吗？",
                    onOk(){
                        let selector = document.querySelector('.selector')
                        let point = document.querySelectorAll('.point')
                        let content = document.querySelectorAll('.content')
                        if(point) {
                            point.forEach(item => {
                                selector.removeChild(item)
                            })
                            content.forEach(item=>{
                                selector.removeChild(item)
                            })
                        }
                        _this.deleteList.push(_this.currentData)
                        _this.tableData.splice(_this.currentIndex,1)
                    }
                })
            },
            // 测 试 点 击 坐 标
            onCoordinateTestClick(){
                if(this.isSentTestReq){
                    this.$Message.info({content:"请等待当前指令执行完成..."})
                    return
                }
                if (this.imgSrc === ''){
                    this.$Message.warning("请先获取图片")
                    return
                }
                if(this.currentIndex===null){
                    this.$Message.warning({content: "请先选择一条数据！", duration: 3})
                    return
                }
                if(this.currentData.x_coordinate===null||this.currentData.y_coordinate===null||this.currentData.z_coordinate===null){
                    this.$Message.warning({content: "请将坐标信息填写完整！", duration: 3})
                    return
                }
                if (this.deviceCutCoordinate.inside_under_right_x===null || this.deviceCutCoordinate.inside_under_right_y===null
                    || this.deviceCutCoordinate.inside_upper_left_x===null || this.deviceCutCoordinate.inside_upper_left_y===null) {
                    this.$Message.warning({content: "边框信息不能为空!", duration: 3})
                    return
                }
                this.$Message.info({content:"正在发送请求..."})
                this.isSentTestReq = true
                let data = new FormData()
                data.append('img', Utils.dataURLtoFile(this.imgSrc,"rawImage.jpg"))
                data.append('device_label', this.deviceLabel)
                data.append('inside_upper_left_x', this.deviceCutCoordinate.inside_upper_left_x)
                data.append('inside_upper_left_y', this.deviceCutCoordinate.inside_upper_left_y)
                data.append('inside_under_right_x', this.deviceCutCoordinate.inside_under_right_x)
                data.append('inside_under_right_y', this.deviceCutCoordinate.inside_under_right_y)
                data.append('x', this.currentData.x_coordinate)
                data.append('y', this.currentData.y_coordinate)
                data.append('z', this.currentData.z_coordinate)

                this.$ajax.post(`http://${this.cabinetIP}:5000/pane/coordinate_click_test/`,data)
                    .then(response=>{
                        this.isSentTestReq = false
                        if(response.data.error_code===0){
                            this.$Message.success({content:"请求成功",duration:3})
                        }else if(response.data.error_code===3013){
                            let _this = this
                            this.$Modal.confirm({
                                title:"提示",
                                content:"机械臂正在使用无法点击，确定要停止当前的动作吗？",
                                onOk(){
                                    data.append('stop_loop_flag', "1")
                                    _this.$ajax.post(`http://${_this.cabinetIP}:5000/pane/coordinate_click_test/`,data)
                                        .then(response=>{
                                            if(response.data.error_code===0){
                                                this.$Message.success({content:"停止成功",duration:5})
                                            } else {
                                                this.$Message.error({content:response.data.description,duration: 10})
                                            }
                                        }).catch(error=>{
                                            if(error.response.status>=500)
                                                this.$Message.error({content:'服务器错误',duration: 5})
                                            else
                                                this.$Message.error({content:'请求失败',duration: 5})
                                        })
                                }
                            })
                        } else{
                            this.$Message.error({content:response.data.description,duration: 10})
                        }
                    }).catch(error=>{
                        this.isSentTestReq = false
                        if(error.response.status>=500)
                            this.$Message.error({content:'服务器错误',duration: 5})
                        else
                            this.$Message.error({content:'请求失败',duration: 5})
                    })
            }
        }
    }
</script>

<style scoped>
    .disabled-input >>> input {
        background-color: #0000;
        color: #515a6e;
        border: #eee dotted 1px;
    }
    /deep/.ivu-form-item {
        margin-bottom: 16px;
    }
    /deep/.ivu-table-overflowX {
        overflow-x: hidden;
    }
    .location-box >>> input{
        text-align: center;
    }
    .location-box .ivu-input-number{
        width: 150px;
    }
    .container {
        display: flex;
        flex-direction: row;
    }

    .panel {
        flex: 2;
        padding: 10px;
        position: relative;
        overflow: auto;
    }

    .panel__footer {
        margin-top: 50px;
        width: calc(100% - 20px);
        display: flex;
        justify-content: space-around;
    }

    .panel_btn {
        width: 46%;
    }

    .input-box {
        display: flex;
        /*justify-content: space-between;*/
    }
    .flex-table{

    }

    .input-box Button {
        border: none;
        box-shadow: none;
    }

    .area-selector {
        flex: 2.5;
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
        margin-bottom: 20px;
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
    .mouse-hover:hover{
        color: #1bbc9c;
    }

    @keyframes turn {
        to {
            transform: rotate(360deg);
        }
    }
</style>
