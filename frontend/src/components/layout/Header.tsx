import type { Provider } from "../../api/types";

type HeaderProps = {
  provider: Provider;
  onChangeProvider: (p: Provider) => void;
};

export function Header({ provider, onChangeProvider }: HeaderProps) {
  return (
    <header className="header">
      {/* App name / logo */}
      <h1 className="brand" style={{ margin: 0, fontWeight: 700, letterSpacing: ".3px" }}>
        DEEP Job Match AI
      </h1>

      {/* Provider toggle */}
      <div style={{ display: "flex", gap: 8 }}>
        <ProviderButton
          label="OpenAI"
          active={provider === "OpenAI"}
          onClick={() => onChangeProvider("OpenAI")}
        />
        <ProviderButton
          label="Gemini"
          active={provider === "Gemini"}
          onClick={() => onChangeProvider("Gemini")}
        />
      </div>
    </header>
  );
}

function ProviderButton({
  label, active, onClick,
}: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`btn ${active ? "provider-btn--active" : ""}`}
      style={{
        padding: "6px 14px",
        borderRadius: 8,
        border: active ? "1px solid #19a54a" : "1px solid rgba(255,255,255,.2)",
        background: active ? "rgba(29,185,84,.15)" : "transparent",
        color: active ? "#1db954" : "#ccc",
        fontWeight: 500,
        cursor: "pointer",
        fontSize: ".9rem",
        transition: "all .2s ease",
      }}
    >
      {label}
    </button>
  );
}
