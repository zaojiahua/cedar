<template>
    <div>
        <Tabs type="card">
            <TabPane v-for="column in filterColumn" :label="column.title" :key="column.key">
                <div style="max-height: 130px;overflow: auto">
                    <Row v-if="column.title==='测试用途'||column.title==='自定义标签'" style="text-align: right;margin-right: 20px">
                        <i-switch v-model="filterType" size="large" @on-change="onOrderChange">
                            <span slot="open">用例</span>
                            <span slot="close">字母</span>
                        </i-switch>
                    </Row>
                    <CheckboxGroup v-model="checked" @on-change="onChange">
                        <Row type="flex">
                            <Col span="4" v-for="(item, index) in filterData[column.key]" :key="item.id">
                                <Checkbox :label="column.key+'_:_'+item.id+'_:_'+item[column.item_key]">
                                    {{item[column.item_key]}}
                                </Checkbox>
                            </Col>
                        </Row>
                    </CheckboxGroup>
                </div>

            </TabPane>
        </Tabs>
        <Row style="margin-top: 16px; border-bottom: 1px solid #dcdee2;">
            <Tag v-for="column in filterColumn" :key="column.key" :color="getTagColor(column.key)"
                 style="cursor: default;">{{column.title}}
            </Tag>
        </Row>
        <Row type="flex" style="margin-top: 16px;">
            <Tag closable @on-close="closeTag" v-for="item in checked" :color="getTagColor(item.split('_:_')[0])"
                 :name="item" :key="item">{{item.split('_:_')[2]}}
            </Tag>
        </Row>
        <Row style="margin-top: 16px;">
            <Button @click="checked=[]; onChange()">清空</Button>
        </Row>
        <Divider></Divider>
    </div>
</template>

