"use client";

import { Button, TextInput, Modal, Label } from "flowbite-react";
import {
  HiPlus,
  HiSearch,
  HiUser,
  HiMail,
  HiPhone,
  HiStatusOnline,
  HiStatusOffline,
} from "react-icons/hi";
import { useEffect, useState } from "react";
import Select, { SingleValue } from "react-select";
// import { useAuth } from "@/app/context/AuthContext";

interface ADVISOR {
 ID: number;
 NAME: string;
  DEPARTMENT: string;
  EMAIL: string;
  PHONE: string;
  STATUS: number;
}

export default function ManageAdvisors() {
  const [advisorList, setAdvisorList] = useState<ADVISOR[]>([]);
useEffect(() => {
  async function fetchAdvisors() {
    try {
      const response = await fetch("/api/advisors");
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
}, []);

  // const { user } = useAuth();
  

  const [showAddModal, setShowAddModal] = useState(false);
  const [newADVISOR, setNewADVISOR] = useState({
    name: "",
    department: "",
    email: "",
    phone: "",
  });

 
  // const [depts, setDepts] = useState<any>([]);

  // useEffect(() => {
  //   async function fetchDepartments() {
  //     try {
  //       const res = await fetch("/api/departments", {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       });
  //       const data = await res.json();
  //       console.log(typeof data.departments);
  //       setDepts(data.departments);
  //     } catch (error) {
  //       console.error("Failed to fetch departments:", error);
  //     }
  //   }

  //   fetchDepartments();
  // }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const handleAddAdvisor = async () => {
    setShowAddModal(false);
    try {
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
        throw new Error(errorMsg);
      }
      console.log("New ADVISOR added successfully");
    } catch (error) {
      console.error("Error adding ADVISOR:", error);
    }
    // Reset the form
    setNewADVISOR({
      name: "",
      department: "",
      email: "",
      phone: "",
    });
  };

  const handleToggleStatus = (id: number) => {
    const updatedList = advisorList.map((advisor) =>
      advisor.ID === id
        ? {
            ...advisor,
            STATUS: advisor.STATUS === 1 ? 0 : 1,
          }
        : advisor,
    );
    setAdvisorList(updatedList);
  };

  const filteredAdvisorList = advisorList.filter(
    (advisor) =>
      (advisor.NAME.toLowerCase().includes(searchQuery.toLowerCase()) ||
        advisor.DEPARTMENT.toLowerCase().includes(searchQuery.toLowerCase()) ||
        advisor.EMAIL.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (statusFilter
        ? advisor.STATUS === (statusFilter === "Active" ? 1 : statusFilter === "Inactive" ? 0 : advisor.STATUS)
        : true),
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Manage ADVISOR`S</h1>
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
          Add New Advisor
        </Button>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="w-1/3">
          <TextInput
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by name, department, email"
            icon={HiSearch}
          />
        </div>
        <div className="w-1/3">
          <Select
            options={statusOptions}
            onChange={handleStatusChange} // Corrected here
            placeholder="Filter by Status"
            isSearchable={false}
            value={statusOptions.find(
              (option) => option.value === statusFilter,
            )} // Corrected here
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
              {filteredAdvisorList.map((advisor) => (
                <tr
                  key={advisor.ID}
                  className="bg-gray-900 transition-colors hover:bg-gray-800"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {advisor.NAME}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {advisor.EMAIL}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {advisor.PHONE}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {advisor.STATUS ===1 ? (
                      <HiStatusOnline className="mr-2 inline text-green-500" />
                    ) : (
                      <HiStatusOffline className="mr-2 inline text-red-500" />
                    )}
                    {advisor.STATUS===1? "Active" : "Inactive"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button
                      style={{
                        backgroundColor:
                          advisor.STATUS === 1? "#ef4444" : "#10b981",
                        color: "#ffffff",
                      }}
                      size="xs"
                      onClick={() => handleToggleStatus(advisor.ID)}
                    >
                      {advisor.STATUS === 1 ? "Inactive" : "Active"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add ADVISOR Modal */}
      <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="relative bg-gray-800 p-4">
          <div className="mb-4 text-xl font-semibold text-white">
            Add New ADVISOR
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <TextInput
                id="name"
                value={newADVISOR.name}
                onChange={(e) =>
                  setNewADVISOR({ ...newADVISOR, name: e.target.value })
                }
                placeholder="Enter name"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <TextInput
                id="email"
                type="email"
                value={newADVISOR.email}
                onChange={(e) =>
                  setNewADVISOR({ ...newADVISOR, email: e.target.value })
                }
                placeholder="Enter email"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <TextInput
                id="phone"
                value={newADVISOR.phone}
                onChange={(e) =>
                  setNewADVISOR({ ...newADVISOR, phone: e.target.value })
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
              onClick={handleAddAdvisor}
            >
              Add ADVISOR
            </Button>
            <Button color="gray" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
