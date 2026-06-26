import * as React from "react";
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Handwritten (script) field label. */
  label?: string;
  hint?: string;
  error?: string;
}
export declare function Input(props: InputProps): JSX.Element;
export default Input;
