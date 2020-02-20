import Iframe from "react-iframe";
import {
  Layout,
  Menu,
  Breadcrumb,
  Icon,
  Divider,
  Descriptions,
  Badge
} from "antd";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

class Index extends React.Component {
  render() {
    return (
      <Layout style={{ height: "100vh" }}>
        <Header className="header">
          <div
            className="logo"
            style={{
              width: "120px",
              height: "31px",
              background: "rgba(255, 255, 255, 0.2)",
              margin: "16px 28px 16px 0",
              float: "left"
            }}
          />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["2"]}
            style={{ lineHeight: "64px" }}
          >
            <Menu.Item key="2">Drivers</Menu.Item>
            <Menu.Item key="3">Deliveries</Menu.Item>
            <Menu.Item key="1">Recipients</Menu.Item>
          </Menu>
        </Header>
        <Layout style={{ height: "100%" }}>
          <Sider width={200} style={{ background: "#fff" }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={["1"]}
              defaultOpenKeys={["sub1"]}
              style={{ height: "100%", borderRight: 0 }}
            >
              <SubMenu
                key="sub1"
                title={
                  <span>
                    <Icon type="team" />
                    United States
                  </span>
                }
              >
                <Menu.Item key="1">San Francisco</Menu.Item>
                <Menu.Item key="2">Chicago</Menu.Item>
                <Menu.Item key="3">New York</Menu.Item>
                <Menu.Item key="4">Washington</Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub2"
                title={
                  <span>
                    <Icon type="team" />
                    India
                  </span>
                }
              ></SubMenu>
            </Menu>
          </Sider>
          <Layout style={{ padding: "0 24px 24px", height: "100%" }}>
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>Fleet</Breadcrumb.Item>
              <Breadcrumb.Item>United States</Breadcrumb.Item>
              <Breadcrumb.Item>San Francisco</Breadcrumb.Item>
            </Breadcrumb>
            <Content
              style={{
                background: "#fff",
                padding: 24,
                margin: 0
              }}
            >
              <Descriptions title="Fleet Overview" bordered>
                <Descriptions.Item label="Local time">
                  10:12 AM
                </Descriptions.Item>
                <Descriptions.Item label="Drivers">253</Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Badge status="processing" text="Active" />
                </Descriptions.Item>
              </Descriptions>
              <Divider>Live Tracking</Divider>
              <Iframe
                frameBorder="0"
                width="100%"
                height="450px"
                url={`https://embed.hypertrack.com/devices?publishable_key=${process.env.HT_PUBLISHABLE_KEY}`}
              />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

export default Index;
