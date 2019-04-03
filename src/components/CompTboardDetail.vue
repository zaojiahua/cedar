<template>
    <Card title="Tboard1" dis-hover>
        <Form :label-width="80">
            <FormItem>
                <b slot="label">任务名称:</b>
                <Input disabled class="disabled-input" value="Test"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">测试用例:</b>
                <ButtonGroup>
                    <Button type="dashed">Job1</Button>
                    <Button type="dashed">Job2</Button>
                    <Button type="dashed">Job3</Button>
                </ButtonGroup>
            </FormItem>
            <FormItem>
                <b slot="label">测试设备:</b>
                <ButtonGroup>
                    <Button type="dashed">Device1</Button>
                    <Button type="dashed">Device2</Button>
                    <Button type="dashed">Device3</Button>
                </ButtonGroup>
            </FormItem>
            <FormItem>
                <b slot="label">运行轮次:</b>
                <Input disabled class="disabled-input" value="1">1</Input>
            </FormItem>
            <FormItem>
                <b slot="label">操作人员:</b>
                <Input disabled class="disabled-input" value="TingTing"></Input>
            </FormItem>
            <Divider orientation="left">总体运行结果</Divider>
                <Row type="flex" align="middle" style="margin: 32px 16px 32px 16px;">
                    <Col>
                        <i-circle :percent="91.6">
                            <p style="font-size:24px">91.6%</p>
                            <small>成功率</small>
                        </i-circle>
                    </Col>
                    <Col style="margin-left:16px;">
                        <b>总共: </b><span>60</span><br>
                        <b>通过: </b><span>55</span><br>
                        <b>失败: </b><span>4</span><br>
                        <b>无效: </b><span>1</span>
                    </Col>
                </Row>
            <Divider orientation="left">设备运行结果</Divider>
            <CellGroup @on-click="$emit('on-cell-click')">
                <Cell>
                    <Row type="flex" align="middle" style="margin-top: 16px; margin-bottom: 16px">
                        <Col>
                            <i-circle :size="80" :percent="75">
                                <p>75%</p>
                                <small>成功率</small>
                            </i-circle>
                        </Col>
                        <Col style="margin-left: 16px;">
                            <b>设备名称: </b><span>Device1</span><br>
                            <b>总共: </b><span>20</span><br>
                            <b>通过: </b><span>15</span><br>
                            <b>失败: </b><span>4</span><br>
                            <b>无效: </b><span>1</span>
                        </Col>
                    </Row>
                </Cell>
                <Cell>
                    <Row type="flex" align="middle" style="margin-top: 16px; margin-bottom: 16px">
                        <Col>
                            <i-circle :size="80" :percent="100" stroke-color="#5cb85c">
                                <Icon type="ios-checkmark" size="60" style="color:#5cb85c"></Icon>
                            </i-circle>
                        </Col>
                        <Col style="margin-left: 16px;">
                            <b>设备名称: </b><span>Device2</span><br>
                            <b>总共: </b><span>20</span><br>
                            <b>通过: </b><span>20</span><br>
                            <b>失败: </b><span>0</span><br>
                            <b>无效: </b><span>0</span>
                        </Col>
                    </Row>
                </Cell>
                <Cell>
                    <Row type="flex" align="middle" style="margin-top: 16px; margin-bottom: 16px">
                        <Col>
                            <i-circle :size="80" :percent="100" stroke-color="#5cb85c">
                                <Icon type="ios-checkmark" size="60" style="color:#5cb85c"></Icon>
                            </i-circle>
                        </Col>
                        <Col style="margin-left: 16px;">
                            <b>设备名称: </b><span>Device3</span><br>
                            <b>总共: </b><span>20</span><br>
                            <b>通过: </b><span>20</span><br>
                            <b>失败: </b><span>0</span><br>
                            <b>无效: </b><span>0</span>
                        </Col>
                    </Row>
                </Cell>
            </CellGroup>
        </Form>
    </Card>
</template>

<script>
    const getTboardSerializer = {
        board_name: "string",
        job: [
            {
                id: "number",
                job_name: "string",
                job_label: "string"
            }
        ],
        device: [
            {
                id: "number",
                device_name: "string",
                device_label: "string"
            }
        ],
        repeat_time: "number",
        author: {
            id: "number",
            username: "string",
            last_name: "string"
        }

    }
    const getRdsSerializer = {
        rdss: [
            {
                id: "number",
                job_assessment_value: "string"
            }
        ]
    }

    export default {
        name: "CompTboardDetail",
        data(){
            return {
                data: {},
                openMoreDetail: false
            }
        },
        methods: {
            refresh(id){

            }
        }
    }
</script>

<style scoped>
    .disabled-input >>> input {
        background-color: #0000;
        color: #515a6e;
        border: #eee dotted 1px;
    }
</style>