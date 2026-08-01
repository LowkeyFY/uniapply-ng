import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getUniversity, getUniversityCourses } from "../../api/universities";
import { createApplication } from "../../api/applications";

export default function UniversityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [university, setUniversity] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applyingCourseId, setApplyingCourseId] = useState(null);
  const [applyError, setApplyError] = useState(null);
  const [appliedCourseIds, setAppliedCourseIds] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [uniData, coursesData] = await Promise.all([
          getUniversity(id),
          getUniversityCourses(id),
        ]);
        setUniversity(uniData);
        setCourses(coursesData);
      } catch (err) {
        setError("Could not load university details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  async function handleApply(courseId) {
    setApplyError(null);
    setApplyingCourseId(courseId);
    try {
      await createApplication({ university_id: id, course_id: courseId });
      setAppliedCourseIds((prev) => [...prev, courseId]);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
        return;
      }
      setApplyError(err.response?.data?.detail || "Could not create application.");
    } finally {
      setApplyingCourseId(null);
    }
  }

  if (loading) return <p className="mx-auto max-w-4xl px-8 py-16 text-gray-500">Loading...</p>;
  if (error) return <p className="mx-auto max-w-4xl px-8 py-16 text-red-600">{error}</p>;

  return (
    <div className="mx-auto max-w-4xl px-8 py-16">
      <Link to="/explore" className="text-blue-700 hover:underline">&larr; Back to Explore</Link>
      <h1 className="mt-4 text-4xl font-bold">{university.name}</h1>
      <p className="mt-2 text-gray-600">
        {university.type} University {university.established_year && `· Est. ${university.established_year}`}
      </p>

      {applyError && <p className="mt-4 rounded bg-red-50 p-3 text-sm text-red-600">{applyError}</p>}

      <h2 className="mt-10 text-2xl font-semibold">Courses & Cut-off Marks</h2>
      <div className="mt-6 grid gap-4">
        {courses.length === 0 && <p className="text-gray-500">No courses listed yet.</p>}
        {courses.map((course) => {
          const alreadyApplied = appliedCourseIds.includes(course.course_id);
          return (
            <div key={course.course_id} className="flex items-center justify-between rounded-lg border bg-white p-5 shadow-sm">
              <div>
                <h3 className="text-lg font-bold">{course.course_name}</h3>
                <p className="text-gray-600">{course.degree_type} · {course.duration_years} years</p>
                <p className="mt-2 font-semibold">JAMB Cut-off: {course.jamb_cutoff}</p>
              </div>
              <button
                onClick={() => handleApply(course.course_id)}
                disabled={applyingCourseId === course.course_id || alreadyApplied}
                className="rounded-lg bg-blue-700 px-5 py-2 text-white hover:bg-blue-800 disabled:opacity-50"
              >
                {alreadyApplied ? "Applied ✓" : applyingCourseId === course.course_id ? "Applying..." : "Apply"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
