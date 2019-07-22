import { Select } from 'antd';
import styled from 'styled-components';
import _ from 'lodash';

class DeviceSelection extends React.Component {
  handleChange(value) {
    console.log(`selected ${value}`);
  }

  render() {
    const StyledSelect = styled(Select)`
      position: fixed;
      width: 50%;
      bottom: 15px;
      left: 25%;
      background-color: #FCFCFC;
    `;

    const { Option } = Select;

    return (
      <StyledSelect
      onChange={this.handleChange}>
          {this.props.devices.map(item => (
            <Option value={item.device_id}>{_.get(item, 'device_info.name', item.device_id)}</Option>
          ))}
      </StyledSelect>
    );
  }
}

export default DeviceSelection;