<template>
    <Card>
        <p slot="title">{{$t('resourcesList.title_1')}}</p>
        <Form v-model="selectMsg" :label-width="120">
            <FormItem :label="$t('resourcesList.operator')+'：'">
                <Select v-model="selectMsg.selectOperator">
                    <Option value=中国移动 >{{$t('resourcesList.operator_1')}}</Option>
                    <Option value=中国联通 >{{$t('resourcesList.operator_2')}}</Option>
                    <Option value=中国电信 >{{$t('resourcesList.operator_3')}}</Option>
                </Select>
            </FormItem>
            <FormItem :label="$t('resourcesList.phone_number')+'：'" prop="phone_number">
                <Input type="text" v-model="selectMsg.phone_number" @on-keyup="phoneInput" :maxlength="11" :placeholder="$t('resourcesList.title_2')"></Input>
            </FormItem>
            <FormItem :label="$t('resourcesList.volte')+'：'">
                <RadioGroup v-model="selectMsg.is_volte">
                    <Radio :label="1" style="margin-right: 20px;">{{$t('resourcesList.yes')}}</Radio>
                    <Radio :label="2">{{$t('resourcesList.no')}}</Radio>
                </RadioGroup>
            </FormItem>
        </Form>
        <Row type="flex" justify="center">
            <Button type="primary" @click="commit">{{$t('resourcesList.commit')}}</Button>
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
                    this.$Message.warning(this.$t('resourcesList.title_3'))
                    return
                }
                if(this.selectMsg.phone_number.trim().length<11){
                    this.$Message.warning(this.$t('resourcesList.title_4'))
                    return
                }
                //新增资源
                if(this.flag){
                    this.$ajax.post("api/v1/cedar/simcard/",{
                        operator: this.selectMsg.selectOperator,
                        is_volte: this.selectMsg.is_volte === 1,
                        phone_number: this.selectMsg.phone_number,
                    }).then(response=>{
                        this.$Message.success(this.$t('resourcesList.title_5'))
                        this.$emit('after-success')
                    }).catch(error=>{
                        if(config.DEBUG) console.log(error)
                        this.$Message.error({content:this.$t('resourcesList.title_6') + error.response.data.phone_number,duration: 6})
                    })
                }else{
                    //修改资源
                    this.$ajax.patch("api/v1/cedar/simcard/" + this.selectMsg.id + "/",{
                        operator: this.selectMsg.selectOperator,
                        is_volte: this.selectMsg.is_volte === 1,
                        phone_number: this.selectMsg.phone_number,
                    }).then(response=>{
                        this.$Message.success(this.$t('resourcesList.title_7'))
                        this.$emit('after-update')
                    }).catch(error=>{
                        if(config.DEBUG) console.log(error)
                        this.$Message.error({content:this.$t('resourcesList.title_8') + error.response.data.phone_number,duration: 6})
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
