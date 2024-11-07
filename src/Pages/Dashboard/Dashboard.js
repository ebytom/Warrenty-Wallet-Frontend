import React, { useContext, useEffect, useRef, useState } from "react";
import { Axios } from "../../Config/Axios/Axios";
import { UserContext } from "../../App";
import { Divider, Flex, Spin } from "antd";
import { PlusCircleFilled } from "@ant-design/icons";
import LoaderOverlay from "../../Components/LoaderOverlay/LoaderOverlay";
import CategoryFilter from "../../Components/Filters/CategoryFilter/CategoryFilter";
import Filters from "../../Components/Filters/Filters";
import WarrantyCard from "../../Components/WarrantyCard/WarrantyCard";

const Dashboard = () => {
  const [contentLoader, setContentLoader] = useState(true);
  const [loader, setLoader] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isError, setIsError] = useState(false);
  const [trucks, setTrucks] = useState([]);
  const [metadata, setMetadata] = useState([]);
  const { user } = useContext(UserContext);

  const sampleData = [
    // Electronics
    {
      itemName: "HP 13'' Laptop 32gb",
      category: "electronics",
      expiresOn: "12/09/2024",
      monthsLeft: 9,
      percentage: 60,
    },
    {
      itemName: "Samsung 50'' LED TV",
      category: "electronics",
      expiresOn: "03/15/2025",
      monthsLeft: 12,
      percentage: 75,
    },

    // Automotive
    {
      itemName: "Goodyear All-Season Tires",
      category: "automotive",
      expiresOn: "06/01/2025",
      monthsLeft: 18,
      percentage: 40,
    },
    {
      itemName: "Bosch Car Battery",
      category: "automotive",
      expiresOn: "09/20/2026",
      monthsLeft: 24,
      percentage: 30,
    },

    // Fashion
    {
      itemName: "Nike Air Max Shoes",
      category: "fashion",
      expiresOn: "05/30/2025",
      monthsLeft: 0,
      percentage: 100,
    },
    {
      itemName: "Adidas Running Jacket",
      category: "fashion",
      expiresOn: "11/22/2024",
      monthsLeft: 7,
      percentage: 65,
    },

    // Home & Kitchen
    {
      itemName: "Dyson Cordless Vacuum Cleaner",
      category: "home_kitchen",
      expiresOn: "04/10/2025",
      monthsLeft: 11,
      percentage: 70,
    },
    {
      itemName: "Instant Pot Pressure Cooker",
      category: "home_kitchen",
      expiresOn: "10/05/2025",
      monthsLeft: 0,
      percentage: 100,
    },

    // Kids & Toys
    {
      itemName: "LEGO City Fire Station",
      category: "kids_toys",
      expiresOn: "12/25/2024",
      monthsLeft: 9,
      percentage: 55,
    },
    {
      itemName: "Barbie Dreamhouse",
      category: "kids_toys",
      expiresOn: "08/15/2025",
      monthsLeft: 16,
      percentage: 45,
    },

    // Phones
    {
      itemName: "iPhone 14 Pro",
      category: "phones",
      expiresOn: "01/31/2025",
      monthsLeft: 10,
      percentage: 60,
    },
    {
      itemName: "Samsung Galaxy S23",
      category: "phones",
      expiresOn: "07/07/2025",
      monthsLeft: 12,
      percentage: 75,
    },

    // Sport
    {
      itemName: "Wilson Tennis Racket",
      category: "sport",
      expiresOn: "03/18/2025",
      monthsLeft: 11,
      percentage: 50,
    },
    {
      itemName: "Nike Running Shoes",
      category: "sport",
      expiresOn: "09/28/2024",
      monthsLeft: 6,
      percentage: 60,
    },
  ];

  const token = localStorage.getItem("token");

  useEffect(() => {
    const lowercasedValue = searchValue.toLowerCase().trim();
    const filtered = sampleData.filter((item) => {
      const matchesSearch =
        item.itemName.toLowerCase().includes(lowercasedValue) ||
        item.category.toLowerCase().includes(lowercasedValue);

      const matchesCategory = selectedCategories.length
        ? selectedCategories.includes(item.category)
        : true; // If no categories are selected, show all

      return matchesSearch && matchesCategory;
    });

    setFilteredData(filtered); // Set filtered data based on search input and selected categories
  }, [searchValue, selectedCategories, sampleData]);

  useEffect(() => {
    setContentLoader(true);
    Axios.get(`/api/v1/app/truck/getAllTrucksByUser/${user.userId}`, {
      params: {
        addedBy: user.userId,
      },
      headers: {
        authorization: `bearer ${token}`,
      },
    })
      .then((res) => {
        setTrucks(res.data);
        setContentLoader(false);
      })
      .catch((err) => {
        setIsError(true);
        setContentLoader(false);
      });

    return () => {};
  }, []);

  useEffect(() => {
    // setLoader(true);
    console.log(token);

    Axios.get(`/api/v1/app/metadata/getMetadataByUserId`, {
      params: {
        userId: user.userId,
      },
      headers: {
        authorization: `bearer ${token}`,
      },
    })
      .then((res) => {
        setMetadata(res.data);
        setLoader(false);
      })
      .catch((err) => {
        setIsError(true);
      });
  }, []);

  const vehicleModalRef = useRef();

  const callVehicleModal = () => {
    if (vehicleModalRef.current) {
      vehicleModalRef.current.showLoading();
    }
  };

  return (
    <>
      <Filters
        setSearchValue={setSearchValue}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />
      <LoaderOverlay isVisible={contentLoader} />
      {loader ? (
        <div className="w-100 my-5 d-flex align-items-center justify-content-center">
          <b className="me-3">Loading</b>
          <Spin size="large" />
        </div>
      ) : filteredData.length ? (
        <div className="warranty-card-list">
          {filteredData.map((item, index) => (
            <WarrantyCard warranty={item} key={index} />
          ))}
        </div>
      ) : (
        <b className="fs-5" style={{ color: "#d3d3d3" }}>No warranties added yet—add one and give your brain a little break!</b>
      )}
    </>
  );
};

export default Dashboard;
