import React from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        {/* Modify this meta tag to disable zooming on mobile */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <title>nextcommerce</title>
        {/* Add other meta tags, links, and scripts here */}
      </head>
      <body>
        {children} {/* This will render your pages/components */}
      </body>
    </html>
  );
}
