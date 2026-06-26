import * as React from "react";
export interface TestimonialProps extends React.HTMLAttributes<HTMLElement> {
  quote: React.ReactNode;
  /** Signed in handwritten script. */
  author?: string;
  /** Optional 0–5 star rating in brand red. */
  rating?: number;
  /** quiet = bare (default), card = sand card with shadow. */
  variant?: "quiet" | "card";
  onDark?: boolean;
}
export declare function Testimonial(props: TestimonialProps): JSX.Element;
export default Testimonial;
