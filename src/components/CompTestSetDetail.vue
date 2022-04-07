<template>
    <Card :title="isShowOther ? '测试集信息' : '新建测试集' ">
        <Form :label-width="120" :rules="validateRules" ref="form" :model="testInfo">
            <FormItem prop="name">
                <b slot="label">测试集名称：</b>
                <Input v-model="testInfo.name" maxlength="50"></Input>
            </FormItem>
            <FormItem v-show="!isShowOther">
                <b slot="label">项目：</b>
                <Select v-model="selectProject" clearable style="width:200px" :filterable="true">
                    <Option v-for="item in allProject" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
            </FormItem>
            <div v-show="isShowOther">
                <FormItem>
                    <b slot="label">用例数量：</b>
                    <Input v-model="testInfo.job_count" disabled class="disabled-input"></Input>
                </FormItem>
                <FormItem>
                    <b slot="label">预计耗时（h）：</b>
                    <Input v-model="testInfo.duration_time" disabled class="disabled-input"></Input>
                </FormItem>
                <FormItem>
                    <b slot="label">更新时间：</b>
                    <Input v-model="testInfo.update_time" disabled class="disabled-input"></Input>
                </FormItem>
                <FormItem>
                    <b slot="label">涉及项目：</b>
                    <p v-if="projectList.length===0" style="color: #FF9900">暂无数据</p>
                    <div v-else>
                        <Button v-for="project in projectList" style="margin:0 10px 8px 0;" :key="project.id">{{ project.name }}</Button>
                    </div>
                </FormItem>
            </div>
        </Form>
        <Row style="text-align-last: right;">
            <Button type="primary" style="margin-right: 20px" @click="onSave">保存</Button>
            <Button @click="onCancel">取消</Button>
        </Row>
        <Spin size="large" fix v-if="spinShow"></Spin>
    </Card>
</template>

<script>
    const testSetSerializer = {
        id:"number",
        name:"string",
        job_count:"number",
        duration_time:"number",
        update_time:"string",
    }

    import config from "../lib/config"
    import utils from "../lib/utils"

    export default{
        data(){
            return{
                isShowOther:false,
                testInfo:utils.validate(testSetSerializer,{}),
                validateRules: { // 表单验证规则
                    name: [{
                        required: true,type:"string", message: '测试集名称不能为空', trigger: 'blur'
                    }, {
                        max: 50, message: '测试集名称不能超过50个字符', trigger: 'blur'
                    }],
                },
                spinShow:false,
                projectList:[],
                selectProject:null,
                allProject:[],
            }
        },
        methods:{
            reset(){
                this.$refs.form.resetFields()
                this.testInfo = utils.validate(testSetSerializer,{})
                this.selectProject = null
            },
            refresh(id){
                this.reset()
                this.spinShow = true
                this.$ajax.get('api/v1/cedar/test_gather/'+ id + '/')
                    .then(response=>{
                        this.spinShow = false
                        this.testInfo = utils.validate(testSetSerializer,response.data)
                        this.testInfo.duration_time =  (this.testInfo.duration_time/3600).toFixed(1) + ' 小时'
                    }).catch(error=>{
                        if(config.DEBUG) console.log(error)
                        this.spinShow = false
                        this.$Message.error({content:"测试集信息获取失败"+error.response.data.description,duration:6})
                    })
                //  取 当 前 测 试 集 所 属 的 项 目
                this.$ajax.get('api/v1/cedar/test_project/?fields=name&test_gather='+id)
                    .then(response=>{
                        this.projectList = response.data.test_project
                    }).catch(error=>{
                    if(config.DEBUG) console.log(error)
                    this.spinShow = false
                    this.$Message.error({content:"项目信息获取失败"+error.response.data.description,duration:6})
                })
            },
            showOther(flag){
                this.isShowOther = flag
            },
            onSave(){
                this.$refs.form.validate(valid => { // 表单验证
                    if (valid) { // 通过验证
                        this.spinShow = true
                        if(this.isShowOther){    //  console.log("修改")
                            this.$ajax.patch('api/v1/cedar/test_gather/'+ this.testInfo.id +'/',{
                                name: this.testInfo.name
                            }).then(response=>{
                                this.$Message.success("测试集信息修改成功！")
                                this.$emit('on-save',false)
                                this.spinShow = false
                            }).catch(error=>{
                                if(config.DEBUG) console.log(error)
                                if(error.response.data.name)
                                    this.$Message.error({content: "测试集不允许重名",duration:3})
                                else
                                    this.$Message.error({content: "测试集信息修改失败"+ error.response.data.description,duration:5})
                                this.spinShow = false
                            })
                        }else {  //  console.log("新建")
                            let obj = {}
                            if(this.selectProject)
                                obj = {
                                    name: this.testInfo.name,
                                    testproject: [].concat(this.selectProject)
                                }
                            else {
                                obj = { name: this.testInfo.name, }
                            }
                            this.$ajax.post('api/v1/cedar/test_gather/',obj )
                            .then(response=>{
                                this.$Message.success("测试集创建成功！")
                                this.$emit('on-save',false)
                                this.spinShow = false
                            }).catch(error=>{
                                if(config.DEBUG) console.log(error)
                                if(error.response.data.name)
                                    this.$Message.error({content: "测试集不允许重名",duration:3})
                                else
                                    this.$Message.error({content: "测试集创建失败" +error.response.data.description,duration:5})
                                this.spinShow = false
                            })
                        }
                    } else { // 验证失败
                        this.$Message.warning({
                            background: true,
                            content: '请输入完整信息'
                        })
                    }
                })
            },
            onCancel(){
                this.$emit('on-save',false)
            },
            getAllProjectList(){
                this.$ajax.get('api/v1/cedar/test_project/?fields=id,name&ordering=-update_time')
                    .then(response=>{
                        this.allProject = response.data.test_project
                    }).catch(error=>{
                        if(config.DEBUG) console.log(error)
                        this.$Message.error({content:"项目信息获取失败"+error.response.data.description,duration:6})
                    })
            }

        },
        mounted(){
            this.getAllProjectList()
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
