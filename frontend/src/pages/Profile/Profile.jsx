import { useState, useEffect } from "react";
import { getMyProfile, updateMyProfile, uploadPassportPhoto } from "../../api/users";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ date_of_birth: "", gender: "", lga: "", address: "" });
  const [photoFile, setPhotoFile] = useState(null);
  const [status, setStatus] = useState("");

  const [error, setError] = useState(null);

  useEffect(() => {
    getMyProfile()
      .then((res) => {
        setProfile(res.data);
        setForm({
          date_of_birth: res.data.date_of_birth || "",
          gender: res.data.gender || "",
          lga: res.data.lga || "",
          address: res.data.address || "",
        });
      })
      .catch((err) => {
        setError(err.response?.status === 401 ? "You need to log in first." : "Failed to load profile: " + err.message);
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Saving...");
    const res = await updateMyProfile(form);
    setProfile(res.data);
    setStatus("Saved.");
  };

  const handlePhotoUpload = async () => {
    if (!photoFile) return;
    setStatus("Uploading photo...");
    const res = await uploadPassportPhoto(photoFile);
    setProfile(res.data);
    setStatus("Photo uploaded.");
  };

  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!profile) return <p className="p-6">Loading profile...</p>;

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Passport Photo</label>
        <input type="file" accept="image/png,image/jpeg" onChange={(e) => setPhotoFile(e.target.files[0])} />
        <button type="button" onClick={handlePhotoUpload} className="ml-2 bg-blue-600 text-white px-3 py-1 rounded">
          Upload
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Date of Birth</label>
          <input type="date" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange} className="w-full border rounded px-3 py-2">
            <option value="">Select...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">LGA (Local Government Area)</label>
          <input type="text" name="lga" value={form.lga} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <textarea name="address" value={form.address} onChange={handleChange} rows={3} className="w-full border rounded px-3 py-2" />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Save Profile
        </button>
        {status && <p className="text-sm text-gray-500">{status}</p>}
      </form>
    </div>
  );
}
