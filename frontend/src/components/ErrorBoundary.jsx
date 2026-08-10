import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error tertangkap oleh ErrorBoundary: ", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "#3d3a34",
          }}
        >
          <p style={{ fontSize: "48px", margin: "0" }}>⚠</p>
          <h2 style={{ margin: "12px 0 8px" }}>
            Terjadi kesalahan pada Aplikasi
          </h2>
          <p style={{ color: "#6b7280", marginBottom: "20px" }}>
            Silahkan muat ulang halaman. Jika masalah berlanjut, hubungi admin.
          </p>
          <button
            onClick={this.handleReload}
            style={{
              padding: "10px 20px",
              backgroundColor: "#2f6f5e",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Muat Ulang Halaman
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
