import * as React from "react";
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Handwritten (script) field label. */
  label?: string;
  hint?: string;
  error?: string;
}
export declare function Textarea(props: TextareaProps): JSX.Element;
export default Textarea;
