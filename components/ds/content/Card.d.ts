import * as React from "react";
export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  /** Image URL — present = feature tile, absent = quiet value block. */
  image?: string;
  imageAlt?: string;
  /** CSS aspect-ratio for the image, e.g. "4 / 3". */
  aspectRatio?: string;
  eyebrow?: string;
  title?: string;
  body?: string;
  footer?: React.ReactNode;
  onDark?: boolean;
  align?: "left" | "center";
}
export declare function Card(props: CardProps): JSX.Element;
export default Card;
