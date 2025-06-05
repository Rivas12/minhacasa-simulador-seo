'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { NumericFormat, PatternFormat } from 'react-number-format';
import { supabase } from '../utils/supabaseClient';

export default function Page() {
  const router = useRouter();
  const inputRefs = useRef({});

  const [formData, setFormData] = useState({
    valor_apartamento: '',
    entrada: '',
    renda_familiar: 'até_2850',
    cotista_fgts: true,
    possui_dependentes: true,
    possui_saldo_fgts: true,
    saldo_fgts: 0,
    taxa_juros_anual: '4,25%',
    prazo_anos: 20,
    email: '',
    celular: '',
    concorda_termos: false,
    ip: '',
    cidade: '',
    estado: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [parcelaMensal, setParcelaMensal] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneDigits = formData.celular.replace(/\D/g, '');
    const newErrors = {};

    if (!formData.valor_apartamento || formData.valor_apartamento <= 0) newErrors.valor_apartamento = true;
    if (!formData.entrada || formData.entrada < 0) newErrors.entrada = true;
    if (!emailRegex.test(formData.email)) newErrors.email = true;
    if (phoneDigits.length !== 11) newErrors.celular = true;
    if (!formData.concorda_termos) newErrors.concorda_termos = true;

    setErrors(newErrors);

    setIsFormValid(Object.keys(newErrors).length === 0);
  };

  useEffect(() => {
    validateForm();
  }, [formData]);

  useEffect(() => {
    const getIpAndLocation = async (retryAttempt = 0) => {
      try {
        const response = await fetch('https://ipwho.is/');
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          ip: data.ip || '',
          cidade: data.city || '',
          estado: data.region_code || ''
        }));
      } catch (error) {
        if (retryAttempt < 2) {
          setTimeout(() => {
            getIpAndLocation(retryAttempt + 1);
          }, 1000);
        }
      }
    };
    getIpAndLocation();
  }, []);

  const calcularParcela = () => {
    const valorImovel = parseFloat(formData.valor_apartamento || 0);
    const entrada = parseFloat(formData.entrada || 0);
    const fgtsUsado = (formData.cotista_fgts)
      ? parseFloat(formData.saldo_fgts || 0)
      : 0;
    const valorFinanciado = valorImovel - entrada - fgtsUsado;
    const prazoMeses = parseInt(formData.prazo_anos || 0) * 12;
    let taxaAnual;
    if (typeof formData.taxa_juros_anual === 'string' && formData.taxa_juros_anual.includes('%')) {
      taxaAnual = parseFloat(formData.taxa_juros_anual.replace('%', '').replace(',', '.'));
    } else {
      taxaAnual = parseFloat(formData.taxa_juros_anual || 9);
    }
    const taxaMensal = taxaAnual / 100 / 12;
    if (valorFinanciado <= 0 || prazoMeses <= 0 || taxaMensal <= 0) return 0;
    const parcela = valorFinanciado * taxaMensal / (1 - Math.pow(1 + taxaMensal, -prazoMeses));
    return parcela;
  };

  const salvarLead = async (lead) => {
    const { data: existing, error: fetchError } = await supabase
      .from('leads')
      .select('*')
      .or(`email.eq.${lead.email},celular.eq.${lead.celular}`)
      .maybeSingle();
    if (fetchError) return { success: false, error: fetchError };
    if (existing) {
      const numero_cotacoes = (existing.numero_cotacoes || 1) + 1;
      const { data, error } = await supabase
        .from('leads')
        .update({ ...lead, numero_cotacoes })
        .eq('id', existing.id)
        .select();
      if (error) return { success: false, error };
      return { success: true, data };
    } else {
      const { data, error } = await supabase
        .from('leads')
        .insert([{ ...lead, numero_cotacoes: 1 }])
        .select();
      if (error) return { success: false, error };
      return { success: true, data };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setWasSubmitted(true); // Marca que tentou enviar
    validateForm();
    if (!isFormValid) return; // Não envia se inválido

    const parcela = calcularParcela();
    setParcelaMensal(parcela);
    setIsSubmitted(true);
    const leadData = {
      email: formData.email,
      celular: formData.celular.replace(/\D/g, ''),
      ip: formData.ip,
      cidade: formData.cidade,
      estado: formData.estado,
      valor_imovel: formData.valor_apartamento,
      valor_entrada: formData.entrada,
      renda_familiar: formData.renda_familiar,
      prazo_anos: formData.prazo_anos,
      saldo_fgts: formData.saldo_fgts,
      regime_de_trabalho: formData.cotista_fgts ? "CLT" : "Autônomo",
      possui_fgts: formData.possui_saldo_fgts,
      possui_dependentes: formData.possui_dependentes,
      concorda_termos: formData.concorda_termos,
      ultima_cotacao: new Date().toISOString()
    };
    try {
      await salvarLead(leadData);
    } catch (error) {}
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value || 0);
  };

  const handleNumberFormatChange = (name, values) => {
    const { floatValue } = values;
    if (name === 'saldo_fgts' && floatValue > 0) {
      setFormData(prev => ({
        ...prev,
        [name]: floatValue || 0,
        possui_saldo_fgts: true
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: floatValue || 0
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === 'sim'
    }));
  };

  return (
    <div className="simulator-container">
      <div className="simulator-card">
        <h1 className="handwritten-title">Simulador minha casa minha vida</h1>
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="form-section">
          <div className="form-row">
            {/* Valor do imóvel */}
            <div className="form-group">
              <label htmlFor="valor_apartamento">Valor do Imóvel aproximado</label>
              <NumericFormat
                id="valor_apartamento"
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                decimalScale={0}
                placeholder="R$ 0"
                onValueChange={(values) => handleNumberFormatChange('valor_apartamento', values)}
                value={formData.valor_apartamento}
                required
                className={"simple-input"}
                getInputRef={(el) => inputRefs.current.valor_apartamento = el}
                allowNegative={false}
              />
            </div>

            {/* Entrada */}
            <div className="form-group">
              <label htmlFor="entrada">Valor da Entrada</label>
              <NumericFormat
                id="entrada"
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                decimalScale={0}
                placeholder="R$ 0"
                onValueChange={(values) => handleNumberFormatChange('entrada', values)}
                value={formData.entrada}
                required
                className={"simple-input"}
                getInputRef={(el) => inputRefs.current.entrada = el}
                allowNegative={false}
              />
            </div>
          </div>

          <div className="form-row">
            {/* Renda familiar */}
            <div className="form-group">
              <label htmlFor="renda_familiar">Renda Familiar Mensal</label>
              <select
                id="renda_familiar"
                name="renda_familiar"
                value={formData.renda_familiar}
                onChange={(e) => {
                  const value = e.target.value;
                  let taxa = '4.25%';

                  if (value === 'até_2850') taxa = "4.25%";
                  else if (value === '2850_4700') taxa = "4.5%";
                  else if (value === '4700_8000') taxa = "5.5%";
                  else if (value === '8000_12000') taxa = "7.16%";

                  setFormData({
                    ...formData,
                    renda_familiar: value,
                    taxa_juros_anual: taxa, // Corrected from taxa_juros to taxa_juros_anual
                  });
                }}
                required
                className="simple-input"
              >
                <option value="até_2850">Até R$ 2.850,00</option>
                <option value="2850_4700">R$ 2.850,01 a R$ 4.700,00</option>
                <option value="4700_8000">R$ 4.700,01 a R$ 8.000,00</option>
                <option value="8000_12000">R$ 8.000,01 a R$ 12.000,00</option>
              </select>
            </div>

            {/* Taxa de juros */}
            <div className="form-group">
              <label htmlFor="taxa_juros_anual">Taxa de juros anual</label>
              <input
                type="text"
                id="taxa_juros_anual"
                name="taxa_juros_anual"
                value={formData.taxa_juros_anual}
                onChange={handleChange}
                placeholder=""
                className="simple-input disabled-input"
                disabled
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prazo_anos">Prazo (Anos)</label>
              <input
                type="number"
                id="prazo_anos"
                name="prazo_anos"
                value={formData.prazo_anos}
                onChange={handleChange}
                placeholder=""
                min="10"
                max="420"
                step="1"
                className="simple-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="saldo_fgts">Saldo FGTS</label>
              <NumericFormat
                id="saldo_fgts"
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                decimalScale={0}
                placeholder="R$ 0"
                onValueChange={(values) => handleNumberFormatChange('saldo_fgts', values)}
                value={formData.saldo_fgts}
                className={"simple-input"}
              />
            </div>

          </div>

        <div className="form-row">
          {/* Regime de trabalho Radio Buttons */}
          <div className="form-group">
            <label>Regime de trabalho</label>
            <div className="radio-group">
              <label className="radio-container">
                <input
                  type="radio"
                  name="cotista_fgts"
                  value="sim"
                  checked={formData.cotista_fgts === true}
                  onChange={handleRadioChange}
                />
                <span className="radio-label">CLT</span>
              </label>
              <label className="radio-container">
                <input
                  type="radio"
                  name="cotista_fgts"
                  value="nao"
                  checked={formData.cotista_fgts === false}
                  onChange={handleRadioChange}
                />
                <span className="radio-label">Autônomo</span>
              </label>
            </div>
          </div>
          
          {/* Dependentes Radio Buttons */}
          <div className="form-group">
            <label>Possui dependentes?</label>
            <div className="radio-group">
              <label className="radio-container">
                <input
                  type="radio"
                  name="possui_dependentes"
                  value="sim"
                  checked={formData.possui_dependentes === true}
                  onChange={handleRadioChange}
                />
                <span className="radio-label">Sim</span>
              </label>
              <label className="radio-container">
                <input
                  type="radio"
                  name="possui_dependentes"
                  value="nao"
                  checked={formData.possui_dependentes === false}
                  onChange={handleRadioChange}
                />
                <span className="radio-label">Não</span>
              </label>
            </div>
          </div>

          {/* Saldo FGTS Radio Buttons */}
          <div className="form-group">
            <label>Possui saldo no FGTS?</label>
            <div className="radio-group">
              <label className="radio-container">
                <input
                  type="radio"
                  name="possui_saldo_fgts"
                  value="sim"
                  checked={formData.possui_saldo_fgts === true}
                  onChange={handleRadioChange}
                />
                <span className="radio-label">Sim</span>
              </label>
              <label className="radio-container">
                <input
                  type="radio"
                  name="possui_saldo_fgts"
                  value="nao"
                  checked={formData.possui_saldo_fgts === false} // Fixed this line
                  onChange={handleRadioChange}
                />
                <span className="radio-label">Não</span>
              </label>
            </div>
          </div>

        </div>

        <div className="form-row">
            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Seu email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@gmail.com"
                required
                className={"simple-input"}
              />
            </div>

            {/* celular */}
            <div className="form-group">
              <label htmlFor="celular">Celular</label>
              <PatternFormat
                format="(##) #####-####"
                allowEmptyFormatting={false}
                mask="_"
                id="celular"
                name="celular"
                value={formData.celular}
                onValueChange={(values) => {
                  const { value } = values;
                  setFormData(prev => ({
                    ...prev,
                    celular: value
                  }));
                }}
                placeholder="(00) 00000-0000"
                required
                className="simple-input"
              />
            </div>
          </div>

          {/* Terms agreement checkbox */}
          <div className="form-group terms-checkbox">
            <label className="checkbox-container">
              <input
                type="checkbox"
                id="concorda_termos"
                name="concorda_termos"
                checked={formData.concorda_termos}
                onChange={handleChange}
                required
              />
              <span className="checkmark"></span>
              <span className="checkbox-label">
                Concordo com os <a href="#" onClick={(e) => { e.preventDefault(); router.push('/termos'); }}>termos e condições</a>
              </span>
            </label>
          </div>

          <button 
            type="submit" 
            className="simulate-button"
            style={{ 
              opacity: isFormValid ? 1 : 0.5,
              cursor: isFormValid ? 'pointer' : 'not-allowed' 
            }}
          >
            Quero minha simulação
          </button>
        </form>
        ) : (
          // Result section - only shown when submitted
          <div className="result-section">
          <h2>Resultado da Simulação</h2>
          <div className="result-grid">
            <div className="result-item">
              <span>Valor do Imóvel:</span>
              <span>{formatCurrency(formData.valor_apartamento)}</span>
            </div>
            <div className="result-item">
              <span>Entrada:</span>
              <span>{formatCurrency(formData.entrada)}</span>
            </div>
            <div className="result-item">
              <span>FGTS usado:</span>
              <span>{formData.possui_saldo_fgts ? formatCurrency(formData.saldo_fgts) : 'R$0,00'}</span>
            </div>
            {/* Calculate valor financiado properly */}
            {(() => {
              const valorFinanciado = formData.valor_apartamento - formData.entrada - 
                (formData.cotista_fgts && formData.possui_saldo_fgts ? formData.saldo_fgts : 0);
              return (
                <>
                  <div className="result-item">
                    <span>Valor Financiado:</span>
                    <span>{formatCurrency(valorFinanciado)}</span>
                  </div>
                  <div className="result-item">
                    <span>Prazo:</span>
                    <span>{formData.prazo_anos} anos ({formData.prazo_anos * 12} meses)</span>
                  </div>
                  <div className="result-item">
                    <span>Taxa de Juros anual:</span>
                    <span>{formData.taxa_juros_anual ? `${formData.taxa_juros_anual}` : '9% a.a. (padrão)'}</span>
                  </div>
                  <div className="result-item">
                    <span>Parcela estimada:</span>
                    <span>{formatCurrency(parcelaMensal)}</span>
                  </div>
                  <div className="result-item">
                    <span>Total de juros:</span>
                    <span>{formatCurrency((parcelaMensal * formData.prazo_anos * 12) - valorFinanciado)}</span>
                  </div>
                  <div className="result-item">
                    <span>Total a pagar:</span>
                    <span>{formatCurrency(parcelaMensal * (formData.prazo_anos * 12))}</span>
                  </div>
                </>
              );
            })()}
          </div>
          <button type="button" className="simulate-button" onClick={() => setIsSubmitted(false)}>
            Editar
          </button>
        </div>
        )}
      </div>
    </div>
  );
}
