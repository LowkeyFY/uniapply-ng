import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { checkEligibility, checkNoJamb } from "../../api/eligibility";
import { getCourses } from "../../api/universities";

const GRADE_OPTIONS = ["A1", "B2", "B3", "C4", "C5", "C6", "D7", "E8", "F9"];
const FALLBACK_SUBJECTS = ["English", "Mathematics"];

export default function EligibilityCheck() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [noJamb, setNoJamb] = useState(false);
  const [jambScore, setJambScore] = useState("");
  const [grades, setGrades] = useState({});
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCourses().then(setCourses).catch(() => setError("Could not load course list."));
  }, []);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const subjects = selectedCourse?.jamb_subject_combo?.length
    ? selectedCourse.jamb_subject_combo
    : FALLBACK_SUBJECTS;

  function handleCourseChange(courseId) {
    setSelectedCourseId(courseId);
    setGrades({});
    setResults(null);
  }

  function handleGradeChange(subject, value) {
    setGrades({ ...grades, [subject]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setResults(null);

    if (!selectedCourse) {
      setError("Select a course first.");
      setLoading(false);
      return;
    }

    const filledGrades = Object.fromEntries(
      Object.entries(grades).filter(([, v]) => v !== "")
    );

    try {
      let data;
      if (noJamb) {
        data = await checkNoJamb({
          waec_grades: filledGrades,
          preferred_course: selectedCourse.name,
        });
      } else {
        data = await checkEligibility({
          jamb_score: parseInt(jambScore, 10),
          waec_grades: filledGrades,
          preferred_course: selectedCourse.name,
        });
      }
      setResults(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Could not run eligibility check.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-8 py-16">
      <h1 className="text-3xl font-bold">Check Your Eligibility</h1>
      <p className="mt-2 text-gray-600">
        Pick your course first — the grades you need to enter will update to match its requirements.
      </p>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700">Course</label>
        <select
          value={selectedCourseId}
          onChange={(e) => handleCourseChange(e.target.value)}
          required
          className="mt-1 w-full rounded-lg border px-3 py-2"
        >
          <option value="">-- Select a course --</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <label className="mt-6 flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={noJamb}
          onChange={(e) => setNoJamb(e.target.checked)}
        />
        I don't have a JAMB score yet (show me the score I'd need)
      </label>

      {error && <p className="mt-4 rounded bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      {selectedCourse && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {!noJamb && (
            <div>
              <label className="block text-sm font-medium text-gray-700">JAMB Score</label>
              <input
                type="number"
                min="0"
                max="400"
                value={jambScore}
                onChange={(e) => setJambScore(e.target.value)}
                required={!noJamb}
                className="mt-1 w-full rounded-lg border px-3 py-2"
              />
            </div>
          )}

          <div>
            <h2 className="font-semibold text-gray-800">
              WAEC Grades — required for {selectedCourse.name}
            </h2>
            <div className="mt-3 space-y-3">
              {subjects.map((subject) => (
                <div key={subject} className="flex items-center justify-between gap-4">
                  <label className="text-sm text-gray-700">{subject}</label>
                  <select
                    value={grades[subject] || ""}
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
            {loading ? "Checking..." : "Check Eligibility"}
          </button>
        </form>
      )}

      {results && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold">
            {results.length === 0 ? "No matches found" : `${results.length} match${results.length > 1 ? "es" : ""} found`}
          </h2>
          <div className="mt-4 grid gap-4">
            {results.map((r) => (
              <div key={`${r.university_id}-${r.course_id}`} className="rounded-lg border bg-white p-5 shadow-sm">
                <Link to={`/universities/${r.university_id}`} className="text-lg font-bold text-blue-700 hover:underline">
                  {r.university_name}
                </Link>
                <p className="text-gray-600">{r.course_name}</p>
                <p className="mt-2 text-sm">
                  {noJamb
                    ? <>JAMB score needed: <strong>{r.jamb_cutoff}</strong></>
                    : <>Cutoff: <strong>{r.jamb_cutoff}</strong> · Margin: <strong>+{r.margin}</strong></>
                  }
                  {" "}· WAEC credits met: <strong>{r.waec_match}</strong>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
