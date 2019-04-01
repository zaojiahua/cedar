<template>
    <Card title="用例详细信息">
        <Form :label-width="80">
            <FormItem v-model="jobInfo">
                <b slot="label">ID:</b>
                <Input v-model="jobInfo.id" disabled="true" class="disabled-input">
            </FormItem>
            <FormItem>
                <b slot="label">用例名称:</b>
                <Input v-model="jobInfo.job_name" disabled="true" class="disabled-input">
            </FormItem>
            <FormItem>
                <b slot="label">用例说明:</b>
                <Input v-model="jobInfo.description" disabled="true" class="disabled-input">
            </FormItem>
            <FormItem>
                <b slot="label">测试用途:</b>
                <Input v-model="testArea" disabled="true" class="disabled-input">
            </FormItem>
            <FormItem>
                <b slot="label">适配机型:</b>
                <Input v-model="phoneModels" disabled="true" class="disabled-input">
            </FormItem>
            <FormItem>
                <b slot="label">安卓版本:</b>
                <Input v-model="androidVersion" disabled="true" class="disabled-input">
            </FormItem>
            <FormItem>
                <b slot="label">ROM版本:</b>
                <Input v-model="romVersion" disabled="true" class="disabled-input">
            </FormItem>
            <FormItem>
                <b slot="label">自定义标签:</b>
                <Input v-model="customTag" disabled="true" class="disabled-input">
            </FormItem>
            <FormItem>
                <b slot="label">编写人员:</b>
                <Input v-model="jobInfo.author.username" disabled="true" class="disabled-input">
            </FormItem>
            <FormItem>
                <b slot="label">更新时间:</b>
                <Input v-model="jobInfo.updated_time" disabled="true" class="disabled-input">
            </FormItem>
        </Form>
    </Card>
</template>

<script>
    import utils from "../lib/utils"

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
        updated_time:"string"

    };

    export default {
        data(){
            return{
                jobInfo:utils.validate(serializer, {}),
                androidVersion: "",
                romVersion: "",
                customTag: "",
                phoneModels: "",
                testArea: ""
            }
        },
        methods:{
            jobRefresh(jobId){
                this.$ajax
                    .get(
                        "api/v1/cedar/job/"+jobId+"/?fields="+
                        "id,"+
                        "author,author.username,"+
                        "android_version,android_version.version,"+
                        "rom_version,rom_version.version,"+
                        "description,"+
                        "updated_time,"+
                        "custom_tag,custom_tag.custom_tag_name,"+
                        "phone_models,phone_models.phone_model_name,"+
                        "test_area,test_area.description,"+
                        "job_name,"+
                        "job_label"
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
                            tags.push(tag.version)
                        })
                        this.customTag = tags.join(",");

                        let models=[];
                        this.jobInfo.phone_models.forEach(model=>{
                            models.push(model.version)
                        })
                        this.phoneModels = models.join(",");

                        let areas=[];
                        this.jobInfo.test_area.forEach(area=>{
                            areas.push(area.version)
                        })
                        this.testArea = areas.join(",");

                    })
                    .catch(error=>{
                        this.$Message.error("数据加载失败");
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
</style>