<script>
    import utils from "../lib/utils";
    import config from "../lib/config";

    const getPhoneModelSerializer = {
        phonemodels: [
            {
                id: "number",
                phone_model_name: "string"
            }
        ]
    }
    const getJobTestAreaSerializer = {
        jobtestareas: [
            {
                id: "number",
                description: "string"
            }
        ]
    }
    const getAndroidVersionSerializer = {
        androidversions: [
            {
                id: "number",
                version: "string"
            }
        ]
    }
    const getRomVersionSerializer = {
        romversions: [
            {
                id: "number",
                version: "string"
            }
        ]
    }
    const getReefUserSerializer = {
        reefusers: [
            {
                id: "number",
                username: "string",
                last_name: "string"
            }
        ]
    }
    const getCustomTagSerializer = {
        customtags: [
            {
                id: "number",
                custom_tag_name: "string"
            }
        ]
    }
    const getJobAssessmentValue = {
        job_assessment_value:[
            {
                id:1,
                job_assessment:"成功"
            },
            {
                id:2,
                job_assessment:"失败"
            },
            {
                id:3,
                job_assessment:"无效"
            }
        ]
    }
    const getOrderSerializer = [
        {
            id: "number",
            name: "string",
            job_count:"number"
        }
    ]

    export default {
        name: "CompFilter",
        props: {
            propAutoLoad: {
                type: Boolean,
                default: true
            },
            propFilterColumn: {
                type: Array,
                default: () => {
                    return ["phone_model", "job_test_area", "android_version", "rom_version", "reefuser", "custom_tag","cabinet_type"]
                }
            },
            propRdsFilter: {
                type: Boolean,
                default: false
            },
            propDefaultDevice:{
                type: Array,
                default: () => {
                    return []
                }
            }
        },
        data() {
            return {
                filterColumn: [
                    {
                        title: "适用机型",
                        key: "phone_model",
                        item_key: "phone_model_name",
                    },
                    {
                        title: "测试用途",
                        key: "job_test_area",
                        item_key: "description"
                    },
                    {
                        title: "安卓版本",
                        key: "android_version",
                        item_key: "version"
                    },
                    {
                        title: "ROM版本",
                        key: "rom_version",
                        item_key: "version"
                    },
                    {
                        title: "维护人员",
                        key: "reefuser",
                        item_key: "username"
                    },
                    {
                        title: "自定义标签",
                        key: "custom_tag",
                        item_key: "custom_tag_name"
                    },
                    {
                        title: "测试柜类型",
                        key: "type",
                        item_key: "type"
                    }
                ],
                filterData: {},
                checked: [],
                defaultPhoneModelList:{},
                filterType:true,
            }

        },
        methods: {
            getTagColor(type) {
                if (type === "phone_model") return "default"
                if (type === "job_test_area") return "red"
                if (type === "android_version") return "orange"
                if (type === "rom_version") return "cyan"
                if (type === "reefuser") return "blue"
                if (type === "custom_tag") return "purple"
                if (type === "type") return "geekblue"
                return "default"
            },
            closeTag(event, name) {
                this.checked.splice(this.checked.indexOf(name), 1)
                this.onChange()
            },
            _jobRender(){
                let selectedData = {}
                this.checked.forEach(item => {
                    let info = item.split('_:_')
                    let type = info[0]
                    let id = parseInt(info[1])
                    if (selectedData[type] === undefined) selectedData[type] = []
                    this.filterData[type].forEach(item=>{
                        if(item.id===id)
                            selectedData[type].push(item)
                    })
                })
                return selectedData;
            },
            onChange() {
                let selectedData = this._jobRender()
                this.$emit('on-change', selectedData)
            },
            // 按照用例数量/首字母顺序排序  true:用例  false:字母
            onOrderChange(flag){
                let requests = []
                if(flag)
                    requests = [
                        this.$ajax.get("api/v1/cedar/job_label_order/?label_name=JobTestArea"),
                        this.$ajax.get("api/v1/cedar/job_label_order/?label_name=CustomTag")
                    ]
                else
                    requests = [
                        this.$ajax.get(
                            "api/v1/cedar/job_test_area/?fields=" +
                            "id," +
                            "description" +
                            "&ordering=description"
                        ),
                        this.$ajax.get(
                            "api/v1/cedar/custom_tag/?fields=" +
                            "id," +
                            "custom_tag_name" +
                            "&ordering=custom_tag_name"
                        )
                    ]
                this.$ajax.all(requests)
                    .then(this.$ajax.spread((job_test_area_resp,custom_tag_resp) => {
                        if(flag){
                            let job_test_area_list = utils.validate(getOrderSerializer, job_test_area_resp.data)
                            let custom_tag_list = utils.validate(getOrderSerializer, custom_tag_resp.data)
                            job_test_area_list.forEach(item=>{
                                item.description = item.name
                            })
                            custom_tag_list.forEach(item=>{
                                item.custom_tag_name = item.name
                            })
                            this.filterData.job_test_area = job_test_area_list
                            this.filterData.custom_tag = custom_tag_list
                        }else {
                            this.filterData.job_test_area = utils.validate(getJobTestAreaSerializer, job_test_area_resp.data).jobtestareas
                            this.filterData.custom_tag = utils.validate(getCustomTagSerializer, custom_tag_resp.data).customtags
                        }
                    })).catch(reason => {
                        if (config.DEBUG) console.log(reason)
                        this.$Message.error("载入失败")
                    })
            }
        },
        created() {
            if (!this.propAutoLoad) return

            let requests = [
                this.$ajax.get(
                    "api/v1/cedar/phone_model/?fields=" +
                    "id," +
                    "phone_model_name" +
                    "&ordering=phone_model_name"
                ),
                this.$ajax.get(
                    "api/v1/cedar/android_version/?fields=" +
                    "id," +
                    "version" +
                    "&ordering=version"
                ),
                this.$ajax.get(
                    "api/v1/cedar/rom_version/?fields=" +
                    "id," +
                    "version" +
                    "&ordering=version"
                ),
                this.$ajax.get(
                    "api/v1/cedar/reefuser/?fields=" +
                    "id," +
                    "username," +
                    "last_name" +
                    "&ordering=username"
                ),
                this.$ajax.get("api/v1/cedar/job_label_order/?label_name=JobTestArea"),
                this.$ajax.get("api/v1/cedar/job_label_order/?label_name=CustomTag"),
                this.$ajax.get('api/v1/cedar/get_cabinet_type_info/?data_type=cabinet_type_data')
            ]

            this.$ajax.all(requests)
                .then(this.$ajax.spread((phone_model_resp, android_version_resp, rom_version_resp, reefuser_resp, job_test_area_resp, custom_tag_resp,cabinet_type_resp) => {
                    let job_test_area_list = utils.validate(getOrderSerializer, job_test_area_resp.data)
                    let custom_tag_list = utils.validate(getOrderSerializer, custom_tag_resp.data)
                    job_test_area_list.forEach(item=>{
                        item.description = item.name
                    })
                    custom_tag_list.forEach(item=>{
                        item.custom_tag_name = item.name
                    })
                    this.filterData = {
                        phone_model: utils.validate(getPhoneModelSerializer, phone_model_resp.data).phonemodels,
                        job_test_area: job_test_area_list,
                        android_version: utils.validate(getAndroidVersionSerializer, android_version_resp.data).androidversions,
                        rom_version: utils.validate(getRomVersionSerializer, rom_version_resp.data).romversions,
                        reefuser: utils.validate(getReefUserSerializer, reefuser_resp.data).reefusers,
                        custom_tag: custom_tag_list,
                        job_assessment_value:getJobAssessmentValue.job_assessment_value,
                        type: cabinet_type_resp.data
                    }
                    this.filterData.type.forEach(item=>{
                        item.id = item.val[0].id
                    })
                    //detail phoneModel and  cabinetType  from select device
                    if(this.propDefaultDevice.length>0){
                        let defaultPhoneModel = [];
                        this.propDefaultDevice.forEach(item=>{
                            if(defaultPhoneModel.indexOf(item.phone_model) === -1)
                                defaultPhoneModel.push(item.phone_model)
                        })

                        let defaultCabinetType = [];
                        this.propDefaultDevice.forEach(item=>{
                            if(defaultCabinetType.indexOf(item.cabinet.type) === -1)
                                defaultCabinetType.push(item.cabinet.type)
                        })

                        let phoneModelList = [];
                        this.filterData.phone_model.forEach((item,index)=>{
                            if(defaultPhoneModel.indexOf(item.phone_model_name) !== -1){
                                this.checked.push("phone_model_:_"+ item.id + "_:_" + item.phone_model_name)
                                phoneModelList.push(item);
                            }
                        })

                        let CabinetTypeList = [];
                        this.filterData.type.forEach((item,index)=>{
                            if(defaultCabinetType.indexOf(item.type) !== -1){
                                this.checked.push("type_:_"+ item.id + "_:_" + item.type)
                                CabinetTypeList.push(item);
                            }
                        })

                        this.defaultPhoneModelList.phone_model = phoneModelList;
                        this.defaultPhoneModelList.type = CabinetTypeList;
                        this.$emit("on-return-data",this.defaultPhoneModelList,)
                    }
                })).catch(reason => {
                if (config.DEBUG) console.log(reason)
                this.$Message.error("载入失败")
            })
            if (this.propRdsFilter) {
                this.filterColumn.splice(3, 2);
                this.filterColumn.splice(1, 1);
                this.filterColumn[0].title = "设备型号";
                this.filterColumn.push({
                    title: "测试结果",
                    key: "job_assessment_value",
                    item_key: "job_assessment"
                })
            }

        }
    }
</script>

<style lang="less" scoped>
    @import "../theme/classic.less";

    p:hover {
        color: @primary-color;
    }
    /deep/ .ivu-tag .ivu-icon-ios-close{
        color: #666!important;
    }
</style>
