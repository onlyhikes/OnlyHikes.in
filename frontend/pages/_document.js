import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en" className="dark">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@800,900,700,500,400&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="bg-charcoal-950 text-offwhite antialiased font-sans selection:bg-acid selection:text-charcoal-950">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
