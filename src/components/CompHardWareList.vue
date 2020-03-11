<template>
    <div style="margin-left: 2px">
        <Row>
            <Select v-model="tableList" style="width: 200px;margin-bottom: 16px;">
                <Option :value="1">硬件模块列表</Option>
                <Option :value="2">温度感应片列表</Option>
                <Option :value="3">智能充电口列表</Option>
            </Select>
            <Button v-show="tableList===1" type="primary" style="float: right;" @click="onOpenHardWareModal">添加硬件模块</Button>
        </Row>

        <div v-if="tableList===1">
            <comp-hard-ware-table ref="hardWareTable"></comp-hard-ware-table>
        </div>
        <div v-if="tableList===2">
            <comp-temp-port-list></comp-temp-port-list>
        </div>
        <div v-if="tableList===3">
            <comp-power-port-list></comp-power-port-list>
        </div>

        <Modal v-model="showAddHardWare" :closable="false" :mask-closable="false" :footer-hide="true">
            <comp-add-hard-ware ref="addHardware" @on-close-modal="onCloseHardWareModal" @after-add-hardware-click="onAfterAddHardWare"></comp-add-hard-ware>
        </Modal>
    </div>
</template>

<script>
    import CompHardWareTable from "../components/CompHardWareTable"
    import CompTempPortList from "../components/CompTempPortList";
    import CompPowerPortList from "../components/CompPowerPortList";
    import CompAddHardWare from "./CompAddHardWare";


    export default {
        components:{ CompHardWareTable, CompTempPortList, CompPowerPortList, CompAddHardWare },
        data(){
            return{
                tableList:1,
                showAddHardWare:false,
            }
        },
        methods:{
            onOpenHardWareModal(){
                this.showAddHardWare = true;
                this.$refs.addHardware.reset()
            },
            onCloseHardWareModal(){
                this.showAddHardWare = false;
            },
            onAfterAddHardWare(){
                this.showAddHardWare = false;
                this.$refs.hardWareTable.getHardWareData()
            },
        }
    }
</script>