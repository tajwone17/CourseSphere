"use client";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "flowbite-react";
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
  const [accounts, setAccounts] = useState<PendingAccount[]>([]);
  const [status, setStatus] = useState<"active" | "inactive">("inactive");

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await fetch("/api/students");
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
  }, []);

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
      className="mx-auto max-w-5xl p-8"
      data-aos="zoom-in"
      data-aos-duration="1000"
    >
      <h1 className="mb-8 flex items-center gap-3 text-4xl font-bold text-white">
        <span className="rounded-lg bg-[#92e3a9] p-2">
          <HiStatusOnline className="h-8 w-8 text-gray-900" />
        </span>
        Account Activation
      </h1>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <div className="relative">
          <input
            type="text"
            className="w-full rounded border border-gray-700 bg-gray-800 py-2 pr-4 pl-10 text-white placeholder-gray-400 focus:border-[#92e3a9] focus:outline-none"
            placeholder="Search by name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <div className="absolute top-0 left-0 flex h-full items-center pl-3">
            <HiUser className="h-5 w-5 text-[#92e3a9]" />
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            className="w-full rounded border border-gray-700 bg-gray-800 py-2 pr-4 pl-10 text-white placeholder-gray-400 focus:border-[#92e3a9] focus:outline-none"
            placeholder="Search by reg. number"
            value={searchRegNum}
            onChange={(e) => setSearchRegNum(e.target.value)}
          />
          <div className="absolute top-0 left-0 flex h-full items-center pl-3">
            <HiIdentification className="h-5 w-5 text-[#92e3a9]" />
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            className="w-full rounded border border-gray-700 bg-gray-800 py-2 pr-4 pl-10 text-white placeholder-gray-400 focus:border-[#92e3a9] focus:outline-none"
            placeholder="Search by email"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
          />
          <div className="absolute top-0 left-0 flex h-full items-center pl-3">
            <HiMail className="h-5 w-5 text-[#92e3a9]" />
          </div>
        </div>
        <div className="relative">
          <select
            className="w-full appearance-none rounded border border-gray-700 bg-gray-800 px-10 py-2 text-white placeholder-gray-400 focus:border-[#92e3a9] focus:outline-none"
            value={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div className="absolute top-0 left-0 flex h-full items-center pl-3">
            <HiStatusOnline className="h-5 w-5 text-[#92e3a9]" />
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
            <svg
              className="h-3 w-3 fill-current text-[#92e3a9]"
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

      <div className="overflow-x-auto rounded-lg border border-gray-700 lg:overflow-hidden">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                <HiUser className="mr-2 inline text-[#92e3a9] group-hover:scale-110" />{" "}
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                <HiIdentification className="mr-2 inline text-[#92e3a9] group-hover:scale-110" />{" "}
                Registration Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                <HiMail className="mr-2 inline text-[#92e3a9] group-hover:scale-110" />{" "}
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                <HiStatusOnline className="mr-2 inline text-[#92e3a9] group-hover:scale-110" />{" "}
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 bg-gray-900">
            {filteredAccounts.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-400">
                  No accounts found.
                </td>
              </tr>
            )}
            {filteredAccounts.map((acc) => (
              <tr key={acc.ID} className="hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap text-white">
                  {acc.NAME}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-white">
                  {acc.REGISTRATION_NUMBER || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-white">
                  {acc.EMAIL}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {acc.STATUS === 0 ? (
                    <Button
                      size="xs"
                      style={{ backgroundColor: "#22c55e", color: "#fff" }}
                      onClick={() => openModal(acc, "active")}
                      className="flex items-center gap-1 px-3 py-1 transition-transform hover:scale-105"
                    >
                      <HiCheck className="h-4 w-4 text-white" />
                      <span>Activate</span>
                    </Button>
                  ) : (
                    <Button
                      size="xs"
                      style={{ backgroundColor: "#ef4444", color: "#fff" }}
                      onClick={() => openModal(acc, "inactive")}
                      className="flex items-center gap-1 px-3 py-1 transition-transform hover:scale-105"
                    >
                      <HiX className="h-4 w-4 text-white" />
                      <span>Deactivate</span>
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
        <div className="p-6 text-center">
          {status === "active" ? (
            <HiStatusOnline className="mx-auto mb-4 h-14 w-14 text-green-500" />
          ) : (
            <HiX className="mx-auto mb-4 h-14 w-14 text-red-500" />
          )}
          <h3 className="mb-5 text-lg font-normal text-gray-300">
            Are you sure you want to{" "}
            <span className="font-semibold text-white">{status}</span> the
            account of{" "}
            <span className="font-semibold text-white">
              {selectedAccount?.NAME}
            </span>
            ?
          </h3>
          <div className="flex justify-center gap-4">
            <Button
              color={status === "active" ? "success" : "failure"}
              onClick={confirmAction}
              className="flex items-center gap-2"
            >
              {status === "active" ? (
                <HiCheck className="text-white" />
              ) : (
                <HiX className="text-white" />
              )}
              Yes, {status}
            </Button>
            <Button color="gray" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
