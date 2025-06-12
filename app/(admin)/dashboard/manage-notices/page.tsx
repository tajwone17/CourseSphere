"use client";

import { Button, TextInput, Label, Modal, Textarea } from "flowbite-react";
import { useState, useEffect } from "react";
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiSpeakerphone,
  HiDocument,
  HiCalendar,
  HiClock,
  HiInformationCircle,
  HiBell,
  HiCheck,
} from "react-icons/hi";
import { useAuth } from "../../../context/AuthContext";
interface NOTICE {
  ID: string;
  TITLE: string;
  DESCRIPTION: string;
  CREATOR_ID: number;
  CREATED_AT: string;
}

interface DEADLINE {
  id: number;
  department_id: number;
  course_registration_without_fine: string;
  course_registration_with_fine: string;
  admit_card_collection: string;
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

  // States for deadlines section
  const [showDeadlinesModal, setShowDeadlinesModal] = useState(false);
  const [deadlines, setDeadlines] = useState<DEADLINE | null>(null);
  const [deadlineForm, setDeadlineForm] = useState({
    course_registration_without_fine: "",
    course_registration_with_fine: "",
    admit_card_collection: "",
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

    // Fetch deadlines if user is HOD
    const fetchDeadlines = async () => {
      if (user && user.departmentId && user.role === "hod") {
        try {
          const response = await fetch("/api/deadlines", {
            headers: { departmentId: user.departmentId },
            credentials: "include",
          });

          if (response.ok) {
            const data = await response.json();
            if (data.deadlines && data.deadlines.length > 0) {
              setDeadlines(data.deadlines[0]);

              // Update the form with fetched values
              setDeadlineForm({
                course_registration_without_fine:
                  data.deadlines[0].course_registration_without_fine || "",
                course_registration_with_fine:
                  data.deadlines[0].course_registration_with_fine || "",
                admit_card_collection:
                  data.deadlines[0].admit_card_collection || "",
              });
            }
          }
        } catch (error) {
          console.error("Error fetching deadlines:", error);
        }
      }
    };

    fetchData();
    fetchDeadlines();
  }, [user]);

