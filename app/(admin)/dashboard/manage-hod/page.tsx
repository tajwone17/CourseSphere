"use client";

import { Button, TextInput, Modal, Label } from "flowbite-react";
import {  HiPlus} from "react-icons/hi";
import { useState } from "react";

interface HOD {
  id: number;
  name: string;
  department: string;
  email: string;
  phone: string;
  password?: string;
  status: string;
}

export default function ManageHOD() {
  const [hodList, setHodList] = useState<HOD[]>([
    {
      id: 1,
      name: "Dr. Tajwone",
      department: "Computer Science",
      email: "tajwone.doe@neub.edu.bd",
      phone: "+880 1712345678",
      status: "Active",
    },
    {
      id: 2,
      name: "Dr. Chowdhury",
      department: "Electrical Engineering",
      email: "chowdhry.@neub.edu.bd",
      phone: "+880 1812345678",
      status: "Active",
    },
    {
      id: 3,
      name: "Dr. Jakaria",
      department: "Civil Engineering",
      email: "jakaria.j@neub.edu.bd",
      phone: "+880 1912345678",
      status: "Inactive",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);


  const [newHOD, setNewHOD] = useState({
    name: "",
    department: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleAddHOD = () => {
    const id = hodList.length + 1;
    const hodData = { ...newHOD, id, status: "Active" };
    setHodList([...hodList, hodData]);
    setShowAddModal(false);
    setNewHOD({ name: "", department: "", email: "", phone: "", password: "" });
  };




  const handleToggleStatus = (id: number) => {
    const updatedList = hodList.map((hod) =>
      hod.id === id
        ? { ...hod, status: hod.status === "Active" ? "Inactive" : "Active" }
        : hod
    );
    setHodList(updatedList);
  };

  return (
    <div className="mx-auto max-w-7xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Manage HODs</h1>
      
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

      <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {hodList.map((hod) => (
                <tr
                  key={hod.id}
                  className="bg-gray-900 transition-colors hover:bg-gray-800"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {hod.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {hod.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {hod.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {hod.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                    
                  
                      <Button
                        style={{
                          backgroundColor: hod.status === "Active" ? "#10b981" : "#ef4444",
                          color: "#ffffff",
                        }}
                        size="xs"
                        onClick={() => handleToggleStatus(hod.id)}
                      >
                        {hod.status === "Active" ? "Active" : "Inactive"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add HOD Modal */}
      <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="relative bg-gray-800 p-4">
          <div className="mb-4 text-xl font-semibold text-white">
            Add New HOD
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <TextInput
                id="name"
                value={newHOD.name}
                onChange={(e) => setNewHOD({ ...newHOD, name: e.target.value })}
                placeholder="Enter name"
              />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <TextInput
                id="department"
                value={newHOD.department}
                onChange={(e) =>
                  setNewHOD({ ...newHOD, department: e.target.value })
                }
                placeholder="Enter department"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
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
            <div>
              <Label htmlFor="phone">Phone</Label>
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
            >
              Add HOD
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
