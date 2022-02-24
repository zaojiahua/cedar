<template>
  <transition>
    <Card dis-hover title="第一步: 设置设备亮度并选择机柜" v-if="addDeviceStep === 1" style="text-align:left;">
      <p style="font-weight: bold;">设备：关闭“自动亮度调节”，调整到适当亮度，并设置屏幕为常亮</p>
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
      <b>机柜内已有设备数量： </b>
      <span style="color: #999999">  {{ deviceNum }} 台 </span>
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
            <FormItem label="设备型号" prop="test_area">
              <Select  @on-change="checkPhoneModelInfo" placeholder="请选择或新建设备型号" filterable allow-create>
                <Option v-for="item in phoneModelList" :value="item">{{ item}}</Option>
              </Select>
            </FormItem>
        <Divider/>
        <FormItem>
          <b slot="label"><span class="need">*</span>屏幕尺寸</b>
          <Input style="width: 200px;margin-right: 5px" v-model="deviceInfo.screen_size"></Input><span>英寸</span>
        </FormItem>
         <FormItem>
            <b slot="label"><span class="need">*</span>Y 分辨率</b>
            <InputNumber style="width: 200px;margin-right: 5px" v-model="deviceInfo.height_resolution" placeholder="高度"></InputNumber>
            <span>像素</span>
         </FormItem>
        <FormItem>
          <b slot="label"><span class="need">*</span>X 分辨率</b>
          <InputNumber style="width: 200px;margin-right: 5px" v-model="deviceInfo.width_resolution" placeholder="宽度"></InputNumber>
          <span>像素</span>
        </FormItem>
        <FormItem>
          <b slot="label"><span class="need">*</span>X边框厚度</b>
          <InputNumber style="width: 200px;margin-right: 5px" v-model="deviceInfo.x_border" :min="0"
                       placeholder="请输入手机左侧边框厚度"></InputNumber>
          <span>毫米</span>
        </FormItem>
        <FormItem>
          <b slot="label"><span class="need">*</span>Y边框厚度</b>
          <InputNumber style="width: 200px;margin-right:5px" :min="0" v-model="deviceInfo.y_border"
                       placeholder="请输入手机顶部边框厚度"></InputNumber>
          <span>毫米</span>
        </FormItem>
        <FormItem>
          <b slot="label">机型高度</b>
          <InputNumber style="width: 200px;margin-right:5px" :min="0" v-model="deviceInfo.height"></InputNumber>
          <span>毫米</span>
        </FormItem>
        <FormItem>
          <b slot="label">机型宽度</b>
          <InputNumber style="width: 200px;margin-right:5px" :min="0" v-model="deviceInfo.width"></InputNumber>
          <span>毫米</span>
        </FormItem>
        <FormItem>
          <b slot="label"><span class="need">*</span>机型厚度</b>
          <InputNumber style="width: 200px;margin-right:5px" :min="0" v-model="deviceInfo.ply"></InputNumber>
          <span>毫米</span>
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
  x_border: "number",
  width_resolution: "number",
  y_border: "number",
  height_resolution: "number",
  screen_size: "string",   //屏幕分辨率
  height:"number",
  width:"number",
  ply:"number"
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
      CabinetSelected: null,
      deviceNum: 0,
      CabinetIpSelected: '',
      phoneModel: "",
      phoneModelList: [],
      filterPhoneModelNameList: [],
    }
  },
  methods: {
    reset() {
      this.addDeviceStep = 1
        if(this.CabinetSelected){
            this.$ajax.get("api/v1/cedar/device/?fields=id&cabinet=" + this.CabinetSelected)
                .then(response => {
                    this.deviceNum = response.data.devices.length
                })
                .catch(error => {
                    if (config.DEBUG) console.log(error);
                    this.$Message.error("获取设备数量出错")
                });
        }
    },
    addDeviceError(title, desc) {
      this.$Notice.error({
        title: title,
        desc: desc,
        duration: 0
      });
    },
    addDevice() {
      if (this.addedDeviceName === "" || this.phoneModel === "" || this.deviceInfo.screen_size === ""
          || this.deviceInfo.x_border === null || this.deviceInfo.width_resolution === null
          || this.deviceInfo.y_border === null || this.deviceInfo.height_resolution === null || this.deviceInfo.ply === null) {
        this.$Message.warning("带*项信息不能为空！")
        return
      }
      this.$Loading.start()
      this.spinShow = true;
      this.$ajax.post("http://" + this.CabinetIpSelected + ":5000" + "/door/manual_registration/",
          {
            device_name: this.addedDeviceName,
            phone_model_name: this.phoneModel,
            x_border: this.deviceInfo.x_border,
            width_resolution: this.deviceInfo.width_resolution,
            y_border: this.deviceInfo.y_border,
            height_resolution: this.deviceInfo.height_resolution,
            screen_size: this.deviceInfo.screen_size,
            width:this.deviceInfo.width,
            height:this.deviceInfo.height,
            ply:this.deviceInfo.ply,

          }
      ).then(response => {
          if (response.data.error_code === 0) {
          this.$Message.success("添加成功")
          this.$Notice.success({
            title: '设备即将重启,请稍侯...'
          });
          this.$emit('afterDeviceAddSuccess', response.data)
        }else {
              this.$Message.error({content: response.data.description, duration: 8})
          }
        this.spinShow = false;
        this.$Loading.finish()

      }).catch(reason => {
        this.spinShow = false;
        if(reason.message==='Network Error'){
          this.$Message.error({content:'添加失败！请检查电脑网络连接是否正确',duration: 10})
          this.$Loading.error()
          return
        }
        if(reason.response.status>=500)
          this.$Message.error({content:'服务器错误',duration: 5})
        else
          this.$Message.error({content:'请求失败',duration: 5})
        this.$Loading.error()
        this.$emit('afterDeviceAddFailed', reason)
      })
    },
    getDeviceInDoor() {
      if (this.CabinetIpSelected === "") {
        this.$Message.error("请先选择机柜信息")
        return
      }
      this.addDeviceStep = 2;
      this.deviceInfo = utils.validate(addDeviceSerializer, {})
      this.addedDeviceName = ""
    },
    getCabinetInfo() {
        this.$ajax.get("api/v1/cedar/get_cabinet_type_info/?data_type=cabinet_type_data")
            .then(response => {
                this.cabinetList = response.data
            })
            .catch(error => {
                if (config.DEBUG) console.log(error)
                this.$Message.error("取得机柜信息出错")
            })
    },
    getPhoneModelList() {
      this.$ajax.get(
          "api/v1/cedar/phone_model/?fields=" +
          "id," +
          "phone_model_name"
      ).then(response => {
        this.phoneModelList = []
        response.data.phonemodels.forEach(item => {
          this.phoneModelList.push(item.phone_model_name)
        })
      })
    },
    handleSearch(value) {
      let list = [];
      if (this.phoneModelList.toString().toUpperCase().indexOf(value.toUpperCase()) !== -1) {
        this.phoneModelList.forEach(item => {
          if (item.toUpperCase().indexOf(value.toUpperCase()) !== -1)
            list.push(item)
        })
      }
      this.filterPhoneModelNameList = list
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
      },
    async checkPhoneModelInfo(item)
    {
      if (this.phoneModelList.indexOf(item) !== -1) {
        this.$ajax.get(
            `api/v1/cedar/phone_model/?phone_model_name=${item}&fields=x_border,y_border,x_dpi,width,height,ply,height_resolution,width_resolution`
        ).then(response => {
          if (response.data.phonemodels.length > 0){
            this.deviceInfo.x_border = response.data.phonemodels[0].x_border
            this.deviceInfo.y_border = response.data.phonemodels[0].y_border
            this.deviceInfo.width = response.data.phonemodels[0].width
            this.deviceInfo.height = response.data.phonemodels[0].height
            this.deviceInfo.ply = response.data.phonemodels[0].ply
            this.deviceInfo.width_resolution = response.data.phonemodels[0].width_resolution
            this.deviceInfo.height_resolution = response.data.phonemodels[0].height_resolution
            let length = Math.sqrt(Math.pow(this.deviceInfo.height_resolution, 2) + Math.pow(this.deviceInfo.width_resolution, 2))
            this.deviceInfo.screen_size = (length / response.data.phonemodels[0].x_dpi).toFixed(2)
          }
        })
      }
      this.phoneModel = item
    }

  },
  created() {
    this.getCabinetInfo()
    this.getPhoneModelList()
  }
}
</script>

<style scoped>
.need {
  color: #ff0000;
  margin-right: 5px;
  vertical-align: middle;
}
</style>
