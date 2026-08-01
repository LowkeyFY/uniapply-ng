import { useEffect, useState } from "react";
import UniversityCard from "../../components/common/UniversityCard";
import { getStates, getUniversities } from "../../api/universities";

export default function Explore() {
  const [universities, setUniversities] = useState([]);
  const [statesById, setStatesById] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [statesData, universitiesData] = await Promise.all([
          getStates(),
          getUniversities(),
        ]);

        const stateMap = {};
        statesData.forEach((s) => {
          stateMap[s.id] = s.name;
        });

        setStatesById(stateMap);
        setUniversities(universitiesData);
      } catch (err) {
        setError("Could not load universities. Is the backend running?");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-8 py-16">
      <h1 className="text-4xl font-bold">Explore Universities</h1>
      <p className="mt-3 text-gray-600">
        Browse universities based on your preferred state and course.
      </p>

      {loading && <p className="mt-12 text-gray-500">Loading universities...</p>}
      {error && <p className="mt-12 text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {universities.map((university) => (
<UniversityCard
  key={university.id}
  id={university.id}
  name={university.name}
  type={university.type}
  state={statesById[university.state_id] || "Unknown"}
/>
          ))}
        </div>
      )}
    </div>
  );
}
