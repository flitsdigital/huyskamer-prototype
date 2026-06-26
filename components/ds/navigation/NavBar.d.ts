import * as React from "react";
export interface NavBarProps extends React.HTMLAttributes<HTMLElement> {
  brand?: string;
  links?: string[];
  activeLink?: string;
  cta?: string;
  onCta?: () => void;
  /** Called with the link label when a nav link is clicked. */
  onLink?: (label: string) => void;
  /** Called when the wordmark is clicked. */
  onBrand?: () => void;
  /** Filled bar instead of transparent-over-hero. */
  solid?: boolean;
}
export declare function NavBar(props: NavBarProps): JSX.Element;
export default NavBar;
