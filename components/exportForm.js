import {
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Row,
  Col
} from "antd";

import Map from "./map";

const ExportForm = Form.create({ name: "form_in_modal" })(
  class extends React.Component {
    render() {
      const { visible, onCancel, onOk, form, loading } = this.props;
      const { getFieldDecorator } = form;
      const { Option } = Select;

      return (
        <Modal
          visible={visible}
          title="Submit expenses"
          okText="Submit"
          onCancel={onCancel}
          onOk={onOk}
          width="75%"
          footer={[
            ,
            <Button
              key="submit"
              htmlType="submit"
              type="primary"
              loading={loading}
              onClick={onOk}
            >
              Submit
            </Button>
          ]}
        >
          <Row gutter={8}>
            <Col span={10}>
              <Form layout="vertical">
                <Row gutter={8}>
                  <Col span={12}>
                    <Form.Item label="Distance">
                      {getFieldDecorator("input-number", { initialValue: 1 })(
                        <InputNumber min={1} max={9999} />
                      )}
                      <span className="ant-form-text"> miles</span>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Amount">
                      {getFieldDecorator("input-number", { initialValue: 1 })(
                        <InputNumber min={1} max={9999} />
                      )}
                      <span className="ant-form-text"> $</span>
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item label="Rate" hasFeedback>
                  <Select defaultValue="1">
                    <Option value="1">Default ($5.80/mile)</Option>
                    <Option value="2">Long-range ($4.50/mile)</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Date">
                  {getFieldDecorator("date-picker", {
                    rules: [
                      {
                        type: "object",
                        required: true,
                        message: "Please select the date of the expense"
                      }
                    ]
                  })(<DatePicker />)}
                </Form.Item>

                <Form.Item label="Description">
                  {getFieldDecorator("description")(<Input type="textarea" />)}
                </Form.Item>
              </Form>
            </Col>
            <Col offset={4} span={10}>
              <Map segments={this.props.segments} height="400px" />
            </Col>
          </Row>
        </Modal>
      );
    }
  }
);

export default ExportForm;
