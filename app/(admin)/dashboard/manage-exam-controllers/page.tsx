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
import { useState } from "react";
import Select, { SingleValue } from "react-select";


interface ExamController {
  id: number;
  name: string;
 
  email: string;
  phone: string;
  status: string;
}

export default function ManageExamControllers() {
  const [examControllerList, setExamControllerList] = useState<ExamController[]>([
    {
      id: 1,
      name: "Dr. Tajwone",
      
      email: "tajwone.doe@neub.edu.bd",
      phone: "+880 1712345678",
      status: "Active",
    },
    {
      id: 2,
      name: "Dr. Chowdhury",
     
      email: "chowdhry.@neub.edu.bd",
      phone: "+880 1812345678",
      status: "Active",
    },
    {
      id: 3,
      name: "Dr. Jakaria",
     
      email: "jakaria.j@neub.edu.bd",
      phone: "+880 1912345678",
      status: "Inactive",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newExamController, setNewExamController] = useState({
    name: "",
  
    email: "",
    phone: "",
  });

 

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

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
      console.log("New Exam Controller added successfully");
    } catch (error) {
      console.error("Error adding Exam Controller:", error);
    }
       // Reset the form
    setNewExamController({
      name: "",
      
      email: "",
      phone: "",
    });
  };

  const handleToggleStatus = (id: number) => {
    const updatedList = examControllerList.map((controller) =>
      controller.id === id
        ? { ...controller, status: controller.status === "Active" ? "Inactive" : "Active" }
        : controller ,
    );
    setExamControllerList(updatedList);
  };

  const filteredExamControllerList = examControllerList.filter(
    (controller) =>
      (controller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
   
        controller.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (statusFilter ? controller.status === statusFilter : true),
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
          <h1 className="text-4xl font-bold text-white">Manage Exam Controllers</h1>
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

      <div className="mb-6 flex items-center gap-4">
        <div className="w-1/3">
          <TextInput
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by name, email"
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
              {filteredExamControllerList.map((controller) => (
                <tr
                  key={controller.id}
                  className="bg-gray-900 transition-colors hover:bg-gray-800"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {controller.name}
                  </td>
                
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {controller.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {controller.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {controller.status === "Active" ? (
                      <HiStatusOnline className="mr-2 inline text-green-500" />
                    ) : (
                      <HiStatusOffline className="mr-2 inline text-red-500" />
                    )}
                    {controller.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button
                      style={{
                        backgroundColor:
                          controller.status === "Active" ? "#ef4444" : "#10b981",
                        color: "#ffffff",
                      }}
                      size="xs"
                      onClick={() => handleToggleStatus(controller.id)}
                    >
                      {controller.status === "Active" ? "Inactive" : "Active"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Exam Controller Modal */}
      <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="relative bg-gray-800 p-4">
          <div className="mb-4 text-xl font-semibold text-white">
            Add New Exam Controller
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <TextInput
                id="name"
                value={newExamController.name}
                onChange={(e) => setNewExamController({ ...newExamController, name: e.target.value })}
                placeholder="Enter name"
              />
            </div>
          
            <div>
              <Label htmlFor="email">Email</Label>
              <TextInput
                id="email"
                type="email"
                value={newExamController.email}
                onChange={(e) =>
                  setNewExamController({ ...newExamController, email: e.target.value })
                }
                placeholder="Enter email"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <TextInput
                id="phone"
                value={newExamController.phone}
                onChange={(e) =>
                  setNewExamController({ ...newExamController, phone: e.target.value })
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
            >
              Add Exam Controller
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
