<template>
    <transition>
        <Card dis-hover title="第一步: 请对待添加设备执行" v-if="addDeviceStep === 1">
            <Steps direction="vertical" :current="-1">
                <Step title="将设备添加到专用USB接口"></Step>
                <Step title="将添加设备连接到TMach系统WLAN"></Step>
                <Step title='开启"USB调试功能"与"通过USB安装APP"'></Step>
                <Step title='关闭"自动亮度调节"，并调整到适当亮度，同时设置屏幕为常亮'></Step>
                <Step title='请在待添加设备弹出窗口中勾选 始终允许这台计算机进行调试 如果已设置，可直接点击"下一步'></Step>
            </Steps>
            <Row type="flex" justify="center" style="margin-top: 16px">
                <Button type="primary" @click="getCabinetInfo ">下一步</Button>
            </Row>
        </Card>
        <Card dis-hover title="第二步: 选择机柜" v-if="addDeviceStep === 2" style="text-align:left;">
            <br>
            <b>机柜列表：</b>
            <Select v-model="CabinetSelected" style="width:150px">
                <OptionGroup v-for="types in cabinetList" :label="types.type">
                    <Option v-for="cabinets in types.val" :value="cabinets.id" :key="cabinets.id"
                            @click.native="onCabinetSelectChange(cabinets.id,cabinets.ip_address)">{{ cabinets.cabinet_name }}</Option>
                </OptionGroup>
            </Select>
            <br>
            <br>
            <b >机柜内已有设备数量： </b>
            <span style="color: #999999">  {{deviceNum}} 台 </span>
            <p style="color: #999999;margin: 20px 0 40px 0">注：每个机柜建议注册不超过50台设备</p>
            <Row>
                <b>设备类型：</b>
                <RadioGroup v-model="deviceType" style="margin-top: -3px;">
                    <Radio :label="1" style="margin-right: 20px;">主机</Radio>
                    <Radio :label="2">僚机</Radio>
                </RadioGroup>
            </Row>
            <Row type="flex" justify="center" style="margin-top: 16px">
                <Button type="primary" @click="getDeviceInDoor">下一步</Button>
                <!--<Button type="error" @click="addDeviceError('ip侦测失败', '侦测不到该装置的IP位置，请确认待添加设备已连接到系统TMach系统WLAN！')">错误DEMO</Button>-->
            </Row>
        </Card>
        <Card dis-hover title="第三步: 添加设备" v-if="addDeviceStep === 3">
            <Form :label-width="130">
                <FormItem>
                    <b slot="label"><span class="need">*</span>自定义名称</b>
                    <Input v-model="addedDeviceName"></Input>
                </FormItem>
                <FormItem>
                    <b slot="label">设备编号</b>
                    <Input v-model="deviceInfo.device_label" class="disabled-input" :disabled="true"></Input>
                </FormItem>
                <FormItem>
                    <b slot="label">IP地址</b>
                    <Input v-model="deviceInfo.ip_address" class="disabled-input" :disabled="true"></Input>
                </FormItem>
                <Divider />
              <FormItem>
                <b slot="label"><span class="need">*</span>厂商名称</b>
                <Select   @on-create="addManufacturer" v-model="deviceInfo.manufacturer" placeholder="请选择或新建厂商信息" filterable allow-create>
                  <Option v-for="item in manufacturerList" :value="item">{{ item}}</Option>
                </Select>
              </FormItem>
                <FormItem>
                    <b slot="label">手机型号</b>
                    <Input v-model="deviceInfo.phone_model_name" class="disabled-input" :disabled="true"></Input>
                </FormItem>
                <FormItem v-if="deviceType===1">
                    <b slot="label">Rom版本</b>
                    <Input v-model="deviceInfo.rom_version"></Input>
                </FormItem>
                <FormItem>
                    <b slot="label"><span class="need">*</span>Xdpi</b>
                    <InputNumber style="width: 324px" v-model="deviceInfo.x_dpi"></InputNumber>
                </FormItem>
                <FormItem>
                    <b slot="label"><span class="need">*</span>Ydpi</b>
                    <InputNumber style="width: 324px" v-model="deviceInfo.y_dpi"></InputNumber>
                </FormItem>
                <FormItem>
                    <b slot="label"><span class="need">*</span>X边框厚度</b>
                    <InputNumber style="width: 200px;margin-right: 5px" v-model="deviceInfo.x_border"  :min="0" placeholder="请输入手机左侧边框厚度"></InputNumber><span>毫米</span>
                </FormItem>
                <FormItem>
                    <b slot="label"><span class="need">*</span>Y边框厚度</b>
                    <InputNumber style="width: 200px;margin-right:5px" :min="0" v-model="deviceInfo.y_border" placeholder="请输入手机顶部边框厚度"></InputNumber><span>毫米</span>
                </FormItem>
            </Form>
            <Row type="flex" justify="center">
                <Button type="primary" v-if="addBtn" @click="addDevice()">添加</Button>
                <Button type="primary" v-if="rescan" @click="getDeviceInDoor()" style="margin-right: 20px;">重新扫描</Button>
                <Button type="primary" v-if="backStepOne" @click="addDeviceStep=2 ">返回上一步</Button>
            </Row>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </Card>
    </transition>
