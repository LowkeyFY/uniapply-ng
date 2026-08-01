import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitJambManual } from "../../api/documents";

const DEFAULT_SUBJECTS = ["English", "Mathematics", "Physics", "Chemistry"];

export default function UploadJAMB() {
  const navigate = useNavigate();
  const [year, setYear] = useState("");
  const [totalScore, setTotalScore] = useState("");
  const [firstChoiceUniversity, setFirstChoiceUniversity] = useState("");
  const [firstChoiceCourse, setFirstChoiceCourse] = useState("");
  const [scores, setScores] = useState(
    Object.fromEntries(DEFAULT_SUBJECTS.map((s) => [s, ""]))
  );
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleScoreChange(subject, value) {
    setScores({ ...scores, [subject]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const filledScores = Object.fromEntries(
      Object.entries(scores)
        .filter(([, v]) => v !== "")
        .map(([k, v]) => [k, parseInt(v, 10)])
    );

    try {
      await submitJambManual({
        year: parseInt(year, 10),
        total_score: parseInt(totalScore, 10),
        subject_scores: filledScores,
        first_choice_university: firstChoiceUniversity || null,
        first_choice_course: firstChoiceCourse || null,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Could not save JAMB results.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-8 py-16">
      <h1 className="text-3xl font-bold">Enter JAMB Results</h1>
      <p className="mt-2 text-gray-600">
        No document to upload? Enter your score manually below.
      </p>

      {error && <p className="mt-4 rounded bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Exam Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Score</label>
            <input
              type="number"
              min="0"
              max="400"
              value={totalScore}
              onChange={(e) => setTotalScore(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-gray-800">Subject Scores</h2>
          <div className="mt-3 space-y-3">
            {DEFAULT_SUBJECTS.map((subject) => (
              <div key={subject} className="flex items-center justify-between gap-4">
                <label className="text-sm text-gray-700">{subject}</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={scores[subject]}
                  onChange={(e) => handleScoreChange(subject, e.target.value)}
                  className="w-24 rounded-lg border px-3 py-2"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">First Choice University (optional)</label>
          <input
            type="text"
            value={firstChoiceUniversity}
            onChange={(e) => setFirstChoiceUniversity(e.target.value)}
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">First Choice Course (optional)</label>
          <input
            type="text"
            value={firstChoiceCourse}
            onChange={(e) => setFirstChoiceCourse(e.target.value)}
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-700 px-5 py-2 text-white hover:bg-blue-800 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save JAMB Results"}
        </button>
      </form>
    </div>
  );
}
