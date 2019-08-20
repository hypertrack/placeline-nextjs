import { Avatar, Badge, List } from "antd";
import styled from "styled-components";
import _ from "lodash";
import Router from "next/router";

import PlaceSelection from "./placeSelection";

class DeviceSelection extends React.Component {
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
      min-height: 100vh;
      padding: 12px;
    `;

    return (
      <div>
        <StyledList
          itemLayout="horizontal"
          dataSource={_.get(this.props, "devices", [])}
          header={<div>Tracked devices ...</div>}
          renderItem={item => (
            <List.Item
              actions={[
                <a
                  key={`show-history-${item.device_id}`}
                  onClick={() => this.handleChange(item)}
                >
                  History
                </a>,
                this.props.devicesLoading ? (
                  <a
                    key={`show-places-${item.device_id}-disabled`}
                    style={{ color: "grey" }}
                  >
                    History
                  </a>
                ) : (
                  <PlaceSelection
                    key={`show-places-${item.device_id}`}
                    item={item}
                    places={_.get(this.props, "places", [])}
                  />
                )
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Badge
                    status={
                      _.get(item, "device_status.value", "disconnected") ===
                        "disconnected" ||
                      _.get(item, "device_status.value", "inactive") ===
                        "inactive"
                        ? "error"
                        : "success"
                    }
                  >
                    <Avatar
                      shape="square"
                      src={`../static/status/${_.get(
                        item,
                        "device_status.value",
                        "disconnected"
                      )}.svg`}
                    />
                  </Badge>
                }
                title={_.get(item, "device_info.name", item.device_id)}
              />
            </List.Item>
          )}
          loading={this.props.loading}
        />
      </div>
    );
  }
}

export default DeviceSelection;
