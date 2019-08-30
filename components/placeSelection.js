import { Icon } from "antd";
import _ from "lodash";
import axios from "axios";

import PlaceForm from "./placeForm";

class PlaceSelection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };
  }

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  handleOk = async places => {
    this.setState({ loading: true });

    // save places
    for (let i = 0; i < places.length; i++) {
      await axios({
        method: "post",
        url: `${process.env.SERVER_URL}/device-places/${
          this.props.item.device_id
        }/${places[i].label}`,
        data: places[i]
      });
    }

    this.setState({ loading: false });
    this.props.showPlaceModal(null);
  };

  render() {
    const { item } = this.props;

    return (
      <div>
        <a
          key={`show-places-${item.device_id}`}
          onClick={() => this.props.showPlaceModal(item.device_id)}
        >
          <Icon type="setting" /> Places
        </a>
        {this.props.visibleModal === item.device_id && (
          <PlaceForm
            deviceName={_.get(item, "device_info.name", item.device_id)}
            wrappedComponentRef={this.saveFormRef}
            places={this.props.places}
            visible={this.props.visibleModal === item.device_id}
            loading={this.state.loading}
            onCancel={() => this.props.showPlaceModal(null)}
            onOk={e => this.handleOk(e)}
          />
        )}
      </div>
    );
  }
}

export default PlaceSelection;
