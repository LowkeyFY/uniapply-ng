export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
        
        <h1 className="text-3xl font-bold text-blue-700">
          UniApply NG
        </h1>

        <div className="hidden items-center gap-8 md:flex">

          <a href="#" className="hover:text-blue-700">
            Home
          </a>

          <a href="#" className="hover:text-blue-700">
            Explore
          </a>

          <a href="#" className="hover:text-blue-700">
            Universities
          </a>

          <a href="#" className="hover:text-blue-700">
            Contact
          </a>

        </div>

        <button className="rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800">
          Get Started
        </button>

      </div>
    </nav>
  );
}
