import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
        <div id="modal" />
        <div
          id="portal"
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            zIndex: 9999,
          }}
        />
      </body>
    </Html>
  );
}
