import _ from "lodash";
import axios from "axios";

import PlaceForm from "./placeForm";
import { findPlacesByDeviceId } from "../common/places";

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

  handleOk = async places => {
    this.setState({ loading: true });

    // save places
    for (let i = 0; i < places.length; i++) {
      await axios({
        method: "post",
        url: `${process.env.SERVER_URL}/device-places/${
          this.props.item.device_id
        }/:${places[i].label}`,
        data: places[i]
      });
    }

    this.setState({ loading: false, visible: false });
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
          places={findPlacesByDeviceId(this.props.places, item.device_id)}
          visible={this.state.visible}
          loading={this.state.loading}
          onCancel={this.handleCancel}
          onOk={e => this.handleOk(e)}
        />
      </div>
    );
  }
}

export default PlaceSelection;
