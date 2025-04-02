import { FC } from "react";

import "./index.scss";

interface DescriptionParagraphProps {
  descriptionText: string;
  descriptionStrong?: string;
}

const DescriptionParagraph: FC<DescriptionParagraphProps> = ({ descriptionStrong, descriptionText }) => {
  return (
    <p className="description">
      {descriptionStrong ? <span className="description__strong">{descriptionStrong} – </span> : ""}
      {descriptionText}
    </p>
  );
};

export default DescriptionParagraph;
