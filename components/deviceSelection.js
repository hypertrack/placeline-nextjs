import { Avatar, Badge, List, Icon, Menu, Dropdown } from "antd";
import styled from "styled-components";
import _ from "lodash";
import Router from "next/router";
import axios from "axios";

import PlaceSelection from "./placeSelection";
import { findPlacesByDeviceId, findPlaceByLabel } from "../common/places";

class DeviceSelection extends React.Component {
  handleChange(item) {
    this.props.onSelect();
    Router.push(
      `/placeline?id=${item.device_id}&name=${encodeURIComponent(
        _.get(item, "device_info.name", item.device_id)
      )}`
    );
  }

  createTrip(deviceId, destination) {
    const place = findPlaceByLabel(
      findPlacesByDeviceId(_.get(this.props, "places", []), deviceId),
      destination
    );

    // only if place is set, create trip
    if (_.get(place, "coordinates.lat", false)) {
      axios({
        method: "post",
        url: `${process.env.SERVER_URL}/trips`,
        data: {
          device_id: place.device_id,
          destination: {
            geometry: {
              type: "Point",
              coordinates: [
                _.get(place, "coordinates.lng", 0),
                _.get(place, "coordinates.lat", 0)
              ]
            }
          },
          metadata: {
            origin: "placeline-app",
            place: place.label
          }
        }
      });
    }
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
                ),
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item
                        disabled={
                          findPlaceByLabel(
                            findPlacesByDeviceId(
                              _.get(this.props, "places", []),
                              item.device_id
                            ),
                            "home"
                          ).address === ""
                        }
                      >
                        <a
                          onClick={() =>
                            this.createTrip(item.device_id, "home")
                          }
                        >
                          Home
                        </a>
                      </Menu.Item>
                      <Menu.Item
                        disabled={
                          findPlaceByLabel(
                            findPlacesByDeviceId(
                              _.get(this.props, "places", []),
                              item.device_id
                            ),
                            "work"
                          ).address === ""
                        }
                      >
                        <a
                          onClick={() =>
                            this.createTrip(item.device_id, "work")
                          }
                        >
                          Work
                        </a>
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <a>
                    <Icon type="down" /> Create trip to ...
                  </a>
                </Dropdown>
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
                title={
                  <a onClick={() => this.handleChange(item)}>
                    {_.get(item, "device_info.name", "")}
                  </a>
                }
                description={_.get(item, "device_id", "")}
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
