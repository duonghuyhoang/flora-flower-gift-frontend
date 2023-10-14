import { useEffect, useState } from "react";
import "./AdminLayout.scss";
import {
  BellOutlined,
  CommentOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  EyeOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShopOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  Button,
  theme,
  Row,
  Col,
  Badge,
  Dropdown,
  Avatar,
  FloatButton,
  notification,
} from "antd";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../../public/logo.svg";
import { FetchApi } from "../../api/FetchAPI";
const { Header, Sider, Content } = Layout;
import { useMediaQuery } from "react-responsive";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [data, setData] = useState();
  const userId = localStorage.getItem("user_id");
  const store_name = localStorage.getItem("store_name");
  const [isStoreEnabled, setStoreEnabled] = useState(false);

  useEffect(() => {
    if (userId) {
      getUserProfileData(userId);
    }
    if (store_name !== "null") {
      setStoreEnabled(true);
    }
  }, []);

  const getUserProfileData = async (userId) => {
    if (userId) {
      const result = await FetchApi.getUserProfile(userId);

      if (result) {
        setData(result);

        if (result.statusCode === 401) {
          navigate("/auth/login");
        }
      } else {
        notification.error({
          message: "Error fetching user data",
          placement: "topRight",
        });
      }
    }
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const location = useLocation();
  const navigate = useNavigate();

  const items = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      to: "/admin/dashboard",
    },
    {
      key: "2",
      icon: <DatabaseOutlined />,
      label: "Collections",
      to: "/admin/collections",
    },
    {
      key: "3",
      icon: <ShopOutlined />,
      label: "Demo store",
      to: "/admin/demo-store",
    },
    {
      key: "4",
      icon: <EyeOutlined />,
      label: "Store online",
      to: `/store/${store_name}/home`,
    },
  ];

  const handleGoToProfile = () => {
    navigate("/admin/profile");
  };
  const handleLogout = () => {
    localStorage.clear();

    navigate("/auth/login");
  };

  const isSmallScreen = useMediaQuery({ maxWidth: 768 });
  useEffect(() => {
    if (isSmallScreen) {
      setCollapsed(true);
    }
  }, [isSmallScreen]);

  const handleReload = async () => {
    await new Promise((resolve) => {
      setTimeout(() => {
        window.history.pushState({}, null, "/admin/dashboard");
        window.location.reload();
        resolve();
      }, 100);
    });
  };

  const userMenu = (
    <Menu style={{ width: "120px", textAlign: "center" }}>
      <Menu.Item key='1' icon={<UserOutlined />} onClick={handleGoToProfile}>
        Profile
      </Menu.Item>
      <Menu.Item key='2' icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );
  const notificationMenu = (
    <Menu style={{ width: "300px", textAlign: "center" }}>
      <Menu.Item key='1'></Menu.Item>
      <Menu.Item key='2'></Menu.Item>
    </Menu>
  );

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme='light'
        className='border-r-[1px]'
      >
        <div
          className='demo-logo-vertical bg-white m-2  rounded-2xl flex cursor-pointer'
          onClick={handleReload}
        >
          <img src={logo} alt='Logo' className='h-[45px] w-[45px] ml-[10px]' />
          <div
            className='ml-7 flex justify-center items-center text-2xl font-semibold'
            style={{ display: collapsed ? "none" : "flex" }}
          >
            {" "}
            Admin
          </div>
        </div>
        <Menu
          theme='light'
          mode='inline'
          className='h-screen menu-sider-admin'
          defaultSelectedKeys={["1"]}
          selectedKeys={[location.pathname]}
        >
          {items.map((item) => (
            <Menu.Item
              key={item.key}
              icon={item.icon}
              className={`${
                location.pathname === item.to ? "menu-item-active" : "menu-item"
              } ${!isStoreEnabled ? "unallow" : ""}`}
            >
              <Link to={item.to}>{item.label}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Row
            align='middle'
            justify='space-between'
            style={{ height: "100%" }}
          >
            <Col>
              <Button
                type='text'
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                className='bg-white btn-collapsed'
                style={{
                  fontSize: "16px",
                  width: 50,
                  height: 50,
                  marginTop: "-5px",
                  marginLeft: "7px",
                }}
              />
            </Col>

            <Col
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginRight: "20px",
              }}
            >
              <Dropdown overlay={notificationMenu} placement='bottomRight'>
                <Badge
                  dot
                  style={{
                    marginTop: "12px",
                    marginRight: "28px",
                  }}
                >
                  <div className='hover:bg-slate-100   align-middle cursor-pointer  mr-3 text-xl w-[45px] h-[45px] text-slate-500 rounded-full'>
                    <BellOutlined />
                  </div>
                </Badge>
              </Dropdown>
              <Dropdown overlay={userMenu} placement='bottomRight'>
                <Avatar
                  size={45}
                  src={data ? data.imageUrl : ""}
                  style={{
                    cursor: "pointer",
                    marginTop: "-2px",
                    objectFit: "inherit",
                  }}
                />
              </Dropdown>
            </Col>
          </Row>
        </Header>
        <Content
          style={{
            margin: "1px 0px",
            padding: 24,
            minHeight: "80vh",
            background: colorBgContainer,
          }}
        >
          <Outlet />
        </Content>
        <FloatButton icon={<CommentOutlined />} tooltip={<div>Message</div>} />
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
