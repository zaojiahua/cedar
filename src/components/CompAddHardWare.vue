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
                </Select>
            </FormItem>
            <FormItem>
                <b slot="label">IP：</b>
                <Input v-model="hardware.ip"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">config：</b>
                <Input type="textarea" v-model="hardware.config" :rows="6" :autosize="{minRows: 6,maxRows: 6}"></Input>
            </FormItem>
        </Form>
        <p style="text-align: center">
            <Button type="primary" @click="onAddHardWareClick">提交</Button>
        </p>
    </Card>
</template>

<script>
    export default {
        name:"CompAddHardWare",
        data() {
            return {
                hardware:{
                    hardware_name:"",
                    type:"power",
                    ip:"",
                    config:""
                }
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
                this.$emit("after-add-hardware-click")
            },
        }
    }
</script>