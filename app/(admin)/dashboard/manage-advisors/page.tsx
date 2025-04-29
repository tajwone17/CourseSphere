"use client";

import { Button, TextInput, Modal, Label, Select } from "flowbite-react";
import { HiSearch, HiPlus } from "react-icons/hi";
import { useState } from "react";

interface Advisor {
  id: number;
  name: string;
  department: string;
  email: string;
  phone: string;
  password?: string;
  status: string;
}

export default function ManageAdvisors() {
  const [advisorsList, setAdvisorsList] = useState<Advisor[]>([
    {
      id: 1,
      name: "Prof. AB De Villiers",
      department: "Computer Science",
      email: "villers.b@neub.edu.bd",
      phone: "+880 1712345678",
      status: "Active",
      password: "villers.b1234",
    },
    {
      id: 2,
      name: "Dr. Tamim Iqbal",
      department: "Electrical Engineering",
      email: "tamim.w@neub.edu.bd",
      phone: "+880 1812345678",
      status: "Active",
      password: "tamim.w5678",
    },
    {
      id: 3,
      name: "Prof. Joe Root",
      department: "Civil Engineering",
      email: "root.l@neub.edu.bd",
      phone: "+880 1912345678",
      status: "Inactive",
      password: "root.l4321",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newAdvisor, setNewAdvisor] = useState({
    name: "",
    department: "",
    email: "",
    phone: "",
    password: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const filteredAdvisors = advisorsList.filter((advisor) => {
    const matchesSearch =
      advisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      advisor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      advisor.phone.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      departmentFilter === "all" ||
      advisor.department.toLowerCase() === departmentFilter.toLowerCase();

    return matchesSearch && matchesDepartment;
  });

  const handleAddAdvisor = () => {
    const id = advisorsList.length + 1;

    // Generate password based on email
    const emailPrefix = newAdvisor.email.split("@")[0];
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const generatedPassword = `${emailPrefix}${randomNum}`;

    const advisorData = {
      ...newAdvisor,
      id,
      status: "Active",
      password: generatedPassword,
    };

    setAdvisorsList([...advisorsList, advisorData]);
    setShowAddModal(false);

    // Reset the form
    setNewAdvisor({
      name: "",
      department: "",
      email: "",
      phone: "",
      password: "",
    });

    // Simulate sending email
    console.log(`Simulated Email Sent to: ${newAdvisor.email}`);
    console.log(`Generated Password: ${generatedPassword}`);
    alert(`Password "${generatedPassword}" has been sent to ${newAdvisor.email}`);
  };

  const toggleAdvisorStatus = (id: number) => {
    setAdvisorsList((prev) =>
      prev.map((advisor) =>
        advisor.id === id
          ? {
              ...advisor,
              status: advisor.status === "Active" ? "Inactive" : "Active",
            }
          : advisor,
      ),
    );
  };

  return (
    <div className="mx-auto max-w-7xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Manage Advisors</h1>
          <p className="mt-4 text-lg text-gray-400">Manage Academic Advisors</p>
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
          Add New Advisor
        </Button>
      </div>

      <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex flex-1 items-start md:items-center gap-4 flex-col md:flex-row">
            <div className="relative w-64">
              <TextInput
                type="search"
                placeholder="Search Advisors..."
                className="rounded-lg border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:border-[#92e3a9] focus:ring-[#92e3a9]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <HiSearch className="absolute top-2.5 right-3 h-5 w-5 text-gray-400" />
            </div>
            <Select
              className="w-48 border-gray-700 bg-gray-800 text-white"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="all">All Departments</option>
              <option value="computer science">Computer Science</option>
              <option value="electrical engineering">Electrical Engineering</option>
              <option value="civil engineering">Civil Engineering</option>
            </Select>
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
                  Password
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredAdvisors.map((advisor) => (
                <tr
                  key={advisor.id}
                  className="bg-gray-900 transition-colors hover:bg-gray-800"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {advisor.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {advisor.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {advisor.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {advisor.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {advisor.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {advisor.password || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button
                      size="xs"
                      style={{
                        backgroundColor:
                          advisor.status === "Active" ? "#ef4444" : "#22c55e",
                        color: "#ffffff",
                      }}
                      onClick={() => toggleAdvisorStatus(advisor.id)}
                    >
                      {advisor.status === "Active" ? "Set Inactive" : "Set Active"}
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredAdvisors.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-gray-400"
                  >
                    No advisors found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Advisor Modal */}
      <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="relative bg-gray-800 p-4">
          <div className="mb-4 text-xl font-semibold text-white">
            Add New Advisor
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <TextInput
                id="name"
                value={newAdvisor.name}
                onChange={(e) =>
                  setNewAdvisor({ ...newAdvisor, name: e.target.value })
                }
                placeholder="Enter name"
              />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <TextInput
                id="department"
                value={newAdvisor.department}
                onChange={(e) =>
                  setNewAdvisor({ ...newAdvisor, department: e.target.value })
                }
                placeholder="Enter department"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <TextInput
                id="email"
                type="email"
                value={newAdvisor.email}
                onChange={(e) =>
                  setNewAdvisor({ ...newAdvisor, email: e.target.value })
                }
                placeholder="Enter email"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <TextInput
                id="phone"
                value={newAdvisor.phone}
                onChange={(e) =>
                  setNewAdvisor({ ...newAdvisor, phone: e.target.value })
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
              onClick={handleAddAdvisor}
            >
              Add Advisor
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
