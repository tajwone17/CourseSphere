"use client";

import { Button, TextInput, Modal, Label } from "flowbite-react";
import {
  HiPlus,
  HiSearch, 
  HiUser,
  HiMail,
  HiPhone,
  HiStatusOnline,
  HiStatusOffline,
  //   HiCash,
} from "react-icons/hi";
import { useState } from "react";
import Select, { SingleValue } from "react-select";

interface AccountsAdmin {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
}

export default function ManageAccountsAdmin() {
  const [accountsAdminList, setAccountsAdminList] = useState<AccountsAdmin[]>([
    {
      id: 1,
      name: "Alan Walker",
      email: "alan.walker@neub.edu.bd",
      phone: "+880 1712345678",
      status: "Active",
    },
    {
      id: 2,
      name: "Emily Rodriguez",
      email: "emily.rodriguez@neub.edu.bd",
      phone: "+880 1812345678",
      status: "Active",
    },
    {
      id: 3,
      name: "David Anderson",
      email: "david.anderson@neub.edu.bd",
      phone: "+880 1912345678",
      status: "Inactive",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newAccountsAdmin, setNewAccountsAdmin] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const handleAddAccountsAdmin = () => {
    const id = accountsAdminList.length + 1;
    const accountsAdminData = { ...newAccountsAdmin, id, status: "Active" };
    setAccountsAdminList([...accountsAdminList, accountsAdminData]);
    setShowAddModal(false);
    setNewAccountsAdmin({ name: "", email: "", phone: "" });
  };

  const handleToggleStatus = (id: number) => {
    const updatedList = accountsAdminList.map((admin) =>
      admin.id === id
        ? {
            ...admin,
            status: admin.status === "Active" ? "Inactive" : "Active",
          }
        : admin,
    );
    setAccountsAdminList(updatedList);
  };

  const filteredAccountsAdminList = accountsAdminList.filter(
    (admin) =>
      (admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (statusFilter ? admin.status === statusFilter : true),
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleStatusChange = (
    selectedOption: SingleValue<{ value: string; label: string }> | null,
  ) => {
    if (selectedOption) {
      setStatusFilter(selectedOption.value);
    } else {
      setStatusFilter("");
    }
  };

  const statusOptions = [
    { value: " ", label: "All" },
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  return (
    <div
      className="mx-auto max-w-7xl p-8"
      data-aos="zoom-in"
      data-aos-duration="1000"
    >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Manage Accounts Office Admins
          </h1>
          <p className="mt-2 text-gray-400">
            Add, manage and monitor accounts office administrators
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
          Add New Accounts Admin
        </Button>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="w-1/3">
          <TextInput
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by name, email"
            icon={HiSearch}
          />
        </div>
        <div className="w-1/3">
          <Select
            options={statusOptions}
            onChange={handleStatusChange}
            placeholder="Filter by Status"
            isSearchable={false}
            value={statusOptions.find(
              (option) => option.value === statusFilter,
            )}
          />
        </div>
      </div>

      <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  <HiUser className="mr-2 inline text-[#92e3a9] group-hover:scale-110" />{" "}
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  <HiMail className="mr-2 inline text-[#92e3a9] group-hover:scale-110" />{" "}
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  <HiPhone className="mr-2 inline text-[#92e3a9] group-hover:scale-110" />{" "}
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  <HiStatusOnline className="mr-2 inline text-[#92e3a9] group-hover:scale-110" />{" "}
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredAccountsAdminList.map((admin) => (
                <tr
                  key={admin.id}
                  className="bg-gray-900 transition-colors hover:bg-gray-800"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {admin.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {admin.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {admin.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {admin.status === "Active" ? (
                      <HiStatusOnline className="mr-2 inline text-green-500" />
                    ) : (
                      <HiStatusOffline className="mr-2 inline text-red-500" />
                    )}
                    {admin.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button
                      style={{
                        backgroundColor:
                          admin.status === "Active" ? "#ef4444" : "#10b981",
                        color: "#ffffff",
                      }}
                      size="xs"
                      onClick={() => handleToggleStatus(admin.id)}
                    >
                      {admin.status === "Active" ? "Deactivate" : "Activate"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Accounts Admin Modal */}
      <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="relative bg-gray-800 p-4">
          <div className="mb-4 text-xl font-semibold text-white">
            Add New Accounts Office Admin
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <TextInput
                id="name"
                value={newAccountsAdmin.name}
                onChange={(e) =>
                  setNewAccountsAdmin({
                    ...newAccountsAdmin,
                    name: e.target.value,
                  })
                }
                placeholder="Enter name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <TextInput
                id="email"
                type="email"
                value={newAccountsAdmin.email}
                onChange={(e) =>
                  setNewAccountsAdmin({
                    ...newAccountsAdmin,
                    email: e.target.value,
                  })
                }
                placeholder="Enter email"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <TextInput
                id="phone"
                value={newAccountsAdmin.phone}
                onChange={(e) =>
                  setNewAccountsAdmin({
                    ...newAccountsAdmin,
                    phone: e.target.value,
                  })
                }
                placeholder="Enter phone number"
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
              onClick={handleAddAccountsAdmin}
            >
              Add Accounts Admin
            </Button>
            <Button color="gray" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
