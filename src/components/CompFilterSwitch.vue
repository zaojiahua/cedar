<template>
    <div class="collapse">
        <div class="collapse__header">
            <span class="collapse__header-tip">搜索</span>
            <Input
                    clearable
                    v-model="keyword"
                    @on-change="onChange"
                    placeholder="输入用例名称..."
                    class="collapse__header-input"
            />
            <Icon type="ios-arrow-up" class="collapse__header-arrow-up" v-show="collapseIsOpen" @click="handleCollapse"/>
            <Icon type="ios-arrow-down" class="collapse__header-arrow-down" v-show="!collapseIsOpen" @click="handleCollapse"/>
        </div>
        <transition name="slide-fade">
            <div class="collapse__content" v-show="collapseIsOpen">
                <div>
                    <Tabs type="card" name="filter">
                        <TabPane v-for="column in filterColumn" :label="column.title" :key="column.key" tab="filter">
                            <div style="max-height: 130px;overflow: auto">
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
                </div>
            </div>
        </transition>
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

    export default {
        name: "CompFilterSwitch",
        props:{
            propTboard:{
                type:Number,
                default:null
            }
        },
        data(){
            return{
                keyword:"",
                collapseIsOpen: true, // 是否展开搜索框下方的标签页
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
            }
        },
        methods:{
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
            //筛选条件改变时触发该函数,返回的是url参数
            onChange() {
                let selectedData = this.selectedParamsDetail(this._jobRender())
                this.$emit('on-change', selectedData)
            },
            //把选好的条件整理成url参数形式
            selectedParamsDetail(selected){
                let conditions = {}
                Object.keys(selected).forEach(key=>{
                    let condition = []  // store id data like [1,2,3]
                    if(key==="type"){    //key = cabinet_type时，condition=>name
                        selected[key].forEach(item=>{
                            condition.push(item.type)
                        })
                    }else {
                        selected[key].forEach(item=>{
                            condition.push(item.id)
                        })
                    }
                    // 不统一的命名额外处理
                    if(key==="job_test_area") key = "test_area"
                    else if(key==="phone_model") key = "phone_models"
                    else if(key==="reefuser") key = "author"
                    condition.forEach(item=>{
                        item = key+"__id="+item
                    })

                    if(key==="type"){
                        conditions.cabinet_type__in=condition
                    }else {
                        let str = key+"__in"
                        conditions[str] = condition
                    }
                })
                if(this.keyword.trim())
                    conditions.contains= this.keyword.trim()
                return conditions
            },
            // 折叠/展开搜索框下方的标签页与筛选条件总览
            handleCollapse () {
                this.collapseIsOpen = !this.collapseIsOpen
            },
            //获取筛选面板数据信息
            getFilterData(){
                this.$ajax.get('api/v1/cedar/data_view_label_filter/?tboard='+this.propTboard)
                    .then(response=>{
                        this.filterData = {
                            phone_model: utils.validate(getPhoneModelSerializer.phonemodels, response.data.PhoneModel),
                            job_test_area:  utils.validate(getJobTestAreaSerializer.jobtestareas, response.data.JobTestArea),
                            android_version: utils.validate(getAndroidVersionSerializer.androidversions, response.data.AndroidVersion),
                            rom_version: utils.validate(getRomVersionSerializer.romversions, response.data.RomVersion),
                            reefuser: utils.validate(getReefUserSerializer.reefusers, response.data.Author),
                            custom_tag:  utils.validate(getCustomTagSerializer.customtags, response.data.CustomTag),
                            type: response.data.CabinetType
                        }
                    }).catch(error=>{
                        if (config.DEBUG) console.log(error)
                        this.$Message.error({content: error.response.description,duration: 6})
                    })
            }
        },
        watch:{
            propTboard:{
                handler: function(val){
                    //重新获取筛选框的值
                    this.getFilterData()
                },
                immediate: true
            }
        },
        created() {
            this.getFilterData()
        }
    }
</script>

<style scoped lang="less">
    .collapse {
        display: flex;
        flex-direction: column;
        margin-bottom: 1em;
        border: 1px solid #cccccc;
        border-radius: 6px;
        .slide-fade-enter-active {
            /*transition: all .3s ease;*/
        }
        .slide-fade-leave-active {
            /*transition: all .3s ease;*/
        }
        .slide-fade-enter, .slide-fade-leave-to {
            opacity: 0;
        }
        &__header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.6em 0;
            width: 100%;
            background-color: #eeeeee;
            border-radius: 6px;

            &-tip {
                width: 3.6em;
                text-align: center;
            }
            &-arrow-up, &-arrow-down {
                padding: 0.6em;
                margin: 0 0.6em;
                border-radius: 50%;
                cursor: pointer;
                &:hover {
                    background-color: #cccccc;
                }
            }
            .filter__clear {
                margin: 0 0.6em;
            }
        }
        &__content {
            padding: 1em;
        }
        &__footer {
            .filter__container {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                overflow: hidden;
                .filter__title {
                    writing-mode: vertical-lr;
                    margin: 1em;
                }
                .filter__content {
                    padding: 1em 0 0;
                    .filter-factor {
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        margin: 0.2em;
                        min-height: 26px;
                        &__title {
                            font-size: 0.75em;
                            width: 6em;
                            cursor: pointer;
                        }
                        &__content {
                            flex: 1;
                            display: flex;
                            flex-wrap: wrap;
                        }
                    }
                }
            }
        }
    }
</style>
