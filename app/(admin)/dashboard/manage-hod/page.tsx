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
      alert(`Error adding HOD: ${error}`);
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
        if (response.ok) {
          alert(
            `HOD status updated to ${status === "active" ? "Active" : "Inactive"}`,
          );
        }
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
      className="mx-auto max-w-7xl p-8"
      data-aos="zoom-in"
      data-aos-duration="1000"
    >
      {" "}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-4xl font-bold text-white">
            <span className="rounded-lg bg-[#92e3a9] p-2">
              <HiBuildingOffice className="h-8 w-8 text-gray-900" />
            </span>
            Manage HODs
          </h1>
        </div>

        <Button
          style={{
            backgroundColor: "#92e3a9",
            color: "#000000",
            marginTop: "20px",
            width: "fit-content",
            cursor: "pointer",
          }}
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-[#92e3a9] text-gray-900 transition-all duration-200 hover:bg-[#7ac892]"
        >
          <HiPlus className="h-5 w-5" />
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
      <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  <HiUser className="mr-2 inline text-[#92e3a9] group-hover:scale-110" />{" "}
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  <HiBuildingOffice className="mr-2 inline text-[#92e3a9] group-hover:scale-110" />{" "}
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  <HiMail className="mr-2 inline text-[#92e3a9] group-hover:scale-110" />{" "}
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  <HiPhone className="mr-2 inline text-[#92e3a9] group-hover:scale-110" />{" "}
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  <HiStatusOnline className="mr-2 inline text-[#92e3a9] group-hover:scale-110" />{" "}
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
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
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {hod.NAME}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {departmentName(hod.DEPARTMENT_ID)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {hod.EMAIL}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {hod.PHONE}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {hod.STATUS === 1 ? (
                      <HiStatusOnline className="mr-2 inline text-green-500" />
                    ) : (
                      <HiStatusOffline className="mr-2 inline text-red-500" />
                    )}
                    {hod.STATUS == 1 ? "Active" : "Inactive"}
                  </td>{" "}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {hod.STATUS === 0 ? (
                      <Button
                        size="xs"
                        style={{ backgroundColor: "#10b981", color: "#fff" }}
                        onClick={() => openModal(hod, "active")}
                        className="flex items-center gap-1 px-3 py-1 transition-transform hover:scale-105"
                      >
                        <HiCheck className="h-4 w-4 text-white" />
                        <span>Activate</span>
                      </Button>
                    ) : (
                      <Button
                        size="xs"
                        style={{ backgroundColor: "#ef4444", color: "#fff" }}
                        onClick={() => openModal(hod, "inactive")}
                        className="flex items-center gap-1 px-3 py-1 transition-transform hover:scale-105"
                      >
                        <HiX className="h-4 w-4 text-white" />
                        <span>Deactivate</span>
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>{" "}
      {/* Add HOD Modal */}
      <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="relative bg-gray-800 p-4">
          <div className="mb-6 text-center">
            <div className="bg-opacity-20 mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray">
              <HiBuildingOffice className="h-10 w-10 text-[#92e3a9]" />
            </div>
            <div className="text-xl font-semibold text-white">Add New HOD</div>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <Label htmlFor="name" className="mb-1 flex items-center gap-2">
                <HiUser className="text-[#92e3a9]" />
                Name
              </Label>
              <TextInput
                id="name"
                value={newHOD.name}
                onChange={(e) => setNewHOD({ ...newHOD, name: e.target.value })}
                placeholder="Enter name"
              />
            </div>
            <div className="relative">
              <Label
                htmlFor="department"
                className="mb-1 flex items-center gap-2"
              >
                <HiBuildingOffice className="text-[#92e3a9]" />
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
                className="focus:ring-primary w-full rounded-lg border border-gray-700 bg-[#323840] p-3 text-white focus:border-[#92e3a9] focus:ring-2 focus:outline-none"
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
              <Label htmlFor="email" className="mb-1 flex items-center gap-2">
                <HiMail className="text-[#92e3a9]" />
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
              />
            </div>
            <div className="relative">
              <Label htmlFor="phone" className="mb-1 flex items-center gap-2">
                <HiPhone className="text-[#92e3a9]" />
                Phone
              </Label>
              <TextInput
                id="phone"
                value={newHOD.phone}
                onChange={(e) =>
                  setNewHOD({ ...newHOD, phone: e.target.value })
                }
                placeholder="Enter phone number"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <Button
              style={{
                backgroundColor: "#92e3a9",
                color: "black",
                width: "fit-content",
                cursor: "pointer",
              }}
              onClick={handleAddHOD}
              className="flex items-center gap-2 transition-transform hover:scale-105"
            >
              <HiPlus className="h-4 w-4" />
              <span>Add HOD</span>
            </Button>
        
            <Button color="gray" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>{" "}
      {/* Confirmation Modal */}
      <Modal show={showModal} size="md" onClose={() => setShowModal(false)}>
        <div className="p-6 text-center">
          {status === "active" ? (
            <HiStatusOnline className="mx-auto mb-4 h-14 w-14 text-green-500" />
          ) : (
            <HiX className="mx-auto mb-4 h-14 w-14 text-red-500" />
          )}
          <h3 className="mb-5 text-lg font-normal text-gray-300">
            Are you sure you want to{" "}
            <span className="font-semibold text-white">{status}</span> the
            account of{" "}
            <span className="font-semibold text-white">
              {selectedHOD?.NAME}
            </span>
            ?
          </h3>
          <div className="flex justify-center gap-4">
            <Button
              color={status === "active" ? "success" : "failure"}
              onClick={handleToggleStatus}
              className="flex items-center gap-2"
            >
              {status === "active" ? (
                <HiCheck className="text-white" />
              ) : (
                <HiX className="text-white" />
              )}
              Yes, {status}
            </Button>
            <Button color="gray" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
