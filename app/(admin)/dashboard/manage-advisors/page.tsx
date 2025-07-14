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
  HiUserGroup,
} from "react-icons/hi";
import { useEffect, useState } from "react";
import Select, { SingleValue } from "react-select";
import { HiCheck, HiBuildingOffice2 } from "react-icons/hi2";
import { useAuth } from "@/app/context/AuthContext";
interface ADVISOR {
  ID: number;
  NAME: string;
  DEPARTMENT: string;
  EMAIL: string;
  PHONE: string;
  STATUS: number;
}

export default function ManageAdvisors() {
  const { user } = useAuth();
  const [advisorList, setAdvisorList] = useState<ADVISOR[]>([]);
  const [searchName, setSearchName] = useState("");
  const [searchDepartment, setSearchDepartment] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<ADVISOR | null>(null);
  const [status, setStatus] = useState<"active" | "inactive">("inactive");

  const [newADVISOR, setNewADVISOR] = useState({
    name: "",
    department: "",
    email: "",
    phone: "",
  });
  // Set department from user when user is available
  useEffect(() => {
    console.log("User data:", user);

    if (user && user.department && user.departmentId) {
      setNewADVISOR((prev) => ({
        ...prev,
        department: user.departmentId,
      }));
    }
  }, [user]);

  useEffect(() => {
    async function fetchAdvisors() {
      try {
        const response = await fetch("/api/advisors", {
          headers: {
            departmentid: user?.departmentId ? String(user.departmentId) : "",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch advisors");
        }
        const data = await response.json();
        setAdvisorList(data.advisors);
      } catch (error: unknown) {
        console.log(error);
      }
    }
    fetchAdvisors();
  }, [user?.departmentId]);
  const handleAddAdvisor = async () => {
    // Validate the form data
    if (
      !newADVISOR.name ||
      !newADVISOR.email ||
      // !newADVISOR.department ||
      !newADVISOR.phone
    ) {
      // console.error("All fields are required");
      alert("All fields are required");
      return;
    }

    try {
      console.log("Sending data:", newADVISOR);
      const res = await fetch("/api/advisor/add-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newADVISOR),
      });

      if (!res.ok) {
        const errorText = await res.text();
        const errorMsg = errorText.split("\n")[0];
        console.log("Error response:", errorText);
        alert(` ${errorMsg}`);
        throw new Error(errorMsg);
      } else {
        // Fetch updated list after successful addition
        const response = await fetch("/api/advisors", {
          headers: {
            departmentid: user?.departmentId ? String(user.departmentId) : "",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setAdvisorList(data.advisors);
        }
        alert("Advisor added successfully");
        console.log("New ADVISOR added successfully");
      }
    } catch (error) {
      console.log("Error adding ADVISOR:", error);
    }

    // Reset the form and close modal
    setNewADVISOR({
      name: "",
      department: "",
      email: "",
      phone: "",
    });
    setShowAddModal(false);
  };

  const openModal = (acc: ADVISOR, action: "active" | "inactive") => {
    setSelectedAccount(acc);
    setStatus(action);
    setShowModal(true);
  };
  const filteredAdvisorList = advisorList.filter((advisor) => {
    // Name filter
    const nameMatch =
      !searchName ||
      advisor.NAME.toLowerCase().includes(searchName.toLowerCase());

    // Phone filter
    const phoneMatch =
      !searchDepartment ||
      advisor.PHONE.toLowerCase().includes(searchDepartment.toLowerCase());

    // Email filter
    const emailMatch =
      !searchEmail ||
      advisor.EMAIL.toLowerCase().includes(searchEmail.toLowerCase());

    // Status filter
    const statusMatch =
      !statusFilter ||
      advisor.STATUS ===
        (statusFilter === "Active"
          ? 1
          : statusFilter === "Inactive"
            ? 0
            : advisor.STATUS);

    return nameMatch && phoneMatch && emailMatch && statusMatch;
  });

  const confirmAction = async () => {
    if (selectedAccount) {
      try {
        // Update local state
        setAdvisorList((prev) =>
          prev.map((acc) =>
            acc.ID === selectedAccount.ID
              ? { ...acc, STATUS: status === "active" ? 1 : 0 }
              : acc,
          ),
        );

        // Make API call to update status in the database
        const response = await fetch(
          `/api/account-status/advisor/${selectedAccount.ID}`,
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
            `Advisor status updated to ${status === "active" ? "Active" : "Inactive"}`,
          );
        }
        if (!response.ok) {
          alert("Failed to update status");
        }
      } catch (error) {
        console.error("Error updating account status:", error);
        // You could add error handling UI here
      }
    }
    setShowModal(false);
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
    { value: " ", label: "All" },
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  return (
    <div
      className="mx-auto max-w-7xl p-4 sm:p-6 md:p-8"
      data-aos="zoom-in"
      data-aos-duration="1000"
    >
      {/* {" "} */}
      <div className="mb-6 flex flex-col justify-between sm:mb-8 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-white sm:gap-3 sm:text-3xl md:text-4xl">
            <span className="rounded-lg bg-[#92e3a9] p-1 sm:p-2">
              <HiUserGroup className="h-6 w-6 text-gray-900 sm:h-7 sm:w-7 md:h-8 md:w-8" />
            </span>
            Manage Advisors
          </h1>
        </div>

        <Button
          style={{
            backgroundColor: "#92e3a9",
            color: "#000000",
            marginTop: "10px",
            width: "fit-content",
            cursor: "pointer",
          }}
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1 bg-[#92e3a9] text-sm text-gray-900 transition-all duration-200 hover:bg-[#7ac892] sm:gap-2 sm:text-base"
        >
          <HiPlus className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="xs:inline hidden">Add New Advisor</span>
          <span className="xs:hidden">Add Advisor</span>
        </Button>
      </div>
      {/* {" "} */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-4">
        <div className="relative">
          <input
            type="text"
            className="w-full rounded border border-gray-700 bg-gray-800 py-2 pr-4 pl-8 text-sm text-white placeholder-gray-400 focus:border-[#92e3a9] focus:outline-none sm:pl-10 sm:text-base"
            placeholder="Search by name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <div className="absolute top-0 left-0 flex h-full items-center pl-2 sm:pl-3">
            <HiUser className="h-4 w-4 text-[#92e3a9] sm:h-5 sm:w-5" />
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            className="w-full rounded border border-gray-700 bg-gray-800 py-2 pr-4 pl-8 text-sm text-white placeholder-gray-400 focus:border-[#92e3a9] focus:outline-none sm:pl-10 sm:text-base"
            placeholder="Search by email"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
          />
          <div className="absolute top-0 left-0 flex h-full items-center pl-2 sm:pl-3">
            <HiMail className="h-4 w-4 text-[#92e3a9] sm:h-5 sm:w-5" />
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            className="w-full rounded border border-gray-700 bg-gray-800 py-2 pr-4 pl-8 text-sm text-white placeholder-gray-400 focus:border-[#92e3a9] focus:outline-none sm:pl-10 sm:text-base"
            placeholder="Search by phone"
            value={searchDepartment}
            onChange={(e) => setSearchDepartment(e.target.value)}
          />
          <div className="absolute top-0 left-0 flex h-full items-center pl-2 sm:pl-3">
            <HiPhone className="h-4 w-4 text-[#92e3a9] sm:h-5 sm:w-5" />
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
                backgroundColor: "#1f2937",
                borderColor: "#374151",
                color: "white",
                fontSize: "0.875rem",
                minHeight: "40px",
                "&:hover": {
                  borderColor: "#4b5563",
                },
              }),
              menu: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: "#1f2937",
              }),
              option: (baseStyles, { isFocused, isSelected }) => ({
                ...baseStyles,
                backgroundColor: isSelected
                  ? "#92e3a9"
                  : isFocused
                    ? "#374151"
                    : "#1f2937",
                color: isSelected ? "black" : "white",
                cursor: "pointer",
                fontSize: "0.875rem",
                ":active": {
                  backgroundColor: isSelected ? "#92e3a9" : "#374151",
                },
              }),
              singleValue: (baseStyles) => ({
                ...baseStyles,
                color: "white",
                fontSize: "0.875rem",
              }),
              placeholder: (baseStyles) => ({
                ...baseStyles,
                color: "#9ca3af",
                fontSize: "0.875rem",
              }),
              dropdownIndicator: (baseStyles) => ({
                ...baseStyles,
                color: "#9ca3af",
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
                fontSize: "0.875rem",
              }),
            }}
          />
        </div>
      </div>
      <div className="rounded-lg border border-gray-800 bg-gray-900 p-3 sm:p-4 md:p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase sm:px-4 sm:py-3 md:px-6">
                  <HiUser className="mr-1 inline text-[#92e3a9] group-hover:scale-110 sm:mr-2" />{" "}
                  <span>Name</span>
                </th>

                <th className="hidden px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase sm:table-cell sm:px-4 sm:py-3 md:px-6">
                  <HiMail className="mr-1 inline text-[#92e3a9] group-hover:scale-110 sm:mr-2" />{" "}
                  <span>Email</span>
                </th>
                <th className="xs:table-cell hidden px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase sm:px-4 sm:py-3 md:px-6">
                  <HiPhone className="mr-1 inline text-[#92e3a9] group-hover:scale-110 sm:mr-2" />{" "}
                  <span>Phone</span>
                </th>
                <th className="xs:table-cell hidden px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase sm:px-4 sm:py-3 md:px-6">
                  <HiStatusOnline className="mr-1 inline text-[#92e3a9] group-hover:scale-110 sm:mr-2" />{" "}
                  <span>Status</span>
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase sm:px-4 sm:py-3 md:px-6">
                  <span>Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredAdvisorList.map((advisor) => (
                <tr
                  key={advisor.ID}
                  className="bg-gray-900 transition-colors hover:bg-gray-800"
                >
                  <td className="px-2 py-2 text-xs whitespace-nowrap text-white sm:px-4 sm:py-4 sm:text-sm md:px-6">
                    <div className="max-w-[120px] truncate sm:max-w-full">
                      {advisor.NAME}
                    </div>
                  </td>
                  <td className="hidden px-2 py-2 text-xs whitespace-nowrap text-white sm:table-cell sm:px-4 sm:py-4 sm:text-sm md:px-6">
                    <div className="max-w-[200px] truncate lg:max-w-full">
                      {advisor.EMAIL}
                    </div>
                  </td>
                  <td className="xs:table-cell hidden px-2 py-2 text-xs whitespace-nowrap text-white sm:px-4 sm:py-4 sm:text-sm md:px-6">
                    {advisor.PHONE}
                  </td>
                  <td className="xs:table-cell hidden px-2 py-2 text-xs whitespace-nowrap text-white sm:px-4 sm:py-4 sm:text-sm md:px-6">
                    {advisor.STATUS === 1 ? (
                      <HiStatusOnline className="mr-1 inline text-green-500 sm:mr-2" />
                    ) : (
                      <HiStatusOffline className="mr-1 inline text-red-500 sm:mr-2" />
                    )}
                    {advisor.STATUS === 1 ? "Active" : "Inactive"}
                  </td>
                  {/* {" "} */}
                  <td className="px-2 py-2 whitespace-nowrap sm:px-4 sm:py-4 md:px-6">
                    {advisor.STATUS === 0 ? (
                      <Button
                        size="xs"
                        style={{ backgroundColor: "#22c55e", color: "#fff" }}
                        onClick={() => openModal(advisor, "active")}
                        className="flex items-center gap-1 px-2 py-0.5 text-xs transition-transform hover:scale-105 sm:px-3 sm:py-1"
                      >
                        <HiCheck className="h-3 w-3 text-white sm:h-4 sm:w-4" />
                        <span className="xs:inline hidden">Activate</span>
                        <span className="xs:hidden">Act</span>
                      </Button>
                    ) : (
                      <Button
                        size="xs"
                        style={{ backgroundColor: "#ef4444", color: "#fff" }}
                        onClick={() => openModal(advisor, "inactive")}
                        className="flex items-center gap-1 px-2 py-0.5 text-xs transition-transform hover:scale-105 sm:px-3 sm:py-1"
                      >
                        <HiX className="h-3 w-3 text-white sm:h-4 sm:w-4" />
                        <span className="xs:inline hidden">Deactivate</span>
                        <span className="xs:hidden">Deact</span>
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Add ADVISOR Modal */}{" "}
      <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="relative bg-gray-800 p-3 sm:p-4">
          <div className="mb-4 text-center sm:mb-6">
            <div className="bg-opacity-20 mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full sm:mb-3 sm:h-16 sm:w-16">
              <HiUserGroup className="h-8 w-8 text-[#92e3a9] sm:h-10 sm:w-10" />
            </div>
            <div className="text-lg font-semibold text-white sm:text-xl">
              Add New Advisor
            </div>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div className="relative">
              <Label
                htmlFor="name"
                className="mb-1 flex items-center gap-1 text-sm sm:gap-2 sm:text-base"
              >
                <HiUser className="text-[#92e3a9]" />
                Name
              </Label>
              <TextInput
                id="name"
                value={newADVISOR.name}
                onChange={(e) =>
                  setNewADVISOR({ ...newADVISOR, name: e.target.value })
                }
                placeholder="Enter name"
                className="text-sm sm:text-base"
              />
            </div>
            {/* {" "} */}
            <div className="relative">
              <Label
                htmlFor="department"
                className="mb-1 flex items-center gap-1 text-sm sm:gap-2 sm:text-base"
              >
                <HiBuildingOffice2 className="text-[#92e3a9]" />
                Department
              </Label>
              <TextInput
                id="department"
                value={
                  user && user.department ? user.department.name || "" : ""
                }
                placeholder="Department"
                disabled={true}
                className="text-sm sm:text-base"
              />
              <input
                type="hidden"
                value={newADVISOR.department}
                id="department_id"
              />
              {user && user.department && (
                <p className="mt-1 text-xs text-gray-400">
                  Department ID: {user.departmentId || "Unknown"}
                </p>
              )}
            </div>
            <div className="relative">
              <Label
                htmlFor="email"
                className="mb-1 flex items-center gap-1 text-sm sm:gap-2 sm:text-base"
              >
                <HiMail className="text-[#92e3a9]" />
                Email
              </Label>
              <TextInput
                id="email"
                type="email"
                value={newADVISOR.email}
                onChange={(e) =>
                  setNewADVISOR({ ...newADVISOR, email: e.target.value })
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
                <HiPhone className="text-[#92e3a9]" />
                Phone
              </Label>
              <TextInput
                id="phone"
                value={newADVISOR.phone}
                onChange={(e) =>
                  setNewADVISOR({ ...newADVISOR, phone: e.target.value })
                }
                placeholder="Enter phone number"
                className="text-sm sm:text-base"
              />
            </div>
          </div>
          {/* {" "} */}
          <div className="mt-4 flex justify-end gap-2 sm:mt-6 sm:gap-4">
            <Button
              style={{
                backgroundColor: "#92e3a9",
                color: "black",
                width: "fit-content",
                cursor: "pointer",
              }}
              onClick={handleAddAdvisor}
              className="flex items-center gap-1 text-xs transition-transform hover:scale-105 sm:gap-2 sm:text-sm"
            >
              <HiPlus className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Add Advisor</span>
            </Button>
            <Button
              color="gray"
              onClick={() => setShowAddModal(false)}
              className="text-xs transition-transform hover:scale-105 sm:text-sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
      {/* Confirmation Modal */}{" "}
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
            <span className="font-semibold text-white">
              {selectedAccount?.NAME}
            </span>
            ?
          </h3>
          <div className="flex justify-center gap-3 sm:gap-4">
            <Button
              color={status === "active" ? "success" : "failure"}
              onClick={confirmAction}
              className="flex items-center gap-1 text-xs sm:gap-2 sm:text-sm"
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
