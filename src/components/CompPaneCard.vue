<template>
    <div>
        <div>
            <div class="pane-box" @mouseenter="showRemove=true" @mouseleave="showRemove=false">
                <span v-if="propShowRemoveBtn" v-show="showRemove" class="remove" style="right: 90px;color: #19be6b" @click="addDevice(propPane,propIndex)">{{$t('paneCard.btn_1')}}</span>
                <span v-if="propShowRemoveBtn" v-show="showRemove" class="remove" @click="removePane(propIndex)">{{$t('paneCard.btn_2')}}</span>
                <div :style="{ width: (propPane.width*40+30) + 'px'}" style="margin:auto">
                    <p style="margin-left: 20px"><span class="w-index" v-for="h_index in propPane.width">{{ h_index }}</span></p>
                    <div>
                        <Row v-for="w_index in propPane.height" :key="w_index">
                            <span class="h-index"> {{ w_index }}</span>
                            <Col class="pane-col" span="1" v-for="h_index in propPane.width" :key="h_index" :style="{background: hoverColor(w_index,h_index)}">
                                <div class="pane-container" :style="{background:showColor(propPane.slotList,w_index-1,h_index-1)}" @mouseenter="onMouseOver(w_index,h_index)" @mouseleave="onMouseLeave" @click="onSlotClick(w_index-1,h_index-1)"></div>
                            </Col>
                        </Row>
                        <p class="line" :style="{width: 40*propPane.width+1 + 'px'}"></p>
                    </div>
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
            propShowRemoveBtn:{
                type: Boolean,
                default:true
            }
        },
        components:{ CompDeviceDetail },
        data(){
            return{
                showRemove:false,
                row:null,
                col:null,
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
            hoverColor(row,col){
                if((row===this.row&&col<=this.col)||(row<=this.row&&col===this.col))
                    return "#F5F6F9"
                else
                    return "none"
            },
            onMouseOver(row,col){
                this.row = row;
                this.col = col;
                this.hoverColor(row,col)
            },
            onMouseLeave(){
                this.row = 0;
                this.col = 0;
                this.hoverColor(this.row,this.col)
            },
            removePane(index){
                let root = this
                this.$Modal.confirm({
                    title:this.$t('public.modal_info'),
                    content:this.$t('paneCard.tips_1'),
                    onOk(){
                        root.$ajax.delete("api/v1/cedar/remove_paneview/",{
                            data:{id: root.propPane.id}
                        }).then(response=>{
                            root.$Message.success(root.$t('paneCard.tips_2'))
                            root.$emit('remove-pane',index)
                        }).catch(error=>{
                            if(config.DEBUG) console.log(error)
                            if(error.response.status===403)
                                root.$Message.error(root.$t('paneCard.tips_3'))
                            else
                                root.$Message.error(root.$t('paneCard.tips_4'))
                        })
                    }
                })
            },
            addDevice(item,index){
                this.$emit("on-add-device",item,index)
            },
            onSlotClick(row,col){
                let key = row + ',' + col
                let id = this.propPane.slotList[key].id
                if(this.propShowRemoveBtn){
                    if(this.propPane.slotList[key].device===null)
                        this.$Message.warning(this.$t('paneCard.tips_5'))
                    else {
                        this.showDeviceDetail = true
                        this.$refs.deviceDetail.refresh(this.propPane.slotList[key].device)
                    }
                }
                else{
                    this.$emit("on-slot-click",row,col,id)
                }
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
    .h-index{
        float:left;
        display: inline-block;
        width: 20px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border-right: 1px solid #dcdcdc;
    }
    .w-index{
        display: inline-block;
        width: 40px;
        text-align: center;
    }
    .remove{
        position: absolute;
        right: 15px;
        top: 10px;
        color: #D04B40;
        cursor: pointer;
    }
    .pane-box{
        width: 420px;
        height: 430px;
        display: flex;
        align-items: center;
        border:1px solid #dcdcdc;
    }
    .pane-col{
        width: 40px;
        height: 40px;
        border: 1px solid #dcdcdc;
        border-bottom: none;
        border-left: none;
    }
    .pane-container{
        width: 20px;
        height:20px;
        margin:10px auto;
    }
    .line{
        height: 1px;
        border-top: 1px solid #dcdcdc;
        margin-left: 19px;
    }
</style>







