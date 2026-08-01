export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Upload Results",
      description: "Upload your WAEC or JAMB result securely.",
    },
    {
      number: "02",
      title: "Check Eligibility",
      description: "We compare your scores with university requirements.",
    },
    {
      number: "03",
      title: "Explore Universities",
      description: "Browse universities that match your profile.",
    },
    {
      number: "04",
      title: "Apply",
      description: "Start your admission journey with confidence.",
    },
  ];

  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-8">

        <div className="text-center">
          <h2 className="text-4xl font-bold">
            How It Works
          </h2>

          <p className="mt-4 text-gray-600">
            Four simple steps to finding your ideal university.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-4">

          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-xl bg-white p-8 shadow"
            >
              <span className="text-5xl font-extrabold text-blue-700">
                {step.number}
              </span>

              <h3 className="mt-6 text-2xl font-semibold">
                {step.title}
              </h3>

              <p className="mt-4 text-gray-600">
                {step.description}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}

