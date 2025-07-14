"use client";

import React, { useState } from "react";
import { Modal, Button, Spinner, Alert } from "flowbite-react";
import {
  HiUser,
  HiMail,
  HiOfficeBuilding,
  HiIdentification,
  HiExclamationCircle,
  HiCheckCircle,
} from "react-icons/hi";
import { HiLockClosed } from "react-icons/hi2";
// import Image from "next/image";

import { useAuth } from "../context/AuthContext";

export default function ProfileModal({
  onClose: handleClose,
}: {
  onClose: () => void;
}) {
  const { user, isAuthenticated } = useAuth();
  // const isAuthenticated = true; //TODO: Replace with actual authentication check

  const userEmail = user?.email || "";

  const userProfile = {
    name: user?.name || "",

    department: user?.department?.name || "",
    id: user?.registration_number || "",
    role: user?.role || "",
  };

  // Editable fields
  const [email, setEmail] = useState(userEmail || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSave = async () => {
    setPasswordError("");
    setSuccessMessage("");

    if (editMode) {
      // Validate password
      if (newPassword && newPassword !== confirmPassword) {
        setPasswordError("New password and confirm password do not match.");
        return;
      }

      if (newPassword && newPassword.length < 8) {
        setPasswordError("New password must be at least 8 characters long.");
        return;
      }

      if (newPassword && !currentPassword) {
        setPasswordError("Current password is required to change password.");
        return;
      }

      setSaving(true);

      // Only update password if a new password was entered
      if (newPassword && currentPassword) {
        try {
          const response = await fetch("/api/change-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: userEmail,
              role: userProfile.role,
              currentPassword,
              newPassword,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Failed to change password");
          }

          setSuccessMessage("Password changed successfully");
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Something went wrong";
          setPasswordError(errorMessage);
          setSaving(false);
          return;
        }
      }

      // Reset the form
      setTimeout(() => {
        setSaving(false);
        setEditMode(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }, 700);
    } else {
      setEditMode(true);
    }
  };

  return (
    <Modal
      show={true}
      onClose={handleClose}
      size="xl"
      className="overflow-hidden"
    >
      <div
        className="w-full rounded-2xl bg-gray-900 p-4 shadow-2xl sm:p-6 md:p-8 lg:p-12"
        data-aos="zoom-in"
        data-aos-delay="400"
      >
        <div className="mb-4 flex flex-col items-center gap-2 sm:mb-6 sm:gap-3 md:mb-8 md:gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#92e3a9] sm:h-18 sm:w-18 md:h-21 md:w-21">
            <HiUser className="text-4xl text-[#92e3a9] sm:text-5xl md:text-6xl" />
          </div>

          <div className="flex items-center gap-2 text-center text-xl font-bold text-white sm:text-2xl">
            <HiIdentification className="text-[#92e3a9]" />{" "}
            <span className="break-all">{userProfile.name}</span>
          </div>
          {userProfile.role != "admin" &&
            userProfile.role != "exam_controller" && (
              <div className="flex items-center gap-2 text-center text-base text-gray-400 sm:text-lg">
                <HiOfficeBuilding className="flex-shrink-0 text-[#92e3a9]" />
                <span className="break-all">{userProfile.department}</span>
              </div>
            )}
          {userProfile.role == "student" && (
            <div className="flex items-center gap-2 text-sm text-gray-400 sm:text-base">
              <HiIdentification className="flex-shrink-0 text-[#92e3a9]" /> ID:{" "}
              <span className="break-all">{userProfile.id}</span>
            </div>
          )}
        </div>
        {isAuthenticated ? (
          <form className="space-y-4 sm:space-y-5 md:space-y-7">
            {successMessage && (
              <Alert color="success" icon={HiCheckCircle}>
                {successMessage}
              </Alert>
            )}

            {passwordError && (
              <Alert color="failure" icon={HiExclamationCircle}>
                {passwordError}
              </Alert>
            )}

            <div
              className={`w-full space-y-4 sm:space-y-5 md:space-y-7 ${
                editMode ? "opacity-100" : "cursor-not-allowed opacity-50"
              }`}
            >
              <div>
                <label
                  className="mb-1 block text-sm text-gray-400 sm:text-base"
                  htmlFor="email"
                >
                  Email
                </label>
                <div className="flex items-center gap-2">
                  <HiMail className="flex-shrink-0 text-[#92e3a9]" />
                  <input
                    id="email"
                    type="email"
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-2 py-1 text-sm text-white focus:border-[#92e3a9] focus:ring-[#92e3a9] sm:px-3 sm:py-2 sm:text-base"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={true} // Email is not editable
                    readOnly
                  />
                </div>
              </div>
              <div>
                <label
                  className="mb-1 block text-sm text-gray-400 sm:text-base"
                  htmlFor="current-password"
                >
                  Current Password
                </label>
                <div className="flex items-center gap-2">
                  <HiLockClosed className="flex-shrink-0 text-[#92e3a9]" />
                  <input
                    id="current-password"
                    type="password"
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-2 py-1 text-sm text-white focus:border-[#92e3a9] focus:ring-[#92e3a9] sm:px-3 sm:py-2 sm:text-base"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Current password"
                    disabled={!editMode}
                  />
                </div>
              </div>
              <div>
                <label
                  className="mb-1 block text-sm text-gray-400 sm:text-base"
                  htmlFor="new-password"
                >
                  New Password
                </label>
                <div className="flex items-center gap-2">
                  <HiLockClosed className="flex-shrink-0 text-[#92e3a9]" />
                  <input
                    id="new-password"
                    type="password"
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-2 py-1 text-sm text-white focus:border-[#92e3a9] focus:ring-[#92e3a9] sm:px-3 sm:py-2 sm:text-base"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    disabled={!editMode}
                  />
                </div>
              </div>
              <div>
                <label
                  className="mb-1 block text-sm text-gray-400 sm:text-base"
                  htmlFor="confirm-password"
                >
                  Confirm Password
                </label>
                <div className="flex items-center gap-2">
                  <HiLockClosed className="flex-shrink-0 text-[#92e3a9]" />
                  <input
                    id="confirm-password"
                    type="password"
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-2 py-1 text-sm text-white focus:border-[#92e3a9] focus:ring-[#92e3a9] sm:px-3 sm:py-2 sm:text-base"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    disabled={!editMode}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col justify-end gap-2 sm:mt-6 sm:flex-row sm:gap-4 md:mt-8">
              {editMode ? (
                <>
                  <Button
                    style={{ backgroundColor: "#92e3a9", color: "#000" }}
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full sm:w-auto"
                  >
                    {saving ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Saving...
                      </>
                    ) : (
                      "Save"
                    )}
                  </Button>
                  <Button
                    color="gray"
                    onClick={() => {
                      setEditMode(false);
                      setPasswordError("");
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  style={{ backgroundColor: "#92e3a9", color: "#000" }}
                  onClick={() => setEditMode(true)}
                  className="w-full sm:w-auto"
                >
                  Change Password
                </Button>
              )}
              <Button
                color="gray"
                onClick={handleClose}
                className="w-full sm:w-auto"
              >
                Close
              </Button>
            </div>
          </form>
        ) : (
          <div className="mb-4 text-center text-red-500">Not signed in</div>
        )}
      </div>
    </Modal>
  );
}
