<template>
    <div>
        <div v-show="propData.length>0" style="padding: 10px">
            <Collapse simple>
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
                                            <span :class="{'high-light':(item_eb1.value!==undefined&&item_eb1.value!==0)}">{{ eb2_index+1 }}-{{ item_eb2.block_name }}
                                                <span v-show="item_eb2.value!==undefined"> ( {{ item_eb2.value }} )</span></span>
                                            <div slot="content" v-for="(unit_list,unit_index) in item_eb2.all_unit_list" class="unit_box">
                                                <p v-for="unit_item in unit_list.units" :class="{'high-light':unit_item.detail.result!==0}">
                                                    {{ unit_index+1 }}-{{ unit_item.jobUnitName }} ( {{ unit_item.detail.result }} )
                                                </p>
                                            </div>
                                        </Panel>

                                    </Collapse>
                                </div>
                                <div slot="content"  v-if="item_eb1.all_unit_list">
                                    <div v-for="(unit_list,unit_index) in item_eb1.all_unit_list" class="unit_box">
                                        <p v-for="unit_item in unit_list.units" :class="{'high-light':unit_item.detail.result!==0}">
                                            {{ unit_index+1 }}-{{ unit_item.jobUnitName }} ( {{ unit_item.detail.result }} )
                                        </p>
                                    </div>
                                </div>
                            </Panel>
                        </Collapse>
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
            }
        },
        data(){
            return{

            }
        },
        methods:{

        }
    }
</script>

<style>
    .high-light{
        color: red;
    }
    .unit_box{
        padding: 5px;
    }
</style>
