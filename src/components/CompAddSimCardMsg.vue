<template>
    <Card>
        <p slot="title">SIM卡资源信息</p>
        <Form v-model="selectMsg" :label-width="120">
            <FormItem label="运营商：">
                <Select v-model="selectMsg.selectOperator">
                    <Option value=1 >中国移动</Option>
                    <Option value=2 >中国联通</Option>
                    <Option value=3 >中国电信</Option>
                </Select>
            </FormItem>
            <FormItem label="手机号：">
                <Input v-model="selectMsg.phone_number" placeholder="请输入"></Input>
            </FormItem>

            <FormItem label="是否Volte：">
                <RadioGroup v-model="selectMsg.volte">
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
    export default {
        name: "CompAddSimMsg",
        data(){
            return{
                selectMsg:{
                    selectOperator:null,
                    phone_number:"",
                    volte:1
                }
            }
        },
        methods:{
            reset(){
                this.selectMsg = {
                    selectOperator:null,
                    phone_number:"",
                    volte:1
                }
            },
            setData(row){
                this.selectMsg = {
                    selectOperator:row.selectOperator,
                    phone_number:row.phone_number,
                    volte:row.volte
                }
            },
            commit(){
                this.$Message.success("提交成功")
                this.$emit('after-succrss')
            }
        }
    }
</script>

<style scoped>

</style>