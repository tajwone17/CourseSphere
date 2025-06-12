"use client";

import { Button, TextInput, Label, Modal, Textarea } from "flowbite-react";
import { useState, useEffect } from "react";
import { HiPlus, HiPencil, HiTrash } from "react-icons/hi";
import { useAuth } from "../../../context/AuthContext";
interface NOTICE {
  ID: string;
  TITLE: string;
  DESCRIPTION: string;
  CREATOR_ID: number;
  CREATED_AT: string;
}

export default function ManageNotices() {
  const [notices, setNotices] = useState<NOTICE[]>([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<NOTICE | null>(null);
  const [newNotice, setNewNotice] = useState({
    title: "",
    description: "",
  });
  const { user } = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      if (user && user.id) {
        const response = await fetch("/api/notices", {
          headers: { creatorId: user.id },
          credentials: "include",
        });
        const data = await response.json();
        
        setNotices(data.notices);
      
      }
    };
    fetchData();
  }, [user]);
  const handleAddNotice = async () => {
    const noticeData = {
      title: newNotice.title,
      description: newNotice.description,
      creatorId: user.id,
      date: new Date().toISOString().split("T")[0],
    };

    if (!noticeData.title || !noticeData.description) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch("/api/notices/add-notice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(noticeData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        const errorMsg = errorText.split("\n")[0];
        console.log("Error response:", errorText);
        alert(` ${errorMsg}`);
        throw new Error(errorMsg);
      } else {
        // Fetch updated list after successful addition
        const response = await fetch("/api/notices", {
          headers: { creatorId: user.id },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setNotices(data.notices);
        }
        alert("Notice added successfully");
        console.log("New notice added successfully");

        setNewNotice({
          title: "",
          description: "",
        });
        setShowAddModal(false);
      }
    } catch (error) {
      console.log("Error adding notice:", error);
    }
  };
  const handleEditNotice = async (id: string) => {
    if (!selectedNotice) return;

    try {
      const res = await fetch(`/api/notices/edit-notice/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: selectedNotice.TITLE,
          description: selectedNotice.DESCRIPTION,
          date: new Date().toISOString().split("T")[0],
          creatorId: user.id,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        const errorMsg = errorText.split("\n")[0];
        console.log("Error response:", errorText);
        alert(` ${errorMsg}`);
        throw new Error(errorMsg);
      } else {
        // Fetch updated list after successful edit
        const response = await fetch("/api/notices", {
          headers: { creatorId: user.id },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setNotices(data.notices);
        }
        alert("Notice updated successfully");
        console.log("Notice updated successfully");
      }
    } catch (error) {
      console.log("Error updating notice:", error);
    }

    setShowEditModal(false);
  };
  const handleDeleteNotice = async () => {
    if (!selectedNotice) return;

    try {
      const res = await fetch(
        `/api/notices/delete-notice/${selectedNotice.ID}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );

      if (!res.ok) {
        const errorText = await res.text();
        const errorMsg = errorText.split("\n")[0];
        console.log("Error response:", errorText);
        alert(` ${errorMsg}`);
        throw new Error(errorMsg);
      } else {
        // Fetch updated list after successful deletion
        const response = await fetch("/api/notices", {
          headers: { creatorId: user.id },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setNotices(data);
        }
        alert("Notice deleted successfully");
        console.log("Notice deleted successfully");
      }
    } catch (error) {
      console.log("Error deleting notice:", error);
    }

    setShowDeleteModal(false);
  };

  return (
    <div
      className="mx-auto max-w-7xl p-8"
      data-aos="zoom-in"
      data-aos-duration="1000"
    >
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
                  key={notice.ID}
                  className="bg-gray-900 transition-colors hover:bg-gray-800"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {notice.TITLE}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                    {new Date(notice.CREATED_AT).toLocaleString()}
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
                value={selectedNotice?.TITLE}
                onChange={(e) =>
                  setSelectedNotice(
                    selectedNotice
                      ? { ...selectedNotice, TITLE: e.target.value }
                      : null,
                  )
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={selectedNotice?.DESCRIPTION}
                onChange={(e) =>
                  setSelectedNotice(
                    selectedNotice
                      ? { ...selectedNotice, DESCRIPTION: e.target.value }
                      : null,
                  )
                }
                rows={4}
              />
            </div>
          </div>{" "}
          <div className="mt-6 flex justify-end gap-4">
            <Button
              style={{
                backgroundColor: "#92e3a9",
                color: "black",
                width: "fit-content",
                cursor: "pointer",
              }}
              onClick={() =>
                selectedNotice && handleEditNotice(selectedNotice.ID)
              }
            >
              Save Changes
            </Button>
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
