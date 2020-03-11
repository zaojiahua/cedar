<template>
    <div>
        <Card>
            <p slot="title">{{ data.name }}</p>
            <Form :model="data" :label-width="120">
                <FormItem>
                    <b slot="label">Type：</b>
                    <Input v-model="data.type"></Input>
                </FormItem>
                <FormItem>
                    <b slot="label">IP：</b>
                    <Input v-model="data.ip"></Input>
                </FormItem>
                <FormItem>
                    <b slot="label">资源：</b>
                    <Input v-model="data.port"></Input>
                </FormItem>
                <FormItem>
                    <b slot="label">关联设备：</b>
                    <Input type="textarea" v-model="data.res" :rows="6" :autosize="{minRows: 6,maxRows: 6}"></Input>
                </FormItem>
            </Form>
        </Card>
        <Button type="error" style="margin-top: 16px" @click="removeModule(data.id)">移除硬件设备模块</Button>
        <Spin size="large" fix v-if="showLoading"></Spin>
    </div>
</template>

<script>
    import config from "../lib/config";

    export default {
        data(){
            return{
                data:{
                    id:null,
                    name:"",
                    type:"",
                    ip:"",
                    port:"",
                    res:""
                },
                showLoading:false
            }
        },
        methods:{
            getData(data){
                this.data = data
            },
            removeModule(id){
                let root = this
                this.$Modal.confirm({
                    title: "警告！",
                    content: "您确定要从系统中移除该硬件模块吗？",
                    onOk(){
                        if(root.data.cont!==0){
                            this.$Message.warning("该模块还有关联设备，请先将设备与硬件解除关联，再进行移除操作！")
                            return
                        }
                        root.showLoading = true
                        root.$ajax.delete("api/v1/cedar/remove_wooden_box/" + id)
                            .then(()=>{
                                root.$Message.success("移除硬件模块成功")
                                root.$emit('after-remove-module')
                                root.showLoading = false
                            })
                            .catch(error=>{
                                root.showLoading = false
                                if(config.DEBUG) console.log(error)
                                root.$Message.error("移除硬件模块失败，请检查后重试！")
                            })
                    }
                })
            }
        }
    }
</script>