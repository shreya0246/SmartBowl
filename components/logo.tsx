import * as React from "react";

export function Logo() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="14" cy="14" r="10" stroke="#806a9f" strokeWidth="1.6" />
      <path
        d="M10 14a4 4 0 118 0h0a4 4 0 01-8 0Z"
        fill="#b8a5d8"
      />
      <circle cx="11" cy="11.5" r="0.9" fill="#e2574c" />
      <circle cx="16.5" cy="12.5" r="0.8" fill="#3b5bdb" />
      <circle cx="13.5" cy="16" r="0.7" fill="#d4a373" />
      <circle cx="15.5" cy="15.5" r="0.45" fill="#33313a" opacity="0.6" />
    </svg>
  );
}
