'use client';
import React from "react";
import { Button } from "flowbite-react";
import { useState } from "react";
import { HiCheck, HiX, HiSearch } from "react-icons/hi";

interface PendingAccount {
  id: number;
  name: string;
  email: string;
  role: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

const initialAccounts: PendingAccount[] = [
  {
    id: 1,
    name: "Tajwone Chowdhury",
    email: "tajwone.chowdhury@neub.edu.bd",
    role: "Student",
    requestedAt: "2025-04-25",
    status: "pending",
  },
  {
    id: 2,
    name: "Jakaria Ahmed",
    email: "jakaria.ahmed@neub.edu.bd",
    role: "Advisor",
    requestedAt: "2025-04-26",
    status: "pending",
  },
  {
    id: 3,
    name: "Masum Pradhania",
    email: "masum.pradhania@neub.edu.bd",
    role: "Student",
    requestedAt: "2025-04-27",
    status: "pending",
  },
];

export default function AccountApproval() {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [search, setSearch] = useState("");

  const handleAction = (id: number, action: 'approved' | 'rejected') => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === id ? { ...acc, status: action } : acc
      )
    );
  };

  const filteredAccounts = accounts.filter(
    (acc) =>
      acc.name.toLowerCase().includes(search.toLowerCase()) ||
      acc.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-5xl p-8">
      <h1 className="mb-8 text-4xl font-bold text-white">Account Approval</h1>
      <div className="mb-6 flex items-center gap-4">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            className="w-full rounded border border-gray-700 bg-gray-800 py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:border-[#92e3a9] focus:outline-none"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <HiSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
      <div className="rounded-lg border border-gray-700">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Requested At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 bg-gray-900">
            {filteredAccounts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-400">
                  No pending accounts found.
                </td>
              </tr>
            )}
            {filteredAccounts.map((acc) => (
              <tr key={acc.id} className="hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap text-white">{acc.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-white">{acc.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-white">{acc.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-white">{acc.requestedAt}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {acc.status === 'pending' && (
                    <span className="inline-flex items-center gap-1 rounded bg-yellow-700/30 px-2 py-1 text-sm font-medium text-yellow-400">
                      Pending
                    </span>
                  )}
                  {acc.status === 'approved' && (
                    <span className="inline-flex items-center gap-1 rounded bg-green-800/30 px-2 py-1 text-sm font-medium text-green-500">
                      <HiCheck className="text-green-400" /> Approved
                    </span>
                  )}
                  {acc.status === 'rejected' && (
                    <span className="inline-flex items-center gap-1 rounded bg-red-800/30 px-2 py-1 text-sm font-medium text-red-500">
                      <HiX className="text-red-400" /> Rejected
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {acc.status === 'pending' && (
                    <div className="flex gap-2 overflow-hidden">
                      <Button
                        size="xs"
                        style={{ backgroundColor: '#22c55e', color: '#fff' }}
                        onClick={() => handleAction(acc.id, 'approved')}
                      >
                        <HiCheck className="mr-1" /> Approve
                      </Button>
                      <Button
                        size="xs"
                        style={{ backgroundColor: '#ef4444', color: '#fff' }}
                        onClick={() => handleAction(acc.id, 'rejected')}
                      >
                        <HiX className="mr-1" /> Reject
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
