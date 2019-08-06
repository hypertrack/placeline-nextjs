import { Modal, Button, Badge, Form } from "antd";
import _ from "lodash";

class ExportConfirmation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      loading: false
    };
  }

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 3000);
  };

  render() {
    const { getFieldDecorator } = form;

    return (
      <div>
        <Badge count={this.props.count}>
          <Button
            onClick={this.showModal}
            type="primary"
            shape="circle"
            icon="upload"
          />
        </Badge>
        <Modal
          visible={this.state.visible}
          title="Submit Expenses"
          centered
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Close
            </Button>,
            <Button
              key="submit"
              htmlType="submit"
              type="primary"
              loading={this.state.loading}
              onClick={this.handleOk}
            >
              Submit
            </Button>
          ]}
        >
          <Form layout="vertical">
            <Form.Item label="Distance">
              {getFieldDecorator("distance", {
                rules: [
                  {
                    required: true,
                    message: "A distance is required"
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default ExportConfirmation;
