"use client";
import React, { useState, useEffect } from "react";
import { Button, Modal, Select, Spinner } from "flowbite-react";
import { HiSearch, HiPencil, HiX } from "react-icons/hi";

interface SubjectResult {
  ID: number;
  COURSE_ID: number;
  course_code: string;
  course_title: string;
  course_credit: number;
  GRADE: string;
  SEMESTER: string;
  passed: boolean;
}

interface Student {
  id: string;
  name: string;
  department: string;
  email: string;
  results: SubjectResult[];
}

interface Course {
  ID: number;
  CODE: string;
  TITLE: string;
  CREDIT: number;
  INSTRUCTOR_NAME: string;
}

export default function ManageResults() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingResult, setEditingResult] = useState<SubjectResult | null>(null);
  const [newGrade, setNewGrade] = useState("");
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [retakeCourses, setRetakeCourses] = useState<Course[]>([]);
  
  const [newResult, setNewResult] = useState({
    courseId: "",
    semester: "",
    grade: ""
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [processing, setProcessing] = useState(false);

  // Fetch students when component mounts
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/results');
        const data = await response.json();
        
        if (data.success) {
          setStudents(data.students || []);
        } else {
          throw new Error(data.error || "Failed to fetch students");
        }
      } catch (err) {
        console.error("Error fetching students:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudents();
  }, []);

  const handleViewDetails = async (student: Student) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/results?studentId=${student.id}`);
      const data = await response.json();
      
      if (data.success) {
        setSelectedStudent(data.student);
        setShowModal(true);
        
        // Fetch available courses for the student
        const coursesResponse = await fetch(`/api/results/available-courses?studentId=${student.id}`);
        const coursesData = await coursesResponse.json();
        
        if (coursesData.success) {
          setAvailableCourses(coursesData.availableCourses || []);
          setRetakeCourses(coursesData.retakeCourses || []);
        }
      } else {
        throw new Error(data.error || "Failed to fetch student details");
      }
    } catch (err) {
      console.error("Error fetching student details:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleEditResult = (result: SubjectResult) => {
    setEditingResult(result);
    setNewGrade(result.GRADE);
    setShowEditModal(true);
  };

  const handleUpdateResult = async () => {
    if (!editingResult) return;
    
    try {
      setProcessing(true);
      
      const response = await fetch('/api/results', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resultId: editingResult.ID,
          grade: newGrade
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess("Result updated successfully");
        
        // Update the result in the UI
        if (selectedStudent) {
          const updatedResults = selectedStudent.results.map(r => 
            r.ID === editingResult.ID 
              ? { ...r, GRADE: newGrade, passed: !["F"].includes(newGrade) } 
              : r
          );
          
          setSelectedStudent({
            ...selectedStudent,
            results: updatedResults
          });
        }
        
        setShowEditModal(false);
      } else {
        throw new Error(data.error || "Failed to update result");
      }
    } catch (err) {
      console.error("Error updating result:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setProcessing(false);
    }
  };

  const handleAddResult = async () => {
    if (!selectedStudent) return;
    
    if (!newResult.courseId || !newResult.semester || !newResult.grade) {
      setError("All fields are required");
      return;
    }
    
    try {
      setProcessing(true);
      
      const response = await fetch('/api/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentId: selectedStudent.id,
          courseId: newResult.courseId,
          semester: newResult.semester,
          grade: newResult.grade
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess("Result added successfully");
        
        // Find the course details
        const courseId = parseInt(newResult.courseId);
        let course = availableCourses.find(c => c.ID === courseId);
        
        if (!course) {
          course = retakeCourses.find(c => c.ID === courseId);
        }
        
        if (course) {
          // Add the new result to the UI
          const newResultObj: SubjectResult = {
            ID: data.resultId,
            COURSE_ID: courseId,
            course_code: course.CODE,
            course_title: course.TITLE,
            course_credit: course.CREDIT,
            GRADE: newResult.grade,
            SEMESTER: newResult.semester,
            passed: !["F"].includes(newResult.grade)
          };
          
          setSelectedStudent({
            ...selectedStudent,
            results: [newResultObj, ...selectedStudent.results]
          });
          
          // Reset form
          setNewResult({
            courseId: "",
            semester: "",
            grade: ""
          });
          
          // Refresh available courses
          const coursesResponse = await fetch(`/api/results/available-courses?studentId=${selectedStudent.id}`);
          const coursesData = await coursesResponse.json();
          
          if (coursesData.success) {
            setAvailableCourses(coursesData.availableCourses || []);
            setRetakeCourses(coursesData.retakeCourses || []);
          }
        }
      } else {
        throw new Error(data.error || "Failed to add result");
      }
    } catch (err) {
      console.error("Error adding result:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setProcessing(false);
    }
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase()) ||
    student.id.toLowerCase().includes(search.toLowerCase())
  );

  const semesters = [
    "Spring-2023", "Summer-2023", "Fall-2023",
    "Spring-2024", "Summer-2024", "Fall-2024",
    "Spring-2025", "Summer-2025", "Fall-2025"
  ];

  const grades = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "D", "F"];

  return (
    <div className="mx-auto max-w-5xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Manage Results</h1>
          <p className="mt-4 text-lg text-gray-400">
            View and manage students' academic performance
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-500 bg-red-900/20 p-3 text-red-300">
          {error}
          <button
            className="float-right text-red-300 hover:text-red-100"
            onClick={() => setError("")}
          >
            <HiX />
          </button>
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-md border border-green-500 bg-green-900/20 p-3 text-green-300">
          {success}
          <button
            className="float-right text-green-300 hover:text-green-100"
            onClick={() => setSuccess("")}
          >
            <HiX />
          </button>
        </div>
      )}

      <div className="mb-6 flex items-center gap-4">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            className="w-full rounded border border-gray-700 bg-gray-800 py-2 pr-4 pl-10 text-white placeholder-gray-400 focus:border-[#92e3a9] focus:outline-none"
            placeholder="Search student by name or ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <HiSearch className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {loading && !showModal && !showEditModal ? (
        <div className="flex justify-center py-10">
          <Spinner size="xl" color="success" />
        </div>
      ) : (
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
      )}

      {/* Student Result Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} size="4xl">
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-bold text-[#92e3a9] text-center">Result History</h2>
          
          {selectedStudent && (
            <>
              <div className="mb-4 text-gray-300">
                <p><strong>Student ID:</strong> {selectedStudent.id}</p>
                <p><strong>Name:</strong> {selectedStudent.name}</p>
                <p><strong>Department:</strong> {selectedStudent.department}</p>
                <p><strong>Email:</strong> {selectedStudent.email}</p>
              </div>
              
              <div className="mb-6 overflow-x-auto">
                <table className="w-full divide-y divide-gray-700 text-white">
                  <thead>
                    <tr className="text-left text-gray-400">
                      <th className="py-2 px-3">Code</th>
                      <th className="py-2 px-3">Title</th>
                      <th className="py-2 px-3">Credit</th>
                      <th className="py-2 px-3">Semester</th>
                      <th className="py-2 px-3">Grade</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedStudent.results.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-4 text-center text-gray-400">No results found.</td>
                      </tr>
                    ) : (
                      selectedStudent.results.map((res) => (
                        <tr key={res.ID} className="hover:bg-gray-700">
                          <td className="py-2 px-3">{res.course_code}</td>
                          <td className="py-2 px-3">{res.course_title}</td>
                          <td className="py-2 px-3">{res.course_credit}</td>
                          <td className="py-2 px-3">{res.SEMESTER}</td>
                          <td className="py-2 px-3">{res.GRADE}</td>
                          <td className="py-2 px-3">
                            {res.passed ? (
                              <span className="text-green-400">Passed</span>
                            ) : (
                              <span className="text-red-400">Failed</span>
                            )}
                          </td>
                          <td className="py-2 px-3">
                            <Button
                              size="xs"
                              color="light"
                              onClick={() => handleEditResult(res)}
                              title="Edit Result"
                            >
                              <HiPencil />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-gray-300">
                <p><strong>Subjects Passed:</strong> {selectedStudent.results.filter((r) => r.passed).length}</p>
                <p><strong>Subjects Failed:</strong> {selectedStudent.results.filter((r) => !r.passed).length}</p>
                <p><strong>Total Credit Completed:</strong> {
                  selectedStudent.results
                    .filter((r) => r.passed)
                    .reduce((acc, curr) => acc + curr.course_credit, 0)
                }</p>
              </div>

              {/* Add Result Form */}
              <div className="mt-6 border-t border-gray-700 pt-4">
                <h3 className="mb-4 text-lg font-semibold text-white">Add New Result</h3>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-300">Course</label>
                    <Select
                      value={newResult.courseId}
                      onChange={(e) => setNewResult({ ...newResult, courseId: e.target.value })}
                      className="bg-gray-700 text-white"
                    >
                      <option value="">Select Course</option>
                      
                      {availableCourses.length > 0 && (
                        <optgroup label="Available Courses">
                          {availableCourses.map((course) => (
                            <option key={course.ID} value={course.ID}>
                              {course.CODE} - {course.TITLE}
                            </option>
                          ))}
                        </optgroup>
                      )}
                      
                      {retakeCourses.length > 0 && (
                        <optgroup label="Retake Courses">
                          {retakeCourses.map((course) => (
                            <option key={course.ID} value={course.ID}>
                              {course.CODE} - {course.TITLE} (Retake)
                            </option>
                          ))}
                        </optgroup>
                      )}
                    </Select>
                  </div>
                  
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-300">Semester</label>
                    <Select
                      value={newResult.semester}
                      onChange={(e) => setNewResult({ ...newResult, semester: e.target.value })}
                      className="bg-gray-700 text-white"
                    >
                      <option value="">Select Semester</option>
                      {semesters.map((sem) => (
                        <option key={sem} value={sem}>{sem}</option>
                      ))}
                    </Select>
                  </div>
                  
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-300">Grade</label>
                    <Select
                      value={newResult.grade}
                      onChange={(e) => setNewResult({ ...newResult, grade: e.target.value })}
                      className="bg-gray-700 text-white"
                    >
                      <option value="">Select Grade</option>
                      {grades.map((grade) => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </Select>
                  </div>
                </div>
                
                <Button 
                  className="mt-4"
                  style={{ backgroundColor: "#92e3a9", color: "#000" }} 
                  onClick={handleAddResult}
                  disabled={processing}
                >
                  {processing ? <Spinner size="sm" /> : "Add Result"}
                </Button>
              </div>

              <div className="mt-6 flex justify-end">
                <Button color="red" onClick={() => setShowModal(false)}>Close</Button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Edit Result Modal */}
      <Modal show={showEditModal} onClose={() => setShowEditModal(false)} size="md">
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-bold text-[#92e3a9] text-center">Edit Result</h2>
          
          {editingResult && (
            <>
              <div className="mb-4 text-gray-300">
                <p><strong>Course:</strong> {editingResult.course_code} - {editingResult.course_title}</p>
                <p><strong>Credit:</strong> {editingResult.course_credit}</p>
                <p><strong>Semester:</strong> {editingResult.SEMESTER}</p>
                <p><strong>Current Grade:</strong> {editingResult.GRADE}</p>
              </div>
              
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-300">New Grade</label>
                <Select
                  value={newGrade}
                  onChange={(e) => setNewGrade(e.target.value)}
                  className="bg-gray-700 text-white"
                >
                  {grades.map((grade) => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </Select>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button
                  color="red"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </Button>
                
                <Button
                  style={{ backgroundColor: "#92e3a9", color: "#000" }}
                  onClick={handleUpdateResult}
                  disabled={processing}
                >
                  {processing ? <Spinner size="sm" /> : "Save Changes"}
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
