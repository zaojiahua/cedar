<template>
    <div>
        <div @mouseenter="showRemove=true" @mouseleave="showRemove=false">
            <span v-if="propShowRemoveBtn" v-show="showRemove" class="remove" @click="removePane(propIndex)">移除</span>
            <div class="pane-box">
                <div :style="{ width: (propPane.width*50+30) + 'px'}" style="margin:auto">
                    <p style="margin-left: 20px"><span class="w-index" v-for="h_index in propPane.width">{{ h_index }}</span></p>
                    <div>
                        <Row v-for="w_index in propPane.height" :key="w_index">
                            <span class="h-index"> {{ w_index }}</span>
                            <Col class="pane-col" span="1" v-for="h_index in propPane.width" :key="h_index" :style="{background: hoverColor(w_index,h_index)}">
                                <div class="pane-container" :style="{background:showColor(propPane.slotList,w_index-1,h_index-1)}" @mouseenter="onMouseOver(w_index,h_index)" @mouseleave="onMouseLeave" @click="onSlotClick(w_index-1,h_index-1)"></div>
                            </Col>
                        </Row>
                        <p class="line" :style="{width: 50*propPane.width + 'px'}"></p>
                    </div>
                </div>
            </div>
            <p style="text-align: center;margin-top: 15px;"><span style="cursor: pointer" @click="addDevice(propPane,propIndex)">{{ propPane.name }}</span></p>
</div>
</div>
</template>

<script>

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
        data(){
            return{
                showRemove:false,
                row:null,
                col:null,
                openModal:false,
            }
        },
        methods:{
            showColor(paneSlot,row,col){
                let key = row + ',' + col
                if(paneSlot[key].status==="ok")  //判断device的状态
                    return "#18A360"
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
                this.$emit('remove-pane',index)
            },
            addDevice(item,index){
                this.$emit("on-add-device",item,index)
            },
            onSlotClick(row,col){
                if(this.propShowRemoveBtn)
                    alert('查看device的详细信息')
                else{
                    let key = row + ',' + col
                    let id = this.propPane.slotList[key].id
                    this.$emit("on-slot-click",row,col,id)
                }
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
        height: 50px;
        line-height: 50px;
        text-align: center;
        border-right: 1px solid #dcdcdc;
    }
    .w-index{
        display: inline-block;
        width: 50px;
        text-align: center;
    }
    .remove{
        position: absolute;
        right: 15px;
        top: 10px;
        cursor: pointer;
    }
    .pane-box{
        width: 500px;
        height: 400px;
        display: flex;
        align-items: center;
        border:1px solid #dcdcdc;
    }
    .pane-col{
        width: 50px;
        height: 50px;
        border: 1px solid #dcdcdc;
        border-bottom: none;
        border-left: none;
    }
    .pane-container{
        width: 20px;
        height:20px;
        margin:15px auto;
    }
    .line{
        height: 1px;
        border-top: 1px solid #dcdcdc;
        margin-left: 20px;
        margin-top: -1px;
    }
</style>







