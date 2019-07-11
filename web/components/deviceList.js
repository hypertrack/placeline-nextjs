import { List, Avatar } from 'antd';
import styled from 'styled-components';
import axios from 'axios';

class DeviceList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: undefined,
      loading: false,
      error: undefined
    };
  }

  componentDidMount() {
    // get all devices from HyperTrack
    const options = {
        method: 'get',
        url: `${process.env.SERVER_URL}/devices`
    };

    this.setState({ loading: true });

    axios(options)
    .then(resp => {
        this.setState({ devices: resp.data, loading: false });
    })
    .catch(error => {
        this.setState({ loading: false, error });
    });
  }

  render() {
    const StyledList = styled(List)`
      position: fixed;
      width: 450px;
      bottom: 10px;
      left: 10px;
      background-color: white;
    `;

    return (
      <div>
            <StyledList
                itemLayout="horizontal"
                bordered
                header={<div><b>Devices</b></div>}
                loading={this.state.loading}
                dataSource={this.state.devices}
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar shape="square" src={`../static/status/${item.device_status}.svg`} />}
                            title={item.device_id}
                            description={`Last updated at: ${item.updatedAt}`}
                        />
                    </List.Item>
                )} />
        </div>
    );
  }
}

export default DeviceList;