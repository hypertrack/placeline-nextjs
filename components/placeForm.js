import { Button, Modal, Form, Select, Row, Col } from "antd";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";

import LocationSearch from "./locationSearch";
import Map from "./map";

const ExportForm = Form.create({ name: "form_in_modal" })(
  class extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        home: {
          address: "",
          coordinates: {}
        },
        work: {
          address: "",
          coordinates: {}
        },
        submitted: false
      };
    }

    updateWorkAddress(workAddress) {
      // geocode for map to show
      geocodeByAddress(workAddress)
        .then(async results => {
          return getLatLng(results[0]);
        })
        .then(coordinates => {
          this.setState({
            work: {
              address: workAddress,
              coordinates
            }
          });
        })
        .catch(error => {
          console.error("Error", error);
          // set state without coordinates
          this.setState({
            work: {
              address: workAddress
            }
          });
        });
    }

    updateHomeAddress(homeAddress) {
      // geocode for map to show
      geocodeByAddress(homeAddress)
        .then(async results => {
          return getLatLng(results[0]);
        })
        .then(coordinates => {
          this.setState({
            home: {
              address: homeAddress,
              coordinates
            }
          });
        })
        .catch(error => {
          console.error("Error", error);
          // set state without coordinates
          this.setState({
            home: {
              address: homeAddress
            }
          });
        });
    }

    onClose(submitted) {
      this.setState(
        {
          submitted
        },
        () => {
          if (submitted) {
            this.props.onOk();
          } else {
            this.props.onCancel();
          }
        }
      );
    }

    render() {
      const { visible, loading } = this.props;

      return (
        <Modal
          visible={visible}
          title="Set Places"
          okText="Set"
          onCancel={() => this.onClose(false)}
          onOk={() => this.onClose(true)}
          width="75%"
          footer={[
            ,
            <Button
              key="submit"
              htmlType="submit"
              type="primary"
              loading={loading}
              onClick={() => this.onClose(true)}
            >
              Set
            </Button>
          ]}
        >
          <Row gutter={8}>
            <Col span={10}>
              <Form layout="vertical">
                <Form.Item label="Home address">
                  <LocationSearch
                    onAddressSelect={e => this.updateHomeAddress(e)}
                  />
                </Form.Item>
              </Form>
              <Form layout="vertical">
                <Form.Item label="Work address">
                  <LocationSearch
                    onAddressSelect={e => this.updateWorkAddress(e)}
                  />
                </Form.Item>
              </Form>
            </Col>
            <Col offset={4} span={10}>
              <Map
                places={[
                  {
                    label: "Home",
                    ...this.state.home
                  },
                  {
                    label: "Work",
                    ...this.state.work
                  }
                ]}
                height="450px"
              />
            </Col>
          </Row>
        </Modal>
      );
    }
  }
);

export default ExportForm;
