<template>
    <Card>
        <Row>
            <Tag v-for="item in tguardList" style="margin-bottom: 5px"
                 :closable="!item.is_system&&username==='admin'" :color="getColor(item.is_system)"
                 @on-close="deleteTGuard(item)">{{ item.name }}</Tag>
            <Button class="box" type="primary" v-if="username==='admin'" icon="md-add" size="small" @click="showAddModal=true">添加</Button>
        </Row>
        <Modal v-model="showAddModal" footer-hide :closable="false" :mask-closable="false" width="420">
            <p style="margin: 12px 0 10px 0"><b>请添加新干扰词</b></p>
            <Input v-model="addName"></Input>
            <Row style="text-align: right;margin-top: 20px;">
                <Button @click="showAddModal=false;addName = ''">取消</Button>
                <Button type="primary" style="margin-left: 20px" @click="addTGuard">确认</Button>
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
                        this.$Message.error("T-Guard词组获取失败")
                })
            },
            deleteTGuard(item){
                let _this = this
                this.$Modal.confirm({
                    title:"提示",
                    content:"确认要删除干扰词 '"+ item.name + "' 吗？",
                    onOk(){
                        this.$ajax.delete("api/v1/cedar/tguard/"+ item.id +"/")
                            .then(response=>{
                                this.$Message.success("干扰词删除成功")
                                _this.getTguardList()
                            }).catch(error=>{
                                if(config.DEBUG) console.log(error);
                                _this.getTguardList()
                                if(error.response.data.data_info&&error.response.data.data_info.length>0)
                                    this.$Message.error({content:error.response.data.data_info.join(',')+'删除失败',duration:10})
                                else
                                    this.$Message.error({content:'干扰词删除失败',duration:6})
                            })
                    }
                })
            },
            addTGuard(){
                this.addName = this.addName.trim()
                if(this.addName===""){
                    this.$Message.warning("请输入要添加的干扰词！")
                    return
                }
                this.$ajax.post("api/v1/cedar/tguard/",{
                    name: this.addName
                }).then(response=>{
                    this.showAddModal = true
                    this.$Message.success("干扰词添加成功")
                    this.getTguardList()
                }).catch(error=>{
                    if(config.DEBUG) console.log(error);
                    this.getTguardList()
                    if(error.response.data.data_info&&error.response.data.data_info.length>0)
                        this.$Message.error({content:error.response.data.data_info.join(',')+'下发失败',duration:10})
                    else if(error.response.data.name)
                        this.$Message.error({content:'干扰词已存在',duration:6})
                    else
                        this.$Message.error({content:'干扰词添加失败',duration:6})
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
