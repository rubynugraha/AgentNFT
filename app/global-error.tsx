"use client";

import React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);

  return (
    <html lang="en">
      <body>
        <h2>Something went wrong!</h2>
        <p>{error.message}</p>

        <button
          onClick={() => reset()}
          style={{
            padding: "10px 20px",
            marginTop: "20px",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}