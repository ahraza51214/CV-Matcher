import type { Provider } from "../../api/types";

type Props = {
  provider: Provider;
  onChange: (p: Provider) => void;
};

export function ProviderToggle({ provider, onChange }: Props) {
  const providers: Provider[] = ["OpenAI", "Gemini", "Claude", "Ensemble"];

  return (
    <div className="provider-toggle">
      {providers.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`provider-toggle__btn${provider === p ? " provider-toggle__btn--active" : ""}`}
        >
          {p}
        </button>
      ))}
    </div>
  );
}
