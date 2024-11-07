import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Button, Form, Input, Modal, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Axios } from "../../Config/Axios/Axios";
import LoaderOverlay from "../LoaderOverlay/LoaderOverlay";
import { UserContext } from "../../App";
import ConfirmModal from "../ConfirmModal/ConfirmModal";

const WarrantyDetailsModal = forwardRef(
  ({ setTrucks, trucks, warrantyDetails }, ref) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [contentLoader, setContentLoader] = useState(false);
    const [truck, setTruck] = useState({});
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isError, setIsError] = useState(false);
    const [deleteBtn, setDeleteBtn] = useState(false);
    const [form] = Form.useForm();
    const [deleteForm] = Form.useForm();

    const { user } = useContext(UserContext);
    const token = localStorage.getItem("token");

    useEffect(() => {
      //   setLoading(true);
      // if(warrantyDetails)
      // {
      //   Axios.get("/api/v1/app/truck/getTruckById", {
      //     params: {
      //       id: warrantyDetails?._id,
      //     },
      //   })
      //     .then((res) => {
      //       console.log(res);
      //       setTruck(res.data);
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

    const normFile = (e) => {
      console.log(e);

      if (Array.isArray(e)) {
        return e;
      }
      return e?.fileList;
    };

    const handleUpperCase = (e) => {
      const { name, value } = e.target;

      form.setFieldsValue({
        [name]: value.toUpperCase(),
      });
    };

    const handleDeleteForm = (e) => {
      setDeleteBtn(false);
      const { name, value } = e.target;

      form.setFieldsValue({
        [name]: value.toUpperCase(),
      });

      if (
        value.toUpperCase() === warrantyDetails?.registrationNo.toUpperCase()
      ) {
        setDeleteBtn(true);
      }
    };

    const submitDetails = async () => {
      try {
        const values = await form.validateFields(); // Validate and get form values
        setContentLoader(true);
        if (warrantyDetails) {
          Axios.put(
            `/api/v1/app/truck/updateTruckById/${warrantyDetails?._id}`,
            {
              values,
            },
            {
              headers: {
                authorization: `bearer ${token}`,
              },
            }
          )
            .then((res) => {
              const updatedTruck = res.data;
              // setTrucks((prevTrucks) =>
              //   prevTrucks.map((truck) =>
              //     truck._id === updatedTruck._id ? updatedTruck : truck
              //   )
              // );

              setContentLoader(false);
              setOpen(false);
              form.resetFields();
              window.location.reload();
            })
            .catch((err) => {
              setIsError(true);
              setContentLoader(false);
            });
        } else {
          Axios.post(
            "/api/v1/app/truck/addTruck",
            {
              ...values,
              addedBy: user.userId,
            },
            {
              headers: {
                authorization: `bearer ${token}`,
              },
            }
          )
            .then((res) => {
              setTrucks([...trucks, res.data]);
              setContentLoader(false);
              form.resetFields();
              setOpen(false);
            })
            .catch((err) => {
              console.error("Error:", err); // Log the error details for debugging
              setIsError(true);
              setContentLoader(false); // Hide the loader after an error
            });
        }
        // addNewVehicle(values);
        // setOpen(false);
      } catch (error) {
        console.error("Form submission failed:", error);
      }
    };

    const deleteTruck = () => {
      if (deleteTruck) {
        Axios.delete(
          `/api/v1/app/truck/deleteTruckById/${warrantyDetails._id}`,
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
            console.error("Failed to delete truck:", err);
          });
      }
    };

    const handleOk = () => {
      setShowDeleteConfirm(true);
    };

    return (
      <>
        <LoaderOverlay isVisible={contentLoader} />
        <Modal
          title="Vehicle Details"
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
                    Update Truck
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
          {isError && (
            <b className="text-danger">
              Something went wrong! Check your entry...
            </b>
          )}
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
            <Form.Item
              label="Upload Invoice"
              name="invoiceURL"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              initialValue={
                warrantyDetails &&
                warrantyDetails.invoiceURL &&
                warrantyDetails.invoiceURL.length > 0
                  ? [warrantyDetails.invoiceURL[0]]
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
              <Input name="description" />
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
                disabled={warrantyDetails ? true : false}
                name="itemName"
              />
            </Form.Item>
            <Form.Item
              label="Purchase Date"
              name="purchasedOn"
              initialValue={warrantyDetails ? warrantyDetails.purchasedOn : ""}
              rules={[
                {
                  required: true,
                  message: "Please select a purchase date",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Expiry Date"
              name="expiresOn"
              initialValue={warrantyDetails ? warrantyDetails.expiresOn : ""}
              rules={[
                {
                  required: true,
                  message: "Please select a expiry date",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              initialValue={warrantyDetails ? warrantyDetails.description : ""}
            >
              <Input name="description" />
            </Form.Item>
            <Form.Item
              label="Warranty Provider"
              name="warrantyProvider"
              initialValue={
                warrantyDetails ? warrantyDetails.warrantyProvider : ""
              }
            >
              <Input type="number" />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="Delete Truck"
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
              onClick={deleteTruck}
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
  }
);

export default WarrantyDetailsModal;
