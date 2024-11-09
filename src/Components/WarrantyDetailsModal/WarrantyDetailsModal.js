import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Button, Form, Input, message, Modal, Select, Upload } from "antd";
import {
  CloseCircleFilled,
  CloseOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Axios } from "../../Config/Axios/Axios";
import LoaderOverlay from "../LoaderOverlay/LoaderOverlay";
import { UserContext } from "../../App";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import moment from "moment";
import { ShareIcon } from "@primer/octicons-react";

const { Option } = Select;

const WarrantyDetailsModal = forwardRef(({ warrantyDetails }, ref) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contentLoader, setContentLoader] = useState(false);
  const [warranty, setWarranty] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isError, setIsError] = useState(false);
  const [deleteBtn, setDeleteBtn] = useState(false);
  const [form] = Form.useForm();
  const [deleteForm] = Form.useForm();

  const { user } = useContext(UserContext);
  const token = localStorage.getItem("token");

  const categories = [
    { id: "electronics", name: "Electronics" },
    { id: "fashion", name: "Fashion" },
    { id: "home_kitchen", name: "Home & Kitchen" },
    { id: "sport", name: "Sport" },
    { id: "kids_toys", name: "Kids & Toys" },
  ];

  const [messageApi, contextHolder] = message.useMessage();

  const toastMessage = (type, mssg) => {
    messageApi.open({
      type: type,
      content: mssg,
    });
  };

  useEffect(() => {
    //   setLoading(true);
    // if(warrantyDetails)
    // {
    //   Axios.get("/api/v1/app/warranty/getWarrantyById", {
    //     params: {
    //       id: warrantyDetails?._id,
    //     },
    //   })
    //     .then((res) => {
    //       console.log(res);
    //       setWarranty(res.data);
    //       setLoading(false);
    //     })
    //     .catch((err) => {
    //       setIsError(true);
    //       setLoading(false);
    //     });
    // }
    setLoading(false);
  }, []);

  const showLoading = () => {
    setOpen(true);
    // setLoading(true);
  };

  useImperativeHandle(ref, () => ({
    showLoading,
  }));

  const handleDateChange = (e, dateType) => {
    const dateValue = e.target.value;
    // Convert date string to timestamp
    const timestamp = new Date(dateValue).valueOf();
    form.setFieldsValue({ [dateType]: dateValue });
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const handleBeforeUpload = (file) => {
    // Prevent antd Upload from automatically uploading
    return false;
  };

  const handleDeleteForm = (e) => {
    setDeleteBtn(false);
    const { name, value } = e.target;

    form.setFieldsValue({
      [name]: value.toUpperCase(),
    });

    if (value === warrantyDetails?.itemName) {
      setDeleteBtn(true);
    }
  };

  const submitDetails = async () => {
    try {
      const values = await form.validateFields(); // Validate and get form values
      setContentLoader(true);

      // Create FormData to send all values (including file) directly to backend
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        console.log(values.invoiceURL?.[0]?.originFileObj);
        if (key === "invoiceURL" && values.invoiceURL?.[0]?.originFileObj) {
          // Append file for `invoiceURL` if present
          formData.append("invoiceFile", values.invoiceURL[0].originFileObj);
        } else {
          // Append other form fields
          formData.append(key, values[key]);
        }
      });
      formData.append("addedBy", user.userId); // Replace with dynamic user ID if needed

      if (warrantyDetails) {
        // Update existing warranty
        await Axios.put(
          `/api/v1/app/warranty/updateWarrantyById/${warrantyDetails?._id}`,
          formData,
          {
            headers: {
              authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // Add new warranty
        await Axios.post("/api/v1/app/warranty/addWarranty", formData, {
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      // Reset form and close modal
      setContentLoader(false);
      setOpen(false);
      form.resetFields();
      window.location.reload();
    } catch (error) {
      console.error("Form submission failed:", error);
      toastMessage('warning','Something went wrong!')
      setContentLoader(false); // Hide the loader after an error
    }
  };

  const deleteWarranty = () => {
    if (deleteWarranty) {
      Axios.delete(
        `/api/v1/app/warranty/deleteWarrantyById/${warrantyDetails._id}`,
        {
          headers: {
            authorization: `bearer ${token}`,
          },
        }
      )
        .then(() => {
          setShowDeleteConfirm(false);
          setOpen(false);
          window.location.reload();
        })
        .catch((err) => {
          console.error("Failed to delete warranty:", err);
        });
    }
  };

  const handleOk = () => {
    setShowDeleteConfirm(true);
  };

  const removeAccess = () => {};

  return (
    <>
      {contextHolder}
      <LoaderOverlay isVisible={contentLoader} />
      <Modal
        title="Warranty Details"
        footer={
          warrantyDetails
            ? [
                <ConfirmModal
                  title="Confirm Action"
                  content="Are you sure you want to delete?"
                  onOk={handleOk}
                  onCancel={() => {}}
                >
                  <Button type="primary" danger>
                    Delete
                  </Button>
                </ConfirmModal>,
                <Button type="primary" onClick={submitDetails}>
                  Update
                </Button>,
              ]
            : [
                <Button type="primary" onClick={submitDetails}>
                  Submit
                </Button>,
              ]
        }
        open={open}
        onCancel={() => {
          setOpen(false);
          setIsError(false);
        }}
        loading={loading}
      >
        <Form
          form={form}
          name="form"
          labelCol={{ flex: "110px" }}
          labelAlign="left"
          labelWrap
          wrapperCol={{ flex: 1 }}
          colon={false}
          style={{ maxWidth: 600, marginTop: 50 }}
        >
          {warrantyDetails && warrantyDetails.invoiceURL ? (
            <Form.Item label="Invoice" name="invoiceURL">
              <Button
                type="primary"
                style={{ width: "100%" }}
                onClick={() =>
                  window.open(warrantyDetails.invoiceURL, "_blank")
                }
              >
                Preview
              </Button>
            </Form.Item>
          ) : (
            <Form.Item
              label="Upload Invoice"
              name="invoiceURL"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              initialValue={
                warrantyDetails &&
                warrantyDetails.invoiceURL &&
                warrantyDetails.invoiceURL.length > 0
                  ? [warrantyDetails.invoiceURL]
                  : []
              }
            >
              <Upload
                listType="picture-card"
                maxCount={1}
                showUploadList={{ showRemoveIcon: true }}
                // accept="image/*"
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>
          )}

          <Form.Item
            label="Category"
            name="category"
            initialValue={warrantyDetails ? warrantyDetails.category : ""}
            rules={[
              {
                required: true,
                message: "Please select a category",
              },
            ]}
          >
            <Select placeholder={"Select category"}>
              {categories?.map((option) => (
                <Option key={option.id} value={option.name}>
                  {option.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Item Name"
            name="itemName"
            initialValue={warrantyDetails ? warrantyDetails.itemName : ""}
            rules={[
              {
                required: true,
                message: "Please enter the Item Name",
              },
            ]}
          >
            <Input
              // disabled={warrantyDetails ? true : false}
              name="itemName"
            />
          </Form.Item>
          <Form.Item
            label="Purchase Date"
            name="purchasedOn"
            initialValue={
              warrantyDetails
                ? moment(warrantyDetails.purchasedOn).format("YYYY-MM-DD")
                : ""
            }
            rules={[
              {
                required: true,
                message: "Please select a purchase date",
              },
            ]}
          >
            <input
              type="date"
              style={{
                padding: "10px",
                width: "100%",
                border: "1px solid #ddd",
                borderRadius: "7px",
              }}
              onChange={(e) => handleDateChange(e, "purchasedOn")}
            />
          </Form.Item>
          <Form.Item
            label="Expiry Date"
            name="expiresOn"
            rules={[
              {
                required: true,
                message: "Please select a expiry date",
              },
            ]}
            initialValue={
              warrantyDetails
                ? moment(warrantyDetails.expiresOn).format("YYYY-MM-DD")
                : ""
            }
          >
            <input
              type="date"
              style={{
                padding: "10px",
                width: "100%",
                border: "1px solid #ddd",
                borderRadius: "7px",
              }}
              onChange={(e) => handleDateChange(e, "expiresOn")}
            />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            initialValue={warrantyDetails ? warrantyDetails.description : ""}
          >
            <Input name="description" />
          </Form.Item>
          <Form.Item
            label="Provider"
            name="warrantyProvider"
            initialValue={
              warrantyDetails ? warrantyDetails.warrantyProvider : ""
            }
          >
            <Input />
          </Form.Item>
          {warrantyDetails && (
            <>
              <hr style={{ color: "#919191" }} />
              <Form.Item
                label="Share With"
                name="sharedWith"
                initialValue={warrantyDetails ? warrantyDetails.sharedWith : ""}
              >
                <div className="d-flex gap-2">
                  <Input />
                  <Button type="primary" onClick={()=>toastMessage('success','Access Shared Sucessfully!')}>
                    <ShareIcon size={16} />
                  </Button>
                </div>
                {warrantyDetails?.sharedWith && (
                  <div
                    style={{ border: "1px solid #eee" }}
                    className="p-2 mt-2 rounded d-grid gap-2"
                  >
                    {warrantyDetails &&
                      warrantyDetails?.sharedWith?.map((user) => {
                        <div
                          className="rounded px-1 d-flex gap-2"
                          style={{
                            background: "#ddeafe",
                            width: "fit-content",
                          }}
                        >
                          <span style={{ fontSize: 14 }}>
                            ebytomy7@gmail.com
                          </span>
                          <ConfirmModal
                            title="Remove Access"
                            content="Are you sure you want remove access for  this user?"
                            onOk={removeAccess}
                            onCancel={() => {}}
                          >
                            <CloseCircleFilled style={{ fontSize: 16 }} />
                          </ConfirmModal>
                        </div>;
                      })}
                  </div>
                )}
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
      <Modal
        title="Delete Warranty"
        open={showDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowDeleteConfirm(false)}>
            Cancel
          </Button>,
          <Button
            key="delete"
            type="primary"
            danger
            onClick={deleteWarranty}
            disabled={!deleteBtn}
          >
            Delete
          </Button>,
        ]}
      >
        <p>
          To confirm, type "<b>{warrantyDetails?.itemName}</b>" in the box
          below.
        </p>
        <Form
          form={deleteForm}
          name="deleteForm"
          labelCol={{ flex: "110px" }}
          labelAlign="left"
          labelWrap
          wrapperCol={{ flex: 1 }}
          colon={false}
        >
          <Form.Item name="deleteText">
            <Input name="deleteText" onChange={handleDeleteForm} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
});

export default WarrantyDetailsModal;
