import { Modal, Statistic, Row, Col, Timeline, Carousel } from 'antd';
import moment from 'moment';
import _ from 'lodash';

import Map from '../components/map';

class SummaryView extends React.Component {
  renderSegments(segments) {
    return segments.map((segment, i) => {
      <Timeline.Item key={`segment-${i}`}>{`${segment.type} activity for ${moment.duration(segment.duration, 's').humanize()} (${segment.distance} km)`}</Timeline.Item>
    });
  }

  renderSummaryCarousel(summaries) {
    const timelineStyle = {
      margin: '50px 0 0 0'
    };

    return summaries.map((summary, i) => {
      const segments = _.get(summary, 'segments', []);

      return (
      <div key={`summary-card-${i}`}>
        <Row gutter={4} type="flex" justify="space-around" align="middle">
                  <Col span={8}>
                    <Statistic title="Duration" value={moment.duration(_.get(summary, 'duration', 0), 's').humanize()} />
                  </Col>
                  <Col span={6}>
                    <Statistic title="Distance" value={_.get(summary, 'distance', 0)} suffix="km" />
                  </Col>
                  <Col span={6}>
                    <Statistic title="Steps" value={_.get(summary, 'steps', 0)} suffix="steps" />
                  </Col>
                </Row>
                <Row gutter={8} type="flex" justify="space-around" align="middle">
                  <Col span={16} style={timelineStyle}>
                    <Timeline>
                      <Timeline.Item color="green">{`Started on ${moment(_.get(summary, 'start_datetime', '')).format("MMMM Do YYYY, h:mmA")}`}</Timeline.Item>
                      {this.renderSegments(segments)}
                      <Timeline.Item color="red">{`Ended on ${moment(_.get(summary, 'end_datetime', '')).format("MMMM Do YYYY, h:mmA")}`}</Timeline.Item>
                    </Timeline>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Map segments={segments} zoom={10} />
                  </Col>
                </Row>
              </div>
      )});
  }

  render() {
    return (
      <div>
            <Modal
              title="Most recent summaries"
              onCancel={e => this.props.onClose(e)}
              onOk={e => this.props.onClose(e)}
              visible={this.props.visible} >
                <Carousel
                  dotPosition="top"
                  autoplay>
                  {this.renderSummaryCarousel(this.props.summaries)}
                </Carousel>
            </Modal>
      </div>
    );
  }
}

export default SummaryView;