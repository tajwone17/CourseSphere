"use client";

import { Button, TextInput, Modal, Label } from "flowbite-react";
import {
  HiPlus,
  HiUser,
  HiMail,
  HiPhone,
  HiStatusOnline,
  HiStatusOffline,
  HiX,
  HiCheck,
} from "react-icons/hi";
import { useEffect, useState } from "react";
import Select, { SingleValue } from "react-select";
import { HiBuildingOffice } from "react-icons/hi2";

// CSS utility classes for extra small screens (below sm breakpoint)
import "../manage-accounts/responsive-utils.css";

interface HOD {
  ID: number;
  NAME: string;
  DEPARTMENT_ID: string;
  EMAIL: string;
  PHONE: string;
  STATUS: number;
}

export default function ManageHOD() {
  const [hodList, setHodList] = useState<HOD[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedHOD, setSelectedHOD] = useState<HOD | null>(null);
  const [status, setStatus] = useState<"active" | "inactive">("inactive");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHOD, setNewHOD] = useState({
    name: "",
    department: "",
    email: "",
    phone: "",
  });

  const departmentName = (deptId: string) => {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const department = depts.find((dept: any) => dept.ID === deptId);
    return department ? department.DEPARTMENT_NAME : "Unknown";
  };
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [depts, setDepts] = useState<any>([]);

  useEffect(() => {
    async function fetchHODs() {
      try {
        const res = await fetch("/api/hod/get-hod", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setHodList(data.hods);
      } catch (error) {
        console.error("Failed to fetch HODs:", error);
      }
    }
    async function fetchDepartments() {
      try {
        const res = await fetch("/api/departments", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        console.log(typeof data.departments);
        setDepts(data.departments);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      }
    }
    fetchHODs();
    fetchDepartments();
  }, []);
  const [statusFilter, setStatusFilter] = useState("");

  // Separate search fields
  const [nameSearch, setNameSearch] = useState("");
  const [departmentSearch, setDepartmentSearch] = useState("");
  const [emailSearch, setEmailSearch] = useState("");
  const handleAddHOD = async () => {
    setShowAddModal(false);
    try {
      const res = await fetch("/api/hod/add-hod", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newHOD),
      });
      if (!res.ok) {
        const errorText = await res.text();
        const errorMsg = errorText.split("\n")[0];
        alert(`Error adding HOD: ${errorMsg}`);
        return;
      }

      alert("New HOD added successfully");

      // Fetch updated HOD list after successful addition
      const hodRes = await fetch("/api/hod/get-hod", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const hodData = await hodRes.json();
      setHodList(hodData.hods);
    } catch (error) {
      alert(`${error}`);
    }
    //reset form field
    // Reset the form
    setNewHOD({
      name: "",
      department: "",
      email: "",
      phone: "",
    });
  };

  const openModal = (hod: HOD, action: "active" | "inactive") => {
    setSelectedHOD(hod);
    setStatus(action);
    setShowModal(true);
  };

  const handleToggleStatus = async () => {
    if (selectedHOD) {
      const updatedList = hodList.map((hod) =>
        hod.ID === selectedHOD.ID
          ? { ...hod, STATUS: status === "active" ? 1 : 0 }
          : hod,
      );
      setHodList(updatedList);

      try {
        // Make API call to update status in the database
        const response = await fetch(
          `/api/account-status/hod/${selectedHOD.ID}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: status === "active" ? 1 : 0,
            }),
          },
        );
        // if (response.ok) {
        //   alert(
        //     `HOD status updated to ${status === "active" ? "Active" : "Inactive"}`,
        //   );
        // }
        if (!response.ok) {
          alert("Failed to update HOD status");
        }
      } catch (error) {
        console.error("Error updating HOD status:", error);
      }
    }
    setShowModal(false);
  };
  const filteredHodList = hodList.filter(
    (hod) =>
      (nameSearch === "" ||
        hod.NAME.toLowerCase().includes(nameSearch.toLowerCase())) &&
      (departmentSearch === "" ||
        departmentName(hod.DEPARTMENT_ID)
          .toLowerCase()
          .includes(departmentSearch.toLowerCase())) &&
      (emailSearch === "" ||
        hod.EMAIL.toLowerCase().includes(emailSearch.toLowerCase())) &&
      (statusFilter === "" ||
        hod.STATUS ===
          (statusFilter === "1" ? 1 : statusFilter === "0" ? 0 : hod.STATUS)),
  );

  const handleNameSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNameSearch(event.target.value);
  };

  const handleDepartmentSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setDepartmentSearch(event.target.value);
  };

  const handleEmailSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEmailSearch(event.target.value);
  };

  const handleStatusChange = (
    selectedOption: SingleValue<{ value: string; label: string }> | null,
  ) => {
    if (selectedOption) {
      setStatusFilter(selectedOption.value); // Set the value of the selected option
    } else {
      setStatusFilter(""); // Clear the filter if nothing is selected
    }
  };
  const statusOptions = [
    { value: "", label: "All" },
    { value: "1", label: "Active" },
    { value: "0", label: "Inactive" },
  ];

  return (
    <div
      className="mx-auto max-w-7xl p-4 md:p-8"
      data-aos="zoom-in"
      data-aos-duration="1000"
    >
      {/* {" "} */}
      <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            <span className="rounded-lg bg-[#92e3a9] p-2">
              <HiBuildingOffice className="h-6 w-6 text-gray-900 sm:h-7 sm:w-7 md:h-8 md:w-8" />
            </span>
            <span className="break-words">Manage HODs</span>
          </h1>
        </div>

        <Button
          style={{
            backgroundColor: "#92e3a9",
            color: "#000000",
            width: "fit-content",
            cursor: "pointer",
          }}
          onClick={() => setShowAddModal(true)}
          className="flex w-full items-center justify-center gap-2 bg-[#92e3a9] text-sm text-gray-900 transition-all duration-200 hover:bg-[#7ac892] sm:w-auto md:text-base"
        >
          <HiPlus className="h-4 w-4 md:h-5 md:w-5" />
          Add New HOD
        </Button>
      </div>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <div className="relative">
          <input
            type="text"
            className="w-full rounded border border-gray-700 bg-gray-800 py-2 pr-4 pl-10 text-white placeholder-gray-400 focus:border-[#92e3a9] focus:outline-none"
            placeholder="Search by name"
            value={nameSearch}
            onChange={handleNameSearchChange}
          />
          <div className="absolute top-0 left-0 flex h-full items-center pl-3">
            <HiUser className="h-5 w-5 text-[#92e3a9]" />
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            className="w-full rounded border border-gray-700 bg-gray-800 py-2 pr-4 pl-10 text-white placeholder-gray-400 focus:border-[#92e3a9] focus:outline-none"
            placeholder="Search by email"
            value={emailSearch}
            onChange={handleEmailSearchChange}
          />
          <div className="absolute top-0 left-0 flex h-full items-center pl-3">
            <HiMail className="h-5 w-5 text-[#92e3a9]" />
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            className="w-full rounded border border-gray-700 bg-gray-800 py-2 pr-4 pl-10 text-white placeholder-gray-400 focus:border-[#92e3a9] focus:outline-none"
            placeholder="Search by department"
            value={departmentSearch}
            onChange={handleDepartmentSearchChange}
          />
          <div className="absolute top-0 left-0 flex h-full items-center pl-3">
            <HiBuildingOffice className="h-5 w-5 text-[#92e3a9]" />
          </div>
        </div>
        <div className="relative">
          <Select
            options={statusOptions}
            onChange={handleStatusChange}
            placeholder="Filter by Status"
            isSearchable={false}
            value={statusOptions.find(
              (option) => option.value === statusFilter,
            )}
            styles={{
              control: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: "#1f2937", // Dark background
                borderColor: "#374151",
                color: "white",
                "&:hover": {
                  borderColor: "#4b5563",
                },
              }),
              menu: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: "#1f2937", // Dark background for dropdown menu
              }),
              option: (baseStyles, { isFocused, isSelected }) => ({
                ...baseStyles,
                backgroundColor: isSelected
                  ? "#92e3a9" // Primary green color for selected item
                  : isFocused
                    ? "#374151" // Slightly lighter dark for hover
                    : "#1f2937", // Dark background
                color: isSelected ? "black" : "white",
                cursor: "pointer",
                ":active": {
                  backgroundColor: isSelected ? "#92e3a9" : "#374151",
                },
              }),
              singleValue: (baseStyles) => ({
                ...baseStyles,
                color: "white", // Text color for selected value
              }),
              placeholder: (baseStyles) => ({
                ...baseStyles,
                color: "#9ca3af", // Light gray for placeholder
              }),
              dropdownIndicator: (baseStyles) => ({
                ...baseStyles,
                color: "#9ca3af", // Light gray for dropdown arrow
                "&:hover": {
                  color: "white",
                },
              }),
              indicatorSeparator: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: "#4b5563",
              }),
              input: (baseStyles) => ({
                ...baseStyles,
                color: "white",
              }),
            }}
          />
        </div>
      </div>
      <div className="rounded-lg border border-gray-800 bg-gray-900 p-3 sm:p-6">
        <div className="-mx-3 overflow-x-auto sm:mx-0">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase sm:px-6 sm:py-3">
                  <HiUser className="mr-1 inline text-[#92e3a9] group-hover:scale-110 sm:mr-2" />{" "}
                  <span className="xs:inline hidden">Name</span>
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase sm:px-6 sm:py-3">
                  <HiBuildingOffice className="mr-1 inline text-[#92e3a9] group-hover:scale-110 sm:mr-2" />{" "}
                  <span className="xs:inline hidden">Dept</span>
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase sm:px-6 sm:py-3">
                  <HiMail className="mr-1 inline text-[#92e3a9] group-hover:scale-110 sm:mr-2" />{" "}
                  <span className="xs:inline hidden">Email</span>
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase sm:px-6 sm:py-3">
                  <HiPhone className="mr-1 inline text-[#92e3a9] group-hover:scale-110 sm:mr-2" />{" "}
                  <span className="xs:inline hidden">Phone</span>
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase sm:px-6 sm:py-3">
                  <HiStatusOnline className="mr-1 inline text-[#92e3a9] group-hover:scale-110 sm:mr-2" />{" "}
                  <span className="xs:inline hidden">Status</span>
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase sm:px-6 sm:py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredHodList.map((hod) => (
                <tr
                  key={hod.ID}
                  className="bg-gray-900 transition-colors hover:bg-gray-800"
                >
                  <td className="px-3 py-2 text-xs whitespace-nowrap text-white sm:px-6 sm:py-4 sm:text-sm md:text-base">
                    {hod.NAME}
                  </td>
                  <td className="px-3 py-2 text-xs whitespace-nowrap text-white sm:px-6 sm:py-4 sm:text-sm md:text-base">
                    {departmentName(hod.DEPARTMENT_ID)}
                  </td>
                  <td className="px-3 py-2 text-xs whitespace-nowrap text-white sm:px-6 sm:py-4 sm:text-sm md:text-base">
                    {hod.EMAIL}
                  </td>
                  <td className="px-3 py-2 text-xs whitespace-nowrap text-white sm:px-6 sm:py-4 sm:text-sm md:text-base">
                    {hod.PHONE}
                  </td>
                  <td className="px-3 py-2 text-xs whitespace-nowrap text-white sm:px-6 sm:py-4 sm:text-sm md:text-base">
                    {hod.STATUS === 1 ? (
                      <HiStatusOnline className="mr-1 inline text-green-500 sm:mr-2" />
                    ) : (
                      <HiStatusOffline className="mr-1 inline text-red-500 sm:mr-2" />
                    )}
                    <span className="xs:inline hidden">
                      {hod.STATUS == 1 ? "Active" : "Inactive"}
                    </span>
                  </td>
                  {/* {" "} */}
                  <td className="px-3 py-2 whitespace-nowrap sm:px-6 sm:py-4">
                    {hod.STATUS === 0 ? (
                      <Button
                        size="xs"
                        style={{ backgroundColor: "#10b981", color: "#fff" }}
                        onClick={() => openModal(hod, "active")}
                        className="flex items-center gap-1 px-2 py-1 text-xs transition-transform hover:scale-105 sm:px-3 sm:text-sm"
                      >
                        <HiCheck className="h-3 w-3 text-white sm:h-4 sm:w-4" />
                        <span className="xs:inline hidden">Activate</span>
                      </Button>
                    ) : (
                      <Button
                        size="xs"
                        style={{ backgroundColor: "#ef4444", color: "#fff" }}
                        onClick={() => openModal(hod, "inactive")}
                        className="flex items-center gap-1 px-2 py-1 text-xs transition-transform hover:scale-105 sm:px-3 sm:text-sm"
                      >
                        <HiX className="h-3 w-3 text-white sm:h-4 sm:w-4" />
                        <span className="xs:inline hidden">Deactivate</span>
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* {" "} */}
      {/* Add HOD Modal */}
      <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="relative bg-gray-800 p-3 sm:p-4">
          <div className="mb-4 text-center sm:mb-6">
            <div className="bg-opacity-20 bg-gray mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full sm:mb-3 sm:h-16 sm:w-16">
              <HiBuildingOffice className="h-8 w-8 text-[#92e3a9] sm:h-10 sm:w-10" />
            </div>
            <div className="text-lg font-semibold text-white sm:text-xl">
              Add New HOD
            </div>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div className="relative">
              <Label
                htmlFor="name"
                className="mb-1 flex items-center gap-1 text-sm sm:gap-2 sm:text-base"
              >
                <HiUser className="h-4 w-4 text-[#92e3a9] sm:h-5 sm:w-5" />
                Name
              </Label>
              <TextInput
                id="name"
                value={newHOD.name}
                onChange={(e) => setNewHOD({ ...newHOD, name: e.target.value })}
                placeholder="Enter name"
                className="text-sm sm:text-base"
              />
            </div>
            <div className="relative">
              <Label
                htmlFor="department"
                className="mb-1 flex items-center gap-1 text-sm sm:gap-2 sm:text-base"
              >
                <HiBuildingOffice className="h-4 w-4 text-[#92e3a9] sm:h-5 sm:w-5" />
                Department
              </Label>
              <select
                id="department"
                name="department"
                value={newHOD.department}
                onChange={(e) =>
                  setNewHOD({ ...newHOD, department: e.target.value })
                }
                required
                className="focus:ring-primary w-full rounded-lg border border-gray-700 bg-[#323840] p-2 text-sm text-white focus:border-[#92e3a9] focus:ring-2 focus:outline-none sm:p-3 sm:text-base"
              >
                <option value="" disabled>
                  Select your department
                </option>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {depts.map((dept: any) => (
                  <option key={dept.ID} value={dept.ID}>
                    {dept.DEPARTMENT_NAME}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <Label
                htmlFor="email"
                className="mb-1 flex items-center gap-1 text-sm sm:gap-2 sm:text-base"
              >
                <HiMail className="h-4 w-4 text-[#92e3a9] sm:h-5 sm:w-5" />
                Email
              </Label>
              <TextInput
                id="email"
                type="email"
                value={newHOD.email}
                onChange={(e) =>
                  setNewHOD({ ...newHOD, email: e.target.value })
                }
                placeholder="Enter email"
                className="text-sm sm:text-base"
              />
            </div>
            <div className="relative">
              <Label
                htmlFor="phone"
                className="mb-1 flex items-center gap-1 text-sm sm:gap-2 sm:text-base"
              >
                <HiPhone className="h-4 w-4 text-[#92e3a9] sm:h-5 sm:w-5" />
                Phone
              </Label>
              <TextInput
                id="phone"
                value={newHOD.phone}
                onChange={(e) =>
                  setNewHOD({ ...newHOD, phone: e.target.value })
                }
                placeholder="Enter phone number"
                className="text-sm sm:text-base"
              />
            </div>
          </div>
          <div className="xs:flex-row mt-4 flex flex-col justify-end gap-2 sm:mt-6 sm:gap-4">
            <Button
              style={{
                backgroundColor: "#92e3a9",
                color: "black",
                width: "100%",
                cursor: "pointer",
              }}
              onClick={handleAddHOD}
              className="flex items-center justify-center gap-1 text-xs transition-transform hover:scale-105 sm:gap-2 sm:text-sm"
            >
              <HiPlus className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Add HOD</span>
            </Button>

            <Button
              color="gray"
              onClick={() => setShowAddModal(false)}
              className="xs:w-auto w-full text-xs sm:text-sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>{" "}
      {/* Confirmation Modal */}
      <Modal show={showModal} size="md" onClose={() => setShowModal(false)}>
        <div className="p-4 text-center sm:p-6">
          {status === "active" ? (
            <HiStatusOnline className="mx-auto mb-3 h-10 w-10 text-green-500 sm:mb-4 sm:h-14 sm:w-14" />
          ) : (
            <HiX className="mx-auto mb-3 h-10 w-10 text-red-500 sm:mb-4 sm:h-14 sm:w-14" />
          )}
          <h3 className="mb-4 text-sm font-normal text-gray-300 sm:mb-5 sm:text-base md:text-lg">
            Are you sure you want to{" "}
            <span className="font-semibold text-white">{status}</span> the
            account of{" "}
            <span className="font-semibold break-words text-white">
              {selectedHOD?.NAME}
            </span>
            ?
          </h3>
          <div className="xs:flex-row flex flex-col justify-center gap-2 sm:gap-4">
            <Button
              color={status === "active" ? "success" : "failure"}
              onClick={handleToggleStatus}
              className="flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              {status === "active" ? (
                <HiCheck className="h-3 w-3 text-white sm:h-4 sm:w-4" />
              ) : (
                <HiX className="h-3 w-3 text-white sm:h-4 sm:w-4" />
              )}
              Yes, {status}
            </Button>
            <Button
              color="gray"
              onClick={() => setShowModal(false)}
              className="text-xs sm:text-sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
