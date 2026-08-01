import { Link } from "react-router-dom";

export default function UniversityCard({ id, name, type, state }) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-lg">
      <h2 className="text-2xl font-bold text-blue-700">{name}</h2>
      <p className="mt-2 text-gray-600">{type} University</p>
      <p className="text-gray-600">{state} State</p>
      <Link
        to={`/universities/${id}`}
        className="mt-6 inline-block rounded-lg bg-blue-700 px-5 py-2 text-white hover:bg-blue-800"
      >
        View Details
      </Link>
    </div>
  );
}
