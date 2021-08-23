<template>
    <Card>
        <Row style="margin-bottom: 20px;">
            分页数据页面笔数设置
        </Row>
        <Row style="margin-bottom: 20px;">
            <Select v-model="pageSetting" style="width:200px">
                <Option :value="10">10 条/页 </Option>
                <Option :value="30">30 条/页</Option>
                <Option :value="50"> 50 条/页</Option>
                <Option :value="100"> 100 条/页</Option>
            </Select>
        </Row>
        <Row style="text-align: center">
            <Button type="primary" @click="onSetting">保存</Button>
        </Row>
    </Card>
</template>

<script>
    import config from "../lib/config"
    export default{
        data(){
            return{
                pageSetting: parseInt(localStorage.pageSize === undefined ? config.DEFAULT_PAGE_SIZE : localStorage.pageSize),
            }
        },
        methods:{
            onSetting(){
                localStorage.setItem("pageSize", this.pageSetting)
                this.$Message.success("操作成功！")
            }
        }
    }
</script>
