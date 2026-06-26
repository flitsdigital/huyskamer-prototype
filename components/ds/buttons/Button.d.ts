import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  /** primary = red pill, secondary = outline, ghost = quiet text. */
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  /** Adapt secondary/ghost colours for a dark surface. */
  onDark?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  /** Override the rendered element (e.g. "a"). Auto-anchors when href is set. */
  as?: any;
  href?: string;
}
export declare function Button(props: ButtonProps): JSX.Element;
export default Button;
