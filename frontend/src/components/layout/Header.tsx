import type { Provider } from "../../api/types";
import { ProviderToggle } from "./ProviderToggle";

type HeaderProps = {
  provider: Provider;
  onChangeProvider: (p: Provider) => void;
};

export function Header({ provider, onChangeProvider }: HeaderProps) {
  return (
    <header className="header">
      <h1 className="brand header__title">DEEP Job Match AI</h1>
      <ProviderToggle provider={provider} onChange={onChangeProvider} />
    </header>
  );
}
