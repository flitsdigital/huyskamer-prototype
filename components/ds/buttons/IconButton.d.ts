import * as React from "react";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Icon element, e.g. <Icon name="whatsapp" size={20} />. */
  icon: React.ReactNode;
  /** Accessible label / tooltip. */
  label?: string;
  /** scrim = translucent dark disc, sand = soft sand disc, ghost, solid = red. */
  variant?: "scrim" | "sand" | "ghost" | "solid";
  /** Diameter in px. Default 43. */
  size?: number;
  onDark?: boolean;
  as?: any;
  href?: string;
}
export declare function IconButton(props: IconButtonProps): JSX.Element;
export default IconButton;
