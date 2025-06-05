import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Simulador Minha Casa Minha Vida</title>
        <meta
          name="description"
          content="Utilize nosso simulador para calcular seu financiamento pelo programa Minha Casa Minha Vida de forma rápida e fácil."
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Simulador Minha Casa Minha Vida" />
        <meta
          property="og:description"
          content="Simule seu financiamento Minha Casa Minha Vida de forma rápida e fácil."
        />
        <meta property="og:image" content="/imagem-compartilhamento.png" />
        <meta property="og:url" content="https://simuleminhacasa.com.br/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Simulador Minha Casa Minha Vida" />
        <meta name="twitter:description" content="Simule seu financiamento Minha Casa Minha Vida de forma rápida e fácil." />
        <meta name="twitter:image" content="/imagem-compartilhamento.png" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
