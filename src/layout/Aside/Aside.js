import { useNavigate, useLocation, Link } from "react-router-dom";

import logo from "../../assets/Icons/logospin.png";

import { Layout, Menu } from "antd";
import { AlbumsIcon, UsersIcon } from "../../assets/Icons";
import "./Aside.scss";
const { Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

function Aside({ collapsed, setCollapsed }) {
  const items = [
    getItem("Albums", "1", <AlbumsIcon />),
    getItem("Users", "2", <UsersIcon />),
  ];
  const navigate = useNavigate();
  const location = useLocation();

  // Get the current path and set the selected key based on it
  const selectedKey = location.pathname.startsWith("/users") ? "2" : "1";

  const handleMenuClick = ({ key }) => {
    if (key === "1") navigate("/albums");
    else if (key === "2") navigate("/users");
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      theme="light"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: 200,
          padding: "0px 16px",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          backgroundColor: "rgb(255, 255, 255)",
          height: 64,
        }}
      >
        <Link
          to="/albums?current=1&pageSize=20"
          style={{ display: "inline-flex", alignItems: "center", gap: 10 }}
        >
          <img
            src={logo}
            alt="logo"
            className="logo-spin"
            style={{
              width: 50,
            }}
          />
          <span
            style={{
              fontFamily: "Courier New, monospace",
              fontWeight: "600",
              fontSize: 22,
              color: "#65ddfc",
            }}
          >
            QUINN-MQ
          </span>
        </Link>
      </div>
      <Menu
        style={{ paddingTop: 8, borderInlineEnd: "none" }}
        theme="light"
        selectedKeys={[selectedKey]}
        mode="inline"
        items={items}
        onClick={handleMenuClick}
      />
    </Sider>
  );
}

export default Aside;
