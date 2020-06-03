<template>
    <div>
        <div :id="'statistic'+propId" style="height: 200px;"></div>
    </div>
</template>

<script>
    import echarts from "echarts"

    export default {
        props:{
            propData:{
                type:Array,
                default:()=>{return []}
            },
            propFailure:{
                type:Number,
            },
            propInvalidRate:{
                type:Number,
            },
            propId:{
                type:Number,
                default:0
            },
            propType:{
                type:Number,
                default:1   //1：失败 2：无效
            }
        },
        data() {
            return {
                histogram:null,
                failure:0.068
            }
        },
        methods:{
            setDefaultOption(){
                let str = "失败率"
                if(this.propType===2)
                    str = "无效率"
                let option = {
                    color:[ "#1bbc9c","#FFAE25","#999"],   //通过>未通过>无效
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            radius: ['50%', '70%'],
                            avoidLabelOverlap: false,
                            emphasis: {
                                label: {
                                    show: true,
                                }
                            },
                            legendHoverLink:false,
                            hoverAnimation:false,
                            label: {
                                normal: {
                                    show: true,
                                    position: 'center',
                                    formatter: ()=>{
                                        let cont = (this.propFailure*100).toFixed(1);
                                        if(this.propType===2)
                                            cont = (this.propInvalidRate*100).toFixed(1);
                                        return cont + '%\n' + str
                                    },
                                    textStyle: {
                                        fontSize: '16',
                                        color: '#515a6e',
                                        lineHeight:20
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: this.propData
                        }
                    ]
                };
                this.histogram.setOption(option)
            }
        },
        watch:{
            propData:{
                handler:function () {
                    this.setDefaultOption();
                }
            },
            propType:{
                handler: function(val){
                    this.setDefaultOption();
                },
            }
        },
        mounted(){
            this.histogram = echarts.init(document.getElementById("statistic"+this.propId));

            this.setDefaultOption();
        }
    }


</script>