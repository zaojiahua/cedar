<template>
    <transition>
        <Card dis-hover :title="$t('deviceManagement.tips_1')" v-if="addDeviceStep === 1">
            <Steps direction="vertical" :current="-1">
                <Step :title="$t('deviceManagement.tips_2')"></Step>
                <Step :title="$t('deviceManagement.tips_3')"></Step>
                <Step :title="$t('deviceManagement.tips_4')"></Step>
                <Step :title="$t('deviceManagement.tips_5')"></Step>
                <Step :title="$t('deviceManagement.tips_6')"></Step>
            </Steps>
            <Row type="flex" justify="center" style="margin-top: 16px">
                <Button type="primary" @click="getCabinetInfo ">{{$t('public.btn_next')}}</Button>
            </Row>
        </Card>
        <Card dis-hover :title="$t('deviceManagement.tips_7')" v-if="addDeviceStep === 2" style="text-align:left;">
            <br>
            <b>{{$t('deviceManagement.tips_8')}}：</b>
            <Select v-model="CabinetSelected" style="width:150px">
                <OptionGroup v-for="types in cabinetList" :label="types.type">
                    <Option v-for="cabinets in types.val" :value="cabinets.id" :key="cabinets.id"
                            @click.native="onCabinetSelectChange(cabinets.id,cabinets.ip_address)">{{ cabinets.cabinet_name }}</Option>
                </OptionGroup>
            </Select>
            <br>
            <br>
            <b >{{$t('deviceManagement.tips_9')}}： </b>
            <span style="color: #999999">  {{deviceNum}} {{$t('functionalTest.pcs')}} </span>
            <p style="color: #999999;margin: 20px 0 40px 0">{{$t('deviceManagement.tips_10')}}</p>
            <Row>
                <b>{{$t('deviceManagement.tips_11')}}：</b>
                <RadioGroup v-model="deviceType" style="margin-top: -3px;">
                    <Radio :label="1" style="margin-right: 20px;">{{$t('jobDetail.host')}}</Radio>
                    <Radio :label="2">{{$t('deviceDetail.subsidiary_device')}}</Radio>
                </RadioGroup>
            </Row>
            <Row type="flex" justify="center" style="margin-top: 16px">
                <Button type="primary" @click="getDeviceInDoor">{{$t('public.btn_next')}}</Button>
                <!--<Button type="error" @click="addDeviceError('ip侦测失败', '侦测不到该装置的IP位置，请确认待添加设备已连接到系统TMach系统WLAN！')">错误DEMO</Button>-->
            </Row>
        </Card>
        <Card dis-hover :title="$t('deviceManagement.tips_12')" v-if="addDeviceStep === 3">
            <Form :label-width="130">
                <FormItem>
                    <b slot="label"><span class="need">*</span>{{$t('deviceList.device_name')}}</b>
                    <Input v-model="addedDeviceName"></Input>
                </FormItem>
                <FormItem>
                    <b slot="label">{{$t('rdsDetail.customName')}}</b>
                    <Input v-model="customNumber" :maxlength="100"></Input>
                </FormItem>
                <FormItem>
                    <b slot="label">{{$t('deviceList.device_label')}}</b>
                    <Input v-model="deviceInfo.device_label" class="disabled-input" :disabled="true"></Input>
                </FormItem>
                <FormItem>
                    <b slot="label">{{$t('deviceDetail.ip')}}</b>
                    <Input v-model="deviceInfo.ip_address" class="disabled-input" :disabled="true"></Input>
                </FormItem>
                <Divider />
              <FormItem>
                <b slot="label"><span class="need">*</span>{{$t('deviceManagement.manufacturer')}}</b>
                <Select   @on-create="addManufacturer" v-model="deviceInfo.manufacturer" :placeholder="$t('deviceManagement.manufacturerTips')" filterable allow-create>
                  <Option v-for="item in manufacturerList" :value="item">{{ item}}</Option>
                </Select>
              </FormItem>
                <FormItem>
                    <b slot="label">{{$t('deviceDetail.phone_model_name')}}</b>
                    <Input v-model="deviceInfo.phone_model_name" class="disabled-input" :disabled="true"></Input>
                </FormItem>
                <FormItem v-if="deviceType===1">
                    <b slot="label">{{$t('deviceList.rom_version')}}</b>
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
                <!--<FormItem>-->
                    <!--<b slot="label"><span class="need">*</span>X边框厚度</b>-->
                    <!--<InputNumber style="width: 200px;margin-right: 5px" v-model="deviceInfo.x_border"  :min="0" placeholder="请输入手机左侧边框厚度"></InputNumber><span>毫米</span>-->
                <!--</FormItem>-->
                <!--<FormItem>-->
                    <!--<b slot="label"><span class="need">*</span>Y边框厚度</b>-->
                    <!--<InputNumber style="width: 200px;margin-right:5px" :min="0" v-model="deviceInfo.y_border" placeholder="请输入手机顶部边框厚度"></InputNumber><span>毫米</span>-->
                <!--</FormItem>-->
            </Form>
            <Row type="flex" justify="center">
                <Button type="primary" v-if="addBtn" @click="addDevice()">{{$t('public.btn_add')}}</Button>
                <Button type="primary" v-if="rescan" @click="getDeviceInDoor()" style="margin-right: 20px;">{{$t('deviceManagement.btn_1')}}</Button>
                <Button type="primary" v-if="backStepOne" @click="addDeviceStep=2 ">{{$t('deviceManagement.btn_2')}}</Button>
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
        x_dpi:"number",
        y_dpi:"number"
    }

    export default {
        name: "CompAddDevice",
        data() {
            return {
                addDeviceStep: 1,
                addedDeviceName: "",
                customNumber:"",
                deviceInfo: utils.validate(addDeviceSerializer, {}),
                addBtn: true,
                spinShow: false,
                rescan: false,
                backStepOne: false,
                cabinetList: [],
                CabinetSelected: null,
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
                if(this.CabinetSelected)
                    this.$ajax.get("api/v1/cedar/device/?fields=id&cabinet=" + this.CabinetSelected + "&status__in=ReefList[idle{%,%}busy]")
                        .then(response => {
                            this.deviceNum = response.data.devices.length
                        })
                        .catch(error => {
                            if (config.DEBUG) console.log(error);
                            this.$Message.error(this.$t('deviceManagement.error_1'))
                        });
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
                if(this.addedDeviceName.trim().length===0||this.deviceInfo.x_dpi===null
                    ||this.deviceInfo.y_dpi===null||this.deviceInfo.manufacturer===""){
                    this.$Message.warning(this.$t('deviceManagement.info_1'))
                    return
                }
                if (!this.addedDeviceName.match(/^[\u4E00-\u9FA5a-zA-Z0-9()_\-]+$/)) {
                    this.$Message.warning({content:this.$t('deviceDetail.tips_9'),duration:5})
                    return
                }
                this.$Loading.start()
                this.spinShow = true;
                let deviceInfoDict = this.deviceInfo
                deviceInfoDict["deviceName"] = this.addedDeviceName.trim()
                deviceInfoDict["custom_number"] = this.customNumber.trim()
                if(this.deviceType===1) {
                    this.$ajax.post("http://" + this.CabinetIpSelected + ":5000" + "/door/set_device_in_door/",
                        deviceInfoDict
                    ).then(response => {
                        if (response.data.error_code === 0) {
                            this.$Message.success(this.$t('public.addSuccess'))
                            this.$emit('afterDeviceAddSuccess', response.data)
                        } else {
                            this.$Message.error({content: response.data.description, duration: 8})
                        }
                        this.spinShow = false;
                        this.$Loading.finish()

                    }).catch(reason => {
                        this.spinShow = false;
                        if(reason.response.status>=500)
                            this.$Message.error({content:this.$t('public.error_500'),duration: 5})
                        else
                            this.$Message.error({content:this.$t('public.requestFail'),duration: 5})
                        this.$Loading.error()
                        this.$emit('afterDeviceAddFailed', reason)
                    })
                }else if(this.deviceType===2){
                    this.$ajax.post("api/v1/coral/register_subsidiary_device/",{
                        serial_number: deviceInfoDict.device_label,
                        ip_address: deviceInfoDict.ip_address,
                        custom_name: deviceInfoDict.deviceName,
                        custom_number: deviceInfoDict.custom_number,
                        manufacturer: deviceInfoDict.manufacturer,
                        phone_model: {
                            phone_model_name: deviceInfoDict.phone_model_name,
                            // x_border: deviceInfoDict.x_border,
                            // y_border: deviceInfoDict.y_border,
                            x_dpi: deviceInfoDict.x_dpi,
                            y_dpi: deviceInfoDict.y_dpi,
                            height_resolution:deviceInfoDict.height_resolution,
                            width_resolution:deviceInfoDict.width_resolution
                        },
                        cabinet:this.CabinetId
                    }).then(response=>{
                        this.$Message.success(this.$t('public.addSuccess'))
                        this.$emit('afterDeviceAddSuccess', response.data)
                    }).catch(error=>{
                        if(config.DEBUG) console.log(error)
                        this.spinShow = false;
                        this.$Loading.error()
                        this.$Message.error({content:this.$t('deviceManagement.error_2')+error.response.data.message,duration:6})
                    })
                }
            },
            getDeviceInDoor() {
                if (this.CabinetIpSelected === "" ){
                    this.$Message.error(this.$t('deviceManagement.error_3'))
                    return
                }
                if(this.CabinetSelected){
                    this.$ajax.get("api/v1/cedar/device/?fields=id&cabinet=" + this.CabinetSelected)
                        .then(response => {
                            this.deviceNum = response.data.devices.length
                        })
                        .catch(error => {
                            if (config.DEBUG) console.log(error);
                            this.$Message.error(this.$t('deviceManagement.error_1'))
                        });
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
                    this.customNumber = "";
                    //分主机和僚机请求不同的接口获取不同的信息
                    if(this.deviceType===1){
                        this.$ajax
                        .get("http://" + this.CabinetIpSelected + ":5000" + "/door/get_device_in_door/")
                        .then(response => {
                            if(response.data.error_code===0){
                                if (utils.validate(addDeviceSerializer, response.data.data).ip_address === null) {
                                    this.addDeviceError(this.$t('deviceManagement.error_4'), response.data.data.description);
                                    this.addBtn = false;
                                    this.backStepOne = true;
                                    this.deviceInfo = utils.validate(addDeviceSerializer, response.data.data);
                                } else if (utils.validate(addDeviceSerializer, response.data.data).ip_address === "") {
                                    this.addBtn = false;
                                    this.rescan = true;
                                    this.deviceInfo = utils.validate(addDeviceSerializer, response.data.data);
                                    this.addDeviceError(this.$t('deviceManagement.error_5'), this.$t('deviceManagement.error_6'))
                                } else {
                                    this.deviceInfo = utils.validate(addDeviceSerializer, response.data.data);
                                    if (this.manufacturerList.indexOf(this.deviceInfo.manufacturer) === -1)
                                        this.manufacturerList.push(this.deviceInfo.manufacturer)
                                }
                            }else {
                                this.addDeviceError(this.$t('deviceManagement.error_4'), response.data.description);
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
                                    this.addDeviceError(this.$t('deviceDetail.slotTips_5'), response.data.description);
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
                                    this.addDeviceError(this.$t('deviceDetail.slotTips_5'), this.$t('deviceManagement.error_7'))
                                }else if(error.response.data.error_code===1000){
                                    this.addDeviceError(this.$t('deviceDetail.slotTips_5'), this.$t('deviceManagement.error_8'))
                                }else if(error.response.data.error_code===1007){
                                    this.addDeviceError(this.$t('deviceDetail.slotTips_5'),this.$t('deviceManagement.error_9'))
                                }else
                                    this.addDeviceError(this.$t('deviceDetail.slotTips_5'),+error.response.data.description)
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
                        this.$Message.error(this.$t('deviceManagement.error_1'))
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
                        this.$Message.error(this.$t('deviceList.err_1'))
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
