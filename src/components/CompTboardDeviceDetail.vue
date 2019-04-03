<template>
    <Card title="Device(device-label)" dis-hover>
        <Row type="flex" align="middle" style="margin: 32px 16px 32px 16px;">
            <Col>
                <i-circle :percent="75">
                    <p style="font-size:24px">75%</p>
                    <small>成功率</small>
                </i-circle>
            </Col>
            <Col style="margin-left:16px;">
                <b>总共: </b><span>20</span><br>
                <b>通过: </b><span>15</span><br>
                <b>失败: </b><span>4</span><br>
                <b>无效: </b><span>1</span>
            </Col>
        </Row>
        <Divider orientation="left">Device1任务运行结果</Divider>
        <Form label-width="80">
            <Card dis-hover style="margin-bottom: 16px;">
                <FormItem style="margin-bottom: 8px;">
                    <b slot="label">任务名称:</b>
                    <Input disabled class="disabled-input" value="Job1"></Input>
                </FormItem>
                <FormItem style="margin-bottom: 0px;">
                    <b slot="label">结果总数:</b>
                    <Input disabled class="disabled-input" value="20"></Input>
                </FormItem>
                <FormItem style="margin-bottom: 0px;">
                    <b slot="label">通过:</b>
                    <Progress :percent="70" stroke-width="4">7</Progress>
                </FormItem>
                <FormItem style="margin-bottom: 0px;">
                    <b slot="label">失败:</b>
                    <Progress :percent="20" stroke-color="#ed4014" stroke-width="4">2</Progress>
                </FormItem>
                <FormItem style="margin-bottom: 0px;">
                    <b slot="label">无效:</b>
                    <Progress :percent="10" stroke-color="#ff9900" stroke-width="4">1</Progress>
                </FormItem>
            </Card>
            <Card dis-hover style="margin-bottom: 16px;">
                <FormItem style="margin-bottom: 8px;">
                    <b slot="label">任务名称:</b>
                    <Input disabled class="disabled-input" value="Job1"></Input>
                </FormItem>
                <FormItem style="margin-bottom: 0px;">
                    <b slot="label">结果总数:</b>
                    <Input disabled class="disabled-input" value="20"></Input>
                </FormItem>
                <FormItem style="margin-bottom: 0px;">
                    <b slot="label">通过:</b>
                    <Progress :percent="70" stroke-width="4">7</Progress>
                </FormItem>
                <FormItem style="margin-bottom: 0px;">
                    <b slot="label">失败:</b>
                    <Progress :percent="20" stroke-color="#ed4014" stroke-width="4">2</Progress>
                </FormItem>
                <FormItem style="margin-bottom: 0px;">
                    <b slot="label">无效:</b>
                    <Progress :percent="10" stroke-color="#ff9900" stroke-width="4">1</Progress>
                </FormItem>
            </Card>
            <Card dis-hover style="margin-bottom: 16px;">
                <FormItem style="margin-bottom: 8px;">
                    <b slot="label">任务名称:</b>
                    <Input disabled class="disabled-input" value="Job1"></Input>
                </FormItem>
                <FormItem style="margin-bottom: 0px;">
                    <b slot="label">结果总数:</b>
                    <Input disabled class="disabled-input" value="20"></Input>
                </FormItem>
                <FormItem style="margin-bottom: 0px;">
                    <b slot="label">通过:</b>
                    <Progress :percent="70" stroke-width="4">7</Progress>
                </FormItem>
                <FormItem style="margin-bottom: 0px;">
                    <b slot="label">失败:</b>
                    <Progress :percent="20" stroke-color="#ed4014" stroke-width="4">2</Progress>
                </FormItem>
                <FormItem style="margin-bottom: 0px;">
                    <b slot="label">无效:</b>
                    <Progress :percent="10" stroke-color="#ff9900" stroke-width="4">1</Progress>
                </FormItem>
            </Card>
            <Card dis-hover style="margin-bottom: 16px;">
                <FormItem style="margin-bottom: 8px;">
                    <b slot="label">任务名称:</b>
                    <Input disabled class="disabled-input" value="Job1"></Input>
                </FormItem>
                <FormItem style="margin-bottom: 0px;">
                    <b slot="label">结果总数:</b>
                    <Input disabled class="disabled-input" value="20"></Input>
                </FormItem>
                <FormItem style="margin-bottom: 0px;">
                    <b slot="label">通过:</b>
                    <Progress :percent="70" stroke-width="4">7</Progress>
                </FormItem>
                <FormItem style="margin-bottom: 0px;">
                    <b slot="label">失败:</b>
                    <Progress :percent="20" stroke-color="#ed4014" stroke-width="4">2</Progress>
                </FormItem>
                <FormItem style="margin-bottom: 0px;">
                    <b slot="label">无效:</b>
                    <Progress :percent="10" stroke-color="#ff9900" stroke-width="4">1</Progress>
                </FormItem>
            </Card>
            <Card dis-hover style="margin-bottom: 16px;">
                <FormItem style="margin-bottom: 8px;">
                    <b slot="label">任务名称:</b>
                    <Input disabled class="disabled-input" value="Job1"></Input>
                </FormItem>
                <FormItem style="margin-bottom: 0px;">
                    <b slot="label">结果总数:</b>
                    <Input disabled class="disabled-input" value="20"></Input>
                </FormItem>
                <FormItem style="margin-bottom: 0px;">
                    <b slot="label">通过:</b>
                    <Progress :percent="70" stroke-width="4">7</Progress>
                </FormItem>
                <FormItem style="margin-bottom: 0px;">
                    <b slot="label">失败:</b>
                    <Progress :percent="20" stroke-color="#ed4014" stroke-width="4">2</Progress>
                </FormItem>
                <FormItem style="margin-bottom: 0px;">
                    <b slot="label">无效:</b>
                    <Progress :percent="10" stroke-color="#ff9900" stroke-width="4">1</Progress>
                </FormItem>
            </Card>
        </Form>
    </Card>
</template>

<script>
    import CompDeviceDetail from "./CompDeviceDetail";
    export default {
        name: "CompTboardDeviceDetail",
        components: {CompDeviceDetail}
    }
</script>

<style scoped>
    .disabled-input >>> input {
        background-color: #0000;
        color: #515a6e;
        border: #eee dotted 1px;
    }
</style>