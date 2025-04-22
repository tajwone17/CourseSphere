"use client";

import { Button, TextInput } from "flowbite-react";
import { HiSearch, HiPlus, HiPencil, HiTrash } from "react-icons/hi";

export default function ManageHOD() {
  const hodList = [
    {
      id: 1,
      name: "Dr. John Doe",
      department: "Computer Science",
      email: "john.doe@neub.edu.bd",
      phone: "+880 1712345678",
      status: "Active",
    },
    {
      id: 2,
      name: "Dr. Jane Smith",
      department: "Electrical Engineering",
      email: "jane.smith@neub.edu.bd",
      phone: "+880 1812345678",
      status: "Active",
    },
    {
      id: 3,
      name: "Dr. Robert Johnson",
      department: "Civil Engineering",
      email: "robert.j@neub.edu.bd",
      phone: "+880 1912345678",
      status: "Inactive",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Manage HODs</h1>
          <p className="mt-4 text-lg text-gray-400">
            Add, edit, or remove Head of Departments
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
        
        className="flex items-center gap-2 bg-[#92e3a9] text-gray-900 transition-all duration-200 hover:bg-[#7ac892]">
          <HiPlus className="h-5 w-5" />
          Add New HOD
        </Button>
      </div>

      <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="relative w-64">
            <TextInput
              type="search"
              placeholder="Search HODs..."
              className="rounded-lg border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:border-[#92e3a9] focus:ring-[#92e3a9]"
            />
            <HiSearch className="absolute top-2.5 right-3 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {hodList.map((hod) => (
                <tr
                  key={hod.id}
                  className="bg-gray-900 transition-colors hover:bg-gray-800"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {hod.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {hod.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {hod.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {hod.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        hod.status === "Active"
                          ? "bg-green-900 text-green-300"
                          : "bg-red-900 text-red-300"
                      }`}
                    >
                      {hod.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Button size="xs" color="warning">
                        <HiPencil className="h-4 w-4" />
                      </Button>
                      <Button size="xs" color="failure">
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
    </div>
  );
}
