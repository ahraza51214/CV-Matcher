// Toggle buttons to switch the active LLM provider.
import type { Provider } from "../../api/types";

type Props = {
  provider: Provider;
  onChange: (p: Provider) => void;
};

export function ProviderToggle({ provider, onChange }: Props) {
  const providers: Provider[] = ["ChatGPT", "Gemini", "Claude", "Fusion"];

  return (
    <div className="provider-toggle">
      {providers.map((p) => (
        <button
          key={p}
          // Update selected provider when clicked
          onClick={() => onChange(p)}
          className={`provider-toggle__btn${provider === p ? " provider-toggle__btn--active" : ""}`}
        >
          {p}
        </button>
      ))}
    </div>
  );
}
