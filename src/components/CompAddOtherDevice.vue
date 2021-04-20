<template>
    <transition>
        <Card dis-hover title="第一步: 设置设备亮度并选择机柜" v-if="addDeviceStep === 1" style="text-align:left;">
            <p style="font-weight: bold;">设备：关闭“自动亮度调节”，调整到适当亮度，并设置屏幕为常亮</p>
            <br>
            <b>机柜列表：</b>
            <i-select v-model="CabinetSelected" style="width:150px">
                <i-option v-for="item in cabinetList" :value="item.id">{{ item.cabinet_name }}</i-option>
            </i-select>
            <br>
            <br>
            <b >机柜内已有设备数量： </b>
            <span style="color: #999999">  {{deviceNum}} 台 </span>
            <p style="color: #999999;margin: 20px 0 40px 0">注：每个机柜建议注册不超过50台设备</p>
            <Row type="flex" justify="center" style="margin-top: 16px">
                <Button type="primary" @click="getDeviceInDoor">下一步</Button>
            </Row>
        </Card>
        <Card dis-hover title="第二步: 添加设备" v-if="addDeviceStep === 2">
            <Form :label-width="130">
                <FormItem>
                    <b slot="label"><span class="need">*</span>自定义名称</b>
                    <Input v-model="addedDeviceName"></Input>
                </FormItem>
                <FormItem>
                    <b slot="label"><span class="need">*</span>设备型号</b>
                    <AutoComplete  v-model="phoneModel"
                                   @on-search="handleSearch"
                                   placeholder="请输入设备型号">
                        <Option v-for="(item,index) in filterPhoneModelNameList" :value="item" :key="index">{{ item }}</Option>
                    </AutoComplete>
                </FormItem>
                <Divider />
                <FormItem>
                    <b slot="label"><span class="need">*</span>屏幕尺寸</b>
                    <Input style="width: 200px;margin-right: 5px" v-model="deviceInfo.screen_size"></Input><span>英寸</span>
                </FormItem>
                <FormItem>
                    <b slot="label"><span class="need">*</span>X 分辨率</b>
                    <InputNumber style="width: 200px;margin-right: 5px" v-model="deviceInfo.device_width"></InputNumber><span>像素</span>
                </FormItem>
                <FormItem>
                    <b slot="label"><span class="need">*</span>Y 分辨率</b>
                    <InputNumber style="width: 200px;margin-right: 5px" v-model="deviceInfo.device_height"></InputNumber><span>像素</span>
                </FormItem>
                <FormItem>
                    <b slot="label"><span class="need">*</span>X边框厚度</b>
                    <InputNumber style="width: 200px;margin-right: 5px" v-model="deviceInfo.x_border"  :min="0" placeholder="请输入手机顶部边框厚度"></InputNumber><span>毫米</span>
                </FormItem>
                <FormItem>
                    <b slot="label"><span class="need">*</span>Y边框厚度</b>
                    <InputNumber style="width: 200px;margin-right:5px" :min="0" v-model="deviceInfo.y_border" placeholder="请输入手机左侧边框厚度"></InputNumber><span>毫米</span>
                </FormItem>
            </Form>
            <Row type="flex" justify="center">
                <Button type="primary" @click="addDevice()">添加</Button>
            </Row>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </Card>
    </transition>
</template>

