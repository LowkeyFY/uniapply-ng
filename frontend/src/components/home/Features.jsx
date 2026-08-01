export default function Features() {
  const features = [
    {
      title: "Find Eligible Universities",
      description:
        "Instantly discover universities where your JAMB score meets the cutoff.",
    },
    {
      title: "Upload Results",
      description:
        "Upload your WAEC and JAMB results for automatic eligibility checks.",
    },
    {
      title: "Smart Recommendations",
      description:
        "Receive personalized university suggestions based on your results and preferred course.",
    },
  ];

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-8">

        <div className="text-center">
          <h2 className="text-4xl font-bold">
            Why Choose UniApply NG?
          </h2>

          <p className="mt-4 text-gray-600">
            Making university admission easier for Nigerian students.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">

          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border p-8 shadow-sm hover:shadow-lg transition"
            >
              <h3 className="text-2xl font-semibold text-blue-700">
                {feature.title}
              </h3>

              <p className="mt-4 text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
