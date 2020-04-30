<template>
    <div>
        <Table :columns="modelColumn" :data="data" @on-row-click="onRowClick" border></Table>
        <Drawer width="50" v-model="showModeDetail" :closable="false" :draggable="true">
            <comp-hard-ware-detail ref="detail" @after-remove-module="OnAfterRemoveModule"></comp-hard-ware-detail>
        </Drawer>
        <Spin size="large" fix v-if="showLoading"></Spin>
    </div>
</template>

<script>
    import CompHardWareDetail from "../components/CompHardWareDetail"
    import config from "../lib/config";

    export default {
        components:{ CompHardWareDetail },
        data(){
            return{
                modelColumn:[
                    {
                        title: "硬件模块",
                        key: "name",
                        sortable: true,
                        width: 150
                    },
                    {
                        title: "type",
                        key: "type",
                    },
                    {
                        title: "IP",
                        key: "ip",
                    },
                    {
                        title: "res",
                        key: "port",
                    },
                    {
                        title: "关联数",
                        key: "cont",
                    }
                ],
                data:[],
                showModeDetail:false,
                showLoading:false,
            }
        },
        methods:{
            getHardWareData(){
                this.showLoading = true
                this.$ajax.get("api/v1/cedar/woodenbox/?fields=id,ip,type,name," +
                    "tempport,tempport.port,tempport.device,tempport.device.id,tempport.device.device_label," +
                    "powerport,powerport.port,powerport.device,powerport.device.id,powerport.device.device_label")
                    .then(response=>{
                        response.data.woodenbox.forEach(item=>{
                            let ports = []
                            let cont = 0
                            let res = []
                            if(item.type==="power"){
                                item.powerport.forEach(port=>{
                                    ports.push(port.port)
                                    if(port.device!==null){
                                        cont++
                                        res.push(port.port+"("+port.device.device_label+")")
                                    }
                                })
                            }else if (item.type==="temp"){
                                item.tempport.forEach(port=>{
                                    ports.push(port.port)
                                    if(port.device!==null){
                                        cont++
                                        res.push(port.port+"("+port.device.device_label+")")
                                    }
                                })
                            }
                            item.port = ports.join("、")
                            item.cont = cont
                            item.res = res.join("、")
                        })
                        this.data = response.data.woodenbox
                        this.showLoading = false
                    }).catch(error=>{
                    this.showLoading = false
                        if(config.DEBUG) console.log(error)
                        this.$Message.error("读取硬件模块列表信息失败")
                    })
            },
            onRowClick(data){
                this.showModeDetail = true
                this.$refs.detail.getData(data)
            },
            OnAfterRemoveModule(){
                this.showModeDetail = false
                this.getHardWareData()
            }
        },
        created(){
            this.getHardWareData()
        }
    }
</script>