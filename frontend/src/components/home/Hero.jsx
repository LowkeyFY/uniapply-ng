export default function Hero() {
  return (
    <section className="mx-auto flex min-h-[85vh] max-w-7xl items-center px-8">

      <div className="max-w-3xl">

        <p className="font-semibold text-blue-700">
          Nigerian University Admission Assistant
        </p>

        <h1 className="mt-5 text-6xl font-extrabold leading-tight">

          Discover the Right University

          <span className="block text-blue-700">

            Based on Your Results

          </span>

        </h1>

        <p className="mt-8 text-xl leading-8 text-gray-600">

          Upload your WAEC or JAMB result and instantly
          discover universities where you are eligible.

        </p>

        <div className="mt-10 flex gap-5">

          <button className="rounded-lg bg-blue-700 px-8 py-4 font-semibold text-white">
            Get Started
          </button>

          <button className="rounded-lg border px-8 py-4">
            Explore Universities
          </button>

        </div>

      </div>

    </section>
  );
}
