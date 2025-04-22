"use client";

import { Button, TextInput, Modal, Label } from "flowbite-react";
import { HiSearch, HiPlus, HiPencil, HiTrash } from "react-icons/hi";
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
      name: "Dr. John Doe",
      department: "Computer Science",
      email: "john.doe@neub.edu.bd",
      phone: "+880 1712345678",
      status: "Active",
    },
    {
      id: 2,
      name: "Dr. Jane Smith",
      department: "Electrical Engineering",
      email: "jane.smith@neub.edu.bd",
      phone: "+880 1812345678",
      status: "Active",
    },
    {
      id: 3,
      name: "Dr. Robert Johnson",
      department: "Civil Engineering",
      email: "robert.j@neub.edu.bd",
      phone: "+880 1912345678",
      status: "Inactive",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedHOD, setSelectedHOD] = useState<HOD | null>(null);
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

  const handleEditHOD = () => {
    if (!selectedHOD) return;
    const updatedList = hodList.map((hod) =>
      hod.id === selectedHOD.id ? selectedHOD : hod,
    );
    setHodList(updatedList);
    setShowEditModal(false);
  };

  const handleDeleteHOD = () => {
    if (!selectedHOD) return;
    const updatedList = hodList.filter((hod) => hod.id !== selectedHOD.id);
    setHodList(updatedList);
    setShowDeleteModal(false);
  };

  return (
    <div className="mx-auto max-w-7xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Manage HODs</h1>
          <p className="mt-4 text-lg text-gray-400">
            Add, edit, or remove Head of Departments
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
          Add New HOD
        </Button>
      </div>

      <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="relative w-64">
            <TextInput
              type="search"
              placeholder="Search HODs..."
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
                        style={{ backgroundColor: "#f59e0b", color: "#ffffff" }}
                        size="xs"
                        onClick={() => {
                          setSelectedHOD(hod);
                          setShowEditModal(true);
                        }}
                      >
                        <HiPencil className="h-4 w-4" />
                      </Button>
                      <Button
                        style={{ backgroundColor: "#ef4444", color: "#ffffff" }}
                        size="xs"
                        onClick={() => {
                          setSelectedHOD(hod);
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
            <div>
              <Label htmlFor="password">Password</Label>
              <TextInput
                id="password"
                type="password"
                value={newHOD.password}
                onChange={(e) =>
                  setNewHOD({ ...newHOD, password: e.target.value })
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

      {/* Edit HOD Modal */}
      <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
        <div className="relative bg-gray-800 p-4">
          <div className="mb-4 text-xl font-semibold text-white">Edit HOD</div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <TextInput
                id="edit-name"
                value={selectedHOD?.name}
                onChange={(e) =>
                  setSelectedHOD(
                    selectedHOD
                      ? { ...selectedHOD, name: e.target.value }
                      : null,
                  )
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-department">Department</Label>
              <TextInput
                id="edit-department"
                value={selectedHOD?.department}
                onChange={(e) =>
                  setSelectedHOD(
                    selectedHOD
                      ? { ...selectedHOD, department: e.target.value }
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
                value={selectedHOD?.email}
                onChange={(e) =>
                  setSelectedHOD(
                    selectedHOD
                      ? { ...selectedHOD, email: e.target.value }
                      : null,
                  )
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-phone">Phone</Label>
              <TextInput
                id="edit-phone"
                value={selectedHOD?.phone}
                onChange={(e) =>
                  setSelectedHOD(
                    selectedHOD
                      ? { ...selectedHOD, phone: e.target.value }
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
                value={selectedHOD?.password || ""}
                onChange={(e) =>
                  setSelectedHOD(
                    selectedHOD
                      ? { ...selectedHOD, password: e.target.value }
                      : null,
                  )
                }
                placeholder="Enter new password"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <Button onClick={handleEditHOD}>Save Changes</Button>
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
            Delete HOD
          </div>
          <p className="mb-6 text-gray-300">
            Are you sure you want to delete this HOD? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-4">
            <Button color="failure" onClick={handleDeleteHOD}>
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
