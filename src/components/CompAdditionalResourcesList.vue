<template>
    <div style="margin-left: 2px">
        <Row>
            <Select v-model="tableList" style="width: 200px;margin-bottom: 16px;">
                <Option :value="1">SIM卡资源列表</Option>
                <Option :value="2">账号资源列表</Option>
            </Select>
            <Button v-show="(tableList===1)&&(username==='admin')" type="primary" style="float: right;" @click="onOpenSimModal">添加SIM卡资源</Button>
            <Button v-show="(tableList===2)&&(username==='admin')" type="primary" style="float: right;" @click="onOpenAppModal">添加账号资源</Button>
        </Row>

        <div v-if="tableList===1">
            <comp-sim-list ref="simTable"></comp-sim-list>
        </div>
        <div v-if="tableList===2">
            <comp-app-table  ref="appTable"></comp-app-table>
        </div>

        <Modal v-model="showAddSimModal" :mask-closable="false" :footer-hide="true">
            <comp-add-sim-msg ref="addSim" @after-success="onAfterAddSim"></comp-add-sim-msg>
        </Modal>

        <Modal v-model="showAddAppModal" :mask-closable="false" :footer-hide="true">
            <comp-add-app-card-msg ref="addApp" @after-succrss="onAfterAddApp"></comp-add-app-card-msg>
        </Modal>
    </div>
</template>

<script>

    import CompAppTable from "./CompAppTable";
    import CompSimList from "./CompSimList";
    import CompAddSimMsg from "./CompAddSimCardMsg"
    import CompAddAppCardMsg from "./CompAddAppCardMsg"

    export default {
        components:{ CompAppTable, CompSimList, CompAddSimMsg, CompAddAppCardMsg,  },
        data(){
            return{
                tableList:1,
                showAddSimModal:false,
                showAddAppModal:false,
                username:"",
            }
        },
        methods:{
            onOpenSimModal(){
                this.showAddSimModal = true;
                this.$refs.addSim.reset()
            },
            onOpenAppModal(){
                this.showAddAppModal = true;
                this.$refs.addApp.reset()
            },
            onAfterAddSim(){
                this.showAddSimModal = false;
                this.$refs.simTable.getData()
            },
            onAfterAddApp(){
                this.showAddAppModal = false;
                this.$refs.appTable.getData()
            }
        },
        mounted(){
            this.username = localStorage.getItem('username');
        }
    }
</script>

<style scoped>
    /deep/.ivu-modal-close{
        margin: 18px;
    }
</style>