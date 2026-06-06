import { FC, useMemo } from "react";

import "./index.scss";

interface Props {
  username: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const PALETTE = ["#b11f1f", "#1f6db1", "#1fb16d", "#b1671f", "#7a1fb1", "#1fa3b1", "#b11f7a", "#4a5a8a"];

const hashString = (value: string): number => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
};

const buildInitials = (username: string): string => {
  const trimmed = username.trim();
  if (!trimmed) return "?";
  const words = trimmed.split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return trimmed.slice(0, 2).toUpperCase();
};

const Avatar: FC<Props> = ({ username, size = "md", className }) => {
  const initials = useMemo(() => buildInitials(username), [username]);
  const background = useMemo(() => PALETTE[hashString(username) % PALETTE.length], [username]);

  const rootClassName = `avatar avatar--${size}${className ? ` ${className}` : ""}`;

  return (
    <div className={rootClassName} style={{ backgroundColor: background }} aria-label={username} role="img">
      <span className="avatar__initials">{initials}</span>
    </div>
  );
};

export default Avatar;
