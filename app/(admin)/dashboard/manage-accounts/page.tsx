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
  HiCash,
} from "react-icons/hi";

// CSS utility classes for extra small screens (below sm breakpoint)
import "./responsive-utils.css";
import { useEffect, useState } from "react";
import Select, { SingleValue } from "react-select";

interface AccountsAdmin {
  ID: number;
  NAME: string;
  EMAIL: string;
  PHONE: string;
  STATUS: number;
}

export default function ManageAccountsAdmin() {
  useEffect(() => {
    async function fetchAccountsAdmin() {
      try {
        const response = await fetch("/api/get-account-admins");
        if (!response.ok) {
          throw new Error("Failed to fetch Accounts Admin");
        }
        const data = await response.json();
        setAccountsAdminList(data.accountsAdmin);
        console.log("Fetched Accounts Admins:", data.accountsAdmin);
      } catch (error: unknown) {
        console.log(error);
      }
    }
    fetchAccountsAdmin();
  }, []);
  const [accountsAdminList, setAccountsAdminList] = useState<AccountsAdmin[]>(
    [],
  );

  const [showAddModal, setShowAddModal] = useState(false);
  const [newAccountsAdmin, setNewAccountsAdmin] = useState({
    name: "",

    email: "",
    phone: "",
  });

  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<AccountsAdmin | null>(
    null,
  );
  const [status, setStatus] = useState<"active" | "inactive">("inactive");
  const openModal = (acc: AccountsAdmin, action: "active" | "inactive") => {
    setSelectedAccount(acc);
    setStatus(action);
    setShowModal(true);
  };
  const handleAddAccountsAdmin = async () => {
    setShowAddModal(false);
    try {
      const res = await fetch("/api/accounts-admin/add-accounts-admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newAccountsAdmin),
      });
      if (!res.ok) {
        const errorText = await res.text();
        const errorMsg = errorText.split("\n")[0];
        console.log("Error response:", errorText);
        throw new Error(errorMsg);
      } else {
        alert("New Accounts Admin added successfully");
        const response = await fetch("/api/get-account-admins");
        if (response) {
          const data = await response.json();
          setAccountsAdminList(data.accountsAdmin);
          console.log("Updated Accounts Admins List:", data.accountsAdmin);
        }
      }
    } catch (error) {
      alert(`${error}`);
    }
    //reset form field
    // Reset the form
    setNewAccountsAdmin({
      name: "",

      email: "",
      phone: "",
    });
  };

  const confirmAction = async () => {
    if (selectedAccount) {
      try {
        // Update local state
        setAccountsAdminList((prev) =>
          prev.map((acc) =>
            acc.ID === selectedAccount.ID
              ? { ...acc, STATUS: status === "active" ? 1 : 0 }
              : acc,
          ),
        );

        // Make API call to update status in the database
        const response = await fetch(
          `/api/account-status/accounts-admin/${selectedAccount.ID}`,
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
        //  if (response.ok) {
        //   alert(
        //     `Accounts Admin status updated to ${status === "active" ? "Active" : "Inactive"}`,
        //   );
        // }

        if (!response.ok) {
          alert("Failed to update status");
        }
      } catch (error) {
        console.log("Error:", error);
      }
    }
    setShowModal(false);
  };

  const filteredAccountsAdminList = accountsAdminList.filter((admin) => {
    // Name filter
    const nameMatch =
      !searchName ||
      admin.NAME.toLowerCase().includes(searchName.toLowerCase());

    // Email filter
    const emailMatch =
      !searchEmail ||
      admin.EMAIL.toLowerCase().includes(searchEmail.toLowerCase());

    // Phone filter
    const phoneMatch =
      !searchPhone ||
      admin.PHONE.toLowerCase().includes(searchPhone.toLowerCase());

    // Status filter
    const statusMatch =
      !statusFilter ||
      statusFilter === " " ||
      admin.STATUS === parseInt(statusFilter);

    return nameMatch && emailMatch && phoneMatch && statusMatch;
  });

  const handleNameSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchName(event.target.value);
  };

  const handleEmailSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchEmail(event.target.value);
  };

  const handlePhoneSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchPhone(event.target.value);
  };

  const handleStatusChange = (
    selectedOption: SingleValue<{ value: string; label: string }> | null,
  ) => {
    if (selectedOption) {
      setStatusFilter(selectedOption.value);
    } else {
      setStatusFilter("");
    }
  };

  const statusOptions = [
    { value: " ", label: "All" },
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
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
              <HiCash className="h-6 w-6 text-gray-900 sm:h-7 sm:w-7 md:h-8 md:w-8" />
            </span>
            <span className="break-words">Manage Account Admins</span>
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
          Add New Accounts Admin
        </Button>
      </div>
      {/* {" "} */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <div className="relative">
          <input
            type="text"
            className="w-full rounded border border-gray-700 bg-gray-800 py-2 pr-4 pl-10 text-white placeholder-gray-400 focus:border-[#92e3a9] focus:outline-none"
            placeholder="Search by name"
            value={searchName}
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
            value={searchEmail}
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
            placeholder="Search by phone"
            value={searchPhone}
            onChange={handlePhoneSearchChange}
          />
          <div className="absolute top-0 left-0 flex h-full items-center pl-3">
            <HiPhone className="h-5 w-5 text-[#92e3a9]" />
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
              {filteredAccountsAdminList.map((admin) => (
                <tr
                  key={admin.ID}
                  className="bg-gray-900 transition-colors hover:bg-gray-800"
                >
                  <td className="px-3 py-2 text-xs whitespace-nowrap text-white sm:px-6 sm:py-4 sm:text-sm md:text-base">
                    {admin.NAME}
                  </td>
                  <td className="px-3 py-2 text-xs whitespace-nowrap text-white sm:px-6 sm:py-4 sm:text-sm md:text-base">
                    {admin.EMAIL}
                  </td>
                  <td className="px-3 py-2 text-xs whitespace-nowrap text-white sm:px-6 sm:py-4 sm:text-sm md:text-base">
                    {admin.PHONE}
                  </td>
                  <td className="px-3 py-2 text-xs whitespace-nowrap text-white sm:px-6 sm:py-4 sm:text-sm md:text-base">
                    {admin.STATUS === 1 ? (
                      <HiStatusOnline className="mr-1 inline text-green-500 sm:mr-2" />
                    ) : (
                      <HiStatusOffline className="mr-1 inline text-red-500 sm:mr-2" />
                    )}
                    <span className="xs:inline hidden">
                      {admin.STATUS === 1 ? "Active" : "Inactive"}
                    </span>
                  </td>
                  {/* {" "} */}
                  <td className="px-3 py-2 whitespace-nowrap sm:px-6 sm:py-4">
                    {admin.STATUS === 0 ? (
                      <Button
                        size="xs"
                        style={{ backgroundColor: "#22c55e", color: "#fff" }}
                        onClick={() => openModal(admin, "active")}
                        className="flex items-center gap-1 px-2 py-1 text-xs transition-transform hover:scale-105 sm:px-3 sm:text-sm"
                      >
                        <HiCheck className="h-3 w-3 text-white sm:h-4 sm:w-4" />
                        <span className="xs:inline hidden">Activate</span>
                      </Button>
                    ) : (
                      <Button
                        size="xs"
                        style={{ backgroundColor: "#ef4444", color: "#fff" }}
                        onClick={() => openModal(admin, "inactive")}
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
      {/* Add Accounts Admin Modal */}
      <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="relative bg-gray-800 p-3 sm:p-4">
          <div className="mb-4 text-center sm:mb-6">
            <div className="bg-opacity-20 bg-gray mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full sm:mb-3 sm:h-16 sm:w-16">
              <HiCash className="h-8 w-8 text-[#92e3a9] sm:h-10 sm:w-10" />
            </div>
            <div className="text-lg font-semibold text-white sm:text-xl">
              Add New Accounts Admin
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
                value={newAccountsAdmin.name}
                onChange={(e) =>
                  setNewAccountsAdmin({
                    ...newAccountsAdmin,
                    name: e.target.value,
                  })
                }
                placeholder="Enter name"
                className="text-sm sm:text-base"
              />
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
                value={newAccountsAdmin.email}
                onChange={(e) =>
                  setNewAccountsAdmin({
                    ...newAccountsAdmin,
                    email: e.target.value,
                  })
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
                value={newAccountsAdmin.phone}
                onChange={(e) =>
                  setNewAccountsAdmin({
                    ...newAccountsAdmin,
                    phone: e.target.value,
                  })
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
              onClick={handleAddAccountsAdmin}
              className="flex items-center justify-center gap-1 text-xs transition-transform hover:scale-105 sm:gap-2 sm:text-sm"
            >
              <HiPlus className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Add Accounts Admin</span>
            </Button>
            <Button
              color="gray"
              onClick={() => setShowAddModal(false)}
              className="xs:w-auto w-full text-xs transition-transform hover:scale-105 sm:text-sm"
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
            <span className="font-semibold break-words text-white">
              {selectedAccount?.NAME}
            </span>
            ?
          </h3>
          <div className="xs:flex-row flex flex-col justify-center gap-2 sm:gap-4">
            <Button
              color={status === "active" ? "success" : "failure"}
              onClick={confirmAction}
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
