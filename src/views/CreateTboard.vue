<template>
    <div>
        <Steps :current="selStep" direction="vertical">
            <Step title="选择测试设备">
                <Card class="layout">
                    <!--<p slot="title">请选择测试设备</p>-->
                    <Table stripe height="450" :columns="deviceColumns" :data="deviceData"></Table>
                    <Button class="Btn" @click="showDeviceDetail = true">选取设备</Button><Icon v-show="dev_del" class="deleteIcon" type="ios-trash-outline" />
                </Card>
            </Step>
            <Step title="选择测试用例">
                <Card class="layout jobTab">
                    <!--<p slot="title">请选择测试用例</p>-->
                    <Table stripe height="450" :columns="jobColumns" :data="jobData"></Table>
                    <Button class="Btn">选取用例</Button><Icon v-show="job_del" class="deleteIcon" type="ios-trash-outline" />
                </Card>
            </Step>
            <Step title="填写任务信息">
                <Card class="layout tboardInfo">
                    <p slot="title">填写任务信息</p>
                    <p style="margin-bottom: 20px"><span>任务名称：</span><Input v-model="tborad_name" placeholder="Enter task name..." clearable style="width: 50%" /></p>
                    <p><span>运行轮次：</span><InputNumber :min="1" v-model="times" precision></InputNumber></p>
                    <Button class="startBtn">启动任务</Button>
                </Card>
            </Step>
        </Steps>

        <Drawer v-model="showDeviceDetail" :draggable="true" width="50" title="请选择要进行测试的设备">
            <Table :columns="deviceColumns1" :data="deviceData" height="700px" stripe></Table>
        </Drawer>

    </div>
</template>

<script>
    export default {
        name: "CreateTboard",
        data(){
            return {
                deviceColumns: [
                    {
                        title: '自定义名称',
                        key: 'device_name'
                    },
                    {
                        title: '设备编号',
                        key: 'device_label'
                    },
                    {
                        title: '设备型号',
                        key: 'phone_model',
                        sortable: true
                    },
                    {
                        title: '安卓版本',
                        key: 'android_version',
                        sortable: true
                    },
                    {
                        title: 'ROM版本',
                        key: 'rom_version'
                    }
                ],
                deviceColumns1: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '自定义名称',
                        key: 'device_name'
                    },
                    {
                        title: '设备编号',
                        key: 'device_label'
                    },
                    {
                        title: '设备型号',
                        key: 'phone_model',
                        sortable: true
                    },
                    {
                        title: '安卓版本',
                        key: 'android_version',
                        sortable: true
                    },
                    {
                        title: 'ROM版本',
                        key: 'rom_version'
                    }
                ],
                deviceData: [
                    {
                        device_name: 'Device',
                        device_label: "device_label",
                        phone_model: 'dior',
                        android_version: '4.4.2',
                        rom_version: '4.4.0',
                    },
                    {
                        device_name: 'Device',
                        device_label: "device_label",
                        phone_model: 'moch',
                        android_version: '4.4.1',
                        rom_version: '4.4.0',
                    },
                    {
                        device_name: 'Device',
                        device_label: "device_label",
                        phone_model: 'dior',
                        android_version: '4.4.5',
                        rom_version: '4.4.0',
                    },
                    {
                        device_name: 'Device',
                        device_label: "device_label",
                        phone_model: 'dior',
                        android_version: '4.4.5',
                        rom_version: '4.4.0',
                    },
                    {
                        device_name: 'Device',
                        device_label: "device_label",
                        phone_model: 'dior',
                        android_version: '4.4.5',
                        rom_version: '4.4.0',
                    },
                    {
                        device_name: 'Device',
                        device_label: "device_label",
                        phone_model: 'dior',
                        android_version: '4.4.5',
                        rom_version: '4.4.0',
                    },
                    {
                        device_name: 'Device',
                        device_label: "device_label",
                        phone_model: 'dior',
                        android_version: '4.4.5',
                        rom_version: '4.4.0',
                    },
                    {
                        device_name: 'Device',
                        device_label: "device_label",
                        phone_model: 'dior',
                        android_version: '4.4.5',
                        rom_version: '4.4.0',
                    },
                    {
                        device_name: 'Device',
                        device_label: "device_label",
                        phone_model: 'dior',
                        android_version: '4.4.5',
                        rom_version: '4.4.0',
                    },
                    {
                        device_name: 'Device',
                        device_label: "device_label",
                        phone_model: 'dior',
                        android_version: '4.4.5',
                        rom_version: '4.4.0',
                    },
                    {
                        device_name: 'Device',
                        device_label: "device_label",
                        phone_model: 'dior',
                        android_version: '4.4.5',
                        rom_version: '4.4.0',
                    }
                ],
                jobColumns: [
                    {
                        title: '运行次数',
                        key: 'repeat'
                    },
                    {
                        title: '用例名称',
                        key: 'job_name'
                    },
                    {
                        title: '测试用途',
                        key: 'test_area'
                    },
                    {
                        title: '用例耗时',
                        key: 'time',
                        sortable: true
                    }
                ],
                jobData: [
                    {
                        repeat: 1,
                        job_name: "job_name1",
                        test_area: 'test_area1',
                        time: '20s'
                    },
                    {
                        repeat: 2,
                        job_name: "job_name1",
                        test_area: 'test_area1',
                        time: '25s'
                    },
                    {
                        repeat: 3,
                        job_name: "job_name1",
                        test_area: 'test_area1',
                        time: '24s'
                    },
                    {
                        repeat: 4,
                        job_name: "job_name1",
                        test_area: 'test_area1',
                        time: '10s'
                    },
                    {
                        repeat: 5,
                        job_name: "job_name1",
                        test_area: 'test_area1',
                        time: '40s'
                    },
                ],
                dev_del:false,
                job_del:true,
                tborad_name:"test",
                times:1,
                selStep:0,
                showDeviceDetail:false,
            }
        },
        methods:{

        }
    }
</script>

<style scoped>
    .layout{
        /*float: left;*/
        /*width: 49%;*/
        margin: 20px 0;
    }
    .jobTab{
         /*margin-left: 1%;*/
     }
    .Btn{
        margin-top: 15px;
        margin-left: 45%;
    }
    .deleteIcon{
        font-size: 32px;
        margin-top: 13px;
        margin-left: 15px;
    }
    .tboardInfo{
        /*width: 99%;*/
        /*clear: both;*/
        height: 300px;
    }
    .startBtn{
        position: absolute;
        margin-left: 45%;
        bottom: 30px;
    }
</style>