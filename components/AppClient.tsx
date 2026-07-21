"use client";

import dynamic from "next/dynamic";

// Dynamically import App with ssr:false to prevent server-side rendering.
// The App component uses localStorage, window, and other browser-only APIs.
const App = dynamic(() => import("@/src/App"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        minHeight: "100dvh",
        backgroundColor: "#fff8f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{ textAlign: "center", color: "#9d4300", fontFamily: "sans-serif" }}
      >
        <div style={{ fontSize: 40, marginBottom: 8 }}>📖</div>
        <p style={{ margin: 0, fontSize: 16 }}>Loading CIE Daily...</p>
      </div>
    </div>
  ),
});

export default function AppClient() {
  return <App />;
}
