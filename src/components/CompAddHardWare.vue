<template>
    <Card>
        <p slot="title">硬件模块信息</p>
        <Icon slot="extra" @click.prevent="onCloseModal" type="md-close" size="20"/>
        <Form :model="hardware" :label-width="120">
            <FormItem>
                <b slot="label">硬件模块名称：</b>
                <Input v-model="hardware.hardware_name" placeholder="请输入"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">类型：</b>
                <Select v-model="hardware.type" style="width: 100px">
                    <Option value="power">power</Option>
                    <Option value="temp">temp</Option>
                </Select>
            </FormItem>
            <FormItem>
                <b slot="label">IP：</b>
                <Input v-model="hardware.ip"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">机柜IP：</b>
                <Select v-model="cabinetSelected">
                    <Option v-for="item in cabinetList" :value="item.id">{{ item.cabinet_name }}</Option>
                </Select>
            </FormItem>
            <FormItem>
                <b slot="label">config：</b>
                <Input type="textarea" v-model="hardware.config" :rows="6" :autosize="{minRows: 6,maxRows: 6}"></Input>
            </FormItem>
        </Form>
        <p style="text-align: center">
            <Button type="primary" @click="onAddHardWareClick">提交</Button>
        </p>
        <Spin size="large" fix v-if="showLoading"></Spin>
    </Card>
</template>

<script>
    import config from "../lib/config";

    export default {
        name:"CompAddHardWare",
        data() {
            return {
                hardware:{
                    hardware_name:"",
                    type:"power",
                    ip:"",
                    config:""
                },
                cabinetList:[],
                cabinetSelected:"",
                showLoading:false,
            }
        },
        methods:{
            reset(){
                this.hardware = {
                    hardware_name:"",
                    type:"power",
                    ip:"",
                    config:""
                }
            },
            onCloseModal(){
                this.$emit("on-close-modal")
            },
            onAddHardWareClick(){
                this.showLoading = true
                this.$ajax.post("api/v1/cedar/create_wooden_box/",{
                    name: this.hardware.hardware_name,
                    type: this.hardware.type,
                    ip: this.hardware.ip,
                    config: this.hardware.config,
                    cabinet: this.cabinetSelected
                }).then(response=>{
                    this.showLoading = false
                    this.$Message.success("添加硬件设备成功")
                    this.$emit("after-add-hardware-click")
                }).catch(error=>{
                    if (config.DEBUG) console.log(error)
                    this.showLoading = false
                    this.$Message.error("添加硬件设备失败，请检查后重试！")
                })
            },
            getCabinet(){
                this.$ajax.get("api/v1/cedar/cabinet/?fields=id,cabinet_name")
                    .then(response=>{
                        this.cabinetList = response.data.cabinets
                    })
                    .catch(error=>{
                        if (config.DEBUG) console.log(error)
                        this.$Message.error("取得机柜信息出错")
                    })
            },
        },
        created(){
            this.getCabinet();
        }
    }
</script>