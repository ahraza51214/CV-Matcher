import type { Provider } from "../../api/types";

type Props = {
  provider: Provider;
  onChange: (p: Provider) => void;
};

/**
 * ProviderToggle
 * --------------
 * - Compact reusable switch between model providers.
 * - Abstracted from Header to be reusable in settings or modals.
 */
export function ProviderToggle({ provider, onChange }: Props) {
  const providers: Provider[] = ["OpenAI", "Gemini"];

  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        background: "rgba(255,255,255,0.05)",
        borderRadius: 12,
        padding: 4,
      }}
    >
      {providers.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`provider-btn ${provider === p ? "active" : ""}`}
          style={{
            flex: 1,
            padding: "6px 12px",
            borderRadius: 8,
            border: "none",
            background:
              provider === p
                ? "rgba(255,255,255,0.2)"
                : "rgba(255,255,255,0.05)",
            color: provider === p ? "#fff" : "rgba(255,255,255,0.6)",
            cursor: "pointer",
            fontWeight: 500,
            transition: "background 0.2s ease",
          }}
        >
          {p}
        </button>
      ))}
    </div>
  );
}
