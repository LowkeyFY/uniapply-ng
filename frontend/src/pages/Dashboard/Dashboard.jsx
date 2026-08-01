import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listMyApplications } from "../../api/applications";

const STATUS_STYLES = {
  draft: "bg-gray-100 text-gray-700",
  submitted: "bg-blue-100 text-blue-700",
  under_review: "bg-yellow-100 text-yellow-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  waitlisted: "bg-orange-100 text-orange-700",
};

export default function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    listMyApplications()
      .then(setApplications)
      .catch(() => setError("Could not load your applications. Please log in again."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-8 py-16">
      <h1 className="text-4xl font-bold">My Applications</h1>
      <p className="mt-2 text-gray-600">Track the status of your university applications.</p>

      {loading && <p className="mt-10 text-gray-500">Loading...</p>}
      {error && <p className="mt-10 text-red-600">{error}</p>}

      {!loading && !error && applications.length === 0 && (
        <div className="mt-10 rounded-lg border bg-gray-50 p-8 text-center">
          <p className="text-gray-600">You haven't applied anywhere yet.</p>
          <Link to="/explore" className="mt-4 inline-block text-blue-700 hover:underline">
            Browse universities &rarr;
          </Link>
        </div>
      )}

      {!loading && !error && applications.length > 0 && (
        <div className="mt-8 space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="rounded-lg border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <Link to={`/universities/${app.university_id}`} className="text-lg font-bold text-blue-700 hover:underline">
                    {app.university_name}
                  </Link>
                  <p className="text-gray-600">{app.course_name}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-sm font-medium ${STATUS_STYLES[app.status] || "bg-gray-100 text-gray-700"}`}>
                  {app.status.replace("_", " ")}
                </span>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                {app.status === "draft"
                  ? "Not yet submitted"
                  : `Submitted ${new Date(app.submitted_at).toLocaleDateString()}`}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
