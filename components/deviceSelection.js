import { Select, Avatar, Badge, List } from "antd";
import styled from "styled-components";
import _ from "lodash";
import moment from "moment";
import Router from "next/router";

class DeviceSelection extends React.Component {
  handleChange(value) {
    Router.push(`/placeline?id=${value}`);
  }

  render() {
    const StyledSelect = styled(Select)`
      position: fixed;
      width: 50%;
      top: 5%;
      left: 25%;
      background-color: #fcfcfc;
    `;

    const { Option } = Select;

    const deviceItems = _.get(this.props, "devices", []).map(item => (
      <Option
        key={`select-${item.device_id}`}
        value={item.device_id}
        label={_.get(item, "device_info.name", item.device_id)}
      >
        <List.Item>
          <List.Item.Meta
            avatar={
              <Badge
                status={
                  item.device_status === "disconnected" ||
                  item.device_status === "inactive"
                    ? "error"
                    : "success"
                }
              >
                <Avatar
                  shape="square"
                  src={`../static/status/${item.device_status}.svg`}
                />
              </Badge>
            }
            title={_.get(item, "device_info.name", item.device_id)}
            description={`Last updated at ${moment(item.updatedAt).format(
              "MMMM Do YYYY, h:mm:ss a"
            )}`}
          />
        </List.Item>
      </Option>
    ));

    return (
      <StyledSelect
        size="large"
        placeholder="Select device to see placeline ..."
        optionLabelProp="label"
        loading={this.props.loading}
        onChange={this.handleChange}
      >
        {deviceItems}
      </StyledSelect>
    );
  }
}

export default DeviceSelection;
