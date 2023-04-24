<template>
    <Card :title="$t('jobDetail.cardTit')" dis-hover>
        <Form :label-width="100">
            <FormItem v-model="jobInfo">
                <b slot="label">ID:</b>
                <Input v-model="jobInfo.id" disabled class="disabled-input"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">{{$t('jobList.job_name')}}:</b>
                <Input v-model="jobInfo.job_name" disabled class="disabled-input" type="textarea" :autosize="{minRows: 1,maxRows: 4}"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">caseNo:</b>
                <Input v-model="jobInfo.case_number" disabled class="disabled-input" type="textarea" :autosize="{minRows: 1,maxRows: 4}"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">priority:</b>
                <Input v-model="jobInfo.priority" disabled class="disabled-input"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">{{$t('jobDetail.description')}}:</b>
                <Input v-model="jobInfo.description" disabled class="disabled-input" type="textarea" :autosize="{minRows: 1,maxRows: 4}"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">{{$t('jobList.display_job_test_area')}}:</b>
                <Input v-model="testArea" disabled class="disabled-input" type="textarea" :autosize="{minRows: 1,maxRows: 4}"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">{{$t('filter.phone_model')}}:</b>
                <Input v-model="phoneModels" disabled class="disabled-input" type="textarea" :autosize="{minRows: 1,maxRows: 4}"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">{{$t('filter.android_version')}}:</b>
                <Input v-model="androidVersion" disabled class="disabled-input"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">{{$t('filter.rom_version')}}:</b>
                <Input v-model="romVersion" disabled class="disabled-input" type="textarea" :autosize="{minRows: 1,maxRows: 4}"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">{{$t('filter.type')}}:</b>
                <Input v-model="jobInfo.cabinet_type" disabled class="disabled-input"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">{{$t('jobList.display_custom_tag')}}:</b>
                <Input v-model="customTag" disabled class="disabled-input" type="textarea" :autosize="{minRows: 1,maxRows: 4}"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">{{$t('jobDetail.resource')}}:</b>
                <span v-if="resourceList.length===0">{{$t('jobDetail.noResource')}}</span>
                <Cascader v-else :disabled="true" v-for="i in resourceList.length" v-model="resourceList[i-1]" :data="cascaderData" :key="i"
                          :transfer="true" style="margin-bottom: 16px" class="disabled-input"></Cascader>
            </FormItem>
            <FormItem>
                <b slot="label">{{$t('jobList.username')}}:</b>
                <Input v-model="jobInfo.author.username" disabled class="disabled-input" type="textarea" :autosize="{minRows: 1,maxRows: 4}"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">{{$t('jobList.updated_time')}}:</b>
                <Input v-model="jobInfo.updated_time" disabled class="disabled-input"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">{{$t('jobDetail.process_time')}}:</b>
                <Input v-model="jobInfo.process_time" disabled class="disabled-input"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">{{$t('jobDetail.max_process_time')}}:</b>
                <Input v-model="jobInfo.max_process_time" disabled class="disabled-input"></Input>
            </FormItem>
        </Form>
        <p style="text-align: right">
            <Button v-if="propDelJob" type="error" style="float:left;" @click="delJob">{{$t('jobDetail.del')}}</Button>
            <Button v-if="propCloseBtn" type="primary" @click="closeDrawerDetail">{{$t('public.btn_close')}}</Button>
        </p>
    </Card>
</template>

