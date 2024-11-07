import React, { useRef, useState } from "react";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Progress } from "antd";
import WarrantyDetailsModal from "../WarrantyDetailsModal/WarrantyDetailsModal";

const WarrantyCard = ({ warranty }) => {
  const [loading, setLoading] = useState(false);
  const warrantyDetailsModalRef = useRef();

  const callWarrantyDetailsModal = () => {
    if (warrantyDetailsModalRef.current) {
      warrantyDetailsModalRef.current.showLoading();
    }
  };

  return (
    <>
      <div
        className="warranty-card p-2 rounded d-flex gap-3 align-items-center"
        style={{
          background: "#00348a1f",
          maxWidth: "500px",
          boxShadow: "3px 4px 2px 2px #f6f6f6",
          cursor: "pointer",
        }}
        onClick={callWarrantyDetailsModal}
      >
        <div
          className="bg-white rounded p-4 d-flex align-items-center justify-content-center"
          style={{
            width: "120px",
            height: "120px",
            backgroundColor: "#f0f0f0",
            flexShrink: 0,
          }}
        >
          <img
            src={`../../assets/img/${warranty.category}.png`}
            alt="product"
            style={{
              objectFit: "contain",
              width: "100%",
              height: "100%",
            }}
          />
        </div>
        <div className="p-2 w-100 h-100 d-flex flex-column justify-content-between">
          <div style={{ textAlign: "left" }}>
            <h6 className="fw-bold m-0 p-0">{warranty.itemName}</h6>
            <span className="p-0 b-0 text-secondary" style={{ fontSize: 11 }}>
              Expires on {warranty.expiresOn}
            </span>
          </div>
          <div className="w-100" style={{ textAlign: "left" }}>
            <span style={{ fontSize: 12, fontWeight: "bold" }}>
              {warranty.percentage === 100
                ? "Warranty expired"
                : `${warranty.monthsLeft} months left`}
            </span>
            <Progress
              percent={warranty.percentage}
              status={warranty.percentage === 100 ? "exception" : "active"}
              format={warranty.percentage === 100 ? "" : () => ""}
              strokeColor={warranty.percentage === 100 ? "red" : "#00348a"}
            />
          </div>
        </div>
      </div>
      <WarrantyDetailsModal
        ref={warrantyDetailsModalRef}
        warrantyDetails={warranty}
      />
    </>
  );
};

export default WarrantyCard;
