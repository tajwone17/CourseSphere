"use client";

import { Button, TextInput, Label, Modal, Textarea } from "flowbite-react";
import { useState } from "react";
import { HiPlus, HiPencil, HiTrash } from "react-icons/hi";

interface Notice {
  id: number;
  title: string;
  description: string;


  createdBy: string;
  createdAt: string;
}

export default function ManageNotices() {
  const [notices, setNotices] = useState<Notice[]>([
    {
      id: 1,
      title: "Fall 2024 Course Registration",
      description:
        "Course registration for Fall 2024 semester is now open. Please complete your registration by the deadline.",
      
    
      createdBy: "Dr. Tajwone",
      createdAt: "2024-04-23",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [newNotice, setNewNotice] = useState({
    title: "",
    description: "",

  });

  const handleAddNotice = () => {
    const id = notices.length + 1;
    const noticeData = {
      ...newNotice,
      id,
      createdBy: "Dr. Tajwone", // This would come from auth context in a real app
      createdAt: new Date().toISOString().split("T")[0],
    };
    setNotices([...notices, noticeData]);
    setShowAddModal(false);
    setNewNotice({
      title: "",
      description: "",
     
    
    });
  };

  const handleEditNotice = () => {
    if (!selectedNotice) return;
    const updatedList = notices.map((notice) =>
      notice.id === selectedNotice.id ? selectedNotice : notice,
    );
    setNotices(updatedList);
    setShowEditModal(false);
  };

  const handleDeleteNotice = () => {
    if (!selectedNotice) return;
    const updatedList = notices.filter(
      (notice) => notice.id !== selectedNotice.id,
    );
    setNotices(updatedList);
    setShowDeleteModal(false);
  };

  return (
    <div className="mx-auto max-w-7xl p-8"      data-aos="zoom-in"
    data-aos-duration="1000">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Manage Notices</h1>
          <p className="mt-4 text-lg text-gray-400">
            Create and manage notices for students
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
          Add New Notice
        </Button>
      </div>

      <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
        {/* Notices Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Title
                </th>
             
             
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Created By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {notices.map((notice) => (
                <tr
                  key={notice.id}
                  className="bg-gray-900 transition-colors hover:bg-gray-800"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {notice.title}
                  </td>
               
               
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {notice.createdBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                    {notice.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <Button
                        style={{ backgroundColor: "#f59e0b", color: "#ffffff" }}
                        size="xs"
                        onClick={() => {
                          setSelectedNotice(notice);
                          setShowEditModal(true);
                        }}
                      >
                        <HiPencil className="h-4 w-4" />
                      </Button>
                      <Button
                        style={{ backgroundColor: "#ef4444", color: "#ffffff" }}
                        size="xs"
                        onClick={() => {
                          setSelectedNotice(notice);
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

      {/* Add Notice Modal */}
      <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="relative bg-gray-800 p-4">
          <div className="mb-4 text-xl font-semibold text-white">
            Add New Notice
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <TextInput
                id="title"
                value={newNotice.title}
                onChange={(e) =>
                  setNewNotice({ ...newNotice, title: e.target.value })
                }
                placeholder="Enter notice title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newNotice.description}
                onChange={(e) =>
                  setNewNotice({ ...newNotice, description: e.target.value })
                }
                placeholder="Enter notice description"
                rows={4}
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
              onClick={handleAddNotice}
            >
              Add Notice
            </Button>
            <Button color="gray" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Notice Modal */}
      <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
        <div className="relative bg-gray-800 p-4">
          <div className="mb-4 text-xl font-semibold text-white">
            Edit Notice
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <TextInput
                id="edit-title"
                value={selectedNotice?.title}
                onChange={(e) =>
                  setSelectedNotice(
                    selectedNotice
                      ? { ...selectedNotice, title: e.target.value }
                      : null,
                  )
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={selectedNotice?.description}
                onChange={(e) =>
                  setSelectedNotice(
                    selectedNotice
                      ? { ...selectedNotice, description: e.target.value }
                      : null,
                  )
                }
                rows={4}
              />
            </div>
         
        
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <Button onClick={handleEditNotice}>Save Changes</Button>
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
            Delete Notice
          </div>
          <p className="mb-6 text-gray-300">
            Are you sure you want to delete this notice? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-4">
            <Button color="failure" onClick={handleDeleteNotice}>
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
