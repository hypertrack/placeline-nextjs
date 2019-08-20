import _ from "lodash";

import PlaceForm from "./placeForm";

class PlaceSelection extends React.Component {
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
    const { item } = this.props;

    return (
      <div>
        <a
          key={`show-places-${item.device_id}`}
          onClick={() => this.showModal()}
        >
          Places
        </a>
        <PlaceForm
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

export default PlaceSelection;
