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
        className="w-full rounded-2xl bg-gray-900 p-12 shadow-2xl"
        data-aos="zoom-in"
        data-aos-delay="400"
      >
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="flex h-21 w-21 items-center justify-center rounded-full border border-[#92e3a9]">
            <HiUser className="text-6xl text-[#92e3a9]" />
          </div>

          <div className="flex items-center gap-2 text-2xl font-bold text-white">
            <HiIdentification className="text-[#92e3a9]" /> {userProfile.name}
          </div>
          {userProfile.role != "admin" && (
            <div className="flex items-center gap-2 text-lg text-gray-400">
              <HiOfficeBuilding className="text-[#92e3a9]" />{" "}
              {userProfile.department}
            </div>
          )}
          {userProfile.role == "student" && (
            <div className="flex items-center gap-2 text-base text-gray-400">
              <HiIdentification className="text-[#92e3a9]" /> ID:{" "}
              {userProfile.id}
            </div>
          )}
        </div>
        {isAuthenticated ? (
          <form className="space-y-7">
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
              className={`w-full space-y-7 ${
                editMode ? "opacity-100" : "cursor-not-allowed opacity-50"
              }`}
            >
              <div>
                <label className="mb-1 block text-gray-400" htmlFor="email">
                  Email
                </label>
                <div className="flex items-center gap-2">
                  <HiMail className="text-[#92e3a9]" />
                  <input
                    id="email"
                    type="email"
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-[#92e3a9] focus:ring-[#92e3a9]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={true} // Email is not editable
                    readOnly
                  />
                </div>
              </div>
              <div>
                <label
                  className="mb-1 block text-gray-400"
                  htmlFor="current-password"
                >
                  Current Password
                </label>
                <div className="flex items-center gap-2">
                  <HiLockClosed className="text-[#92e3a9]" />
                  <input
                    id="current-password"
                    type="password"
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-[#92e3a9] focus:ring-[#92e3a9]"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Current password"
                    disabled={!editMode}
                  />
                </div>
              </div>
              <div>
                <label
                  className="mb-1 block text-gray-400"
                  htmlFor="new-password"
                >
                  New Password
                </label>
                <div className="flex items-center gap-2">
                  <HiLockClosed className="text-[#92e3a9]" />
                  <input
                    id="new-password"
                    type="password"
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-[#92e3a9] focus:ring-[#92e3a9]"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    disabled={!editMode}
                  />
                </div>
              </div>
              <div>
                <label
                  className="mb-1 block text-gray-400"
                  htmlFor="confirm-password"
                >
                  Confirm Password
                </label>
                <div className="flex items-center gap-2">
                  <HiLockClosed className="text-[#92e3a9]" />
                  <input
                    id="confirm-password"
                    type="password"
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-[#92e3a9] focus:ring-[#92e3a9]"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    disabled={!editMode}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              {editMode ? (
                <>
                  <Button
                    style={{ backgroundColor: "#92e3a9", color: "#000" }}
                    onClick={handleSave}
                    disabled={saving}
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
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  style={{ backgroundColor: "#92e3a9", color: "#000" }}
                  onClick={() => setEditMode(true)}
                >
                  Change Password
                </Button>
              )}
              <Button color="gray" onClick={handleClose}>
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
