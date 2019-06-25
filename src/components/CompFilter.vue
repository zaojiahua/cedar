<template>
    <div>
        <Tabs type="card">
            <TabPane v-for="column in filterColumn" :label="column.title" :key="column.key">
                <CheckboxGroup v-model="checked" @on-change="onChange">
                    <Row type="flex">
                        <Col span="4" v-for="(item, index) in filterData[column.key]" :key="index">
                            <Checkbox :label="column.key+'_:_'+index+'_:_'+item[column.item_key]">
                                {{item[column.item_key]}}
                            </Checkbox>
                        </Col>
                    </Row>
                </CheckboxGroup>
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
                job_assessment:"通过"
            },
            {
                id:2,
                job_assessment:"未通过"
            },
            {
                id:3,
                job_assessment:"无效"
            }
        ]
    }

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
                    return ["phone_model", "job_test_area", "android_version", "rom_version", "reefuser", "custom_tag"]
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
                    }
                ],
                filterData: {},
                checked: [],
                defaultPhoneModelList:{},
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
                return "default"
            },
            closeTag(event, name) {
                this.checked.splice(this.checked.indexOf(name), 1)
            },
            _jobRender(){
                let selectedData = {}
                this.checked.forEach(item => {
                    let info = item.split('_:_')
                    let type = info[0]
                    let index = info[1]
                    if (selectedData[type] === undefined) selectedData[type] = []
                    selectedData[type].push(this.filterData[type][index])
                })
                return selectedData;
            },
            onChange() {
                let selectedData = this._jobRender()
                this.$emit('on-change', selectedData)
            }
        },
        created() {
            if (!this.propAutoLoad) return

            let requests = [
                this.$ajax.get(
                    "api/v1/cedar/phone_model/?fields=" +
                    "id," +
                    "phone_model_name"
                ),
                this.$ajax.get(
                    "api/v1/cedar/job_test_area/?fields=" +
                    "id," +
                    "description"
                ),
                this.$ajax.get(
                    "api/v1/cedar/android_version/?fields=" +
                    "id," +
                    "version"
                ),
                this.$ajax.get(
                    "api/v1/cedar/rom_version/?fields=" +
                    "id," +
                    "version"
                ),
                this.$ajax.get(
                    "api/v1/cedar/reefuser/?fields=" +
                    "id," +
                    "username," +
                    "last_name"
                ),
                this.$ajax.get(
                    "api/v1/cedar/custom_tag/?fields=" +
                    "id," +
                    "custom_tag_name"
                )
            ]

            this.$ajax.all(requests)
                .then(this.$ajax.spread((phone_model_resp, job_test_area_resp, android_version_resp, rom_version_resp, reefuser_resp, custom_tag_resp) => {
                    this.filterData = {
                        phone_model: utils.validate(getPhoneModelSerializer, phone_model_resp.data).phonemodels,
                        job_test_area: utils.validate(getJobTestAreaSerializer, job_test_area_resp.data).jobtestareas,
                        android_version: utils.validate(getAndroidVersionSerializer, android_version_resp.data).androidversions,
                        rom_version: utils.validate(getRomVersionSerializer, rom_version_resp.data).romversions,
                        reefuser: utils.validate(getReefUserSerializer, reefuser_resp.data).reefusers,
                        custom_tag: utils.validate(getCustomTagSerializer, custom_tag_resp.data).customtags,
                        job_assessment_value:getJobAssessmentValue.job_assessment_value
                    }
                    //detail phoneModel   from select device
                    if(this.propDefaultDevice.length>0){
                        let defaultPhoneModel = [];
                        this.propDefaultDevice.forEach(item=>{
                            if(defaultPhoneModel.indexOf(item.phone_model) === -1)
                                defaultPhoneModel.push(item.phone_model)
                        })

                        let phoneModelList = [];
                        this.filterData.phone_model.forEach((item,index)=>{
                            if(defaultPhoneModel.indexOf(item.phone_model_name) !== -1){
                                this.checked.push("phone_model_:_"+ index + "_:_" + item.phone_model_name)
                                phoneModelList.push(item);
                            }
                        })
                        this.defaultPhoneModelList.phone_model = phoneModelList;
                        this.$emit("on-return-data",this.defaultPhoneModelList)
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
</style>