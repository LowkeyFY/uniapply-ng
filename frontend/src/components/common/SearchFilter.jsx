export default function SearchFilter() {
  return (
    <div className="mt-10 rounded-xl bg-white p-6 shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">
        Search Universities
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        {/* State Filter */}
        <div>
          <label
            htmlFor="state"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            State
          </label>

          <select
            id="state"
            className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-600 focus:outline-none"
          >
            <option>All States</option>
            <option>Lagos</option>
            <option>Ogun</option>
            <option>Abuja (FCT)</option>
            <option>Oyo</option>
            <option>Rivers</option>
          </select>
        </div>

        {/* Course Filter */}
        <div>
          <label
            htmlFor="course"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Course
          </label>

          <select
            id="course"
            className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-600 focus:outline-none"
          >
            <option>All Courses</option>
            <option>Computer Science</option>
            <option>Medicine</option>
            <option>Law</option>
            <option>Accounting</option>
            <option>Engineering</option>
          </select>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button className="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white transition hover:bg-blue-800">
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
