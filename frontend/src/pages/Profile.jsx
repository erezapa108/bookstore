import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const defaultMessages = [
  {
    id: 1,
    title: "Pesanan dikonfirmasi",
    body: "Pesanan bukumu telah kami terima dan sedang diproses.",
  },
  {
    id: 2,
    title: "Promo minggu ini",
    body: "Diskon 15% untuk buku self-development khusus member.",
  },
];

const defaultNotifications = [
  {
    id: 1,
    title: "Stok buku baru",
    body: "Buku bestseller terbaru sudah tersedia kembali.",
  },
  {
    id: 2,
    title: "Wishlist siap dibeli",
    body: "Beberapa buku favoritmu sedang dalam promo hari ini.",
  },
];

function Profile() {
  const { user, updateProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const initialTab =
    new URLSearchParams(location.search).get("tab") || "profile";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    photoUrl: user?.photoUrl || "",
    bio: user?.bio || "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const switchTab = (nextTab) => {
    setActiveTab(nextTab);
    navigate(`/profile${nextTab === "profile" ? "" : `?tab=${nextTab}`}`);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateProfile({
      ...user,
      ...formData,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      photoUrl: formData.photoUrl,
      bio: formData.bio,
    });
    setStatus("Profil berhasil diperbarui.");
  };

  const initial = (formData.name || user?.name || "U").charAt(0).toUpperCase();

  return (
    <div
      style={{ maxWidth: "1100px", margin: "0 auto", padding: "8px 20px 40px" }}
    >
      <div style={{ ...panelStyle, marginBottom: "18px" }}>
        <div
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "#2F6F5E",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "28px",
              fontWeight: 700,
            }}
          >
            {initial}
          </div>
          <div>
            <h2 style={{ margin: "0 0 4px", color: "#2F6F5E" }}>
              {formData.name || user?.name || "Pengguna Bookzone"}
            </h2>
            <p style={{ margin: 0, color: "#6B7280" }}>
              {formData.email || user?.email || "Belum ada email"}
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "18px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => switchTab("profile")}
          style={tabStyle(activeTab === "profile")}
        >
          Profil
        </button>
        <button
          onClick={() => switchTab("messages")}
          style={tabStyle(activeTab === "messages")}
        >
          Pesan
        </button>
        <button
          onClick={() => switchTab("notifications")}
          style={tabStyle(activeTab === "notifications")}
        >
          Notifikasi
        </button>
      </div>

      {activeTab === "profile" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: "20px",
          }}
        >
          <div style={panelStyle}>
            <h3 style={{ marginTop: 0, color: "#2F6F5E" }}>Update Profil</h3>
            <form onSubmit={handleSubmit}>
              <label style={labelStyle}>Nama lengkap</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={inputStyle}
              />

              <label style={labelStyle}>Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                style={inputStyle}
              />

              <label style={labelStyle}>Nomor telepon</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={inputStyle}
              />

              <label style={labelStyle}>Alamat</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                style={{ ...inputStyle, minHeight: "90px" }}
              />

              <label style={labelStyle}>URL Foto Profil</label>
              <input
                name="photoUrl"
                value={formData.photoUrl}
                onChange={handleChange}
                style={inputStyle}
                placeholder="https://example.com/avatar.jpg"
              />

              <label style={labelStyle}>Bio singkat</label>
              <input
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                style={inputStyle}
                placeholder="Saya suka membaca novel dan self-development"
              />

              {status && (
                <p style={{ color: "#2F6F5E", marginBottom: "10px" }}>
                  {status}
                </p>
              )}
              <button type="submit" style={buttonStyle}>
                Simpan Profil
              </button>
            </form>
          </div>

          <div style={panelStyle}>
            <h3 style={{ marginTop: 0, color: "#2F6F5E" }}>Preview Foto</h3>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "14px",
              }}
            >
              {formData.photoUrl ? (
                <img
                  src={formData.photoUrl}
                  alt="Foto profil"
                  style={{
                    width: "140px",
                    height: "140px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "3px solid #E8DFCC",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "140px",
                    height: "140px",
                    borderRadius: "50%",
                    background: "#F4EEDC",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#2F6F5E",
                    fontSize: "42px",
                    fontWeight: 700,
                  }}
                >
                  {initial}
                </div>
              )}
            </div>
            <p style={{ margin: 0, color: "#3D3A34" }}>
              {formData.bio ||
                "Tambahkan bio singkat agar profilmu semakin personal."}
            </p>
            <div
              style={{
                marginTop: "14px",
                padding: "12px",
                background: "#F8F4EA",
                borderRadius: "12px",
              }}
            >
              <strong>Alamat</strong>
              <p style={{ margin: "6px 0 0", color: "#6B7280" }}>
                {formData.address || "Belum ada alamat"}
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "messages" && (
        <div style={panelStyle}>
          <h3 style={{ marginTop: 0, color: "#2F6F5E" }}>Pesan</h3>
          {defaultMessages.map((item) => (
            <div
              key={item.id}
              style={{ padding: "12px 0", borderBottom: "1px solid #F0E9DA" }}
            >
              <strong>{item.title}</strong>
              <p style={{ margin: "4px 0 0", color: "#6B7280" }}>{item.body}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "notifications" && (
        <div style={panelStyle}>
          <h3 style={{ marginTop: 0, color: "#2F6F5E" }}>Notifikasi</h3>
          {defaultNotifications.map((item) => (
            <div
              key={item.id}
              style={{ padding: "12px 0", borderBottom: "1px solid #F0E9DA" }}
            >
              <strong>{item.title}</strong>
              <p style={{ margin: "4px 0 0", color: "#6B7280" }}>{item.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const panelStyle = {
  background: "#fff",
  borderRadius: "20px",
  padding: "20px",
  boxShadow: "0 12px 30px rgba(61, 58, 52, 0.08)",
  border: "1px solid #EEE7D7",
};

const tabStyle = (active) => ({
  border: active ? "1px solid #2F6F5E" : "1px solid #DDD6C4",
  background: active ? "#2F6F5E" : "#fff",
  color: active ? "#fff" : "#2F6F5E",
  padding: "8px 14px",
  borderRadius: "999px",
  cursor: "pointer",
});

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  marginBottom: "10px",
  borderRadius: "10px",
  border: "1px solid #DDD6C4",
  boxSizing: "border-box",
};

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  color: "#3D3A34",
  fontWeight: 600,
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "10px",
  border: "none",
  background: "#2F6F5E",
  color: "#fff",
  cursor: "pointer",
};

export default Profile;
