"use client";
import React, { useState } from "react";
import { Button, Modal } from "flowbite-react";
import { HiCheck, HiX, HiSearch, HiExclamation } from "react-icons/hi";

interface PendingAccount {
  id: number;
  name: string;
  email: string;
  role: string;
  requestedAt: string;
  status: "active" | "inactive";
}

const initialAccounts: PendingAccount[] = [
  {
    id: 1,
    name: "Tajwone Chowdhury",
    email: "tajwone.chowdhury@neub.edu.bd",
    role: "Student",
    requestedAt: "2025-04-25",
    status: "active",
  },
  {
    id: 2,
    name: "Jakaria Ahmed",
    email: "jakaria.ahmed@neub.edu.bd",
    role: "Advisor",
    requestedAt: "2025-04-26",
    status: "active",
  },
  {
    id: 3,
    name: "Masum Pradhania",
    email: "masum.pradhania@neub.edu.bd",
    role: "Student",
    requestedAt: "2025-04-27",
    status: "inactive",
  },
];

export default function AccountApproval() {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<PendingAccount | null>(
    null,
  );
  const [pendingAction, setPendingAction] = useState<"active" | "inactive">(
    "active",
  );

  const openModal = (acc: PendingAccount, action: "active" | "inactive") => {
    setSelectedAccount(acc);
    setPendingAction(action);
    setShowModal(true);
  };

  const confirmAction = () => {
    if (selectedAccount) {
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === selectedAccount.id
            ? { ...acc, status: pendingAction }
            : acc,
        ),
      );
    }
    setShowModal(false);
  };

  const filteredAccounts = accounts.filter(
    (acc) =>
      acc.name.toLowerCase().includes(search.toLowerCase()) ||
      acc.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      className="mx-auto max-w-5xl p-8"
      data-aos="zoom-in"
      data-aos-duration="1000"
    >
      <h1 className="mb-8 text-4xl font-bold text-white">Account Activation</h1>

      <div className="mb-6 flex items-center gap-4">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            className="w-full rounded border border-gray-700 bg-gray-800 py-2 pr-4 pl-10 text-white placeholder-gray-400 focus:border-[#92e3a9] focus:outline-none"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <HiSearch className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-700 lg:overflow-hidden">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Requested At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
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
              <tr key={acc.id} className="hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap text-white">
                  {acc.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-white">
                  {acc.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-white">
                  {acc.requestedAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {acc.status === "inactive" ? (
                    <Button
                      size="xs"
                      style={{ backgroundColor: "#22c55e", color: "#fff" }}
                      onClick={() => openModal(acc, "active")}
                    >
                      <HiCheck className="mr-1" /> Activate
                    </Button>
                  ) : (
                    <Button
                      size="xs"
                      style={{ backgroundColor: "#ef4444", color: "#fff" }}
                      onClick={() => openModal(acc, "inactive")}
                    >
                      <HiX className="mr-1" /> Deactivate
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
          <HiExclamation className="mx-auto mb-4 h-14 w-14 text-yellow-400" />
          <h3 className="mb-5 text-lg font-normal text-gray-300">
            Are you sure you want to{" "}
            <span className="font-semibold text-white">{pendingAction}</span>{" "}
            the account of{" "}
            <span className="font-semibold text-white">
              {selectedAccount?.name}
            </span>
            ?
          </h3>
          <div className="flex justify-center gap-4">
            <Button
              color={pendingAction === "active" ? "success" : "failure"}
              onClick={confirmAction}
            >
              Yes, {pendingAction}
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