<script>
    import utils from "../lib/utils"
    import config from "../lib/config"

    const serializer = {
        android_version:[{
            id:"number",
            version:"string"
        }],
        author:{
            id:"number",
            username:"string"
        },
        custom_tag:[{
            id: "number",
            custom_tag_name: "string"
        }],
        priority:"string",
        case_number:"string",
        description:"string",
        id:"number",
        job_label:"string",
        job_name:"string",
        phone_models:[{
            id:"number",
            phone_model_name:"string"
        }],
        rom_version:[{
            id:"number",
            version:"string"
        }],
        test_area:[{
            id:"number",
            description:"string"
        }],
        updated_time:"string",
        process_time:"string",
        max_process_time:"string",
        cabinet_type:"string"
    };
    const lang = localStorage.getItem("lang")
    const simChildren = [
        {
            value: '中国移动',
            label: lang ==='zh' ? '中国移动' : 'China Mobile',
            children: [
                {
                    value: 'volte_true',
                    label: 'Volte',
                },
                {
                    value: 'volte_false',
                    label: 'not Volte',
                }
            ]
        },
        {
            value: '中国联通',
            label: lang ==='zh' ? '中国联通' : 'China Unicom',
            children: [
                {
                    value: 'volte_true',
                    label: 'Volte',
                },
                {
                    value: 'volte_false',
                    label: 'not Volte',
                }
            ]
        },
        {
            value: '中国电信',
            label: lang ==='zh' ? '中国电信' : 'China Telecom',
            children: [
                {
                    value: 'volte_true',
                    label: 'Volte',
                },
                {
                    value: 'volte_false',
                    label: 'not Volte',
                }
            ]
        },
        {
            value: 'anything',
            label: lang ==='zh' ? '移动/联通/电信' : 'Mobile/Unicom/Telecom',
            children: [
                {
                    value: 'volte_true',
                    label: 'Volte',
                },
                {
                    value: 'volte_false',
                    label: 'not Volte',
                }
            ]
        },
        {
            value: 'not_中国移动',
            label: lang ==='zh' ? '非中国移动':"not China Mobile",
            children: [
                {
                    value: 'volte_true',
                    label: 'Volte',
                },
                {
                    value: 'volte_false',
                    label: 'not Volte',
                }
            ]
        },
        {
            value: 'not_中国联通',
            label: lang ==='zh' ? '非中国联通':"not China Unicom",
            children: [
                {
                    value: 'volte_true',
                    label: 'Volte',
                },
                {
                    value: 'volte_false',
                    label: ' not Volte',
                }
            ]
        },
        {
            value: 'not_中国电信',
            label: lang ==='zh' ? '非中国电信':"not China Telecom",
            children: [
                {
                    value: 'volte_true',
                    label: 'Volte',
                },
                {
                    value: 'volte_false',
                    label: 'not Volte',
                }
            ]
        },
        {
            value: 'nothing',
            label: lang ==='zh' ? '无卡':"no SIMCard"
        },
    ];

    export default {
        props:{
            propDelJob:{ // Show delete button
                type: Boolean,
                default: false
            },
            propCloseBtn:{
                type: Boolean,
                default: true
            }
        },
        data(){
            return{
                jobInfo:utils.validate(serializer, {}),
                androidVersion: "",
                romVersion: "",
                customTag: "",
                phoneModels: "",
                testArea: "",
                cascaderData:[
                    {
                        value: 'device',
                        label: lang ==='zh'?'主机':'host',
                        children: [
                            {
                                value: 'simcard_1',
                                label: lang ==='zh'?'SIM卡1':'simcard_1',
                                children: simChildren,
                            },
                            {
                                value: 'simcard_2',
                                label: lang ==='zh'?'SIM卡2':'simcard_2',
                                children: simChildren,
                            },
                            {
                                value: 'account_resource',
                                label: lang ==='zh'?'账号资源':'account_resource',
                                children:[]
                            }
                        ]
                    },
                    //=========================================
                    {
                        value: 'subsidiary_device_1',
                        label: lang ==='zh'?'僚机1':'subsidiary_device_1',
                        children: [
                            {
                                value: 'simcard_1',
                                label: lang ==='zh'?'SIM卡1':'simcard_1',
                                children: simChildren,
                            },
                            {
                                value: 'simcard_2',
                                label: lang ==='zh'?'SIM卡2':'simcard_2',
                                children: simChildren,
                            },
                            {
                                value: 'account_resource',
                                label: lang ==='zh'?'账号资源':'account_resource',
                                children:[]
                            }
                        ]
                    },
                    //============================
                    {
                        value: 'subsidiary_device_2',
                        label: lang ==='zh'?'僚机2':'subsidiary_device_2',
                        children: [
                            {
                                value: 'simcard_1',
                                label: lang ==='zh'?'SIM卡1':'simcard_1',
                                children: simChildren,
                            },
                            {
                                value: 'simcard_2',
                                label: lang ==='zh'?'SIM卡2':'simcard_2',
                                children: simChildren,
                            },
                            {
                                value: 'account_resource',
                                label: lang ==='zh'?'账号资源':'account_resource',
                                children:[]
                            }
                        ]
                    },
                    //=======================
                    {
                        value: 'subsidiary_device_3',
                        label: lang ==='zh'?'僚机3':'subsidiary_device_3',
                        children: [
                            {
                                value: 'simcard_1',
                                label: lang ==='zh'?'SIM卡1':'simcard_1',
                                children: simChildren,
                            },
                            {
                                value: 'simcard_2',
                                label: lang ==='zh'?'SIM卡2':'simcard_2',
                                children: simChildren,
                            },
                            {
                                value: 'account_resource',
                                label: lang ==='zh'?'账号资源':'account_resource',
                                children:[]
                            }
                        ]
                    }
                ],
                resourceList:[],
            }
        },
        methods:{
            refresh(jobId){
                this.$ajax
                    .get(
                        "api/v1/cedar/job/"+jobId+"/?fields="+
                        "id,"+
                        "author,author.username,"+
                        "android_version,android_version.version,"+
                        "rom_version,rom_version.version,"+
                        "description,"+
                        "updated_time,"+
                        "case_number," +
                        "priority," +
                        "custom_tag,custom_tag.custom_tag_name,"+
                        "phone_models,phone_models.phone_model_name,"+
                        "test_area,test_area.description,"+
                        "job_name,"+
                        "job_label," +
                        "matching_rule,"+
                        "process_time," +
                        "max_process_time," +
                        "cabinet_type"
                    )
                    .then(response=>{
                        this.jobInfo = utils.validate(serializer, response.data);
                        let versions = [];
                        this.jobInfo.android_version.forEach(version=>{
                            versions.push(version.version)
                        })
                        this.androidVersion = versions.join(",");

                        versions=[];
                        this.jobInfo.rom_version.forEach(version=>{
                            versions.push(version.version)
                        })
                        this.romVersion = versions.join(",");

                        let tags = [];
                        this.jobInfo.custom_tag.forEach(tag=>{
                            tags.push(tag.custom_tag_name)
                        })
                        this.customTag = tags.join(",");

                        let models=[];
                        this.jobInfo.phone_models.forEach(model=>{
                            models.push(model.phone_model_name)
                        })
                        this.phoneModels = models.join(",");

                        let areas=[];
                        this.jobInfo.test_area.forEach(area=>{
                            areas.push(area.description)
                        })
                        this.testArea = areas.join(",");
                        this.resourceList = this.jobInfo.matching_rule ? this.jobInfo.matching_rule.resource_data : []

                        if(response.data.process_time){
                            //计算分钟数
                            let minutes=Math.floor(response.data.process_time/60)
                            //计算相差秒数
                            let leave=response.data.process_time%60    //计算分钟数后剩余的毫秒数
                            let seconds=Math.round(leave)
                            this.jobInfo.process_time = minutes+" min "+seconds+" s"
                        }else
                            this.jobInfo.process_time = this.$t('jobDetail.noData')
                        if(response.data.max_process_time){
                            //计算分钟数
                            let minutes=Math.floor(response.data.max_process_time/60)
                            //计算相差秒数
                            let leave=response.data.max_process_time%60    //计算分钟数后剩余的毫秒数
                            let seconds=Math.round(leave)
                            this.jobInfo.max_process_time = minutes+" min "+seconds+" s"
                        }else
                            this.jobInfo.max_process_time = this.$t('jobDetail.noData')

                    })
                    .catch(error=>{
                        if (config.DEBUG) console.log(error)
                        this.$Message.error(this.$t('jobDetail.loadFail'));
                    })
            },
            closeDrawerDetail(){
                this.$emit("closeDrawer",false);
            },
            delJob(){
                let root = this;
                this.$Modal.confirm({
                    title: root.$t('public.modal_warn'),
                    content: root.$t('jobDetail.delTit'),
                    onOk(){
                        this.$ajax
                            .post("api/v1/cedar/job_deleted/",{
                                job_ids:[].concat(root.jobInfo.id)
                            })
                            .then(response=>{
                                this.$Message.success(root.$t('jobDetail.delSuccess'));
                                root.$emit("delJobOne",false);
                            })
                            .catch(error=>{
                                if (config.DEBUG) console.log(error)
                                let errorMsg = "";
                                if (error.response.status >= 500) {
                                    errorMsg = root.$t('public.error_500')
                                } else {
                                    if(error.response.data.custom_code==="203001"){
                                        errorMsg = root.$t('jobDetail.err_1')
                                    }else if (error.response.data.custom_code === "203002") {
                                        errorMsg = root.$t('jobDetail.err_2')
                                    }else if(error.response.data.custom_code ==="201001"){
                                        errorMsg = root.$t('jobDetail.err_3')+error.response.data.description
                                    }else{
                                        errorMsg = 'Inner 【'+ error.response.data.point_out_job.join("】,【") +'】 '+root.$t('jobDetail.err_4')
                                    }
                                }
                                this.$Message.error({content:errorMsg,duration:10})
                            })
                    }
                });
            },
            getAppNameList(){
                this.$ajax.get("api/v1/cedar/get_order_app_name")
                    .then(response=>{
                        let appChildren = []
                        let subsidiaryAppChildren = []
                        response.data.result.forEach(app=>{
                            appChildren.push({value:app.name,label:app.name})
                            subsidiaryAppChildren.push({
                                value:app.name,label:app.name,
                                children:[{value:"account_alike_true",label:lang ==='zh'?"与主机相同":'Same as the host'},
                                    {value:"unrestrained",label:lang ==='zh'?"无特殊要求":'No special requirements'}]})
                        })
                        this.cascaderData.forEach(item=> {
                            if(item.label === this.$t('jobDetail.host'))
                                item.children[2].children = appChildren
                            else
                                item.children[2].children = subsidiaryAppChildren
                        })
                    })
                    .catch(error=>{
                        if(config.DEBUG) console.log(error)
                        this.$Message.error({content:this.$t('jobDetail.fail')+ error.response.data.message,duration:3})
                    })
            }
        },
        created(){
            this.getAppNameList()
        }
    }
</script>

<style scoped>
    .disabled-input >>> input {
        background-color: #0000;
        color: #515a6e;
        border: #eee dotted 1px;
    }
    .disabled-input >>> textarea {
        background-color: #0000;
        color: #515a6e;
        border: #eee dotted 1px;
    }
</style>
