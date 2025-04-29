"use client";
import React, { useState } from "react";
import { Button, Modal } from "flowbite-react";
import { HiSearch } from "react-icons/hi";

interface SubjectResult {
  code: string;
  title: string;
  credit: number;
  grade: string;
  passed: boolean;
}

interface Student {
  id: string;
  name: string;
  department: string;
  results: SubjectResult[];
}

const initialStudents: Student[] = [
  {
    id: "0562310005101031",
    name: "Raihan Ahmed",
    department: "CSE",
    results: [
      { code: "CSE101", title: "Intro to Programming", credit: 3, grade: "A", passed: true },
      { code: "CSE102", title: "Data Structures", credit: 3, grade: "C", passed: true },
      { code: "MAT101", title: "Calculus", credit: 3, grade: "F", passed: false },
    ],
  },
];

export default function ManageResults() {
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newResult, setNewResult] = useState<SubjectResult>({
    code: "",
    title: "",
    credit: 0,
    grade: "",
    passed: false,
  });

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleAddResult = () => {
    if (!selectedStudent) return;
    const updatedStudents = students.map((student) =>
      student.id === selectedStudent.id
        ? {
            ...student,
            results: [...student.results, newResult],
          }
        : student
    );
    setStudents(updatedStudents);
    setSelectedStudent({
      ...selectedStudent,
      results: [...selectedStudent.results, newResult],
    });
    setNewResult({ code: "", title: "", credit: 0, grade: "", passed: false });
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-5xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Manage Results</h1>
          <p className="mt-4 text-lg text-gray-400">
            View and manage students’ academic performance
          </p>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            className="w-full rounded border border-gray-700 bg-gray-800 py-2 pr-4 pl-10 text-white placeholder-gray-400 focus:border-[#92e3a9] focus:outline-none"
            placeholder="Search student by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <HiSearch className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Student ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 bg-gray-900">
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-400">No students found.</td>
              </tr>
            )}
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-800">
                <td className="px-6 py-4 text-white">{student.id}</td>
                <td className="px-6 py-4 text-white">{student.name}</td>
                <td className="px-6 py-4 text-white">{student.department}</td>
                <td className="px-6 py-4">
                  <Button
                    size="xs"
                    style={{ backgroundColor: "#92e3a9", color: "#000" }}
                    onClick={() => handleViewDetails(student)}
                  >
                    View History
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Student Result Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-bold text-[#92e3a9] text-center ">Result History</h2>
          {selectedStudent && (
            <>
              <div className="mb-4 text-gray-300">
                <p><strong>Student ID:</strong> {selectedStudent.id}</p>
                <p><strong>Name:</strong> {selectedStudent.name}</p>
                <p><strong>Department:</strong> {selectedStudent.department}</p>
              </div>
              <table className="w-full divide-y divide-gray-700 text-white">
                <thead>
                  <tr className="text-left text-gray-400">
                    <th className="py-2">Code</th>
                    <th className="py-2">Title</th>
                    <th className="py-2">Credit</th>
                    <th className="py-2">Grade</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedStudent.results.map((res, index) => (
                    <tr key={index} className="hover:bg-gray-700">
                      <td className="py-2">{res.code}</td>
                      <td className="py-2">{res.title}</td>
                      <td className="py-2">{res.credit}</td>
                      <td className="py-2">{res.grade}</td>
                      <td className="py-2">
                        {res.passed ? (
                          <span className="text-green-400">Passed</span>
                        ) : (
                          <span className="text-red-400">Failed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 text-gray-300">
                <p><strong>Subjects Passed:</strong> {selectedStudent.results.filter((r) => r.passed).length}</p>
                <p><strong>Subjects Failed:</strong> {selectedStudent.results.filter((r) => !r.passed).length}</p>
                <p><strong>Total Credit Completed:</strong> {
                  selectedStudent.results
                    .filter((r) => r.passed)
                    .reduce((acc, curr) => acc + curr.credit, 0)
                }</p>
              </div>

              {/* Add Result Form */}
              <div className="mt-6 border-t border-gray-700 pt-4">
                <h3 className="mb-2 text-lg font-semibold text-white">Add New Result</h3>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Course Code"
                    value={newResult.code}
                    onChange={(e) => setNewResult({ ...newResult, code: e.target.value })}
                    className="rounded bg-gray-700 px-3 py-2 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Title"
                    value={newResult.title}
                    onChange={(e) => setNewResult({ ...newResult, title: e.target.value })}
                    className="rounded bg-gray-700 px-3 py-2 text-white"
                  />
                  <input
                    type="number"
                    placeholder="Credit"
                    value={newResult.credit}
                    onChange={(e) => setNewResult({ ...newResult, credit: Number(e.target.value) })}
                    className="rounded bg-gray-700 px-3 py-2 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Grade"
                    value={newResult.grade}
                    onChange={(e) => {
                      const grade = e.target.value.toUpperCase();
                      const passed = grade !== "F";
                      setNewResult({ ...newResult, grade, passed });
                    }}
                    className="rounded bg-gray-700 px-3 py-2 text-white"
                  />
                </div>
                <Button className="mt-4 "  style={{ backgroundColor: "#92e3a9", color: "#000" }} onClick={handleAddResult}>
                  Add Result
                </Button>
              </div>

              <div className="mt-6 flex justify-end">
                <Button style={{ backgroundColor: "#DC3545" }} onClick={() => setShowModal(false)}>Close</Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
