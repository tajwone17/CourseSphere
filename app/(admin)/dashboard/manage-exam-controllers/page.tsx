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
  HiDocumentReport,
} from "react-icons/hi";
import { useState, useEffect } from "react";
import Select, { SingleValue } from "react-select";

interface ExamController {
  ID: number;
  NAME: string;
  EMAIL: string;
  PHONE: string;
  STATUS: number;
}

export default function ManageExamControllers() {
  const [examControllerList, setExamControllerList] = useState<
    ExamController[]
  >([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newExamController, setNewExamController] = useState({
    name: "",

    email: "",
    phone: "",
  });

  useEffect(() => {
    async function fetchExamControllers() {
      try {
        const response = await fetch("/api/get-exam-controllers");
        if (!response.ok) {
          throw new Error("Failed to fetch Accounts Exam Controllers");
        }
        const data = await response.json();
        setExamControllerList(data.examControllers);
        console.log("Fetched  Exam Controllers:", data.examControllers);
      } catch (error: unknown) {
        console.log(error);
      }
    }
    fetchExamControllers();
  }, []);
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<ExamController | null>(
    null,
  );
  const [status, setStatus] = useState<"active" | "inactive">("inactive");
  const openModal = (acc: ExamController, action: "active" | "inactive") => {
    setSelectedAccount(acc);
    setStatus(action);
    setShowModal(true);
  };

  const confirmAction = async () => {
    if (selectedAccount) {
      try {
        // Update local state
        setExamControllerList((prev) =>
          prev.map((acc) =>
            acc.ID === selectedAccount.ID
              ? { ...acc, STATUS: status === "active" ? 1 : 0 }
              : acc,
          ),
        );

        // Make API call to update status in the database
        const response = await fetch(
          `/api/account-status/exam-controller/${selectedAccount.ID}`,
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
        //     `Exam Controller status updated to ${status === "active" ? "Active" : "Inactive"}`,
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

  const handleAddExamController = async () => {
    setShowAddModal(false);
    try {
      const res = await fetch("/api/exam-controller/add-exam-controller", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newExamController),
      });
      if (!res.ok) {
        const errorText = await res.text();
        const errorMsg = errorText.split("\n")[0];
        console.log("Error response:", errorText);
        throw new Error(errorMsg);
      }
      alert("New Exam Controller added successfully");
    } catch (error) {
      alert(` ${error}`);
    }
    // Reset the form
    setNewExamController({
      name: "",

      email: "",
      phone: "",
    });
  };

  const filteredExamControllerList = examControllerList.filter((controller) => {
    // Name filter
    const nameMatch =
      !searchName ||
      controller.NAME.toLowerCase().includes(searchName.toLowerCase());

    // Email filter
    const emailMatch =
      !searchEmail ||
      controller.EMAIL.toLowerCase().includes(searchEmail.toLowerCase());

    // Phone filter
    const phoneMatch =
      !searchPhone ||
      controller.PHONE.toLowerCase().includes(searchPhone.toLowerCase());

    // Status filter
    const statusMatch =
      !statusFilter ||
      statusFilter === " " ||
      controller.STATUS === parseInt(statusFilter);

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
      className="mx-auto max-w-7xl p-8"
      data-aos="zoom-in"
      data-aos-duration="1000"
    >
      {" "}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-4xl font-bold text-white">
            <span className="rounded-lg bg-[#92e3a9] p-2">
              <HiDocumentReport className="h-8 w-8 text-gray-900" />
            </span>
            Manage Exam Controllers
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
          Add New Exam Controller
        </Button>
      </div>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {" "}
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
              {filteredExamControllerList.map((controller) => (
                <tr
                  key={controller.ID}
                  className="bg-gray-900 transition-colors hover:bg-gray-800"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {controller.NAME}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {controller.EMAIL}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {controller.PHONE}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {controller.STATUS === 1 ? (
                      <HiStatusOnline className="mr-2 inline text-green-500" />
                    ) : (
                      <HiStatusOffline className="mr-2 inline text-red-500" />
                    )}
                    {controller.STATUS==1?"Active":"Inactive"}
                  </td>{" "}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {controller.STATUS === 0 ? (
                      <Button
                        size="xs"
                        style={{ backgroundColor: "#22c55e", color: "#fff" }}
                        onClick={() => openModal(controller, "active")}
                        className="flex items-center gap-1 px-3 py-1 transition-transform hover:scale-105"
                      >
                        <HiCheck className="h-4 w-4 text-white" />
                        <span>Activate</span>
                      </Button>
                    ) : (
                      <Button
                        size="xs"
                        style={{ backgroundColor: "#ef4444", color: "#fff" }}
                        onClick={() => openModal(controller, "inactive")}
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
      {/* Add Exam Controller Modal */}
      <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="relative bg-gray-800 p-4">
          <div className="mb-6 text-center">
            <div className="bg-opacity-20 bg-gray mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full">
              <HiDocumentReport className="h-10 w-10 text-[#92e3a9]" />
            </div>
            <div className="text-xl font-semibold text-white">
              Add New Exam Controller
            </div>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <Label htmlFor="name" className="mb-1 flex items-center gap-2">
                <HiUser className="text-[#92e3a9]" />
                Name
              </Label>
              <TextInput
                id="name"
                value={newExamController.name}
                onChange={(e) =>
                  setNewExamController({
                    ...newExamController,
                    name: e.target.value,
                  })
                }
                placeholder="Enter name"
              />
            </div>

            <div className="relative">
              <Label htmlFor="email" className="mb-1 flex items-center gap-2">
                <HiMail className="text-[#92e3a9]" />
                Email
              </Label>
              <TextInput
                id="email"
                type="email"
                value={newExamController.email}
                onChange={(e) =>
                  setNewExamController({
                    ...newExamController,
                    email: e.target.value,
                  })
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
                value={newExamController.phone}
                onChange={(e) =>
                  setNewExamController({
                    ...newExamController,
                    phone: e.target.value,
                  })
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
              onClick={handleAddExamController}
              className="flex items-center gap-2 transition-transform hover:scale-105"
            >
              <HiPlus className="h-4 w-4" />
              <span>Add Exam Controller</span>
            </Button>
            <Button
              color="gray"
              onClick={() => setShowAddModal(false)}
              className="transition-transform hover:scale-105"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
      {/* Confirmation Modal */}{" "}
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
              {selectedAccount?.NAME}
            </span>
            ?
          </h3>
          <div className="flex justify-center gap-4">
            <Button
              color={status === "active" ? "success" : "failure"}
              onClick={confirmAction}
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
