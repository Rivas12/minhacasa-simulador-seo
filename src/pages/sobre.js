import Head from 'next/head';
import { useRouter } from 'next/navigation';

export default function Sobre() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Sobre nós | Simulador Minha Casa Minha Vida</title>
        <meta name="description" content="Conheça mais sobre o Simulador Minha Casa Minha Vida, nossa missão e quem está por trás do projeto." />
        <link rel="canonical" href="https://simuleminhacasa.com.br/sobre" />
      </Head>
      <div className="simulator-container">
        <div className="simulator-card">
          <h1 className="handwritten-title">Sobre nós</h1>
          <div className="terms-content">
            <p>
                O <strong>Simulador Minha Casa Minha Vida</strong> é a principal plataforma online gratuita dedicada a facilitar o acesso ao <strong>programa Minha Casa Minha Vida</strong> em todo o Brasil. Nosso site foi criado para ajudar brasileiros de todas as regiões a entenderem como funciona o financiamento habitacional, simularem condições de crédito e realizarem o sonho da casa própria de forma simples, rápida e segura.
            </p>
            <p>
                Aqui, você encontra informações atualizadas sobre as regras do <strong>Minha Casa Minha Vida</strong>, requisitos para participar, faixas de renda, taxas de juros, subsídios do governo federal, documentação necessária e dicas para aumentar suas chances de aprovação no financiamento. Nosso simulador permite que você compare diferentes cenários, visualize valores de parcelas, prazos e descubra qual a melhor opção para o seu perfil.
            </p>
            <p>
                Nossa missão é democratizar o acesso à moradia digna, tornando o processo de simulação de financiamento habitacional transparente e acessível para todos. Trabalhamos diariamente para manter nossos conteúdos atualizados, alinhados com as últimas mudanças do governo e das instituições financeiras, garantindo que você tenha sempre as melhores informações para tomar decisões seguras.
            </p>
            <p>
                Somos uma equipe apaixonada por tecnologia, inovação e impacto social. Acreditamos que o acesso à informação é fundamental para transformar vidas e comunidades. Por isso, desenvolvemos uma ferramenta intuitiva, segura e fácil de usar, pensada para quem busca conquistar o primeiro imóvel ou melhorar de vida por meio do <strong>Minha Casa Minha Vida</strong>.
            </p>
            <p>
                Além do simulador, oferecemos artigos, guias completos, perguntas frequentes e notícias sobre habitação popular, financiamento imobiliário e dicas para organizar sua vida financeira. Nosso compromisso é ser referência em conteúdo de qualidade sobre o <strong>Minha Casa Minha Vida</strong> e ajudar você em todas as etapas do processo.
            </p>
            <p>
                Se você tem dúvidas, sugestões ou deseja saber mais sobre o <strong>Simulador Minha Casa Minha Vida</strong>, entre em contato conosco pelo e-mail: <a href="mailto:contato@simuleminhacasa.com.br">contato@simuleminhacasa.com.br</a>. Nossa equipe está pronta para ajudar e responder rapidamente.
            </p>
            <p>
                Aproveite para explorar nosso simulador, leia nossos conteúdos exclusivos e descubra como o <strong>Minha Casa Minha Vida</strong> pode transformar sua vida e da sua família. Faça sua simulação agora mesmo e dê o primeiro passo rumo ao seu novo lar!
            </p>
          </div>
            <button 
            className="simulate-button"
            onClick={() => router.push('/')}
            >
            Voltar para o simulador
            </button>
        </div>
      </div>
    </>
  );
}