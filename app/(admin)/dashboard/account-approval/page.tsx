"use client";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "flowbite-react";
import { useAuth } from "../../../context/AuthContext";
import {
  HiCheck,
  HiX,
  HiUser,
  HiIdentification,
  HiMail,
  HiStatusOnline,
} from "react-icons/hi";

interface PendingAccount {
  ID: number;
  NAME: string;
  REGISTRATION_NUMBER: string;
  EMAIL: string;
  ROLE: string;
  CREATED_AT: string;
  STATUS: number;
}

export default function AccountApproval() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<PendingAccount[]>([]);
  const [status, setStatus] = useState<"active" | "inactive">("inactive");

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await fetch("/api/students", {
          headers: {
            departmentid: user?.departmentId ? String(user.departmentId) : "",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }
        const data = await response.json();
        setAccounts(data.students);
        console.log("Fetched students:", data.students);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error("Error fetching students:", errorMessage);
      }
    }

    fetchStudents();
  }, [user?.departmentId]);

  const [searchName, setSearchName] = useState("");
  const [searchRegNum, setSearchRegNum] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchStatus, setSearchStatus] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<PendingAccount | null>(
    null,
  );

  const openModal = (acc: PendingAccount, action: "active" | "inactive") => {
    setSelectedAccount(acc);
    setStatus(action);
    setShowModal(true);
  };

  const confirmAction = async () => {
    if (selectedAccount) {
      try {
        // Update local state
        setAccounts((prev) =>
          prev.map((acc) =>
            acc.ID === selectedAccount.ID
              ? { ...acc, STATUS: status === "active" ? 1 : 0 }
              : acc,
          ),
        );

        // Make API call to update status in the database
        const response = await fetch(
          `/api/account-status/student/${selectedAccount.ID}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: status === "active" ? 1 : 0,
            }),
          },
        );

        if (!response.ok) {
          console.error("Failed to update account status");
          // You could add error handling UI here
        }
      } catch (error) {
        console.error("Error updating account status:", error);
        // You could add error handling UI here
      }
    }
    setShowModal(false);
  };
  const filteredAccounts = accounts.filter((acc) => {
    // Name filter
    const nameMatch =
      !searchName || acc.NAME.toLowerCase().includes(searchName.toLowerCase());

    // Registration number filter
    const regNumMatch =
      !searchRegNum ||
      (acc.REGISTRATION_NUMBER &&
        acc.REGISTRATION_NUMBER.toLowerCase().includes(
          searchRegNum.toLowerCase(),
        ));

    // Email filter
    const emailMatch =
      !searchEmail ||
      acc.EMAIL.toLowerCase().includes(searchEmail.toLowerCase());

    // Status filter
    const statusMatch =
      !searchStatus ||
      (searchStatus === "active" && acc.STATUS === 1) ||
      (searchStatus === "inactive" && acc.STATUS === 0);

    return nameMatch && regNumMatch && emailMatch && statusMatch;
  });

  return (
    <div
      className="mx-auto max-w-5xl px-3 py-4 sm:px-6 md:p-8"
      data-aos="zoom-in"
      data-aos-duration="1000"
    >
      <h1 className="mb-4 flex items-center gap-2 text-xl font-bold text-white sm:mb-6 sm:gap-3 sm:text-3xl md:mb-8 md:text-4xl">
        <span className="rounded-lg bg-[#92e3a9] p-1 sm:p-2">
          <HiStatusOnline className="h-5 w-5 text-gray-900 sm:h-6 sm:w-6 md:h-8 md:w-8" />
        </span>
        Account Activation
      </h1>

      <div className="xs:grid-cols-2 mb-4 grid grid-cols-1 gap-3 sm:mb-6 sm:gap-4 md:grid-cols-4">
        <div className="relative">
          <input
            type="text"
            className="w-full rounded border border-gray-700 bg-gray-800 py-1.5 pr-4 pl-9 text-sm text-white placeholder-gray-400 focus:border-[#92e3a9] focus:outline-none sm:py-2 sm:pl-10 sm:text-base"
            placeholder="Search by name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <div className="absolute top-0 left-0 flex h-full items-center pl-2.5 sm:pl-3">
            <HiUser className="h-4 w-4 text-[#92e3a9] sm:h-5 sm:w-5" />
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            className="w-full rounded border border-gray-700 bg-gray-800 py-1.5 pr-4 pl-9 text-sm text-white placeholder-gray-400 focus:border-[#92e3a9] focus:outline-none sm:py-2 sm:pl-10 sm:text-base"
            placeholder="Search by reg. number"
            value={searchRegNum}
            onChange={(e) => setSearchRegNum(e.target.value)}
          />
          <div className="absolute top-0 left-0 flex h-full items-center pl-2.5 sm:pl-3">
            <HiIdentification className="h-4 w-4 text-[#92e3a9] sm:h-5 sm:w-5" />
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            className="w-full rounded border border-gray-700 bg-gray-800 py-1.5 pr-4 pl-9 text-sm text-white placeholder-gray-400 focus:border-[#92e3a9] focus:outline-none sm:py-2 sm:pl-10 sm:text-base"
            placeholder="Search by email"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
          />
          <div className="absolute top-0 left-0 flex h-full items-center pl-2.5 sm:pl-3">
            <HiMail className="h-4 w-4 text-[#92e3a9] sm:h-5 sm:w-5" />
          </div>
        </div>
        <div className="relative">
          <select
            className="w-full appearance-none rounded border border-gray-700 bg-gray-800 px-9 py-1.5 text-sm text-white placeholder-gray-400 focus:border-[#92e3a9] focus:outline-none sm:px-10 sm:py-2 sm:text-base"
            value={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div className="absolute top-0 left-0 flex h-full items-center pl-2.5 sm:pl-3">
            <HiStatusOnline className="h-4 w-4 text-[#92e3a9] sm:h-5 sm:w-5" />
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 sm:px-3">
            <svg
              className="h-2.5 w-2.5 fill-current text-[#92e3a9] sm:h-3 sm:w-3"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase sm:px-4 sm:py-3 md:px-6 md:py-3">
                <HiUser className="mr-1 inline h-3 w-3 text-[#92e3a9] group-hover:scale-110 sm:mr-2 sm:h-auto sm:w-auto" />{" "}
                Name
              </th>
              <th className="hidden px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase sm:table-cell sm:px-4 sm:py-3 md:px-6 md:py-3">
                <HiIdentification className="mr-1 inline h-3 w-3 text-[#92e3a9] group-hover:scale-110 sm:mr-2 sm:h-auto sm:w-auto" />{" "}
                Registration
              </th>
              <th className="hidden px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase sm:px-4 sm:py-3 md:table-cell md:px-6 md:py-3">
                <HiMail className="mr-1 inline h-3 w-3 text-[#92e3a9] group-hover:scale-110 sm:mr-2 sm:h-auto sm:w-auto" />{" "}
                Email
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-400 uppercase sm:px-4 sm:py-3 sm:text-left md:px-6 md:py-3">
                <HiStatusOnline className="mr-1 inline h-3 w-3 text-[#92e3a9] group-hover:scale-110 sm:mr-2 sm:h-auto sm:w-auto" />{" "}
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 bg-gray-900">
            {filteredAccounts.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-2 py-4 text-center text-xs text-gray-400 sm:px-6 sm:text-sm"
                >
                  No accounts found.
                </td>
              </tr>
            )}
            {filteredAccounts.map((acc) => (
              <tr key={acc.ID} className="hover:bg-gray-800">
                <td className="max-w-[100px] truncate px-2 py-2 text-xs whitespace-nowrap text-white sm:max-w-[200px] sm:px-4 sm:py-3 sm:text-sm md:px-6 md:py-4">
                  {acc.NAME}
                </td>
                <td className="hidden max-w-[120px] truncate px-2 py-2 text-xs whitespace-nowrap text-white sm:table-cell sm:px-4 sm:py-3 sm:text-sm md:max-w-[150px] md:px-6 md:py-4">
                  {acc.REGISTRATION_NUMBER || "N/A"}
                </td>
                <td className="hidden max-w-[150px] truncate px-2 py-2 text-xs whitespace-nowrap text-white sm:px-4 sm:py-3 sm:text-sm md:table-cell md:px-6 md:py-4 lg:max-w-none">
                  {acc.EMAIL}
                </td>
                <td className="px-2 py-2 text-center whitespace-nowrap sm:px-4 sm:py-3 sm:text-left md:px-6 md:py-4">
                  {acc.STATUS === 0 ? (
                    <Button
                      size="xs"
                      style={{ backgroundColor: "#22c55e", color: "#fff" }}
                      onClick={() => openModal(acc, "active")}
                      className="flex items-center gap-0.5 px-2 py-1 text-xs transition-transform hover:scale-105 sm:gap-1 sm:px-3"
                    >
                      <HiCheck className="h-3 w-3 text-white sm:h-4 sm:w-4" />
                      <span className="xs:inline hidden">Activate</span>
                      <span className="xs:hidden">Act</span>
                    </Button>
                  ) : (
                    <Button
                      size="xs"
                      style={{ backgroundColor: "#ef4444", color: "#fff" }}
                      onClick={() => openModal(acc, "inactive")}
                      className="flex items-center gap-0.5 px-2 py-1 text-xs transition-transform hover:scale-105 sm:gap-1 sm:px-3"
                    >
                      <HiX className="h-3 w-3 text-white sm:h-4 sm:w-4" />
                      <span className="xs:inline hidden">Deactivate</span>
                      <span className="xs:hidden">Deact</span>
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      <Modal show={showModal} size="md" onClose={() => setShowModal(false)}>
        <div className="p-4 text-center sm:p-6">
          {status === "active" ? (
            <HiStatusOnline className="mx-auto mb-3 h-10 w-10 text-green-500 sm:mb-4 sm:h-14 sm:w-14" />
          ) : (
            <HiX className="mx-auto mb-3 h-10 w-10 text-red-500 sm:mb-4 sm:h-14 sm:w-14" />
          )}
          <h3 className="mb-4 text-base font-normal text-gray-300 sm:mb-5 sm:text-lg">
            Are you sure you want to{" "}
            <span className="font-semibold text-white">{status}</span> the
            account of{" "}
            <span className="font-semibold text-white">
              {selectedAccount?.NAME}
            </span>
            ?
          </h3>
          <div className="flex justify-center gap-3 sm:gap-4">
            <Button
              color={status === "active" ? "success" : "failure"}
              onClick={confirmAction}
              className="flex items-center gap-1 text-xs sm:gap-2 sm:text-sm"
            >
              {status === "active" ? (
                <HiCheck className="h-3 w-3 text-white sm:h-4 sm:w-4" />
              ) : (
                <HiX className="h-3 w-3 text-white sm:h-4 sm:w-4" />
              )}
              Yes, {status}
            </Button>
            <Button
              color="gray"
              onClick={() => setShowModal(false)}
              className="text-xs sm:text-sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
