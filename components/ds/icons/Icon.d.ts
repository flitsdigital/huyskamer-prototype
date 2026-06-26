import * as React from "react";

export type IconName =
  | "menu" | "close" | "arrow-right" | "chevron-down" | "chevron-right"
  | "users" | "gift" | "scan" | "list"
  | "phone" | "mail" | "map-pin" | "clock"
  | "info" | "check" | "check-circle" | "star"
  | "instagram" | "facebook" | "whatsapp";

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, "name"> {
  /** Which glyph to render. */
  name: IconName;
  /** Pixel size of the square icon. Default 24. */
  size?: number | string;
  /** Stroke width for line icons. Default 2. */
  strokeWidth?: number;
  /** Convenience colour override (otherwise inherits currentColor). */
  color?: string;
}

/** A single-colour line/solid icon on a 24×24 grid (Lucide-equivalent of the Figma Relume set). */
export declare function Icon(props: IconProps): JSX.Element;
export default Icon;
