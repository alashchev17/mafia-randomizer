import { FC, ReactNode } from "react";

interface Props {
  /** BEM block whose `--centered` modifier centers the content (e.g. "mp-room"). */
  base: string;
  children: ReactNode;
}

/** Centered wrapper used for loading/empty/error states across pages. */
const CenteredMessage: FC<Props> = ({ base, children }) => (
  <div className={`${base} ${base}--centered`}>{children}</div>
);

export default CenteredMessage;