<script>
    import utils from "../lib/utils"
    import config from "../lib/config"

    const addDeviceSerializer = {
        x_border:"number",
        device_width:"number",
        y_border:"number",
        device_height:"number",
        screen_size:"string"   //屏幕分辨率
    }

    export default {
        name: "CompAddOtherDevice",
        data() {
            return {
                addDeviceStep: 1,
                addedDeviceName: "",
                deviceInfo: utils.validate(addDeviceSerializer, {}),
                spinShow: false,
                cabinetList: [],
                CabinetSelected: '',
                deviceNum: 0,
                CabinetIpSelected: '',
                phoneModel:"",
                phoneModelList:[],
                filterPhoneModelNameList:[],
            }
        },
        methods: {
            reset() {
                this.addDeviceStep = 1
            },
            addDeviceError(title, desc) {
                this.$Notice.error({
                    title: title,
                    desc: desc,
                    duration: 0
                });
            },
            addDevice() {
                if(this.addedDeviceName===""||this.phoneModel===""||this.deviceInfo.screen_size===""||this.deviceInfo.x_border===null||this.deviceInfo.device_width===null||this.deviceInfo.y_border===null||this.deviceInfo.device_height===null){
                    this.$Message.warning("带*项信息不能为空！")
                    return
                }
                this.$Loading.start()
                this.spinShow = true;
                this.$ajax.post("http://" + this.CabinetIpSelected + ":5000" + "/door/manual_registration/",
                    {
                        device_name: this.addedDeviceName,
                        phone_model_name:this.phoneModel,
                        x_border: this.deviceInfo.x_border,
                        device_width:this.deviceInfo.device_width,
                        y_border: this.deviceInfo.y_border,
                        device_height: this.deviceInfo.device_height,
                        screen_size:this.deviceInfo.screen_size

                    }
                ).then(response => {
                    if (response.data.state === "DONE") {
                        this.$Message.success("添加成功")
                        this.$Notice.success({
                            title: '设备即将重启,请稍侯...'
                        });
                        this.$emit('afterDeviceAddSuccess', response.data)
                    }
                    this.spinShow = false;
                    this.$Loading.finish()

                }).catch(reason => {
                    this.spinShow = false;
                    console.log(reason);
                    this.$Message.error({content:"添加失败"+ reason.response.data.description,duration: 5})
                    this.$Loading.error()
                    this.$emit('afterDeviceAddFailed', reason)
                })
            },
            getDeviceInDoor() {
                if (this.CabinetIpSelected === "" ){
                    this.$Message.error("请先选择机柜信息")
                    return
                }
                this.addDeviceStep = 2;
            },
            getCabinetInfo() {
                this.$ajax.get("api/v1/cedar/cabinet/?fields=ip_address,cabinet_name,id&is_delete=False")
                    .then(response => {
                        this.cabinetList = response.data.cabinets
                    })
                    .catch(error => {
                        if (config.DEBUG) console.log(error)
                        this.$Message.error("取得机柜信息出错")
                    })
            },
            getPhoneModelList(){
                this.$ajax.get(
                    "api/v1/cedar/phone_model/?fields=" +
                    "id," +
                    "phone_model_name"
                ).then(response=>{
                    this.phoneModelList = []
                    response.data.phonemodels.forEach(item=>{
                        this.phoneModelList.push(item.phone_model_name)
                    })
                })
            },
            handleSearch (value) {
                let list = [];
                if(this.phoneModelList.toString().toUpperCase().indexOf(value.toUpperCase())!==-1){
                    this.phoneModelList.forEach(item=>{
                        if(item.toUpperCase().indexOf(value.toUpperCase())!==-1)
                            list.push(item)
                    })
                }
                this.filterPhoneModelNameList = list
            },
        },
        watch: {
            CabinetSelected: function (newId, oldId) {
                this.$ajax.get("api/v1/cedar/device/?fields=id&cabinet=" + this.CabinetSelected)
                    .then(response => {
                        this.deviceNum = response.data.devices.length
                    })
                    .catch(error => {
                        if (config.DEBUG) console.log(error);
                        this.$Message.error("获取设备数量出错")
                    });
                for (let cabinet of this.cabinetList) {
                    if (cabinet.id === newId) {
                        this.CabinetIpSelected = cabinet.ip_address
                    }
                }
            }
        },
        created(){
            this.getCabinetInfo()
            this.getPhoneModelList()
        }
    }
</script>

<style scoped>
    .need{
        color: #ff0000;
        margin-right: 5px;
        vertical-align: middle;
    }
</style>
