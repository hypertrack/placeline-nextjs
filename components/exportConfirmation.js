import { Button, Badge } from "antd";
import _ from "lodash";

import ExportForm from "./exportForm";

class ExportConfirmation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      loading: false
    };
  }

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

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
    return (
      <div>
        <Badge count={this.props.count}>
          <Button
            onClick={this.showModal}
            type="primary"
            shape="circle"
            icon="upload"
            disabled={this.props.count < 1 || this.state.loading}
          />
        </Badge>
        <ExportForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          loading={this.state.loading}
          onCancel={this.handleCancel}
          onOk={this.handleOk}
        />
      </div>
    );
  }
}

export default ExportConfirmation;
