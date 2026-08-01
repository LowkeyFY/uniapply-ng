import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitWaecManual } from "../../api/documents";

const GRADE_OPTIONS = ["A1", "B2", "B3", "C4", "C5", "C6", "D7", "E8", "F9"];
const DEFAULT_SUBJECTS = ["English", "Mathematics", "Biology", "Chemistry", "Physics"];

export default function UploadWAEC() {
  const navigate = useNavigate();
  const [examYear, setExamYear] = useState("");
  const [examType, setExamType] = useState("WASSCE");
  const [grades, setGrades] = useState(
    Object.fromEntries(DEFAULT_SUBJECTS.map((s) => [s, ""]))
  );
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleGradeChange(subject, value) {
    setGrades({ ...grades, [subject]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const filledGrades = Object.fromEntries(
      Object.entries(grades).filter(([, v]) => v !== "")
    );

    if (Object.keys(filledGrades).length === 0) {
      setError("Enter at least one subject grade.");
      setLoading(false);
      return;
    }

    try {
      await submitWaecManual({
        exam_year: parseInt(examYear, 10),
        exam_type: examType,
        grades: filledGrades,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Could not save WAEC results.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-8 py-16">
      <h1 className="text-3xl font-bold">Enter WAEC Results</h1>
      <p className="mt-2 text-gray-600">
        No document to upload? Enter your grades manually below.
      </p>

      {error && <p className="mt-4 rounded bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Exam Year</label>
            <input
              type="number"
              value={examYear}
              onChange={(e) => setExamYear(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Exam Type</label>
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            >
              <option value="WASSCE">WASSCE</option>
              <option value="NECO">NECO</option>
              <option value="GCE">GCE</option>
            </select>
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-gray-800">Subject Grades</h2>
          <div className="mt-3 space-y-3">
            {DEFAULT_SUBJECTS.map((subject) => (
              <div key={subject} className="flex items-center justify-between gap-4">
                <label className="text-sm text-gray-700">{subject}</label>
                <select
                  value={grades[subject]}
                  onChange={(e) => handleGradeChange(subject, e.target.value)}
                  className="w-32 rounded-lg border px-3 py-2"
                >
                  <option value="">--</option>
                  {GRADE_OPTIONS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-700 px-5 py-2 text-white hover:bg-blue-800 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save WAEC Results"}
        </button>
      </form>
    </div>
  );
}
