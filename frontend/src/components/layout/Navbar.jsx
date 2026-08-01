import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("access_token"));
  }, []);

  function handleLogout() {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    navigate("/");
  }

  const links = [
    { label: "Home", to: "/" },
    { label: "Explore", to: "/explore" },
    { label: "Eligibility Check", to: "/eligibility" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
        <Link to="/" className="text-3xl font-bold text-blue-700">
          UniApply NG
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link key={link.to} to={link.to} className="hover:text-blue-700">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="hover:text-blue-700">Dashboard</Link>
              <Link to="/profile" className="flex items-center gap-2 hover:text-blue-700" aria-label="Profile">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
                  <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
                </svg>
              </Link>
              <button onClick={handleLogout} className="rounded-lg border px-5 py-2 font-semibold hover:bg-gray-50">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-700">Login</Link>
              <Link to="/register" className="rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800">
                Get Started
              </Link>
            </>
          )}
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-2xl md:hidden" aria-label="Toggle menu">
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {mobileOpen && (
        <div className="flex flex-col gap-4 border-t px-8 py-6 md:hidden">
          {links.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}>
              {link.label}
            </Link>
          ))}
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              <Link to="/profile" onClick={() => setMobileOpen(false)}>Profile</Link>
              <button onClick={handleLogout} className="text-left">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="rounded-lg bg-blue-700 px-6 py-3 text-center font-semibold text-white">
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
