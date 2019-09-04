import { Avatar, List, Menu, Dropdown, Icon, Input } from "antd";
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
      height: calc(100vh - 104px);
      max-height: calc(100vh - 104px) !important;
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
                  this.props.tripsLoading ? (
                    "loading trips ..."
                  ) : (
                    <Dropdown
                      overlay={
                        <Menu>
                          {_.get(
                            this.props.tripsPerDevice,
                            `[${item.device_id}].active`,
                            []
                          ).map(trip => (
                            <Menu.Item>
                              <a
                                key={`menu-trip-${trip.trip_id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                href={trip.views.embed_url}
                              >
                                Trip {trip.trip_id}
                              </a>
                            </Menu.Item>
                          ))}
                        </Menu>
                      }
                    >
                      <div>
                        <a className="ant-dropdown-link" href="#">
                          <Icon type="down" />{" "}
                          {_.get(
                            this.props.tripsPerDevice,
                            `[${item.device_id}].active.length`,
                            0
                          )}{" "}
                          active trip(s)
                        </a>{" "}
                        |{" "}
                        {_.get(
                          this.props.tripsPerDevice,
                          `[${item.device_id}].completed.length`,
                          0
                        )}{" "}
                        completed trip(s)
                      </div>
                    </Dropdown>
                  )
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
