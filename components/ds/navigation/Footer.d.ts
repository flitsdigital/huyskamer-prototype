import * as React from "react";
export interface FooterContact {
  name: string;
  address: string[];
  phone: string[];
  email: string;
}
/**
 * Site footer.
 */
export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  /** [day, hours] pairs; "Gesloten" rows render muted. */
  hours?: [string, string][];
  links?: string[];
  contact?: FooterContact;
  wordmark?: string;
  /** Sand surface (default) vs deep brown. */
  onSand?: boolean;
}
export declare function Footer(props: FooterProps): JSX.Element;
export default Footer;
