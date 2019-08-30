import { Avatar, List, Icon, Input, Tag } from "antd";
import styled from "styled-components";
import _ from "lodash";
import Router from "next/router";

import PlaceSelection from "./placeSelection";

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
          disabled={this.props.devicesLoading}
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
                this.props.placesLoading ? (
                  "loading places ..."
                ) : (
                  <PlaceSelection
                    item={item}
                    places={_.get(
                      this.props,
                      `placesPerDevice[${item.device_id}]`,
                      {}
                    )}
                    showPlaceModal={id => this.showPlaceModal(id)}
                    visibleModal={this.state.placeModal}
                  />
                )
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
                    {_.get(item, "device_info.name", "")}
                  </a>
                }
                description={
                  this.props.tripsLoading
                    ? "loading trips ..."
                    : `${_.get(
                        this.props.tripsPerDevice,
                        `[${item.device_id}].active`,
                        0
                      )} active trip(s) | ${_.get(
                        this.props.tripsPerDevice,
                        `[${item.device_id}].completed`,
                        0
                      )} completed trip(s)`
                }
              />
              {_.get(item, "device_id", "")}
            </List.Item>
          )}
          loading={this.props.devicesLoading}
        />
      </div>
    );
  }
}

export default DeviceSelection;
