import * as React from "react";
export interface StarRatingProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Filled stars (rounded). Default 5. */
  value?: number;
  max?: number;
  size?: number;
  color?: string;
}
export declare function StarRating(props: StarRatingProps): JSX.Element;
export default StarRating;
