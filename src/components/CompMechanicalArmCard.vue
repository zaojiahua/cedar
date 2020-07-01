<template>
    <div>
        <div>
            <div class="pane-box" @mouseenter="showRemove=true" @mouseleave="showRemove=false">
                <span v-show="showRemove" class="remove" @click="removePane(propIndex)">移除支架</span>

                <div v-if="propPane.slotList['1,1'].status==='empty'" style="margin:auto;width: 100px;height: 150px;text-align: center;cursor: pointer" :style="{background:showColor(propPane.slotList,1,1)}" @click="addDevice(propPane,propIndex)">
                    <Icon type="md-add" size="60" color="#fff" style="margin-top: 45px;"/>
                </div>
                <div v-else style="margin:auto;width: 100px;height: 150px;" :style="{background:showColor(propPane.slotList,1,1)}" @click="onSlotClick(1,1)">
                </div>

            </div>
            <p style="text-align: center;margin-top: 15px;"><span style="cursor: pointer">{{ propPane.name }}</span></p>
        </div>
        <Drawer v-model="showDeviceDetail" :draggable="true" :closable="false" width="50">
            <comp-device-detail ref="deviceDetail" :prop-device-slot="true" @after-remove-pane-slot="afterRemovePaneSlot"></comp-device-detail>
        </Drawer>

    </div>
</template>

<script>

    import CompDeviceDetail from "../components/CompDeviceDetail"
    import config from "../lib/config"

    export default {
        props:{
            propPane:{
                type: Object,
                default: ()=>{
                    return {}
                }
            },
            propIndex:{
                type: Number,
                default:null
            },
        },
        components:{ CompDeviceDetail },
        data(){
            return{
                showRemove:false,
                openModal:false,
                showDeviceDetail:false,
            }
        },
        methods:{
            showColor(paneSlot,row,col){
                let key = row + ',' + col
                if(paneSlot[key].status==="ok")  //判断device的状态
                    return "#85D700"
                else if(paneSlot[key].status==="error")
                    return "#D04B40"
                else if(paneSlot[key].status==="empty")
                    return "#CBD0D3"
                else
                    return "#D04B40"
            },
            removePane(index){
                let root = this
                this.$Modal.confirm({
                    title:"提示：",
                    content:"您确定要移除该支架吗？",
                    onOk(){
                        root.$ajax.delete("api/v1/cedar/remove_paneview/",{
                            data:{id: root.propPane.id}
                        }).then(response=>{
                            root.$Message.success("支架移除成功!")
                            root.$emit('remove-pane',index)
                        }).catch(error=>{
                            if(config.DEBUG) console.log(error)
                            if(error.response.status===403)
                                root.$Message.error("当前支架还有设备存在，请先移除设备之后再进行支架移除！")
                            else
                                root.$Message.error("未知错误：支架移除失败，请检查后重试！")
                        })
                    }
                })
            },
            addDevice(item,index){
                this.$emit("on-mechanical-arm-add-device",item,index)
            },
            onSlotClick(row,col){
                let key = row + ',' + col
                this.showDeviceDetail = true
                this.$refs.deviceDetail.refresh(this.propPane.slotList[key].device)
            },
            afterRemovePaneSlot(){
                this.showDeviceDetail = false
                this.$emit("after-remove-pane-slot")
            }
        },
        mounted(){
        }
    }
</script>


<style scoped>
    .remove{
        position: absolute;
        right: 15px;
        top: 10px;
        color: #D04B40;
        cursor: pointer;
    }
    .pane-box{
        width: 420px;
        height: 350px;
        display: flex;
        align-items: center;
        border:1px solid #dcdcdc;
    }
</style>







