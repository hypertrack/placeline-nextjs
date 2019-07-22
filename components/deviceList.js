import { List, Avatar, Badge } from 'antd';
import styled from 'styled-components';
import moment from 'moment';
import _ from 'lodash';

class DeviceList extends React.Component {
  render() {
    const StyledList = styled(List)`
      position: fixed;
      width: 50%;
      bottom: 0px;
      left: 25%;
      background-color: #FCFCFC;
    `;

    return (
      <div>
            <StyledList
                itemLayout="horizontal"
                bordered
                header={<div><b>Devices</b></div>}
                dataSource={this.props.devices}
                renderItem={(item, i) => (
                    <List.Item actions={[<a onClick={(e) => this.props.onSummary(i, e)}>placeline</a>]}>
                        <List.Item.Meta
                            avatar={<Badge status={(item.device_status === 'disconnected' || item.device_status === 'inactive')? 'error' : 'success'}><Avatar shape="square" src={`../static/status/${item.device_status}.svg`} /></Badge>}
                            title={_.get(item, 'device_info.name', item.device_id)}
                            description={moment(item.updatedAt).format("MMMM Do YYYY, h:mm:ss a")}
                        />
                    </List.Item>
                )} />
        </div>
    );
  }
}

export default DeviceList;