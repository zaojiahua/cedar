<template>
  <transition>
    <Card dis-hover :title="$t('deviceManagement.info_2')" v-if="addDeviceStep === 1" style="text-align:left;">
      <p style="font-weight: bold;">{{$t('rdsDeviceStatistic.dev')}}：{{$t('deviceManagement.tips_5')}}</p>
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
      <b>{{$t('deviceManagement.tips_9')}}： </b>
      <span style="color: #999999">  {{ deviceNum }} {{$t('functionalTest.pcs')}} </span>
      <p style="color: #999999;margin: 20px 0 40px 0">{{$t('deviceManagement.tips_10')}}</p>
      <Row type="flex" justify="center" style="margin-top: 16px">
        <Button type="primary" @click="getDeviceInDoor">{{$t('public.btn_next')}}</Button>
      </Row>
    </Card>
    <Card dis-hover :title="$t('deviceManagement.info_3')" v-if="addDeviceStep === 2">
      <Form :label-width="130">
        <FormItem>
          <b slot="label"><span class="need">*</span>{{$t('deviceList.device_name')}}</b>
          <Input v-model="addedDeviceName"></Input>
        </FormItem>
        <FormItem>
          <b slot="label">{{$t('rdsDetail.customName')}}</b>
          <Input v-model="addCustomNumber" :maxlength="100"></Input>
        </FormItem>
            <FormItem prop="test_area">
              <b slot="label"><span class="need">*</span>{{$t('deviceList.phone_model')}}</b>
              <Select  @on-change="checkPhoneModelInfo" :placeholder="$t('deviceManagement.info_4')" filterable allow-create>
                <Option v-for="item in phoneModelList" :value="item" :key="item">{{ item }}</Option>
              </Select>
            </FormItem>
        <Divider/>
        <!--<FormItem>-->
          <!--<b slot="label"><span class="need">*</span>屏幕尺寸</b>-->
          <!--<Input style="width: 200px;margin-right: 5px" v-model="deviceInfo.screen_size"></Input><span>英寸</span>-->
        <!--</FormItem>-->
         <!--<FormItem>-->
            <!--&lt;!&ndash;<b slot="label"><span class="need">*</span>Y 分辨率</b>&ndash;&gt;-->
            <!--<InputNumber style="width: 200px;margin-right: 5px" v-model="deviceInfo.height_resolution" placeholder="高度"></InputNumber>-->
            <!--<span>像素</span>-->
         <!--</FormItem>-->
        <!--<FormItem>-->
          <!--<b slot="label"><span class="need">*</span>X 分辨率</b>-->
          <!--<InputNumber style="width: 200px;margin-right: 5px" v-model="deviceInfo.width_resolution" placeholder="宽度"></InputNumber>-->
          <!--<span>像素</span>-->
        <!--</FormItem>-->
        <!--<FormItem>-->
          <!--<b slot="label"><span class="need">*</span>X边框厚度</b>-->
          <!--<InputNumber style="width: 200px;margin-right: 5px" v-model="deviceInfo.x_border" :min="0"-->
                       <!--placeholder="请输入手机左侧边框厚度"></InputNumber>-->
          <!--<span>毫米</span>-->
        <!--</FormItem>-->
        <!--<FormItem>-->
          <!--<b slot="label"><span class="need">*</span>Y边框厚度</b>-->
          <!--<InputNumber style="width: 200px;margin-right:5px" :min="0" v-model="deviceInfo.y_border"-->
                       <!--placeholder="请输入手机顶部边框厚度"></InputNumber>-->
          <!--<span>毫米</span>-->
        <!--</FormItem>-->
        <!--<FormItem>-->
          <!--<b slot="label"><span class="need">*</span>机型高度</b>-->
          <!--<InputNumber style="width: 200px;margin-right:5px" :min="0" v-model="deviceInfo.height"></InputNumber>-->
          <!--<span>毫米</span>-->
        <!--</FormItem>-->
        <!--<FormItem>-->
          <!--<b slot="label"><span class="need">*</span>机型宽度</b>-->
          <!--<InputNumber style="width: 200px;margin-right:5px" :min="0" v-model="deviceInfo.width"></InputNumber>-->
          <!--<span>毫米</span>-->
        <!--</FormItem>-->
        <FormItem>
          <b slot="label"><span class="need">*</span>{{$t('deviceManagement.info_5')}}</b>
          <InputNumber style="width: 200px;margin-right:5px" :min="0" v-model="deviceInfo.ply"></InputNumber>
          <span>$t('deviceManagement.info_6')</span>
        </FormItem>
      </Form>
      <Row type="flex" justify="center">
        <Button type="primary" @click="addDevice()">{{$t('public.btn_add')}}</Button>
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
      addCustomNumber: "",
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
                    this.$Message.error(this.$t('deviceManagement.error_1'))
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
      if (this.addedDeviceName === "" || this.phoneModel === ""
          // || this.deviceInfo.screen_size === ""
          // || this.deviceInfo.x_border === null || this.deviceInfo.width_resolution === null
          // || this.deviceInfo.y_border === null || this.deviceInfo.height_resolution === null
          // || this.deviceInfo.height === null || this.deviceInfo.width === null
          || this.deviceInfo.ply === null) {
        this.$Message.warning(this.$t('deviceManagement.info_1'))
        return
      }
      if (!this.addedDeviceName.match(/^[\u4E00-\u9FA5a-zA-Z0-9()_\-]+$/)) {
         this.$Message.warning({content:this.$t('deviceDetail.tips_9'),duration:5})
         return
      }
      let reg = ['\/','\\',' ','`','~','!','#','$','%','^','&','*','(',')','+','=','<','>','?',':','"','{','}','|','！','￥','…','（','）',
         '《','》','？','：','“','”','【','】','、','；','‘','’','，','。']
       for(let i = 0;i < reg.length;i++ ){
          if(this.phoneModel.indexOf(reg[i])!==-1){
              this.$Message.warning({content:this.$t('deviceManagement.info_7'),duration:5})
              return
          }
       }
      this.$Loading.start()
      this.spinShow = true;
      this.$ajax.post("http://" + this.CabinetIpSelected + ":5000" + "/door/manual_registration/",
          {
            device_name: this.addedDeviceName,
            custom_number: this.addCustomNumber,
            phone_model_name: this.phoneModel,
            // x_border: this.deviceInfo.x_border,
            // width_resolution: this.deviceInfo.width_resolution,
            // y_border: this.deviceInfo.y_border,
            // height_resolution: this.deviceInfo.height_resolution,
            // screen_size: this.deviceInfo.screen_size,
            // width:this.deviceInfo.width,
            // height:this.deviceInfo.height,
            ply:this.deviceInfo.ply,

          }
      ).then(response => {
          if (response.data.error_code === 0) {
          this.$Message.success(this.$t('public.addSuccess'))
          this.getPhoneModelList()
          this.$emit('afterDeviceAddSuccess', response.data)
        }else {
              this.$Message.error({content: response.data.description, duration: 8})
          }
        this.spinShow = false;
        this.$Loading.finish()

      }).catch(reason => {
        this.spinShow = false;
        if(reason.message==='Network Error'){
          this.$Message.error({content:this.$t('deviceManagement.info_8'),duration: 10})
          this.$Loading.error()
          return
        }
        if(reason.response.status>=500)
          this.$Message.error({content:this.$t('public.error_500'),duration: 5})
        else
          this.$Message.error({content:this.$t('public.requestFail'),duration: 5})
        this.$Loading.error()
        this.$emit('afterDeviceAddFailed', reason)
      })
    },
    getDeviceInDoor() {
      if (this.CabinetIpSelected === "") {
        this.$Message.error(this.$t('deviceManagement.error_3'))
        return
      }
      this.addDeviceStep = 2;
      this.deviceInfo = utils.validate(addDeviceSerializer, {})
      this.addedDeviceName = ""
      this.addCustomNumber = ""
    },
    getCabinetInfo() {
        this.$ajax.get("api/v1/cedar/get_cabinet_type_info/?data_type=cabinet_type_data")
            .then(response => {
                this.cabinetList = response.data
            })
            .catch(error => {
                if (config.DEBUG) console.log(error)
                this.$Message.error(this.$t('deviceList.err_1'))
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
                  this.$Message.error(this.$t('deviceManagement.error_1'))
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
            // this.deviceInfo.width = response.data.phonemodels[0].width
            // this.deviceInfo.height = response.data.phonemodels[0].height
            this.deviceInfo.ply = response.data.phonemodels[0].ply
            this.deviceInfo.width_resolution = response.data.phonemodels[0].width_resolution
            this.deviceInfo.height_resolution = response.data.phonemodels[0].height_resolution
            // let length = Math.sqrt(Math.pow(this.deviceInfo.height_resolution, 2) + Math.pow(this.deviceInfo.width_resolution, 2))
            // this.deviceInfo.screen_size = (length / response.data.phonemodels[0].x_dpi).toFixed(2)
          }
        })
      }
      this.phoneModel = item.trim()
      this.deviceInfo.width = null
      this.deviceInfo.height = null
      this.deviceInfo.ply = null
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
