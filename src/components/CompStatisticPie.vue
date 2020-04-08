<template>
    <div>
        <div id="statistic" style="height: 200px;"></div>
    </div>
</template>

<script>
    import echarts from "echarts"

    export default {
        data() {
            return {
                histogram:null,
                failure:0.068
            }
        },
        methods:{
            setDefaultOption(){
                let option = {
                    color:[ "#1bbc9c","#FFAE25","#999"],
                    series: [
                        {
                            name: '访问来源',
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
                                        let cont = Number(this.failure*100).toFixed(1);
                                        return cont + '%\n失败率'
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
                            data: [
                                {value: 15132, name: '通过'},
                                {value: 5780, name: '未通过'},
                                {value: 240, name: '无效'},
                            ]
                        }
                    ]
                };
                this.histogram.setOption(option)
            }
        },
        mounted(){
            this.histogram = echarts.init(document.getElementById("statistic"));

            this.setDefaultOption();
        }
    }


</script>