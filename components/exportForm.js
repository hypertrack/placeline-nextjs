import {
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Row,
  Col,
  Checkbox
} from "antd";
import moment from "moment";
import _ from "lodash";

import Map from "./map";

const ExportForm = Form.create({ name: "form_in_modal" })(
  class extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        distance: 0,
        rate: 3.6,
        amount: 0,
        date: undefined,
        description: "",
        submitted: false
      };
    }

    componentWillReceiveProps() {
      let distance = 0,
        rate = 3.6,
        amount = 0,
        date = undefined,
        description = "";

      if (this.props.segments) {
        for (let i = 0; i < this.props.segments.length; i++) {
          const segment = this.props.segments[i];

          // sum of distance
          distance += segment.distance;

          if (i === 0) {
            // set starting address in description
            description = `Drive from ${_.get(
              segment,
              "start_place",
              "A"
            )} to `;

            // set starting date as date
            date = moment(segment.start_datetime);
          }

          if (i === this.props.segments.length - 1) {
            // set end address in description
            description += `${_.get(segment, "end_place", "B")}`;
          }
        }
      }

      // convert meters to kilometers
      distance = (distance / 1000).toFixed(2);
      amount = (distance * rate).toFixed(2);

      this.setState({
        distance,
        rate,
        amount,
        date,
        description
      });
    }

    onClose(submitted) {
      this.setState(
        {
          submitted
        },
        () => {
          if (submitted) {
            this.props.onOk();
          } else {
            this.props.onCancel();
          }
        }
      );
    }

    render() {
      const { visible, form, loading } = this.props;
      const { getFieldDecorator } = form;
      const { Option } = Select;

      return (
        <Modal
          visible={visible}
          title="Submit expenses"
          okText="Submit"
          onCancel={() => this.onClose(false)}
          onOk={() => this.onClose(true)}
          afterClose={() => this.props.onSubmitSuccess(this.state)}
          width="75%"
          footer={[
            ,
            <Button
              key="submit"
              htmlType="submit"
              type="primary"
              loading={loading}
              onClick={() => this.onClose(true)}
            >
              Submit
            </Button>
          ]}
        >
          <Row gutter={8}>
            <Col span={10}>
              <Form layout="vertical">
                <Row gutter={8}>
                  <Col span={8}>
                    <Form.Item label="Distance">
                      {getFieldDecorator("input-number", {
                        initialValue: this.state.distance
                      })(<InputNumber min={1} max={9999} />)}
                      <span className="ant-form-text"> kilometers</span>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Amount">
                      {getFieldDecorator("input-number", {
                        initialValue: this.state.amount
                      })(<InputNumber min={1} max={9999} />)}
                      <span className="ant-form-text"> $</span>
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item label="Rate" hasFeedback>
                  <Select defaultValue="1">
                    <Option value="1">Default ($3.60/km)</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Date">
                  {getFieldDecorator("date-picker", {
                    initialValue: this.state.date,
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
                  {getFieldDecorator("description", {
                    initialValue: this.state.description
                  })(<Input type="textarea" />)}
                </Form.Item>
                <Form.Item>
                  <Checkbox checked={true}>Reimbursable</Checkbox>
                </Form.Item>
              </Form>
            </Col>
            <Col offset={4} span={10}>
              <Map segments={this.props.segments} height="450px" />
            </Col>
          </Row>
        </Modal>
      );
    }
  }
);

export default ExportForm;
