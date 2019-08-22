import { Avatar, List, Icon, Badge, Tag } from "antd";
import styled from "styled-components";
import _ from "lodash";
import Router from "next/router";

import PlaceSelection from "./placeSelection";
import { getDeviceColor } from "../common/devices";

class DeviceSelection extends React.Component {
  handleChange(item) {
    this.props.onSelect();
    Router.push(
      `/placeline?id=${item.device_id}&name=${encodeURIComponent(
        _.get(item, "device_info.name", item.device_id)
      )}`
    );
  }

  getTripAmount(device) {
    const { trips } = this.props;
    let tripAmount = 0;

    for (let i = 0; i < trips.length; i++) {
      const trip = trips[i];
      if (trip.device_id === device.device_id) {
        tripAmount++;
      }
    }

    return tripAmount;
  }

  render() {
    const StyledList = styled(List)`
      min-height: 100vh;
      padding: 12px;
    `;

    return (
      <div>
        <StyledList
          itemLayout="vertical"
          size="large"
          dataSource={_.get(this.props, "devices", [])}
          header={<div>Tracked devices ...</div>}
          renderItem={item => (
            <List.Item
              actions={[
                this.props.devicesLoading ? (
                  <a style={{ color: "grey" }}>
                    <Icon type="setting" /> Places
                  </a>
                ) : (
                  <PlaceSelection
                    item={item}
                    places={_.get(this.props, "places", [])}
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
                    <Tag color={getDeviceColor(item.device_id)}>•</Tag>
                    {_.get(item, "device_info.name", "")}
                  </a>
                }
                description={
                  this.props.tripsLoading
                    ? ""
                    : `${this.getTripAmount(item)} active trip(s)`
                }
              />
              {`Device ID: ${_.get(item, "device_id", "")}`}
            </List.Item>
          )}
          loading={this.props.loading}
        />
      </div>
    );
  }
}

export default DeviceSelection;
