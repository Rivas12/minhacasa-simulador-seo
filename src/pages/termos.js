'use client';
import { useRouter } from 'next/navigation';

export default function Termos() {
  const router = useRouter();

  return (
    <div className="simulator-container">
      <div className="simulator-card terms-card">
        <h1 className="handwritten-title">Termos e Condições</h1>
        
        <div className="terms-content">
          <section>
            <h2>1. Introdução</h2>
            <p>Bem-vindo ao Simulador Minha Casa Minha Vida. Ao utilizar este serviço, você concorda com os termos e condições descritos neste documento.</p>
          </section>

          <section>
            <h2>2. Natureza do Serviço</h2>
            <p>Este simulador fornece cálculos aproximados de financiamento imobiliário com base nas informações fornecidas. Os resultados são meramente informativos e não constituem uma oferta de crédito ou garantia de aprovação.</p>
          </section>

          <section>
            <h2>3. Precisão das Informações</h2>
            <p>Os valores, taxas e condições apresentados são aproximados e podem variar de acordo com a análise de crédito, políticas vigentes da Caixa Econômica Federal e outros fatores individuais não contemplados nesta simulação.</p>
          </section>

          <section className="data-usage-section">
            <h2 className="section-title">4. Uso de Dados Pessoais</h2>
            
            <div className="data-usage-content">
              <p className="important-notice">Ao utilizar nosso simulador, você concorda com a coleta e processamento dos dados fornecidos para fins de:</p>
              
                <span className="highlight">1. Realizar a simulação solicitada</span><br />
                <span className="highlight">2. Compartilhamento com imobiliárias e corretores parceiros</span> que possam oferecer imóveis adequados ao seu perfil<br />
                3. Análise de mercado e <span className="highlight">geração de leads qualificados</span> para o setor imobiliário<br />
                4. Melhorar nossos produtos e serviços<br />
                5. Cumprir obrigações legais<br /><br />
              
              <div className="data-sharing-notice">
                <p>Seus dados serão compartilhados com nossos parceiros comerciais do setor imobiliário para que possam entrar em contato e apresentar ofertas personalizadas. <strong>Ao utilizar este simulador, você autoriza expressamente este compartilhamento.</strong></p>
              </div>
              
              <p className="partner-commitment">Trabalhamos apenas com parceiros comprometidos com a proteção de dados e boas práticas comerciais.</p>
            </div>
          </section>

          <section>
            <h2>5. Direitos do Usuário</h2>
            <p>Você tem o direito de solicitar acesso, correção ou exclusão de seus dados pessoais a qualquer momento, enviando um e-mail para contato@minhacasaminhavida.com.br.</p>
          </section>

          <section>
            <h2>6. Limitação de Responsabilidade</h2>
            <p>Não nos responsabilizamos por decisões tomadas com base nas simulações realizadas. Recomendamos sempre consultar um especialista em financiamento imobiliário antes de tomar qualquer decisão financeira.</p>
          </section>

          <section>
            <h2>7. Alterações nos Termos</h2>
            <p>Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após sua publicação nesta página.</p>
          </section>
        </div>
        
        <button 
          className="simulate-button"
          onClick={() => router.push('/')}
        >
          Voltar para o simulador
        </button>
      </div>
    </div>
  );
}