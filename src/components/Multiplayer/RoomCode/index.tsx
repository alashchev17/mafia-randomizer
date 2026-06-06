import { FC, useState } from "react";
import { useTranslation } from "react-i18next";

import "./index.scss";

interface Props {
  code: string;
  onCopied?: () => void;
}

const RoomCode: FC<Props> = ({ code, onCopied }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      onCopied?.();
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="room-code">
      <span className="room-code__label">{t("multiplayer.lobby.code")}</span>
      <span className="room-code__value">{code}</span>
      <button type="button" className="button button--outline" onClick={copy}>
        {copied ? t("multiplayer.lobby.codeCopied") : t("buttons.copyCode")}
      </button>
    </div>
  );
};

export default RoomCode;
