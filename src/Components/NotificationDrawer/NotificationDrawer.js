import { Divider, Drawer, FloatButton } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import React from "react";
import { VersionsIcon } from "@primer/octicons-react";

const NotificationDrawer = ({ navOpen, setNavOpen }) => {
  const onNavClose = () => {
    setNavOpen(false);
  };

  return (
    <Drawer
      placement={"left"}
      closable={false}
      onClose={onNavClose}
      open={navOpen}
      style={{ padding: 0, height: "100vh" }}
      key={"left"}
    >
      <div className="w-100 d-flex flex-column justify-content-center align-items-center mt-5">
        <VersionsIcon fill="#eee" size={120} />
        <div className="mt-4 text-center">
          <b className="fs-5" style={{ color: "#808080" }}>
            Notification features are coming soon.
          </b>
        </div>
      </div>

      <FloatButton
        shape="circle"
        type="dark"
        style={{
          insetInlineStart: 320,
          top: 16,
        }}
        onClick={onNavClose}
        icon={<CloseOutlined />}
      />
    </Drawer>
  );
};

export default NotificationDrawer;
