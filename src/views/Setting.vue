<template>
    <Card>
        <Row style="margin-bottom: 20px;">
            {{$t('pageSetting.pageSize')}}
        </Row>
        <Row style="margin-bottom: 20px;">
            <Select v-model="pageSetting" style="width:200px">
                <Option :value="10">{{$t('pageSetting.sige_1')}}</Option>
                <Option :value="30">{{$t('pageSetting.sige_2')}}</Option>
                <Option :value="50">{{$t('pageSetting.sige_3')}}</Option>
                <Option :value="100">{{$t('pageSetting.sige_4')}}</Option>
            </Select>
        </Row>
        <Row style="margin: 10px 0;">
            {{$t('pageSetting.language')}}
        </Row>
        <Select v-model="lang" style="width:200px">
            <Option value="zh">简体中文</Option>
            <Option value="en">English</Option>
        </Select>
        <Row style="text-align: center">
            <Button type="primary" @click="onSetting">{{$t('public.btn_save')}}</Button>
        </Row>
    </Card>
</template>

<script>
    import config from "../lib/config"
    export default{
        data(){
            return{
                lang: localStorage.getItem("lang") ||  'zh',
                pageSetting: parseInt(localStorage.pageSize === undefined ? config.DEFAULT_PAGE_SIZE : localStorage.pageSize),
            }
        },
        methods:{
            onSetting(){
                this.$i18n.locale = this.lang
                localStorage.setItem('lang', this.lang)
                localStorage.setItem("pageSize", this.pageSetting)
                this.$Message.success(this.$t('pageSetting.sucTip'))
            }
        }
    }
</script>