</template>

<script>
    import utils from "../lib/utils"
    import config from "../lib/config"

    const addDeviceSerializer = {
        cpu_name: "string",
        cpu_id: "string",
        rom_version: "string",
        device_label: "string",
        ip_address: "string",
        phone_model_name:"string",
        manufacturer:"string",
        x_border:"number",
        x_dpi:"number",
        y_border:"number",
        y_dpi:"number"
    }

    export default {
        name: "CompAddDevice",
        data() {
            return {
                addDeviceStep: 1,
                addedDeviceName: "",
                deviceInfo: utils.validate(addDeviceSerializer, {}),
                addBtn: true,
                spinShow: false,
                rescan: false,
                backStepOne: false,
                cabinetList: [],
                CabinetSelected: '',
                CabinetId:null,
                deviceNum: 0,
                CabinetIpSelected: '',
                deviceType:1,
                manufacturerList:[]
            }
        },
        methods: {
            reset() {
                this.addDeviceStep = 1
            },
            setManufacturer(item){
              this.deviceInfo.manufacturer = item
              // this.manufacturerList.push(item)
            },
            addManufacturer (item){
              this.manufacturerList.push(item)
            },
            addDeviceError(title, desc) {
                this.$Notice.error({
                    title: title,
                    desc: desc,
                    duration: 0
                });
            },
            addDevice() {
              if(this.addedDeviceName.trim().length===0||this.deviceInfo.x_border===null||this.deviceInfo.x_dpi===null
                    ||this.deviceInfo.y_border===null||this.deviceInfo.y_dpi===null||this.deviceInfo.manufacturer===""){
                    this.$Message.warning("带*项信息不能为空！")
                    return
                }
                this.$Loading.start()
                this.spinShow = true;
                let deviceInfoDict = this.deviceInfo
                deviceInfoDict["deviceName"] = this.addedDeviceName.trim()
                if(this.deviceType===1) {
                    this.$ajax.post("http://" + this.CabinetIpSelected + ":5000" + "/door/set_device_in_door/",
                        deviceInfoDict
                    ).then(response => {
                        if (response.data.error_code === 0) {
                            this.$Message.success("添加成功")
                            this.$Notice.success({
                                title: '设备即将重启,请稍侯...'
                            });
                            this.$emit('afterDeviceAddSuccess', response.data)
                        } else {
                            this.$Message.error({content: response.data.description, duration: 8})
                        }
                        this.spinShow = false;
                        this.$Loading.finish()

                    }).catch(reason => {
                        this.spinShow = false;
                        if(reason.response.status>=500)
                            this.$Message.error({content:'服务器错误',duration: 5})
                        else
                            this.$Message.error({content:'请求失败',duration: 5})
                        this.$Loading.error()
                        this.$emit('afterDeviceAddFailed', reason)
                    })
                }else if(this.deviceType===2){
                    this.$ajax.post("api/v1/coral/register_subsidiary_device/",{
                        serial_number: deviceInfoDict.device_label,
                        ip_address: deviceInfoDict.ip_address,
                        custom_name: deviceInfoDict.deviceName,
                        manufacturer: deviceInfoDict.manufacturer,
                        phone_model: {
                            phone_model_name: deviceInfoDict.phone_model_name,
                            x_border: deviceInfoDict.x_border,
                            y_border: deviceInfoDict.y_border,
                            x_dpi: deviceInfoDict.x_dpi,
                            y_dpi: deviceInfoDict.y_dpi,
                        },
                        cabinet:this.CabinetId
                    }).then(response=>{
                        this.$Message.success("添加成功")
                        this.$emit('afterDeviceAddSuccess', response.data)
                    }).catch(error=>{
                        if(config.DEBUG) console.log(error)
                        this.spinShow = false;
                        this.$Loading.error()
                        this.$Message.error({content:"僚机添加失败！"+error.response.data.message,duration:6})
                    })
                }
            },
            getDeviceInDoor() {
                if (this.CabinetIpSelected === "" ){
                    this.$Message.error("请先选择机柜信息")
                    return
                }
                this.deviceInfo = utils.validate(addDeviceSerializer, {});
                // else{
                    this.addDeviceStep = 3;
                    this.addBtn = true;
                    this.rescan = false;
                    this.backStepOne = false;
                    this.spinShow = true;
                    this.$Loading.start();
                    this.addedDeviceName = "";
                    //分主机和僚机请求不同的接口获取不同的信息
                    if(this.deviceType===1){
                        this.$ajax
                        .get("http://" + this.CabinetIpSelected + ":5000" + "/door/get_device_in_door/")
                        .then(response => {
                            if(response.data.error_code===0){
                                if (utils.validate(addDeviceSerializer, response.data.data).ip_address === null) {
                                    this.addDeviceError('扫描设备失败', response.data.data.description);
                                    this.addBtn = false;
                                    this.backStepOne = true;
                                    this.deviceInfo = utils.validate(addDeviceSerializer, response.data.data);
                                } else if (utils.validate(addDeviceSerializer, response.data.data).ip_address === "") {
                                    this.addBtn = false;
                                    this.rescan = true;
                                    this.deviceInfo = utils.validate(addDeviceSerializer, response.data.data);
                                    this.addDeviceError('ip侦测失败', '侦测不到该设备的IP地址，请确认待添加设备已连接到TMach系统WLAN！')
                                } else {
                                    this.deviceInfo = utils.validate(addDeviceSerializer, response.data.data);
                                    if (this.manufacturerList.indexOf(this.deviceInfo.manufacturer) === -1)
                                        this.manufacturerList.push(this.deviceInfo.manufacturer)
                                }
                            }else {
                                this.addDeviceError('扫描设备失败', response.data.description);
                                this.addBtn = false;
                                this.rescan = true;
                            }
                            this.$Loading.finish();
                            this.spinShow = false;
                        })
                        .catch(error => {
                            this.addBtn = false;
                            this.rescan = true;
                            if (config.DEBUG) console.log(error)
                            this.spinShow = false;
                            this.$Loading.error();
                            this.$Message.error({content:error.response.data.description,duration: 10})
                        })
                    }else if(this.deviceType=== 2){
                        this.$ajax.get("http://" + this.CabinetIpSelected + ":5000" + "/door/get_assistance_device_in_door/")
                            .then(response => {
                                if(response.data.error_code===0) {
                                    this.deviceInfo = utils.validate(addDeviceSerializer, response.data.data)
                                    this.spinShow = false;
                                    if (this.manufacturerList.indexOf(this.deviceInfo.manufacturer) === -1)
                                        this.manufacturerList.push(this.deviceInfo.manufacturer)
                                }else {
                                    this.addDeviceError('僚机信息获取失败', response.data.description);
                                    this.addBtn = false;
                                    this.backStepOne = true;
                                    this.rescan = true;
                                    this.spinShow = false;
                                }
                            })
                            .catch(error => {
                                if (config.DEBUG) console.log(error)
                                this.addBtn = false;
                                this.backStepOne = true;
                                this.rescan = true;
                                this.spinShow = false;
                                if(error.response.data.error_code===1001){
                                    this.addDeviceError('僚机信息获取失败', '请确认当前设备是否连接到TMach系统中')
                                }else if(error.response.data.error_code===1000){
                                    this.addDeviceError('僚机信息获取失败', '请确认当前系统中是否连接了多个僚机设备')
                                }else if(error.response.data.error_code===1007){
                                    this.addDeviceError('僚机信息获取失败','该设备已被注册，请先将其移除，再进行操作')
                                }else
                                    this.addDeviceError('僚机信息获取失败 ',+error.response.data.description)
                            })
                    }
            },
            onCabinetSelectChange(val,ip){
                this.$ajax.get("api/v1/cedar/device/?fields=id&cabinet=" + this.CabinetSelected + "&status__in=ReefList[idle{%,%}busy]")
                    .then(response => {
                        this.deviceNum = response.data.devices.length
                    })
                    .catch(error => {
                        if (config.DEBUG) console.log(error);
                        this.$Message.error("获取设备数量出错")
                    });
                    this.CabinetIpSelected = ip
                    this.CabinetId = val
            },
            getCabinetInfo() {
                this.addDeviceStep = 2;
                this.$ajax.get("api/v1/cedar/get_cabinet_type_info/?data_type=cabinet_type_data")
                    .then(response => {
                        this.cabinetList = response.data
                    })
                    .catch(error => {
                        if (config.DEBUG) console.log(error)
                        this.$Message.error("取得机柜信息出错")
                    })
            }
        },
        created() {
          this.$ajax.get(
              "api/v1/cedar/manufacturer/?fields=" +
              "id," +
              "manufacturer_name"
          ).then(response => {
            this.manufacturerList = []
            response.data.manufacturers.forEach(item => {
              this.manufacturerList.push(item.manufacturer_name)
            })
          })
        }
    }
</script>

<style scoped>
    .disabled-input >>> input {
        background-color: #0000;
        color: #515a6e;
        border: #eee dotted 1px;
    }
    .need{
        color: #ff0000;
        margin-right: 5px;
        vertical-align: middle;
    }
    /deep/.ivu-select-group-title{
        color: #c5c8ce;
    }
</style>
