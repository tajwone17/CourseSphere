"use client";

import React, { useState } from "react";
import { Modal, Button } from "flowbite-react";
import {
  HiUser,
  HiMail,
  HiOfficeBuilding,
  HiIdentification,
} from "react-icons/hi";
import { HiLockClosed } from "react-icons/hi2";
import Image from "next/image";

// import { useAuth } from "../context/AuthContext";


export default function ProfileModal({
  onClose: handleClose,
}: {
  onClose: () => void;
}) {
  // const { user, isAuthenticated } = useAuth();
  const isAuthenticated = true; //TODO: Replace with actual authentication check
  const user = {
    email: "tajwone@example.com",
  };
  const userEmail = user?.email || "";

  // Mocked user data for demo
  const userProfile = {
    avatar: "https://avatars.githubusercontent.com/u/139250082?v=4",
    name: "Tajwone Chowdhury",
    department: "Computer Science Engineering",
    id: "0562310005101031",
  };

  // Editable fields
  const [email, setEmail] = useState(userEmail || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleSave = () => {
    setPasswordError("");
    if (editMode) {
      if (newPassword !== confirmPassword) {
        setPasswordError("New password and confirm password do not match.");
        return;
      }
      // Optionally, check currentPassword validity here
    }
    setSaving(true);
    // Only email is persisted in AuthContext
    localStorage.setItem("userEmail", email);
    setTimeout(() => {
      setSaving(false);
      setEditMode(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 700);
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
          <Image
            src={userProfile.avatar}
            alt="Avatar"
            width={120}
            height={120}
            className="h-32 w-32 rounded-full border-4 border-[#92e3a9] object-cover shadow-lg"
            unoptimized
          />
          <div className="flex items-center gap-2 text-2xl font-bold text-white">
            <HiUser className="text-[#92e3a9]" /> {userProfile.name}
          </div>
          <div className="flex items-center gap-2 text-lg text-gray-400">
            <HiOfficeBuilding className="text-[#92e3a9]" />{" "}
            {userProfile.department}
          </div>
          <div className="flex items-center gap-2 text-base text-gray-400">
            <HiIdentification className="text-[#92e3a9]" /> ID: {userProfile.id}
          </div>
        </div>
        {isAuthenticated ? (
          <form className="space-y-7">
            <div
              className={`w-full space-y-7 ${editMode ? "opacity-100" : "cursor-not-allowed opacity-50"}`}
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
                    disabled={!editMode}
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

            {passwordError && (
              <div className="mt-1 text-sm text-red-500">{passwordError}</div>
            )}
            <div className="mt-8 flex justify-end gap-4">
              {editMode ? (
                <>
                  <Button
                    style={{ backgroundColor: "#92e3a9", color: "#000" }}
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save"}
                  </Button>
                  <Button color="gray" onClick={() => setEditMode(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  style={{ backgroundColor: "#92e3a9", color: "#000" }}
                  onClick={() => setEditMode(true)}
                >
                  Edit
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