  // Handler for updating deadlines
  const handleUpdateDeadlines = async () => {
    if (!user || !user.departmentId) {
      alert(
        "Unable to update deadlines. User or department information is missing.",
      );
      return;
    }

    try {
      const res = await fetch("/api/deadlines/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          department_id: user.departmentId,
          course_registration_without_fine:
            deadlineForm.course_registration_without_fine,
          course_registration_with_fine:
            deadlineForm.course_registration_with_fine,
          admit_card_collection: deadlineForm.admit_card_collection,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error response:", errorText);
        alert(`Error updating deadlines: ${errorText}`);
      } else {
        // Fetch updated deadlines
        const response = await fetch("/api/deadlines", {
          headers: { departmentId: user.departmentId },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.deadlines && data.deadlines.length > 0) {
            setDeadlines(data.deadlines[0]);
          }
        }

        alert("Deadlines updated successfully");
        setShowDeadlinesModal(false);
      }
    } catch (error) {
      console.error("Error updating deadlines:", error);
      alert(`Error updating deadlines: ${error}`);
    }
  };

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
      {" "}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-4xl font-bold text-white">
            <span className="rounded-lg bg-[#92e3a9] p-2">
              <HiSpeakerphone className="h-8 w-8 text-gray-900" />
            </span>
            Manage Notices
          </h1>{" "}
          <p className="mt-4 flex items-center gap-2 text-lg text-gray-400">
            <HiInformationCircle className="text-[#92e3a9]" />
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
              {" "}
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  <HiDocument className="mr-2 inline text-[#92e3a9] group-hover:scale-110" />{" "}
                  Title
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  <HiCalendar className="mr-2 inline text-[#92e3a9] group-hover:scale-110" />{" "}
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  <HiClock className="mr-2 inline text-[#92e3a9] group-hover:scale-110" />{" "}
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
                  {" "}
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    <div className="flex items-center gap-2">
                      {notice.TITLE}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                    <div className="flex items-center gap-2">
                      {new Date(notice.CREATED_AT).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      {" "}
                      <Button
                        style={{ backgroundColor: "#f59e0b", color: "#ffffff" }}
                        size="xs"
                        onClick={() => {
                          setSelectedNotice(notice);
                          setShowEditModal(true);
                        }}
                        className="flex items-center gap-1 px-3 py-1 transition-transform hover:scale-105"
                        title="Edit Notice"
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
                        className="flex items-center gap-1 px-3 py-1 transition-transform hover:scale-105"
                        title="Delete Notice"
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
      {/* Add Notice Modal */}{" "}
      <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="relative bg-gray-800 p-4">
          <div className="mb-6 text-center">
            <div className="bg-opacity-20 bg-gray mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full">
              <HiBell className="h-10 w-10 text-[#92e3a9]" />
            </div>
            <div className="text-xl font-semibold text-white">
              Add New Notice
            </div>
          </div>
          <div className="space-y-4">
            {" "}
            <div>
              <Label htmlFor="title" className="mb-1 flex items-center gap-2">
                <HiDocument className="text-[#92e3a9]" />
                Title
              </Label>
              <TextInput
                id="title"
                value={newNotice.title}
                onChange={(e) =>
                  setNewNotice({ ...newNotice, title: e.target.value })
                }
                placeholder="Enter notice title"
              />
            </div>{" "}
            <div>
              <Label
                htmlFor="description"
                className="mb-1 flex items-center gap-2"
              >
                <HiInformationCircle className="text-[#92e3a9]" />
                Description
              </Label>
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
              className="flex items-center gap-2 transition-transform hover:scale-105"
            >
              <HiPlus className="h-4 w-4" />
              Add Notice
            </Button>{" "}
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
      {/* Edit Notice Modal */}{" "}
      <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
        <div className="relative bg-gray-800 p-4">
          <div className="mb-6 text-center">
            <div className="bg-opacity-20 bg-gray mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full">
              <HiPencil className="h-10 w-10 text-[#92e3a9]" />
            </div>
            <div className="text-xl font-semibold text-white">Edit Notice</div>
          </div>
          <div className="space-y-4">
            {" "}
            <div>
              <Label
                htmlFor="edit-title"
                className="mb-1 flex items-center gap-2"
              >
                <HiDocument className="text-[#92e3a9]" />
                Title
              </Label>
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
            </div>{" "}
            <div>
              <Label
                htmlFor="edit-description"
                className="mb-1 flex items-center gap-2"
              >
                <HiInformationCircle className="text-[#92e3a9]" />
                Description
              </Label>
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
              className="flex items-center gap-2 transition-transform hover:scale-105"
            >
              <HiCheck className="h-4 w-4" />
              Save Changes
            </Button>{" "}
            <Button
              color="gray"
              onClick={() => setShowEditModal(false)}
              className="transition-transform hover:scale-105"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
      {/* Delete Confirmation Modal */}{" "}
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="relative bg-gray-800 p-4">
          <div className="mb-6 text-center">
            <div className="bg-opacity-20 bg-gray mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full">
              <HiTrash className="h-10 w-10 text-red-500" />
            </div>
            <div className="text-xl font-semibold text-white">
              Delete Notice
            </div>
          </div>
          <p className="mb-6 text-gray-300">
            Are you sure you want to delete this notice? This action cannot be
            undone.
          </p>{" "}
          <div className="flex justify-end gap-4">
            <Button
              color="failure"
              onClick={handleDeleteNotice}
              className="flex items-center gap-2 transition-transform hover:scale-105"
            >
              <HiTrash className="h-4 w-4" />
              Delete
            </Button>
            <Button
              color="gray"
              onClick={() => setShowDeleteModal(false)}
              className="transition-transform hover:scale-105"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
      {/* Deadlines Section - Only visible to HOD users */}
      {user && user.role === "hod" && (
        <div className="mt-12">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="flex items-center gap-3 text-4xl font-bold text-white">
                <span className="rounded-lg bg-[#f59e0b] p-2">
                  <HiCalendar className="h-8 w-8 text-gray-900" />
                </span>
                Important Deadlines
              </h1>
              <p className="mt-4 flex items-center gap-2 text-lg text-gray-400">
                <HiInformationCircle className="text-[#f59e0b]" />
                Manage important deadlines for students
              </p>
            </div>

            <Button
              style={{
                backgroundColor: "#f59e0b",
                color: "#000000",
                marginTop: "20px",
                width: "fit-content",
                cursor: "pointer",
              }}
              onClick={() => setShowDeadlinesModal(true)}
              className="flex items-center gap-2 text-gray-900 transition-all duration-200 hover:bg-[#e39008]"
            >
              <HiPencil className="h-5 w-5" />
              Update Deadlines
            </Button>
          </div>

          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      <HiDocument className="mr-2 inline text-[#f59e0b]" />{" "}
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      <HiCalendar className="mr-2 inline text-[#f59e0b]" />{" "}
                      Deadline
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  <tr className="bg-gray-900 transition-colors hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      Course Registration Without Fine
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                      {deadlines?.course_registration_without_fine
                        ? new Date(
                            deadlines.course_registration_without_fine,
                          ).toLocaleDateString()
                        : "Not set"}
                    </td>
                  </tr>
                  <tr className="bg-gray-900 transition-colors hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      Course Registration With Fine
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                      {deadlines?.course_registration_with_fine
                        ? new Date(
                            deadlines.course_registration_with_fine,
                          ).toLocaleDateString()
                        : "Not set"}
                    </td>
                  </tr>
                  <tr className="bg-gray-900 transition-colors hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      Admit Card Collection
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                      {deadlines?.admit_card_collection
                        ? new Date(
                            deadlines.admit_card_collection,
                          ).toLocaleDateString()
                        : "Not set"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* Update Deadlines Modal - HOD only */}
      <Modal
        show={showDeadlinesModal}
        onClose={() => setShowDeadlinesModal(false)}
      >
        <div className="relative bg-gray-800 p-4">
          <div className="mb-6 text-center">
            <div className="bg-opacity-20 bg-gray mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full">
              <HiCalendar className="h-10 w-10 text-[#f59e0b]" />
            </div>
            <div className="text-xl font-semibold text-white">
              Update Important Deadlines
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label
                htmlFor="course-reg-no-fine"
                className="mb-1 flex items-center gap-2"
              >
                <HiCalendar className="text-[#f59e0b]" />
                Course Registration Without Fine
              </Label>
              <TextInput
                id="course-reg-no-fine"
                type="date"
                value={deadlineForm.course_registration_without_fine}
                onChange={(e) =>
                  setDeadlineForm({
                    ...deadlineForm,
                    course_registration_without_fine: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label
                htmlFor="course-reg-with-fine"
                className="mb-1 flex items-center gap-2"
              >
                <HiCalendar className="text-[#f59e0b]" />
                Course Registration With Fine
              </Label>
              <TextInput
                id="course-reg-with-fine"
                type="date"
                value={deadlineForm.course_registration_with_fine}
                onChange={(e) =>
                  setDeadlineForm({
                    ...deadlineForm,
                    course_registration_with_fine: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label
                htmlFor="admit-card"
                className="mb-1 flex items-center gap-2"
              >
                <HiCalendar className="text-[#f59e0b]" />
                Admit Card Collection
              </Label>
              <TextInput
                id="admit-card"
                type="date"
                value={deadlineForm.admit_card_collection}
                onChange={(e) =>
                  setDeadlineForm({
                    ...deadlineForm,
                    admit_card_collection: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <Button
              style={{
                backgroundColor: "#f59e0b",
                color: "black",
                width: "fit-content",
                cursor: "pointer",
              }}
              onClick={handleUpdateDeadlines}
              className="flex items-center gap-2 transition-transform hover:scale-105"
            >
              <HiCheck className="h-4 w-4" />
              Save Changes
            </Button>{" "}
            <Button
              color="gray"
              onClick={() => setShowDeadlinesModal(false)}
              className="transition-transform hover:scale-105"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
