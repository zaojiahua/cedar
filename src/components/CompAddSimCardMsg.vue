<template>
    <Card>
        <p slot="title">SIM卡资源信息</p>
        <Form v-model="selectMsg" :label-width="120">
            <FormItem label="运营商：">
                <Select v-model="selectMsg.selectOperator">
                    <Option value=中国移动 >中国移动</Option>
                    <Option value=中国联通 >中国联通</Option>
                    <Option value=中国电信 >中国电信</Option>
                </Select>
            </FormItem>
            <FormItem label="手机号：" prop="phone_number">
                <Input type="text" v-model="selectMsg.phone_number" @on-keyup="phoneInput" :maxlength="11" placeholder="请输入正确的手机号"></Input>
            </FormItem>
            <FormItem label="是否Volte：">
                <RadioGroup v-model="selectMsg.is_volte">
                    <Radio :label="1" style="margin-right: 20px;">是</Radio>
                    <Radio :label="2">否</Radio>
                </RadioGroup>
            </FormItem>
        </Form>
        <Row type="flex" justify="center">
            <Button type="primary" @click="commit">提交</Button>
        </Row>
    </Card>
</template>

<script>
    import config from "../lib/config"

    export default {
        name: "CompAddSimMsg",
        data(){
            return{
                selectMsg:{
                    selectOperator:null,
                    phone_number:"",
                    is_volte:1
                },
                flag:true,  //true:新增 false：修改
            }
        },
        methods:{
            reset(){
                this.selectMsg = {
                    selectOperator:null,
                    phone_number:"",
                    is_volte:1
                }
                this.flag = true
            },
            setData(row){
                this.flag = false
                this.selectMsg = {
                    id:row.id,
                    selectOperator:row.operator,
                    phone_number:row.phone_number,
                    is_volte:row.is_volte ? 1 : 2
                }
            },
            commit(){
                if(this.selectMsg.selectOperator===null||this.selectMsg.phone_number.trim().length===0){
                    this.$Message.warning("请先将信息填写完整再提交！")
                    return
                }
                if(this.selectMsg.phone_number.trim().length<11){
                    this.$Message.warning("请输入正确的11位手机号！")
                    return
                }
                //新增资源
                if(this.flag){
                    this.$ajax.post("api/v1/cedar/simcard/",{
                        operator: this.selectMsg.selectOperator,
                        is_volte: this.selectMsg.is_volte === 1,
                        phone_number: this.selectMsg.phone_number,
                    }).then(response=>{
                        this.$Message.success("SIM卡资源添加成功")
                        this.$emit('after-success')
                    }).catch(error=>{
                        if(config.DEBUG) console.log(error)
                        this.$Message.error({content:"SIM卡资源添加失败! " + error.response.data.phone_number,duration: 6})
                    })
                }else{
                    //修改资源
                    this.$ajax.patch("api/v1/cedar/simcard/" + this.selectMsg.id + "/",{
                        operator: this.selectMsg.selectOperator,
                        is_volte: this.selectMsg.is_volte === 1,
                        phone_number: this.selectMsg.phone_number,
                    }).then(response=>{
                        this.$Message.success("SIM卡信息修改成功")
                        this.$emit('after-update')
                    }).catch(error=>{
                        if(config.DEBUG) console.log(error)
                        this.$Message.error({content:"SIM卡信息修改失败! " + error.response.data.phone_number,duration: 6})
                    })
                }
            },
            phoneInput() {
                this.selectMsg.phone_number = this.selectMsg.phone_number.replace(/[^\d]+/g,'')
            },
        }
    }
</script>

<style scoped>

</style>