'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Something went wrong!</h1>
          <p>{error.message}</p>
          <button onClick={() => reset()}>Try again</button>
        </div>
      </body>
    </html>
  );
}