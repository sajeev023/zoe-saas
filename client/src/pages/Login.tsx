import { useLocation } from "wouter";

export default function Login() {
  const [, navigate] = useLocation();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#05060e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "32px",
      }}
    >
      <div
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "48px",
          color: "#e8c97a",
          letterSpacing: "4px",
        }}
      >
        ZOE.
      </div>

      <div
        style={{
          background: "#080b16",
          border: "1px solid rgba(232,201,122,.22)",
          borderRadius: "16px",
          padding: "40px",
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <h2
          style={{
            color: "#eef0f8",
            fontSize: "22px",
            fontWeight: 600,
            textAlign: "center",
            marginBottom: "8px",
          }}
        >
          Sign in to continue
        </h2>

        {/* Fix: was missing opening tag in source doc — using <a> correctly */}
        <a
          href="/api/auth/google"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            background: "white",
            color: "#1a1a1a",
            border: "none",
            borderRadius: "8px",
            padding: "14px 24px",
            fontSize: "15px",
            fontWeight: 600,
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </a>

        <div
          style={{ textAlign: "center", color: "#4e6080", fontSize: "13px" }}
        >
          or
        </div>

        <button
          onClick={() => navigate("/onboarding")}
          style={{
            background: "transparent",
            color: "#9eadc8",
            border: "1px solid rgba(255,255,255,.055)",
            borderRadius: "8px",
            padding: "12px 24px",
            fontSize: "14px",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "rgba(232,201,122,.4)";
            (e.currentTarget as HTMLButtonElement).style.color = "#e8c97a";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "rgba(255,255,255,.055)";
            (e.currentTarget as HTMLButtonElement).style.color = "#9eadc8";
          }}
        >
          Continue as Guest (Demo Mode)
        </button>

        <p
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: "#4e6080",
            marginTop: "8px",
          }}
        >
          No credit card required · Cancel anytime
        </p>
      </div>
    </div>
  );
}
