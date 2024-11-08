import React from "react";

const ComingSoon = () => {
  return (
    <div className="w-100 d-flex flex-column justify-content-center align-items-center mt-5">
      <VersionsIcon fill="#eee" size={120} />
      <div className="mt-4 text-center">
        <b className="fs-5" style={{ color: "#808080" }}>
          Notification features are coming soon.
        </b>
      </div>
    </div>
  );
};

export default ComingSoon;
