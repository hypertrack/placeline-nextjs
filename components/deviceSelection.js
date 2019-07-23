import { Select } from 'antd';
import styled from 'styled-components';
import _ from 'lodash';
import Router from 'next/router';

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
      background-color: #FCFCFC;
    `;

    const { Option } = Select;

    const deviceItems = (_.get(this.props, 'devices', [])).map(item => (
      <Option key={`select-${item.device_id}`} value={item.device_id}>{_.get(item, 'device_info.name', item.device_id)}</Option>
    ));

    return (
      <StyledSelect
      size='large'
      loading={this.props.loading}
      onChange={this.handleChange}>
          {deviceItems}
      </StyledSelect>
    );
  }
}

export default DeviceSelection;