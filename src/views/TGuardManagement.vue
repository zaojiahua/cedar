<template>
    <Card>
        <Row>
            <Tag v-for="item in tguardList" style="margin-bottom: 5px"
                 :closable="!item.is_system&&username==='admin'" :color="getColor(item.is_system)"
                 @on-close="deleteTGuard(item)">{{ item.name }}</Tag>
            <Button class="box" type="primary" v-if="username==='admin'" icon="md-add" size="small" @click="showAddModal=true;addName = ''">{{$t('public.btn_add')}}</Button>
        </Row>
        <Modal v-model="showAddModal" footer-hide :closable="false" :mask-closable="false" width="420">
            <p style="margin: 12px 0 10px 0"><b>{{$t('TGuard.addTit')}}</b></p>
            <Input v-model="addName"></Input>
            <Row style="text-align: right;margin-top: 20px;">
                <Button @click="showAddModal=false;addName = ''">{{$t('public.btn_cancel')}}</Button>
                <Button type="primary" style="margin-left: 20px" @click="addTGuard">{{$t('public.btn_ok')}}</Button>
            </Row>
        </Modal>
    </Card>
</template>

<script>
    import config from "../lib/config"
    export default{
        data(){
            return{
                tguardList:[],
                username:sessionStorage.getItem('username'),
                addName:"",
                showAddModal:false,
            }
        },
        methods:{
            getTguardList(){
                this.$ajax.get("api/v1/cedar/tguard/")
                    .then(response=>{
                        this.tguardList = response.data
                    }).catch(error=>{
                        if(config.DEBUG) console.log(error);
                        this.$Message.error(this.$t('TGuard.getError'))
                })
            },
            deleteTGuard(item){
                let _this = this
                this.$Modal.confirm({
                    title:this.$t('public.modal_info'),
                    content:this.$t('TGuard.delTit')+ item.name + "？",
                    onOk(){
                        this.$ajax.delete("api/v1/cedar/tguard/"+ item.id +"/")
                            .then(response=>{
                                this.$Message.success(_this.$t('TGuard.delSuccess'))
                                _this.getTguardList()
                            }).catch(error=>{
                                if(config.DEBUG) console.log(error);
                                _this.getTguardList()
                                if(error.response.data.data_info&&error.response.data.data_info.length>0)
                                    this.$Message.error({content:error.response.data.data_info.join(',')+_this.$t('TGuard.delError'),duration:10})
                                else
                                    this.$Message.error({content:_this.$t('TGuard.delError'),duration:6})
                            })
                    }
                })
            },
            addTGuard(){
                this.addName = this.addName.trim()
                if(this.addName===""){
                    this.$Message.warning(this.$t('TGuard.addWaring'))
                    return
                }
                this.$ajax.post("api/v1/cedar/tguard/",{
                    name: this.addName
                }).then(response=>{
                    this.showAddModal = false
                    this.$Message.success(this.$t('TGuard.addSuccess'))
                    this.getTguardList()
                }).catch(error=>{
                    if(config.DEBUG) console.log(error);
                    this.getTguardList()
                    if(error.response.data.data_info&&error.response.data.data_info.length>0){
                        this.$Message.error({content:error.response.data.data_info.join(',')+this.$t('TGuard.addErr_3'),duration:10})
                        this.showAddModal = false
                    }
                    else if(error.response.data.name)
                        this.$Message.error({content:this.$t('TGuard.addErr_1'),duration:6})
                    else
                        this.$Message.error({content:this.$t('TGuard.addErr_2'),duration:6})
                })
            },
            getColor(flag){
                if(flag)
                    return "default"
                else
                    return "blue"
            },
        },
        mounted(){
            this.getTguardList()
        }
    }
</script>
<style scoped>
    /deep/.box > .ivu-icon + span{
        position: relative;
        top: 1px;
    }
    /deep/ .ivu-tag .ivu-icon-ios-close{
        color: #2db7f5!important;
    }
</style>
