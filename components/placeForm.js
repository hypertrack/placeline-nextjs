import { Button, Modal, Form, Row, Col } from "antd";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";

import LocationSearch from "./locationSearch";

import Map from "./map";

const PlaceForm = Form.create({ name: "form_in_modal" })(
  class extends React.Component {
    constructor(props) {
      super(props);

      const homePlace = _.get(this.props, "places.home");
      const workPlace = _.get(this.props, "places.work");

      this.state = {
        home: {
          address: _.get(homePlace, "address", ""),
          coordinates: _.get(homePlace, "coordinates", {})
        },
        work: {
          address: _.get(workPlace, "address", ""),
          coordinates: _.get(workPlace, "coordinates", {})
        },
        submitted: false
      };
    }

    updateWorkAddress(workAddress) {
      if (!workAddress) {
        // empty adddress
        this.setState({
          work: {
            address: "",
            coordinates: {}
          }
        });
      }

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
              address: workAddress,
              coordinates: {}
            }
          });
        });
    }

    updateHomeAddress(homeAddress) {
      if (!homeAddress) {
        // empty adddress
        this.setState({
          home: {
            address: "",
            coordinates: {}
          }
        });
      }

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
              address: homeAddress,
              coordinates: {}
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
            this.props.onOk([
              {
                label: "home",
                ...this.state.home
              },
              {
                label: "work",
                ...this.state.work
              }
            ]);
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
          title={`Set places for ${this.props.deviceName}`}
          okText="Set"
          onCancel={() => this.onClose(false)}
          onOk={() => this.onClose(true)}
          width="75%"
          footer={[
            <Button
              key={`${this.props.deviceName}-btn-cancel`}
              loading={loading}
              onClick={() => this.onClose(false)}
            >
              Cancel
            </Button>,
            <Button
              key={`${this.props.deviceName}-btn-submit`}
              htmlType="submit"
              type="primary"
              loading={loading}
              onClick={() => this.onClose(true)}
            >
              Save
            </Button>
          ]}
        >
          <Row gutter={8}>
            <Col span={10}>
              <Form layout="vertical">
                <Form.Item label="Home address">
                  <LocationSearch
                    value={_.get(this.state, "home.address", "")}
                    onAddressSelect={e => this.updateHomeAddress(e)}
                  />
                </Form.Item>
              </Form>
              <Form layout="vertical">
                <Form.Item label="Work address">
                  <LocationSearch
                    value={_.get(this.state, "work.address", "")}
                    onAddressSelect={e => this.updateWorkAddress(e)}
                  />
                </Form.Item>
              </Form>
            </Col>
            <Col offset={4} span={10}>
              {(this.state.home.address !== "" ||
                this.state.work.address !== "") && (
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
              )}
            </Col>
          </Row>
        </Modal>
      );
    }
  }
);

export default PlaceForm;
