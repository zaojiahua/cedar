<template>
    <Card title="用例详细信息">
        <Form :label-width="80">
            <FormItem v-model="jonInfo">
                <b slot="label">ID:</b>
                <Input v-model="jonInfo.id" disabled="true" class="disabled-input">
            </FormItem>
            <FormItem>
                <b slot="label">用例名称:</b>
                <Input v-model="jonInfo.job_name" disabled="true" class="disabled-input">
            </FormItem>
            <FormItem>
                <b slot="label">用例说明:</b>
                <Input v-model="jonInfo.description" disabled="true" class="disabled-input">
            </FormItem>
            <FormItem>
                <b slot="label">测试用途:</b>
                <Input v-model="jonInfo.test_area" disabled="true" class="disabled-input">
            </FormItem>
            <FormItem>
                <b slot="label">适配机型:</b>
                <Input v-model="jonInfo.phone_model_name" disabled="true" class="disabled-input">
            </FormItem>
            <FormItem>
                <b slot="label">安卓版本:</b>
                <Input v-model="jonInfo.android_version" disabled="true" class="disabled-input">
            </FormItem>
            <FormItem>
                <b slot="label">ROM版本:</b>
                <Input v-model="jonInfo.rom_version" disabled="true" class="disabled-input">
            </FormItem>
            <FormItem>
                <b slot="label">自定义标签:</b>
                <Input v-model="jonInfo.custom_tag" disabled="true" class="disabled-input">
            </FormItem>
            <FormItem>
                <b slot="label">编写人员:</b>
                <Input v-model="jonInfo.author" disabled="true" class="disabled-input">
            </FormItem>
            <FormItem>
                <b slot="label">更新时间:</b>
                <Input v-model="jonInfo.updated_time" disabled="true" class="disabled-input">
            </FormItem>
        </Form>
    </Card>
</template>

<script>
    const serializer = [{
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

    }]

    export default {
        data(){
            return{
                jonInfo:{
                    id:"",
                    job_name:"",
                    description:"",
                    test_area:"",
                    phone_model_name:"",
                    android_version: "",
                    rom_version: "",
                    author:"",
                    updated_time: "",
                    custom_tag: ""
                }
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