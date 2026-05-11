// AmbienteOn - Calculadora de Crédito de Carbono Rural
// Lógica isolada do main.js para não conflitar com o resto do sistema.

(function () {
  'use strict';

  // ---------- PARÂMETROS DO CÁLCULO ----------
  // Fatores médios de absorção de CO2 por hectare/ano para vegetação nativa em pé.
  // Valores conservadores baseados em literatura de REDD+ Brasil.
  // Ajustar conforme metodologia VERRA específica do projeto.
  const FATORES_BIOMA = {
    amazonia:       { absorcao: 6.5, nome: 'Amazônia' },
    mata_atlantica: { absorcao: 5.0, nome: 'Mata Atlântica' },
    cerrado:        { absorcao: 3.5, nome: 'Cerrado' },
    pantanal:       { absorcao: 3.0, nome: 'Pantanal' },
    pampa:          { absorcao: 2.5, nome: 'Pampa' },
    caatinga:       { absorcao: 2.0, nome: 'Caatinga' }
  };

  // Cotação de referência do crédito de carbono no mercado voluntário (VERRA).
  // Atualizar periodicamente. Em 2025 o mercado oscila entre R$ 25 e R$ 80 por tCO2.
  const PRECO_CREDITO_BRL = 40;

  // Parcela líquida para o produtor após descontar custos de desenvolvimento,
  // certificação, monitoramento e comissão de gestão.
  const PARCELA_LIQUIDA_PRODUTOR = 0.70;

  // ---------- HELPERS ----------
  function formatBRL(valor) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    });
  }

  function formatBRLcompacto(valor) {
    if (valor >= 1_000_000) {
      return 'R$ ' + (valor / 1_000_000).toFixed(2).replace('.', ',') + ' mi';
    }
    if (valor >= 1_000) {
      return 'R$ ' + (valor / 1_000).toFixed(0) + ' mil';
    }
    return formatBRL(valor);
  }

  function formatNumero(valor) {
    return valor.toLocaleString('pt-BR', { maximumFractionDigits: 0 });
  }

  // ---------- CÁLCULO PRINCIPAL ----------
  function calcularCarbonoRural(input) {
    const { hectares, biomaKey, anos } = input;
    const bioma = FATORES_BIOMA[biomaKey];
    if (!bioma) throw new Error('Bioma inválido: ' + biomaKey);

    const tcoAno = hectares * bioma.absorcao;
    const receitaBrutaAno = tcoAno * PRECO_CREDITO_BRL;
    const receitaLiquidaAno = receitaBrutaAno * PARCELA_LIQUIDA_PRODUTOR;
    const receitaTotal = receitaLiquidaAno * anos;
    const creditosTotais = tcoAno * anos;

    return {
      biomaNome: bioma.nome,
      absorcaoFator: bioma.absorcao,
      hectares,
      anos,
      tcoAno,
      receitaBrutaAno,
      receitaLiquidaAno,
      receitaTotal,
      creditosTotais,
      precoCredito: PRECO_CREDITO_BRL,
      parcelaLiquida: PARCELA_LIQUIDA_PRODUTOR
    };
  }

  // ---------- RENDER ----------
  function classificarPorte(hectares) {
    if (hectares < 100) return { label: 'Propriedade pequena', cor: 'warning' };
    if (hectares < 500) return { label: 'Propriedade média', cor: 'success' };
    if (hectares < 2000) return { label: 'Propriedade média-grande', cor: 'primary' };
    return { label: 'Grande propriedade', cor: 'primary' };
  }

  function renderResultado(resultado) {
    const $ = (id) => document.getElementById(id);

    $('crResultado').style.display = 'block';
    $('crLabelAnos').textContent = resultado.anos;
    $('crReceitaTotal').textContent = formatBRLcompacto(resultado.receitaTotal);
    $('crTcoAno').textContent = formatNumero(resultado.tcoAno) + ' tCO₂';
    $('crReceitaBruta').textContent = formatBRL(resultado.receitaBrutaAno) + '/ano';
    $('crReceitaLiquida').textContent = formatBRL(resultado.receitaLiquidaAno) + '/ano';
    $('crCreditosTotais').textContent = formatNumero(resultado.creditosTotais) + ' VCUs';

    const porte = classificarPorte(resultado.hectares);
    const badge = $('crResumoBadge');
    badge.textContent = porte.label;
    badge.className = 'cr-resultado-badge cr-badge-' + porte.cor;

    $('crBreakdownTexto').innerHTML =
      `Sua área de <strong>${formatNumero(resultado.hectares)} ha</strong> de ` +
      `<strong>${resultado.biomaNome}</strong> absorve em média ` +
      `<strong>${resultado.absorcaoFator} tCO₂ por hectare/ano</strong>, totalizando ` +
      `<strong>${formatNumero(resultado.tcoAno)} tCO₂ anuais</strong>. ` +
      `Com a cotação de referência de <strong>${formatBRL(resultado.precoCredito)}/tCO₂</strong> ` +
      `no mercado voluntário VERRA, a receita bruta seria de ` +
      `<strong>${formatBRL(resultado.receitaBrutaAno)}/ano</strong>. ` +
      `Após custos de desenvolvimento, validação e monitoramento ` +
      `(estimados em ${Math.round((1 - resultado.parcelaLiquida) * 100)}%), o produtor recebe ` +
      `<strong>${formatBRL(resultado.receitaLiquidaAno)} por ano líquidos</strong>, ` +
      `acumulando <strong>${formatBRLcompacto(resultado.receitaTotal)}</strong> ao longo de ` +
      `${resultado.anos} anos de projeto.`;

    // Salvar para uso em contato (integra com o sistema cross-page do main.js)
    try {
      localStorage.setItem('ao_carbono_rural', JSON.stringify({
        hectares: resultado.hectares,
        bioma: resultado.biomaNome,
        anos: resultado.anos,
        tcoAno: Math.round(resultado.tcoAno),
        receitaTotal: Math.round(resultado.receitaTotal),
        receitaLiquidaAno: Math.round(resultado.receitaLiquidaAno)
      }));
    } catch (e) {
      console.warn('Não foi possível salvar no localStorage:', e);
    }
  }

  // ---------- EVENTOS ----------
  function init() {
    const form = document.getElementById('formCarbonoRural');
    if (!form) return; // página não carregada

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const hectares = parseFloat(document.getElementById('cr-hectares').value);
      const biomaKey = document.getElementById('cr-bioma').value;
      const estado = document.getElementById('cr-estado').value;
      const anos = parseInt(document.getElementById('cr-anos').value, 10);

      if (!hectares || hectares <= 0) {
        alert('Informe a área de mata em hectares.');
        return;
      }
      if (!biomaKey) {
        alert('Selecione o bioma predominante.');
        return;
      }
      if (!estado) {
        alert('Selecione o estado.');
        return;
      }

      try {
        const resultado = calcularCarbonoRural({ hectares, biomaKey, anos });
        renderResultado(resultado);

        document.getElementById('crResultado').scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      } catch (err) {
        console.error('Erro no cálculo:', err);
        alert('Ocorreu um erro no cálculo. Verifique os dados e tente novamente.');
      }
    });

    // Botão "Solicitar Análise Técnica" no resultado
    const btnAnalise = document.getElementById('crSolicitarAnalise');
    if (btnAnalise) {
      btnAnalise.addEventListener('click', function () {
        // Preencher pré-formulário com dados da fazenda
        const hectares = document.getElementById('cr-hectares').value;
        const fazendaInput = document.getElementById('lead-area');
        if (fazendaInput && hectares) fazendaInput.value = hectares;

        // Scroll para o formulário
        document.getElementById('contato-rural').scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        setTimeout(() => {
          const nomeInput = document.getElementById('lead-nome');
          if (nomeInput) nomeInput.focus();
        }, 600);
      });
    }

    // FAQ accordion
    document.querySelectorAll('.cr-faq-question').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const item = btn.parentElement;
        const isOpen = item.classList.contains('cr-faq-open');

        // Fechar todos
        document.querySelectorAll('.cr-faq-item').forEach(function (i) {
          i.classList.remove('cr-faq-open');
          const icon = i.querySelector('.cr-faq-icon');
          if (icon) icon.textContent = '+';
        });

        // Abrir o clicado (se não estava aberto)
        if (!isOpen) {
          item.classList.add('cr-faq-open');
          const icon = btn.querySelector('.cr-faq-icon');
          if (icon) icon.textContent = '−';
        }
      });
    });

    // Formulário de lead
    const formLead = document.getElementById('formLeadRural');
    if (formLead) {
      formLead.addEventListener('submit', function (e) {
        e.preventDefault();

        const submitBtn = formLead.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;

        const data = {
          nome: document.getElementById('lead-nome').value,
          whatsapp: document.getElementById('lead-whatsapp').value,
          email: document.getElementById('lead-email').value,
          fazenda: document.getElementById('lead-fazenda').value,
          area: document.getElementById('lead-area').value,
          municipio: document.getElementById('lead-municipio').value,
          origem: 'calculadora-carbono-rural',
          calculo: JSON.parse(localStorage.getItem('ao_carbono_rural') || 'null')
        };

        // Simulação de envio - substituir por chamada real (Formspree/backend)
        setTimeout(function () {
          const protocolo = 'AOC' + Date.now().toString().slice(-6);
          console.log('Lead Carbono Rural:', data, 'Protocolo:', protocolo);

          alert(
            '✅ Solicitação recebida!\n\n' +
            'Protocolo: ' + protocolo + '\n\n' +
            'Em até 24h úteis um especialista entra em contato pelo WhatsApp ' + data.whatsapp + '.'
          );

          formLead.reset();
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 1500);
      });
    }
  }

  // Inicializar quando DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expor para testes/console
  window.CarbonoRural = {
    calcular: calcularCarbonoRural,
    FATORES_BIOMA,
    PRECO_CREDITO_BRL,
    PARCELA_LIQUIDA_PRODUTOR
  };
})();
