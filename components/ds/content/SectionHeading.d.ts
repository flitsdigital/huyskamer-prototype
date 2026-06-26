import * as React from "react";
export interface SectionHeadingProps extends React.HTMLAttributes<HTMLElement> {
  /** Handwritten script line above the title. */
  eyebrow?: string;
  title?: string;
  description?: string;
  align?: "left" | "center" | "right";
  onDark?: boolean;
  /** Override eyebrow colour (defaults to the heading colour). */
  eyebrowColor?: string;
}
export declare function SectionHeading(props: SectionHeadingProps): JSX.Element;
export default SectionHeading;
