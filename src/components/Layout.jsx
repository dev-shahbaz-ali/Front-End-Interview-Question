import * as React from "react";
import "./App.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <style>{`
          html {
            font-family: sans-serif;
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
