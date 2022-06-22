<template>
    <div>
        <div v-show="propData.length>0">
            <Collapse>
                <Panel v-for="flow in propData">
                    {{ flow.flow_name }} ( {{ flow.job_assessment_value }} )
                    <div slot="content">
                        <Collapse>
                            <Panel  v-for="(item_eb1,eb1_index) in flow.eblock_list">
                                <span :class="{'high-light':item_eb1.job_assessment_value!=='0'}" v-if="item_eb1.eblock_list">
                                    {{ eb1_index+1 }}-{{ item_eb1.block_name }}<span v-show="item_eb1.job_assessment_value"> ( {{ item_eb1.job_assessment_value }} )</span></span>
                                <span :class="{'high-light':item_eb1.value!==undefined&&item_eb1.value!==0}" v-if="item_eb1.all_unit_list">
                                    {{ eb1_index+1 }}-{{ item_eb1.block_name }}<span v-show="item_eb1.value!==undefined"> ( {{ item_eb1.value }} )</span></span>
                                <div slot="content" v-if="item_eb1.eblock_list">
                                    <Collapse>
                                        <Panel v-for="(item_eb2,eb2_index) in item_eb1.eblock_list">
                                            <span :class="{'high-light':(item_eb2.value!==undefined&&item_eb2.value!==0)}">{{ eb2_index+1 }}-{{ item_eb2.block_name }}
                                                <span v-show="item_eb2.value!==undefined"> ( {{ item_eb2.value }} )</span></span>
                                            <div slot="content" v-for="(unit_list,unit_index) in item_eb2.all_unit_list" class="unit_box">
                                                <div v-for="unit_item in unit_list.units">
                                                    <p v-if="unit_item.detail" :class="{'high-light':unit_item.detail.result!==0}">{{ unit_index+1 }}-{{ unit_item.jobUnitName }} ( {{ unit_item.detail.result }} )
                                                        {{ unit_item.assistDevice ? '【僚机'+ unit_item.assistDevice +'】' : ''}}</p>
                                                    <p v-else>{{ unit_index+1 }}-{{ unit_item.jobUnitName }} {{ unit_item.assistDevice ? '【僚机'+ unit_item.assistDevice +'】' : ''}}</p>
                                                    <div class="pic" v-for="(pic,index) in unit_item.pictures" >
                                                        <p :class="{'high-light-pic':propPicName===pic&&!isNotInclude(pic),'high-light':isNotInclude(pic)}" @click="onPicClick(pic)"><Icon type="md-image" class="p-icon" />{{ unit_item.timestamps ? unit_item.timestamps[index] :'' }} {{ pic }}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Panel>

                                    </Collapse>
                                </div>
                                <div slot="content"  v-if="item_eb1.all_unit_list">
                                    <div v-for="(unit_list,unit_index) in item_eb1.all_unit_list" class="unit_box">
                                        <div v-for="unit_item in unit_list.units">
                                            <p v-if="unit_item.detail" :class="{'high-light':unit_item.detail.result!==0}">{{ unit_index+1 }}-{{ unit_item.jobUnitName }} ( {{ unit_item.detail.result }} )
                                                {{ unit_item.assistDevice ? '【僚机'+ unit_item.assistDevice +'】' : ''}}</p>
                                            <p v-else>{{ unit_index+1 }}-{{ unit_item.jobUnitName }} {{ unit_item.assistDevice ? '【僚机'+ unit_item.assistDevice +'】': ''}}</p>
                                            <div class="pic " v-for="(pic,index) in unit_item.pictures" >
                                                <p :class="{'high-light-pic':propPicName===pic&&!isNotInclude(pic),'high-light':isNotInclude(pic)}" @click="onPicClick(pic)"><Icon type="md-image" class="p-icon" />{{ unit_item.timestamps ? unit_item.timestamps[index]:'' }} {{ pic }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Panel>
                        </Collapse>
                        <div style="margin-top: 10px;margin-left: 16px">
                            <p v-for="times in flow.switch_times">{{ times.name }} ( {{ times.time }} / {{ times.max_time }} )</p>
                        </div>
                    </div>
                </Panel>
            </Collapse>
        </div>
    </div>
</template>

<script>

    import config from "../lib/config"
    export default{
        props:{
            propData:{
                type:Array,
                default:()=>{
                    return []
                }
            },
            propPicName:{
                type:String,
                default:""
            },
            propPicList:{
                type:Array,
                default:()=>{
                    return []
                }
            }
        },
        data(){
            return{

            }
        },
        methods:{
            onPicClick(picName){
                // if(!this.isNotInclude(picName))
                //     this.$emit("on-pic-name-click",picName)
                this.$emit("on-pic-name-click",picName)
            },
            isNotInclude(picName){
                // for (let i=0;i<this.propPicList.length;i++) {
                //     if(this.propPicList[i].file_name===picName)
                //         return false
                // }
                // return true
                return false
            }
        }
    }
</script>

<style>
    .high-light{
        color: red;
    }
    .pic{
        margin-top: 5px;
        margin-left: 14px;
        cursor: pointer;
    }
    .p-icon{
        margin-right: 5px;
    }
    .high-light-pic{
        background: #515a6e;
        color: #fff;
    }
    .unit_box{
        padding: 5px;
    }
</style>
