import * as React from "react";
export interface MenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  /** Number (auto-formats to "€ 7,50") or a pre-formatted string. */
  price?: number | string;
  description?: string;
  /** Appends a muted "(V)" vegetarian marker. */
  vegetarian?: boolean;
}
export declare function MenuItem(props: MenuItemProps): JSX.Element;
export default MenuItem;
