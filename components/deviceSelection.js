import { Avatar, List, Icon, Input, Tag } from "antd";
import styled from "styled-components";
import _ from "lodash";
import Router from "next/router";

import PlaceSelection from "./placeSelection";
// import { getDeviceColor } from "../common/devices";

class DeviceSelection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      placeModal: null
    };
  }

  showPlaceModal = placeModal => {
    this.setState({ placeModal });
  };

  handleChange(item) {
    this.props.onSelect();
    Router.push(
      `/placeline?id=${item.device_id}&name=${encodeURIComponent(
        _.get(item, "device_info.name", item.device_id)
      )}`
    );
  }

  getTripAmount(device_id) {
    const { trips } = this.props;
    let activeTrips = 0,
      completedTrips = 0;

    for (let i = 0; i < trips.length; i++) {
      const trip = trips[i];
      if (trip.device_id === device_id) {
        trip.status === "completed" ? completedTrips++ : activeTrips++;
      }
    }

    return { activeTrips, completedTrips };
  }

  render() {
    const StyledList = styled(List)`
      height: 100vh;
      max-height: 100vh !important;
      overflow: scroll;
      padding: 12px;
    `;

    const { Search } = Input;

    return (
      <div style={{ margin: "24px" }}>
        <Search
          placeholder="Search for device ID or name ..."
          onChange={e => this.props.filterDevices(e.target.value)}
          value={this.props.filterText}
          style={{ marginBottom: "24px" }}
        />
        <StyledList
          itemLayout="vertical"
          size="large"
          dataSource={
            this.props.filterText === ""
              ? this.props.devices
              : this.props.filteredDevices
          }
          renderItem={item => (
            <List.Item
              actions={[
                <PlaceSelection
                  item={item}
                  places={_.get(this.props, "places", [])}
                  showPlaceModal={id => this.showPlaceModal(id)}
                  visibleModal={this.state.placeModal}
                />
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    style={{
                      color: `#${_.get(item, "device_info.name", "")}`
                    }}
                    shape="square"
                    src={`../static/status/${_.get(
                      item,
                      "device_status.value",
                      "disconnected"
                    )}.svg`}
                  />
                }
                title={
                  <a onClick={() => this.handleChange(item)}>
                    {/*<Tag color={getDeviceColor(item.device_id)}>•</Tag>*/}
                    {_.get(item, "device_info.name", "")}
                  </a>
                }
                description={
                  this.props.tripsLoading
                    ? "loading trips ..."
                    : `${
                        this.getTripAmount(item.device_id).activeTrips
                      } active trip(s) | ${
                        this.getTripAmount(item.device_id).completedTrips
                      } completed trip(s)`
                }
              />
              {_.get(item, "device_id", "")}
            </List.Item>
          )}
          loading={this.props.loading}
        />
      </div>
    );
  }
}

export default DeviceSelection;
