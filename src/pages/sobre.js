import Head from 'next/head';

export default function Sobre() {
  return (
    <>
      <Head>
        <title>Sobre nós | Simulador Minha Casa Minha Vida</title>
        <meta name="description" content="Conheça mais sobre o Simulador Minha Casa Minha Vida, nossa missão e quem está por trás do projeto." />
        <link rel="canonical" href="https://simuleminhacasa.com.br/sobre" />
      </Head>
      <div className="simulator-container">
        <div className="simulator-card">
          <h1>Sobre nós</h1>
          <p>
            O <strong>Simulador Minha Casa Minha Vida</strong> foi criado para ajudar brasileiros a entenderem melhor as condições de financiamento habitacional, de forma simples, transparente e gratuita.
          </p>
          <p>
            Nossa missão é democratizar o acesso à informação e facilitar o sonho da casa própria. Somos uma equipe apaixonada por tecnologia e impacto social.
          </p>
          <p>
            Se tiver dúvidas ou sugestões, entre em contato pelo e-mail: <a href="mailto:contato@simuleminhacasa.com.br">contato@simuleminhacasa.com.br</a>
          </p>
        </div>
      </div>
    </>
  );
}