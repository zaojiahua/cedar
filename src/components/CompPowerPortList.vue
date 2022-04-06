<template>
    <div>
        <!--<Drawer width="50" v-model="showPowerPortDetail" :closable="false" :draggable="true">-->
            <!--<comp-power-port-detail ref="detail"></comp-power-port-detail>-->
        <!--</Drawer>-->
        <Table ref="table" :columns="powerPortColumns" :data="powerPorts" @on-row-click="onRowClick" @on-selection-change="onSelectionChange" border></Table>
        <Page :total="dataTotal" :current="currentPage" @on-change="onPageChange" :page-size="pageSize" simple style="margin-top:20px;text-align: center "/>
    </div>
</template>

<script>
    import CompPowerPortDetail from "./CompPowerPortDetail";
    import utils from "../lib/utils";
    import config from "../lib/config";
    const getPowerPortSerializer = {
        powerports: [
            {
                id: "number",
                port: "string",
                device: {
                    id: "number",
                    device_name: "string",
                    device_label: "string"
                }
            }
        ]
    }
    export default {
        name: "CompPowerPortList",
        components: {CompPowerPortDetail},
        data(){
            return {
                powerPortColumns:[
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: "编号",
                        key: "port",
                        width:150,
                        // sortable: true
                    },
                    {
                        title: "关联设备",
                        key: "display_device_name",
                        maxWidth: 350
                        // sortable: true
                    },
                    {
                        title: "充电策略",
                        key: "strategy_data",
                    }
                ],
                powerPorts:[],
                // showPowerPortDetail: false,
                pageSize:config.DEFAULT_PAGE_SIZE,
                dataTotal:0,
                currentPage:1,
                offset: 0,
                selection:[],
                selectionPower:{},
                currentPageSelection:{},
            }
        },
        methods:{
            // Data
            refresh(){
                this.currentPageSelection = {}
                this.$ajax.get(
                    "api/v1/cedar/power_port/?fields=" +
                    "id," +
                    "port," +
                    "device," +
                    "device.id," +
                    "device.device_name," +
                    "device.device_label," +
                    "strategy_data" +
                    "&ordering=id" +
                    "&limit=" + this.pageSize +
                    "&offset=" + this.offset
                ).then(response=>{
                    this.dataTotal = parseInt(response.headers["total-count"])
                    let data = utils.validate(getPowerPortSerializer, response.data).powerports
                    data.forEach(port=>{
                        if(port.device.id !== null)
                            port.display_device_name = port.device.device_name + "(" + port.device.device_label + ")"
                        else
                            port.device_display_name = ""
                        /* 将之前已经选中的选项重新勾选 */
                        if(this.selection.length>0)
                            this.selection.forEach(selected=>{
                                if (port.id === selected.id){
                                    port._checked = true
                                    this.$set(this.currentPageSelection, port.id, 'exist')
                                }
                            })
                    })
                    this.powerPorts = data
                }).catch(reason => {
                    if(config.DEBUG) console.log(reason)
                    this.$Message.error("载入失败")
                })
            },
            // Table control
            onRowClick(data, index){
                // this.showPowerPortDetail = true
                // this.$refs.detail.refresh(data.id)
                this.$refs.table.toggleSelect(index)
            },
            onPageChange(page){
                this.offset = this.pageSize*(page-1);
                this.currentPage = page;
                this.refresh()
            },
            getThisSelection(){
                return this.selection;
            },
            // 多 选
            onSelectionChange(selection){
                selection.forEach((value) => {
                    if (this.selectionPower[value.id] === undefined ) {
                        //console.log('勾选了id为' + value.id + '的job')
                        this.$set(this.selectionPower, value.id, value)    //所有的已选择App  包括新选择的App
                        this.$set(this.currentPageSelection, value.id, 'exist')    //currentPageSelectedApp  当前页已选择App
                    }
                })
                //用上个步骤得到的当前页已选择的App-id 和 实际表格返回的 selection做比对，如果对上，则不做任何操作
                // 如果对不上，则表示多了一个，即用户点击了一次取消，就用$delete方法将多出来的这条数据删除this.$delete(obj,key);
                for (let item in this.currentPageSelection) {
                    let i = 0
                    for (i; i < selection.length; i++) {
                        if (parseInt(item) === selection[i].id) {
                            break
                        }
                    }
                    if (i === selection.length) {
                        //console.log('不再勾选id为' + item + '的job')
                        this.$delete(this.selectionPower, item)
                        this.$delete(this.currentPageSelection, item)
                    }
                }
                //对象提取所有的value
                this.selection = _.values(this.selectionPower)
                this.$emit("selected-count",this.selection.length)
            },
            // 取 消 全 选
            resetPowerList(){
                this.selectionPower = {}
                this.currentPageSelection = {}
                this.selection = []
                this.$emit("selected-count",0)
                this.data.forEach(item=>{
                    this.$set(item,"_checked",false)
                    this.$delete(item, "_checked")
                })
            }
        },
        created() {
            this.refresh()
            this.pageSize = utils.getPageSize();
        }

    }
</script>

<style scoped>

</style>
