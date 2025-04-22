"use client";

import { Button, TextInput, Modal, Label } from "flowbite-react";
import { HiSearch, HiPlus, HiPencil, HiTrash } from "react-icons/hi";
import { useState } from "react";

interface Advisor {
  id: number;
  name: string;
  department: string;
  email: string;
  phone: string;
  password?: string;
  status: string;
}

export default function ManageAdvisors() {
  const [advisorsList, setAdvisorsList] = useState<Advisor[]>([
    {
      id: 1,
      name: "Prof. Michael Brown",
      department: "Computer Science",
      email: "michael.b@neub.edu.bd",
      phone: "+880 1712345678",
      status: "Active",
    },
    {
      id: 2,
      name: "Dr. Sarah Wilson",
      department: "Electrical Engineering",
      email: "sarah.w@neub.edu.bd",
      phone: "+880 1812345678",
      status: "Active",
    },
    {
      id: 3,
      name: "Prof. David Lee",
      department: "Civil Engineering",
      email: "david.l@neub.edu.bd",
      phone: "+880 1912345678",
      status: "Inactive",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
  const [newAdvisor, setNewAdvisor] = useState({
    name: "",
    department: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleAddAdvisor = () => {
    const id = advisorsList.length + 1;
    const advisorData = { ...newAdvisor, id, status: "Active" };
    setAdvisorsList([...advisorsList, advisorData]);
    setShowAddModal(false);
    setNewAdvisor({
      name: "",
      department: "",
      email: "",
      phone: "",
      password: "",
    });
  };

  const handleEditAdvisor = () => {
    if (!selectedAdvisor) return;
    const updatedList = advisorsList.map((advisor) =>
      advisor.id === selectedAdvisor.id ? selectedAdvisor : advisor,
    );
    setAdvisorsList(updatedList);
    setShowEditModal(false);
  };

  const handleDeleteAdvisor = () => {
    if (!selectedAdvisor) return;
    const updatedList = advisorsList.filter(
      (advisor) => advisor.id !== selectedAdvisor.id,
    );
    setAdvisorsList(updatedList);
    setShowDeleteModal(false);
  };

  return (
    <div className="mx-auto max-w-7xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Manage Advisors</h1>
          <p className="mt-4 text-lg text-gray-400">
            Add, edit, or remove Academic Advisors
          </p>
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

      <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="relative w-64">
            <TextInput
              type="search"
              placeholder="Search Advisors..."
              className="rounded-lg border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:border-[#92e3a9] focus:ring-[#92e3a9]"
            />
            <HiSearch className="absolute top-2.5 right-3 h-5 w-5 text-gray-400" />
          </div>
        </div>

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
              {advisorsList.map((advisor) => (
                <tr
                  key={advisor.id}
                  className="bg-gray-900 transition-colors hover:bg-gray-800"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {advisor.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {advisor.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {advisor.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {advisor.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Button
                        size="xs"
                        style={{ backgroundColor: "#f59e0b", color: "#ffffff" }}
                        onClick={() => {
                          setSelectedAdvisor(advisor);
                          setShowEditModal(true);
                        }}
                      >
                        <HiPencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="xs"
                        style={{ backgroundColor: "#ef4444", color: "#ffffff" }}
                        onClick={() => {
                          setSelectedAdvisor(advisor);
                          setShowDeleteModal(true);
                        }}
                      >
                        <HiTrash className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Advisor Modal */}
      <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="relative bg-gray-800 p-4">
          <div className="mb-4 text-xl font-semibold text-white">
            Add New Advisor
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <TextInput
                id="name"
                value={newAdvisor.name}
                onChange={(e) =>
                  setNewAdvisor({ ...newAdvisor, name: e.target.value })
                }
                placeholder="Enter name"
              />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <TextInput
                id="department"
                value={newAdvisor.department}
                onChange={(e) =>
                  setNewAdvisor({ ...newAdvisor, department: e.target.value })
                }
                placeholder="Enter department"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <TextInput
                id="email"
                type="email"
                value={newAdvisor.email}
                onChange={(e) =>
                  setNewAdvisor({ ...newAdvisor, email: e.target.value })
                }
                placeholder="Enter email"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <TextInput
                id="phone"
                value={newAdvisor.phone}
                onChange={(e) =>
                  setNewAdvisor({ ...newAdvisor, phone: e.target.value })
                }
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <TextInput
                id="password"
                type="password"
                value={newAdvisor.password}
                onChange={(e) =>
                  setNewAdvisor({ ...newAdvisor, password: e.target.value })
                }
                placeholder="Enter password"
                required
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
              Add Advisor
            </Button>
            <Button color="gray" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Advisor Modal */}
      <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
        <div className="relative bg-gray-800 p-4">
          <div className="mb-4 text-xl font-semibold text-white">
            Edit Advisor
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <TextInput
                id="edit-name"
                value={selectedAdvisor?.name}
                onChange={(e) =>
                  setSelectedAdvisor(
                    selectedAdvisor
                      ? { ...selectedAdvisor, name: e.target.value }
                      : null,
                  )
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-department">Department</Label>
              <TextInput
                id="edit-department"
                value={selectedAdvisor?.department}
                onChange={(e) =>
                  setSelectedAdvisor(
                    selectedAdvisor
                      ? { ...selectedAdvisor, department: e.target.value }
                      : null,
                  )
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <TextInput
                id="edit-email"
                type="email"
                value={selectedAdvisor?.email}
                onChange={(e) =>
                  setSelectedAdvisor(
                    selectedAdvisor
                      ? { ...selectedAdvisor, email: e.target.value }
                      : null,
                  )
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-phone">Phone</Label>
              <TextInput
                id="edit-phone"
                value={selectedAdvisor?.phone}
                onChange={(e) =>
                  setSelectedAdvisor(
                    selectedAdvisor
                      ? { ...selectedAdvisor, phone: e.target.value }
                      : null,
                  )
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-password">New Password (Optional)</Label>
              <TextInput
                id="edit-password"
                type="password"
                value={selectedAdvisor?.password || ""}
                onChange={(e) =>
                  setSelectedAdvisor(
                    selectedAdvisor
                      ? { ...selectedAdvisor, password: e.target.value }
                      : null,
                  )
                }
                placeholder="Enter new password"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <Button onClick={handleEditAdvisor}>Save Changes</Button>
            <Button color="gray" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="relative bg-gray-800 p-4">
          <div className="mb-4 text-xl font-semibold text-white">
            Delete Advisor
          </div>
          <p className="mb-6 text-gray-300">
            Are you sure you want to delete this advisor? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-4">
            <Button color="failure" onClick={handleDeleteAdvisor}>
              Delete
            </Button>
            <Button color="gray" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
