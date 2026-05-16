// Sistema AmbienteOn - JavaScript Principal

// ===== ANIMAÇÃO DE CONTADORES =====
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'));
  const duration = 1800;
  const start = performance.now();
  
  const update = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

// Inicia contadores quando ficam visíveis
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.metric-number').forEach(el => counterObserver.observe(el));

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.bento-card, .diff-card-v2, .tool-showcase-card, .float-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  revealObserver.observe(el);
});



// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registrado com sucesso:', registration.scope);
      })
      .catch(error => {
        console.log('Falha ao registrar ServiceWorker:', error);
      });
  });
}

// Função para rolar suavemente até uma seção
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

// Menu mobile toggle
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.ao-menu-toggle');
  const nav = document.querySelector('.ao-nav');
  
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      nav.classList.toggle('ao-nav-open');
    });
  }

  // Fechar menu ao clicar em links
  const navLinks = document.querySelectorAll('.ao-nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      nav.classList.remove('ao-nav-open');
    });
  });

  // Atualizar ano no footer
  const yearElement = document.getElementById('ao-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Sistema de seleção de serviços
  initializeServiceSelection();
  
  // Sistema de FAQ
  initializeFAQ();
  
  // Sistema de formulários
  initializeForms();
  
  // Sistema de Calculadora de Carbono
  initializeCalculator();
  
  // Sistema de Mapa Interativo de Legislação
  try {
    initializeMap();
  } catch (e) {
    console.error('Erro ao inicializar mapa:', e);
  }
  
  // Sistema de Dashboard de Sustentabilidade
  try {
    initializeDashboard();
  } catch (e) {
    console.error('Erro ao inicializar dashboard:', e);
  }
  
  // Sistema de Agendamento Online
  initializeScheduling();

  // Sistema de Ferramentas Premium
  if (document.querySelector('.ao-page')) {
    initializePremiumTools();
  }
  
  // Exibir notificação de boas-vindas
  setTimeout(() => {
    showNotification('Bem-vindo ao AmbienteOn! Explore nossas ferramentas ambientais.', 'info');
  }, 2000);
});

// Sistema de seleção de serviços
function initializeServiceSelection() {
  const serviceCheckboxes = document.querySelectorAll('input[name="servicos"]');
  const selectedServicesContainer = document.getElementById('servicos-selecionados');
  
  if (!serviceCheckboxes.length || !selectedServicesContainer) return;

  // Adicionar event listeners aos checkboxes
  serviceCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateSelectedServices);
  });

  // Função para atualizar a lista de serviços selecionados
  function updateSelectedServices() {
    const selectedServices = [];
    
    serviceCheckboxes.forEach(checkbox => {
      if (checkbox.checked) {
        const serviceName = checkbox.parentElement.querySelector('h3').textContent;
        selectedServices.push(serviceName);
      }
    });

    // Atualizar interface
    if (selectedServices.length === 0) {
      selectedServicesContainer.innerHTML = '<p class="ao-no-services">Nenhum serviço selecionado. Escolha os serviços desejados acima.</p>';
    } else {
      selectedServicesContainer.innerHTML = selectedServices.map(service => 
        `<span class="ao-service-tag">${service}</span>`
      ).join('');
    }
  }

  // Atualizar na carga inicial
  updateSelectedServices();
}

// Sistema de FAQ (Accordion)
function initializeFAQ() {
  const faqItems = document.querySelectorAll('.ao-faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.ao-faq-question');
    const answer = item.querySelector('.ao-faq-answer');
    
    if (question && answer) {
      question.addEventListener('click', function() {
        // Toggle active class
        item.classList.toggle('active');
        answer.classList.toggle('active');
        
        // Fechar outros itens (opcional)
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            otherItem.querySelector('.ao-faq-answer').classList.remove('active');
          }
        });
      });
    }
  });
}

// Sistema de formulários
function initializeForms() {
  // Formulário de solicitação principal
  const solicitationForm = document.getElementById('solicitationForm');
  if (solicitationForm) {
    solicitationForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handleSolicitationSubmit(this);
    });
  }

  // Formulário de contato rápido
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handleContactSubmit(this);
    });
  }
  
  // Formulários de lead magnet
  const leadForms = document.querySelectorAll('.ao-lead-form');
  leadForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      handleLeadSubmit(this);
    });
  });

  // Verificar se há dados pré-preenchidos do localStorage
  checkContactSource();
}

function checkContactSource() {
  const source = localStorage.getItem('ao_contact_source');
  const form = document.getElementById('solicitationForm'); // ID corrigido
  
  if (!source || !form) return;
  
  // Limpar flag
  localStorage.removeItem('ao_contact_source');
  
  const detalhesProjeto = form.querySelector('textarea[name="detalhes-projeto"]'); // Nome corrigido
  const servicosContainer = document.getElementById('servicos-selecionados');
  
  if (source === 'calculadora') {
    const emissaoTotal = localStorage.getItem('ao_carbon_result');
    if (emissaoTotal) {
       // Atualizar UI de serviços
       if (servicosContainer) {
         servicosContainer.innerHTML = '<span class="ao-service-tag">Consultoria de Carbono</span>';
       }
       
       // Preencher detalhes
       if (detalhesProjeto) {
         detalhesProjeto.value = `Dados importados da calculadora:\nEmissão anual estimada: ${emissaoTotal} toneladas de CO₂\n\nGostaria de um plano para neutralização.`;
       }
       
       showNotification('Dados da calculadora importados com sucesso!', 'success');
    }
  } else if (source === 'mapa') {
    const mapData = JSON.parse(localStorage.getItem('ao_map_data'));
    if (mapData) {
       if (servicosContainer) {
         servicosContainer.innerHTML = '<span class="ao-service-tag">Consultoria de Legislação</span>';
       }
       
       if (detalhesProjeto) {
         detalhesProjeto.value = `Dados importados do mapa:\nRegião: ${mapData.regiao}\nAtividade: ${mapData.atividade}\nPorte: ${mapData.porte}\n\nBusco orientação sobre legislação específica.`;
       }
       
       showNotification('Dados do mapa importados com sucesso!', 'success');
    }
  } else if (source === 'dashboard') {
    const dashboardSummary = JSON.parse(localStorage.getItem('ao_dashboard_summary'));
    if (dashboardSummary) {
       if (servicosContainer) {
         servicosContainer.innerHTML = '<span class="ao-service-tag">Análise Ambiental</span>';
       }
       
       if (detalhesProjeto) {
         detalhesProjeto.value = `Dados do dashboard de sustentabilidade:\n` +
           `- Emissões: ${dashboardSummary.emissions}\n` +
           `- Energia: ${dashboardSummary.energy}\n` +
           `- Reciclagem: ${dashboardSummary.waste}\n\n` +
           `Gostaria de uma análise detalhada de nossas métricas e sugestões de melhoria.`;
       }
       
       showNotification('Dados do dashboard importados com sucesso!', 'success');
    }
  }
}

// Handler para formulário de solicitação
function handleSolicitationSubmit(form) {
  // Validar se há serviços selecionados (checkboxes ou tags visuais vindas de outras ferramentas)
  const selectedCheckboxes = document.querySelectorAll('input[name="servicos"]:checked');
  const selectedTags = document.querySelectorAll('#servicos-selecionados .ao-service-tag');
  
  if (selectedCheckboxes.length === 0 && selectedTags.length === 0) {
    // Se não houver checkboxes nem tags, verificar se há serviços no texto (fallback)
    const servicosText = document.getElementById('servicos-selecionados')?.textContent.trim();
    if (!servicosText || servicosText.includes('Nenhum serviço selecionado')) {
      alert('Por favor, selecione pelo menos um serviço ou descreva sua necessidade.');
      return;
    }
  }

  // Coletar dados do formulário
  const formData = new FormData(form);
  const data = {};
  
  // Processar dados básicos
  for (let [key, value] of formData.entries()) {
    data[key] = value;
  }
  
  // Adicionar serviços selecionados
  const servicesFromCheckboxes = Array.from(selectedCheckboxes).map(cb => cb.value);
  const servicesFromTags = Array.from(selectedTags).map(tag => tag.textContent);
  
  // Combinar e remover duplicatas
  data.servicos = [...new Set([...servicesFromCheckboxes, ...servicesFromTags])];
  
  // Simular envio (em produção, isso seria uma API real)
  simulateFormSubmission(data, 'solicitacao');
}

// Handler para formulário de contato
function handleContactSubmit(form) {
  const formData = new FormData(form);
  const data = {};
  
  for (let [key, value] of formData.entries()) {
    data[key] = value;
  }
  
  simulateFormSubmission(data, 'contato');
}

// Handler para formulários de lead magnet
function handleLeadSubmit(form) {
  const email = form.querySelector('input[type="email"]').value;
  const button = form.querySelector('button[type="submit"]');
  const originalText = button.textContent;
  
  // Mostrar loading
  button.textContent = 'Baixando...';
  button.disabled = true;
  
  // Simular download (em produção, isso seria uma API real)
  setTimeout(() => {
    // Gerar ID de download
    const downloadId = 'MAT' + Date.now().toString().slice(-6);
    
    // Mostrar mensagem de sucesso
    showNotification(`
      <strong>Download realizado com sucesso!</strong><br>
      Verifique seu e-mail em instantes.<br>
      ID do download: ${downloadId}
    `, 'success');
    
    // Restaurar botão
    button.textContent = originalText;
    button.disabled = false;
    
    // Limpar formulário
    form.reset();
    
    // Log para demonstração (remover em produção)
    console.log('Lead capturado:', { email, downloadId, material: button.closest('.ao-material-card').querySelector('h3').textContent });
  }, 2000);
}

// Função para mostrar notificações
function showNotification(message, type = 'info') {
  // Criar elemento de notificação
  const notification = document.createElement('div');
  notification.className = `ao-notification ao-notification-${type}`;
  notification.innerHTML = `
    <div class="ao-notification-content">
      ${message}
    </div>
    <button class="ao-notification-close">&times;</button>
  `;
  
  // Adicionar ao body
  document.body.appendChild(notification);
  
  // Mostrar com animação
  setTimeout(() => {
    notification.classList.add('ao-notification-show');
  }, 100);
  
  // Remover após 5 segundos
  const autoHide = setTimeout(() => {
    hideNotification(notification);
  }, 5000);
  
  // Função para esconder
  function hideNotification(element) {
    element.classList.remove('ao-notification-show');
    setTimeout(() => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }, 300);
  }
  
  // Botão de fechar
  const closeButton = notification.querySelector('.ao-notification-close');
  closeButton.addEventListener('click', () => {
    clearTimeout(autoHide);
    hideNotification(notification);
  });
}

// Envio real de formulário via API Vercel
async function submitForm(data, type) {
  const submitButton = document.querySelector('button[type="submit"]:focus') || document.activeElement;
  const originalText = submitButton ? submitButton.textContent : 'Enviar';
  
  if (submitButton) {
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;
  }
  
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, type })
    });

    const result = await response.json();

    if (response.ok) {
      alert(`✅ Recebemos sua solicitação!\n\nProtocolo gerado. Entraremos em contato em breve.`);
      const form = submitButton ? submitButton.closest('form') : null;
      if (form) form.reset();
      if (type === 'solicitacao') initializeServiceSelection();
    } else {
      throw new Error(result.message || 'Erro no servidor');
    }
  } catch (error) {
    alert('❌ Erro ao enviar. Por favor, tente novamente via WhatsApp ou e-mail.');
    console.error('Erro no envio:', error);
  } finally {
    if (submitButton) {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  }
}

// Alias para manter compatibilidade com chamadas existentes
function simulateFormSubmission(data, type) {
  submitForm(data, type);
}

// Função utilitária para máscara de CNPJ (pode ser expandida)
function applyCNPJMask(input) {
  let value = input.value.replace(/\D/g, '');
  
  if (value.length <= 14) {
    value = value.replace(/(\d{2})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1/$2');
    value = value.replace(/(\d{4})(\d)/, '$1-$2');
  }
  
  input.value = value;
}

// Função utilitária para máscara de telefone
function applyPhoneMask(input) {
  let value = input.value.replace(/\D/g, '');
  
  if (value.length <= 11) {
    value = value.replace(/(\d{2})(\d)/, '($1) $2');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
  }
  
  input.value = value;
}

// Adicionar máscaras aos campos apropriados
document.addEventListener('DOMContentLoaded', function() {
  const cnpjInput = document.getElementById('empresa-cnpj');
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  
  if (cnpjInput) {
    cnpjInput.addEventListener('input', function() {
      applyCNPJMask(this);
    });
  }
  
  phoneInputs.forEach(input => {
    input.addEventListener('input', function() {
      applyPhoneMask(this);
    });
  });
});

// Animações de scroll suave para links internos
document.addEventListener('DOMContentLoaded', function() {
  // Garantir que o chatbot seja inicializado o mais cedo possível
  try {
    injectChatbotWidget();
    initializeChatbot();
  } catch (e) {
    console.error('Erro ao inicializar chatbot:', e);
  }

  const internalLinks = document.querySelectorAll('a[href^="#"]');
  
  internalLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      scrollToSection(targetId);
    });
  });

  // Inicializar animações de scroll
  try {
    initializeScrollAnimations();
  } catch (e) {
    console.warn('Scroll animations failed:', e);
  }
  
  // Inicializar biblioteca de normas
  initializeNormasLibrary();
  
  // Inicializar tema e acessibilidade
  initializeThemeAndAccessibility();
  
  // Inicializar newsletter
  initializeNewsletter();
});

// Sistema de Calculadora de Pegada de Carbono
function calcularPegadaCarbono() {
  // Coletar valores dos inputs
  const gasolina = parseFloat(document.getElementById('gasolina').value) || 0;
  const diesel = parseFloat(document.getElementById('diesel').value) || 0;
  const gasNatural = parseFloat(document.getElementById('gas-natural').value) || 0;
  const energia = parseFloat(document.getElementById('energia').value) || 0;
  const voosNacionais = parseFloat(document.getElementById('voos-nacionais').value) || 0;
  const voosInternacionais = parseFloat(document.getElementById('voos-internacionais').value) || 0;
  const residuosOrganicos = parseFloat(document.getElementById('residuos-organicos').value) || 0;
  const residuosReciclaveis = parseFloat(document.getElementById('residuos-reciclaveis').value) || 0;

  // Fatores de emissão (kg CO₂ por unidade)
  const fatores = {
    gasolina: 2.3, // kg CO₂ por litro
    diesel: 2.7, // kg CO₂ por litro
    gasNatural: 2.0, // kg CO₂ por m³
    energia: 0.1, // kg CO₂ por kWh (média brasileira)
    vooNacional: 200, // kg CO₂ por voo
    vooInternacional: 800, // kg CO₂ por voo
    residuosOrganicos: 0.5, // kg CO₂ por kg
    residuosReciclaveis: 0.2 // kg CO₂ por kg
  };

  // Calcular emissões mensais
  const emissoes = {
    combustivel: (gasolina * fatores.gasolina + diesel * fatores.diesel + gasNatural * fatores.gasNatural) / 1000,
    energia: (energia * fatores.energia) / 1000,
    viagens: (voosNacionais * fatores.vooNacional + voosInternacionais * fatores.vooInternacional) / 1000,
    residuos: (residuosOrganicos * fatores.residuosOrganicos + residuosReciclaveis * fatores.residuosReciclaveis) / 1000
  };

  // Calcular emissão anual total
  const emissaoTotal = (emissoes.combustivel + emissoes.energia + emissoes.viagens + emissoes.residuos) * 12;

  // Salvar no localStorage para uso em outras páginas
  localStorage.setItem('ao_carbon_result', emissaoTotal.toFixed(2));
  localStorage.setItem('ao_carbon_details', JSON.stringify(emissoes));

  // Atualizar interface
  const emissaoTotalElement = document.getElementById('emissao-total');
  if (emissaoTotalElement) {
    emissaoTotalElement.textContent = emissaoTotal.toFixed(2);
  }
  
  // Atualizar breakdown
  const totalParcial = Object.values(emissoes).reduce((a, b) => a + b, 0);
  
  // Combustível
  const percentCombustivel = (emissoes.combustivel / totalParcial) * 100;
  document.getElementById('valor-combustivel').textContent = (emissoes.combustivel * 12).toFixed(2) + ' t';
  document.getElementById('bar-combustivel').style.width = percentCombustivel + '%';
  
  // Energia
  const percentEnergia = (emissoes.energia / totalParcial) * 100;
  document.getElementById('valor-energia').textContent = (emissoes.energia * 12).toFixed(2) + ' t';
  document.getElementById('bar-energia').style.width = percentEnergia + '%';
  
  // Viagens
  const percentViagens = (emissoes.viagens / totalParcial) * 100;
  document.getElementById('valor-viagens').textContent = (emissoes.viagens * 12).toFixed(2) + ' t';
  document.getElementById('bar-viagens').style.width = percentViagens + '%';
  
  // Resíduos
  const percentResiduos = (emissoes.residuos / totalParcial) * 100;
  document.getElementById('valor-residuos').textContent = (emissoes.residuos * 12).toFixed(2) + ' t';
  document.getElementById('bar-residuos').style.width = percentResiduos + '%';

  // Calcular compensação
  const arvoresNecessarias = Math.ceil(emissaoTotal * 7); // 1 árvore compensa ~143kg CO₂/ano
  document.getElementById('compensacao-arvores').textContent = emissaoTotal.toFixed(2);
  document.getElementById('compensacao-arvores-num').textContent = arvoresNecessarias;

  // Mostrar resultados
  document.getElementById('resultados-carbono').style.display = 'block';
  
  // Rolar para os resultados
  document.getElementById('resultados-carbono').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  
  // Registrar no console para desenvolvimento
  console.log('Cálculo de pegada de carbono realizado:', {
    emissaoTotal: emissaoTotal.toFixed(2) + ' t CO₂/ano',
    emissoes: emissoes,
    arvoresNecessarias: arvoresNecessarias
  });
}

// Função para solicitar plano de carbono personalizado
function solicitarPlanoCarbono() {
  // O valor já foi salvo no localStorage durante o cálculo
  const emissaoTotal = localStorage.getItem('ao_carbon_result');
  
  if (!emissaoTotal) {
    showNotification('Por favor, faça o cálculo primeiro.', 'warning');
    return;
  }
  
  // Redirecionar para a página de contato com flag de origem
  localStorage.setItem('ao_contact_source', 'calculadora');
  window.location.href = 'contato.html';
}

// Inicializar calculadora com animações
function initializeCalculator() {
  // Adicionar animação aos inputs
  const inputs = document.querySelectorAll('#calculadora input[type="number"]');
  inputs.forEach(input => {
    input.addEventListener('input', function() {
      if (this.value && parseFloat(this.value) > 0) {
        this.style.backgroundColor = '#f0fdf4';
        this.style.borderColor = '#22c55e';
      } else {
        this.style.backgroundColor = '';
        this.style.borderColor = '';
      }
    });
  });
  
  console.log('Calculadora de pegada de carbono inicializada');
}

// Sistema de Mapa Interativo de Legislação
function filtrarLegislacao() {
  try {
    const regiao = document.getElementById('regiao-select').value;
    const atividade = document.getElementById('atividade-select').value;
    const porte = document.getElementById('porte-select').value;
    
    if (!regiao || !atividade || !porte) {
      showNotification('Por favor, selecione todos os filtros para buscar as exigências.', 'warning');
      return;
    }
    
    // Base de dados de legislação (simulada para demonstração)
    const legislacaoData = {
      'mato-grosso': {
        'industria': {
          'media': [
            {
              titulo: 'Licença Ambiental de Operação - LO',
              descricao: 'Obrigatória para indústrias com processos produtivos. Validade anual com condicionantes específicas.',
              complexidade: 'media',
              prazo: '45 dias úteis',
              custo: 'R$ 2.500 - R$ 8.000'
            },
            {
              titulo: 'Plano de Gerenciamento de Resíduos Sólidos - PGRS',
              descricao: 'Documento obrigatório para empresas geradoras de resíduos classe I e II.',
              complexidade: 'media',
              prazo: '30 dias úteis',
              custo: 'R$ 1.500 - R$ 3.500'
            },
            {
              titulo: 'Emissões Atmosféricas - LAP',
              descricao: 'Laudo de Emissões Atmosféricas para controle de poluentes do ar.',
              complexidade: 'alta',
              prazo: '60 dias úteis',
              custo: 'R$ 3.000 - R$ 10.000'
            }
          ]
        },
        'agricultura': {
          'grande': [
            {
              titulo: 'Cadastro Ambiental Rural - CAR',
              descricao: 'Obrigatório para todas as propriedades rurais. Fundamental para regularização fundiária.',
              complexidade: 'alta',
              prazo: '30 dias úteis',
              custo: 'R$ 8 - R$ 15 por hectare'
            },
            {
              titulo: 'Licença Ambiental para Uso de Agrotóxicos',
              descricao: 'Requerida para armazenamento e aplicação de produtos agrotóxicos.',
              complexidade: 'media',
              prazo: '20 dias úteis',
              custo: 'R$ 1.200 - R$ 2.500'
            }
          ]
        }
      },
      'norte': {
        'mineracao': {
          'grande': [
            {
              titulo: 'EIA/RIMA - Estudo de Impacto Ambiental',
              descricao: 'Exigido para atividades de mineração de grande porte na região amazônica.',
              complexidade: 'alta',
              prazo: '180 dias úteis',
              custo: 'R$ 50.000+'
            },
            {
              titulo: 'Licença de Instalação (LI)',
              descricao: 'Autoriza a instalação do empreendimento de acordo com as especificações constantes dos planos.',
              complexidade: 'alta',
              prazo: '120 dias úteis',
              custo: 'R$ 20.000 - R$ 100.000'
            }
          ]
        },
        'industria': {
          'media': [
            {
              titulo: 'Licenciamento Ambiental Simplificado',
              descricao: 'Para atividades de menor impacto na Zona Franca e arredores.',
              complexidade: 'media',
              prazo: '60 dias úteis',
              custo: 'R$ 5.000 - R$ 15.000'
            }
          ]
        }
      },
      'nordeste': {
        'servicos': {
          'pequena': [
            {
              titulo: 'Licença Ambiental Simplificada (LAS)',
              descricao: 'Para empreendimentos turísticos de pequeno porte em zona costeira.',
              complexidade: 'media',
              prazo: '45 dias úteis',
              custo: 'R$ 2.000 - R$ 5.000'
            },
            {
              titulo: 'Autorização para Uso de Recursos Hídricos',
              descricao: 'Necessária se houver captação própria de água.',
              complexidade: 'media',
              prazo: '60 dias úteis',
              custo: 'R$ 1.000 - R$ 4.000'
            }
          ]
        },
        'agricultura': {
          'media': [
            {
              titulo: 'Licença para Irrigação',
              descricao: 'Obrigatória para projetos de fruticultura irrigada.',
              complexidade: 'alta',
              prazo: '90 dias úteis',
              custo: 'R$ 5.000 - R$ 12.000'
            }
          ]
        }
      },
      'centro-oeste': {
        'pecuaria': {
          'grande': [
            {
              titulo: 'Licenciamento Ambiental de Atividades Agrossilvipastoris',
              descricao: 'Regulamentação para grandes confinamentos e pastagens.',
              complexidade: 'alta',
              prazo: '120 dias úteis',
              custo: 'R$ 15.000 - R$ 40.000'
            },
            {
              titulo: 'Outorga de Direito de Uso de Água',
              descricao: 'Para dessedentação animal em grande escala.',
              complexidade: 'media',
              prazo: '60 dias úteis',
              custo: 'R$ 2.000 - R$ 8.000'
            }
          ]
        },
        'agricultura': {
          'grande': [
             {
              titulo: 'Cadastro Ambiental Rural (CAR)',
              descricao: 'Regularização obrigatória de reserva legal e APPs.',
              complexidade: 'media',
              prazo: 'Indeterminado',
              custo: 'Variável'
            }
          ]
        }
      },
      'sudeste': {
        'industria': {
          'grande': [
            {
              titulo: 'Licença de Operação - CETESB/INEA/FEAM',
              descricao: 'Licenciamento estadual rigoroso para indústrias de grande porte (SP/RJ/MG).',
              complexidade: 'alta',
              prazo: '90-180 dias úteis',
              custo: 'R$ 10.000 - R$ 100.000'
            },
            {
              titulo: 'Inventário de Gases de Efeito Estufa',
              descricao: 'Obrigatório para alguns setores industriais em estados específicos.',
              complexidade: 'media',
              prazo: '30 dias úteis',
              custo: 'R$ 5.000 - R$ 20.000'
            }
          ],
          'media': [
             {
              titulo: 'Licença Prévia e de Instalação Concomitantes',
              descricao: 'Processo agilizado para indústrias de médio porte em distritos industriais.',
              complexidade: 'media',
              prazo: '60 dias úteis',
              custo: 'R$ 5.000 - R$ 15.000'
            }
          ]
        },
        'servicos': {
          'media': [
            {
              titulo: 'CADRI - Certificado de Movimentação de Resíduos',
              descricao: 'Para empresas que enviam resíduos para locais de reprocessamento (SP).',
              complexidade: 'media',
              prazo: '30 dias úteis',
              custo: 'Taxa estadual + Consultoria'
            }
          ]
        }
      },
      'sul': {
        'industria': {
          'media': [
            {
              titulo: 'Licença Ambiental Unificada (LAU)',
              descricao: 'Modalidade simplificada para atividades de médio potencial poluidor.',
              complexidade: 'media',
              prazo: '45 dias úteis',
              custo: 'R$ 3.000 - R$ 10.000'
            }
          ],
          'grande': [
            {
              titulo: 'Licença Ambiental de Operação (LAO)',
              descricao: 'Para grandes parques industriais, com foco em efluentes líquidos.',
              complexidade: 'alta',
              prazo: '120 dias úteis',
              custo: 'R$ 15.000+'
            }
          ]
        },
        'agricultura': {
          'media': [
            {
              titulo: 'Licenciamento de Suinocultura',
              descricao: 'Específico para criação de suínos, com foco em tratamento de dejetos.',
              complexidade: 'alta',
              prazo: '90 dias úteis',
              custo: 'R$ 5.000 - R$ 15.000'
            }
          ]
        }
      }
    };
    
    // Buscar dados ou usar padrão
    let resultados = [];
    if (legislacaoData[regiao] && legislacaoData[regiao][atividade] && legislacaoData[regiao][atividade][porte]) {
      resultados = legislacaoData[regiao][atividade][porte];
    } else {
      // Resultados padrão para combinações não especificadas
      resultados = [
        {
          titulo: 'Análise de Viabilidade Ambiental',
          descricao: 'Avaliação preliminar das exigências específicas para sua atividade e região.',
          complexidade: 'baixa',
          prazo: '7 dias úteis',
          custo: 'Consulta gratuita'
        }
      ];
    }
    
    // Atualizar interface
    atualizarResultadosLegislacao(resultados, regiao, atividade, porte);
    
    // Destacar região no mapa
    destacarRegiaoMapa(regiao);
  } catch (err) {
    console.error('Erro ao filtrar legislação:', err);
    showNotification('Ocorreu um erro ao buscar as exigências. Tente novamente.', 'error');
  }
}

function atualizarResultadosLegislacao(resultados, regiao, atividade, porte) {
  const resultsContainer = document.getElementById('legislation-results');
  const gridContainer = document.getElementById('legislation-grid');
  const summaryElement = document.getElementById('results-summary');
  
  // Atualizar resumo
  const regioesNomes = {
    'norte': 'Região Norte',
    'nordeste': 'Região Nordeste',
    'centro-oeste': 'Região Centro-Oeste',
    'sudeste': 'Região Sudeste',
    'sul': 'Região Sul',
    'mato-grosso': 'Mato Grosso'
  };
  
  const atividadesNomes = {
    'industria': 'Indústria',
    'comercio': 'Comércio',
    'servicos': 'Prestação de Serviços',
    'agricultura': 'Agricultura',
    'pecuaria': 'Pecuária',
    'mineracao': 'Mineração',
    'construcao': 'Construção Civil'
  };
  
  const portesNomes = {
    'micro': 'Microempresa',
    'pequena': 'Pequena Empresa',
    'media': 'Média Empresa',
    'grande': 'Grande Empresa'
  };
  
  summaryElement.textContent = `Encontradas ${resultados.length} exigências para ${atividadesNomes[atividade]} de porte ${portesNomes[porte]} em ${regioesNomes[regiao]}`;
  
  // Limpar grid
  gridContainer.innerHTML = '';
  
  // Adicionar resultados
  resultados.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.className = 'ao-legislation-item';
    
    const complexidadeClass = `complexidade-${item.complexidade}`;
    
    itemElement.innerHTML = `
      <h4>${item.titulo}</h4>
      <p>${item.descricao}</p>
      <div class="ao-legislation-meta">
        <span class="ao-legislation-tag ${complexidadeClass}">Complexidade: ${item.complexidade}</span>
        <span class="ao-legislation-tag">Prazo: ${item.prazo}</span>
        <span class="ao-legislation-tag">Custo: ${item.custo}</span>
      </div>
    `;
    
    gridContainer.appendChild(itemElement);
  });
  
  // Mostrar resultados
  resultsContainer.style.display = 'block';
  resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function destacarRegiaoMapa(regiao) {
  // Remover destaques anteriores
  document.querySelectorAll('.ao-map-region').forEach(region => {
    region.classList.remove('active');
  });
  document.querySelectorAll('.ao-map-highlight').forEach(highlight => {
    highlight.classList.remove('active');
  });
  
  // Adicionar destaque à região selecionada
  if (regiao === 'mato-grosso') {
    document.getElementById('destaque-mt').classList.add('active');
  } else {
    const regiaoElement = document.getElementById(`regiao-${regiao}`);
    if (regiaoElement) {
      regiaoElement.classList.add('active');
    }
  }
}

function exportarLegislacao() {
  showNotification('Relatório de legislação exportado com sucesso!', 'success');
  // Em produção, isso geraria e baixaria um PDF com os resultados
  console.log('Exportando relatório de legislação...');
}

function solicitarOrientacao() {
  // Preencher formulário com dados do mapa
  const regiao = document.getElementById('regiao-select').value;
  const atividade = document.getElementById('atividade-select').value;
  const porte = document.getElementById('porte-select').value;
  
  if (!regiao || !atividade || !porte) {
    showNotification('Selecione os filtros primeiro.', 'warning');
    return;
  }

  // Salvar dados no localStorage
  const mapData = { regiao, atividade, porte };
  localStorage.setItem('ao_map_data', JSON.stringify(mapData));
  localStorage.setItem('ao_contact_source', 'mapa');
  
  // Redirecionar
  window.location.href = 'contato.html';
}

// Inicializar mapa com interações
function initializeMap() {
  const mapElements = document.querySelectorAll('.ao-map-region, .ao-map-highlight');
  const regionSelect = document.getElementById('regiao-select');
  
  if (mapElements.length === 0) return;

  console.log('Inicializando mapa interativo de legislação...');

  // Sincronizar select com mapa
  if (regionSelect) {
    regionSelect.addEventListener('change', function() {
      destacarRegiaoMapa(this.value);
    });
  }

  // Adicionar eventos de clique às regiões do mapa
  mapElements.forEach(element => {
    element.addEventListener('click', function() {
      try {
        const regiao = this.getAttribute('data-regiao');
        
        if (regionSelect) {
          regionSelect.value = regiao;
          // Disparar evento de mudança para atualizar UI se necessário
          regionSelect.dispatchEvent(new Event('change'));
        }
        
        // Destacar visualmente (já tratado pelo change event, mas reforça feedback imediato)
        destacarRegiaoMapa(regiao);
        
        // Adicionar efeito visual
        this.style.transform = 'scale(1.02)';
        setTimeout(() => {
          this.style.transform = '';
        }, 200);
      } catch (err) {
        console.error('Erro ao processar clique no mapa:', err);
      }
    });
    
    // Adicionar tooltip
    element.addEventListener('mouseenter', function() {
      const nome = this.getAttribute('data-nome');
      // Criar tooltip (simplificado)
      // console.log(`Região: ${nome}`);
    });
  });
  
  console.log('Mapa interativo de legislação inicializado com sucesso');
}

// Sistema de Dashboard de Sustentabilidade
function initializeDashboard() {
  // Tentar recuperar dados do localStorage
  let dashboardData = JSON.parse(localStorage.getItem('ao_dashboard_data'));
  
  // Se não houver dados, gerar iniciais e salvar
  if (!dashboardData) {
    dashboardData = {
      emissions: {
        current: 1245,
        previous: 1415,
        trend: -12,
        data: [1200, 1180, 1220, 1190, 1245]
      },
      energy: {
        current: 45230,
        previous: 49160,
        trend: -8,
        data: [48000, 47000, 46000, 45500, 45230]
      },
      waste: {
        current: 89,
        previous: 77,
        trend: +15,
        data: [75, 80, 82, 85, 89]
      }
    };
    localStorage.setItem('ao_dashboard_data', JSON.stringify(dashboardData));
  }
  
  // Verificar se há dados da calculadora de carbono para integrar
  const calculatorData = localStorage.getItem('ao_carbon_result');
  if (calculatorData) {
    // Atualizar dados de emissões com base na calculadora (simulação de integração)
    const annualEmission = parseFloat(calculatorData);
    if (annualEmission > 0 && dashboardData.emissions.current !== annualEmission) {
        dashboardData.emissions.current = Math.round(annualEmission);
        // Atualizar histórico fictício para parecer real
        dashboardData.emissions.data.push(Math.round(annualEmission));
        if (dashboardData.emissions.data.length > 5) dashboardData.emissions.data.shift();
        
        localStorage.setItem('ao_dashboard_data', JSON.stringify(dashboardData));
    }
  }
  
  // Atualizar valores no dashboard
  updateDashboardValues(dashboardData);
  
  // Criar gráficos (simulados)
  createDashboardCharts(dashboardData);
  
  // Adicionar animações de entrada
  animateDashboardCards();
  
  console.log('Dashboard de sustentabilidade inicializado com dados persistentes');
}

function updateDashboardValues(data) {
  // Atualizar valores com animação de contador
  animateCounter('.ao-card-value', data.emissions.current);
  animateCounter('.ao-card-value:nth-child(2)', data.energy.current);
  animateCounter('.ao-card-value:nth-child(3)', data.waste.current);
}

function createDashboardCharts(data) {
  // Criar gráficos simples usando canvas ou elementos HTML
  createEmissionsChart(data.emissions);
  createEnergyChart(data.energy);
  createWasteChart(data.waste);
}

function createEmissionsChart(emissionsData) {
  const canvas = document.getElementById('emissions-chart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  
  // Limpar canvas
  ctx.clearRect(0, 0, width, height);
  
  // Configurar estilo
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  // Criar linha de tendência
  const maxValue = Math.max(...emissionsData.data);
  const minValue = Math.min(...emissionsData.data);
  const range = maxValue - minValue || 1;
  
  ctx.beginPath();
  emissionsData.data.forEach((value, index) => {
    const x = (index / (emissionsData.data.length - 1)) * (width - 40) + 20;
    const y = height - 20 - ((value - minValue) / range) * (height - 40);
    
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();
  
  // Adicionar pontos
  ctx.fillStyle = '#22c55e';
  emissionsData.data.forEach((value, index) => {
    const x = (index / (emissionsData.data.length - 1)) * (width - 40) + 20;
    const y = height - 20 - ((value - minValue) / range) * (height - 40);
    
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fill();
  });
}

function createEnergyChart(energyData) {
  const canvas = document.getElementById('energy-chart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  
  // Limpar canvas
  ctx.clearRect(0, 0, width, height);
  
  // Configurar estilo
  ctx.fillStyle = '#3b82f6';
  
  // Criar gráfico de barras
  const barWidth = (width - 60) / energyData.data.length;
  const maxValue = Math.max(...energyData.data);
  
  energyData.data.forEach((value, index) => {
    const barHeight = (value / maxValue) * (height - 40);
    const x = 30 + index * barWidth;
    const y = height - 20 - barHeight;
    
    // Adicionar animação gradual
    setTimeout(() => {
      ctx.fillRect(x, y, barWidth - 10, barHeight);
    }, index * 200);
  });
}

function createWasteChart(wasteData) {
  const canvas = document.getElementById('waste-chart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  
  // Limpar canvas
  ctx.clearRect(0, 0, width, height);
  
  // Criar gráfico de pizza (circular) para taxa de reciclagem
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 20;
  
  // Taxa de reciclagem
  const recyclingRate = wasteData.current / 100;
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + (2 * Math.PI * recyclingRate);
  
  // Desenhar setor de reciclagem
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.lineTo(centerX, centerY);
  ctx.closePath();
  ctx.fillStyle = '#22c55e';
  ctx.fill();
  
  // Desenhar setor de não reciclado
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, endAngle, startAngle + 2 * Math.PI);
  ctx.lineTo(centerX, centerY);
  ctx.closePath();
  ctx.fillStyle = '#e5e7eb';
  ctx.fill();
  
  // Adicionar texto central
  ctx.fillStyle = '#1f2937';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(wasteData.current + '%', centerX, centerY);
}

function animateDashboardCards() {
  const cards = document.querySelectorAll('.ao-dashboard-card');
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 100);
    }, index * 150);
  });
}

function exportarDashboard() {
  showNotification('Dashboard exportado com sucesso! Relatório gerado em PDF.', 'success');
  // Em produção, isso geraria um PDF com os dados do dashboard
  console.log('Exportando dashboard...');
}

function solicitarAnaliseDashboard() {
  // Coletar dados atuais do dashboard (do localStorage ou do DOM se necessário)
  const dashboardData = JSON.parse(localStorage.getItem('ao_dashboard_data')) || {};
  
  // Preparar resumo para o contato
  const emissions = dashboardData.emissions ? `${dashboardData.emissions.current} tCO₂` : 'N/A';
  const energy = dashboardData.energy ? `${dashboardData.energy.current.toLocaleString()} kWh` : 'N/A';
  const waste = dashboardData.waste ? `${dashboardData.waste.current}%` : 'N/A';
  
  const summary = {
    emissions,
    energy,
    waste
  };
  
  // Salvar no localStorage
  localStorage.setItem('ao_dashboard_summary', JSON.stringify(summary));
  localStorage.setItem('ao_contact_source', 'dashboard');
  
  // Redirecionar para contato
  window.location.href = 'contato.html';
}

function abrirModalCertificacoes() {
  showNotification('Modal de certificações em desenvolvimento!', 'info');
  // Em produção, abriria um modal com todas as certificações
}

// Função auxiliar para animar contadores
function animateCounter(selector, targetValue) {
  const element = document.querySelector(selector);
  if (!element) return;
  
  const duration = 2000; // 2 segundos
  const startTime = performance.now();
  const startValue = 0;
  
  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Função de easing para animação suave
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuart);
    
    element.textContent = currentValue.toLocaleString();
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  }
  
  requestAnimationFrame(updateCounter);
}

// Sistema de Agendamento Online
function initializeScheduling() {
  const calendar = document.getElementById('appointment-calendar');
  if (!calendar) return;

  const timeSlots = document.querySelectorAll('.ao-time-slot');
  const appointmentForm = document.getElementById('appointment-form');
  const appointmentSummary = document.getElementById('appointment-summary');
  const summaryContent = document.getElementById('summary-content');
  
  let selectedDate = null;
  let selectedTime = null;
  let currentCalendarDate = new Date(); // Data base para o calendário
  
  // Gerar calendário inicial
  generateCalendar();
  
  // Função para gerar o calendário
  function generateCalendar() {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    
    const calendarHTML = [];
    
    // Cabeçalho do calendário
    calendarHTML.push('<div class="ao-calendar-header">');
    calendarHTML.push('<div class="ao-calendar-nav prev-month">‹</div>');
    calendarHTML.push(`<div class="ao-calendar-title">${getMonthName(month)} ${year}</div>`);
    calendarHTML.push('<div class="ao-calendar-nav next-month">›</div>');
    calendarHTML.push('</div>');
    
    // Dias da semana
    calendarHTML.push('<div class="ao-calendar-weekdays">');
    ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].forEach(day => {
      calendarHTML.push(`<div class="ao-calendar-weekday">${day}</div>`);
    });
    calendarHTML.push('</div>');
    
    // Dias do mês
    calendarHTML.push('<div class="ao-calendar-days">');
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    // Dias em branco no início
    for (let i = 0; i < firstDay; i++) {
      calendarHTML.push('<div class="ao-calendar-day blank"></div>');
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isPast = date < today;
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      
      // Verificar se é a data selecionada
      const dateString = formatDate(date);
      const isSelected = selectedDate === dateString;
      
      const classes = [
        'ao-calendar-day',
        isPast ? 'past' : '',
        isWeekend ? 'weekend' : '',
        isSelected ? 'selected' : '',
        !isPast && !isWeekend ? 'clickable' : ''
      ].filter(Boolean).join(' ');
      
      // Apenas dias futuros e dias de semana são clicáveis
      if (!isPast && !isWeekend) {
        calendarHTML.push(`<div class="${classes}" data-date="${dateString}">${day}</div>`);
      } else {
        calendarHTML.push(`<div class="${classes}">${day}</div>`);
      }
    }
    
    calendarHTML.push('</div>');
    calendar.innerHTML = calendarHTML.join('');
    
    // Adicionar event listeners aos botões de navegação
    calendar.querySelector('.prev-month').addEventListener('click', () => {
      currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
      generateCalendar();
    });
    
    calendar.querySelector('.next-month').addEventListener('click', () => {
      currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
      generateCalendar();
    });
    
    // Adicionar event listeners aos dias
    document.querySelectorAll('.ao-calendar-day.clickable').forEach(day => {
      day.addEventListener('click', function() {
        selectDate(this.dataset.date);
      });
    });
  }
  
  // Função para selecionar data
  function selectDate(date) {
    // Atualizar estado
    selectedDate = date;
    
    // Atualizar UI do calendário
    document.querySelectorAll('.ao-calendar-day.selected').forEach(day => {
      day.classList.remove('selected');
    });
    
    const dayElement = document.querySelector(`.ao-calendar-day[data-date="${date}"]`);
    if (dayElement) {
      dayElement.classList.add('selected');
    }
    
    updateSummary();
  }
  
  // Função para selecionar horário
  timeSlots.forEach(slot => {
    slot.addEventListener('click', function() {
      if (this.classList.contains('disabled')) return;
      
      // Remover seleção anterior
      timeSlots.forEach(s => s.classList.remove('selected'));
      
      // Adicionar seleção nova
      this.classList.add('selected');
      selectedTime = this.dataset.time;
      updateSummary();
    });
  });
  
  // Função para atualizar resumo
  function updateSummary() {
    if (selectedDate && selectedTime) {
      const formData = new FormData(appointmentForm);
      const name = formData.get('name') || 'Não informado';
      const serviceValue = formData.get('service');
      const service = serviceValue ? getServiceName(serviceValue) : 'Não selecionado';
      
      // Formatando a data para exibição
      const dateParts = selectedDate.split('-');
      const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
      
      summaryContent.innerHTML = `
        <div class="ao-summary-item"><strong>Data:</strong> ${formattedDate}</div>
        <div class="ao-summary-item"><strong>Horário:</strong> ${selectedTime}</div>
        <div class="ao-summary-item"><strong>Serviço:</strong> ${service}</div>
      `;
      
      appointmentSummary.style.display = 'block';
    }
  }
  
  // Função para lidar com mudanças no formulário
  appointmentForm.addEventListener('change', updateSummary);
  
  // Função para submeter formulário
  appointmentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      showNotification('Por favor, selecione uma data e horário no calendário.', 'warning');
      return;
    }
    
    const formData = new FormData(this);
    const serviceValue = formData.get('service');
    
    const appointmentData = {
      date: selectedDate,
      time: selectedTime,
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      company: formData.get('company'),
      service: serviceValue,
      serviceName: getServiceName(serviceValue),
      notes: formData.get('notes'),
      reminder: formData.get('reminder') === 'on'
    };
    
    // Simular processamento
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Agendando...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
      console.log('Agendamento confirmado:', appointmentData);
      
      // Salvar no localStorage para persistência (simulação de backend)
      const agendamentos = JSON.parse(localStorage.getItem('ao_appointments') || '[]');
      agendamentos.push({
        ...appointmentData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('ao_appointments', JSON.stringify(agendamentos));
      
      showNotification('Agendamento confirmado com sucesso! Enviamos os detalhes para seu e-mail.', 'success');
      
      // Limpar formulário e estado
      this.reset();
      selectedDate = null;
      selectedTime = null;
      appointmentSummary.style.display = 'none';
      
      // Resetar UI
      document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      
      // Regenerar calendário para limpar seleções visuais
      generateCalendar();
      
    }, 1500);
  });
  
  console.log('Sistema de agendamento inicializado');
}

// Funções auxiliares para o calendário
function getMonthName(monthIndex) {
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  return months[monthIndex];
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function formatDateBR(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}

function getServiceName(serviceValue) {
  const services = {
    'licenciamento': 'Licenciamento Ambiental',
    'regularizacao': 'Regularização Ambiental',
    'gestao-residuos': 'Gestão de Resíduos',
    'auditoria': 'Auditoria Ambiental',
    'treinamento': 'Treinamento e Capacitação',
    'consultoria-carbono': 'Consultoria de Carbono',
    'outros': 'Outros'
  };
  return services[serviceValue] || serviceValue;
}

// Injetar widget do chatbot em páginas que não o têm
function injectChatbotWidget() {
  if (document.getElementById('chatbot-widget')) return; // já existe
  const widgetHTML = `
  <div class="ao-chatbot-widget" id="chatbot-widget">
    <div class="ao-chatbot-button" id="chatbot-button">
      <span class="chatbot-icon">🤖</span>
      <span class="chatbot-notification" id="chatbot-notification">1</span>
    </div>
    <div class="ao-chatbot-container" id="chatbot-container">
      <div class="ao-chatbot-header">
        <div class="chatbot-info">
          <div class="chatbot-avatar">🌱</div>
          <div class="chatbot-details">
            <h4>AmbienteBot</h4>
            <p>Assistente Ambiental</p>
          </div>
        </div>
        <button class="chatbot-close" id="chatbot-close">×</button>
      </div>
      <div class="ao-chatbot-messages" id="chatbot-messages">
        <div class="chatbot-message bot-message">
          <div class="message-avatar">🤖</div>
          <div class="message-content">
            <p>Olá! Sou o AmbienteBot, seu assistente especializado em gestão ambiental. Como posso ajudar sua empresa hoje?</p>
            <span class="message-time">Agora</span>
          </div>
        </div>
      </div>
      <div class="ao-chatbot-input-container">
        <div class="chatbot-quick-actions">
          <button class="quick-action" data-action="licenciamento">📋 Licenciamento</button>
          <button class="quick-action" data-action="regularizacao">⚡ Regularização</button>
          <button class="quick-action" data-action="residuos">♻️ Resíduos</button>
          <button class="quick-action" data-action="carbono">🌱 Carbono</button>
        </div>
        <form class="ao-chatbot-form" id="chatbot-form">
          <input type="text" id="chatbot-input" placeholder="Digite sua pergunta ambiental..." />
          <button type="submit" class="chatbot-send">➤</button>
        </form>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', widgetHTML);
}

// Função global para abrir o chatbot de qualquer página
window.openChatbot = function() {
  console.log('Tentando abrir chatbot via openChatbot()...');
  const container = document.getElementById('chatbot-container');
  const notification = document.getElementById('chatbot-notification');
  const input = document.getElementById('chatbot-input');
  
  if (container) {
    container.classList.add('active');
    // FORÇAR exibição via JS (ignora cache de CSS)
    container.style.display = 'flex';
    container.style.opacity = '1';
    container.style.transform = 'translateY(0)';
    container.style.zIndex = '10000';
    
    if (notification) notification.style.display = 'none';
    if (input) setTimeout(() => input.focus(), 300);
    console.log('Chatbot aberto com sucesso.');
  } else {
    console.error('Falha ao abrir chatbot: Elemento #chatbot-container não encontrado no DOM.');
  }
};

// Sistema de Chatbot Ambiental com IA (Gemini)
function initializeChatbot() {
  const chatbotButton = document.getElementById('chatbot-button');
  const chatbotContainer = document.getElementById('chatbot-container');
  
  console.log('Inicializando Chatbot...', { chatbotButton, chatbotContainer });

  if (!chatbotButton || !chatbotContainer) {
    console.error('Botão ou Container do Chatbot não encontrados!');
    return;
  }

  const chatbotClose = document.getElementById('chatbot-close');
  const chatbotForm = document.getElementById('chatbot-form');
  const chatbotInput = document.getElementById('chatbot-input');
  const chatbotMessages = document.getElementById('chatbot-messages');
  const quickActions = document.querySelectorAll('.quick-action');

  // Histórico da conversa para enviar contexto ao Gemini
  const welcomeMessage = '👋 Olá! Sou o **AmbienteBot**, assistente IA especializado em legislação ambiental do Mato Grosso. Posso responder dúvidas sobre licenciamento, CAR, Reserva Legal, resíduos e créditos de carbono. Como posso ajudar?';
  const conversationHistory = [{ role: 'bot', text: welcomeMessage }];
  let isWaiting = false;
  
  // Abrir/fechar chatbot
  chatbotButton.onclick = function(e) {
    console.log('Clique no botão do chatbot');
    toggleChatbot();
  };

  if (chatbotClose) {
    chatbotClose.onclick = function(e) {
      console.log('Clique no fechar do chatbot');
      toggleChatbot();
    };
  }
  
  function toggleChatbot() {
    const isActive = chatbotContainer.classList.toggle('active');
    console.log('Chatbot toggled. Active:', isActive);
    
    // FORÇAR exibição via JS (ignora cache de CSS que pode estar quebrando o site)
    if (isActive) {
      chatbotContainer.style.display = 'flex';
      chatbotContainer.style.opacity = '1';
      chatbotContainer.style.transform = 'translateY(0)';
      chatbotContainer.style.zIndex = '10000';
      if (chatbotInput) setTimeout(() => chatbotInput.focus(), 200);
      const notif = document.getElementById('chatbot-notification');
      if (notif) notif.style.display = 'none';
    } else {
      chatbotContainer.style.display = 'none';
      chatbotContainer.style.opacity = '0';
    }
  }
  
  // Ações rápidas — agora disparam pergunta real para a IA
  quickActions.forEach(action => {
    action.addEventListener('click', function() {
      const labels = {
        licenciamento: 'Quero saber sobre licenciamento ambiental no Mato Grosso',
        regularizacao: 'Como regularizar minha empresa ambientalmente?',
        residuos: 'Como devo gerenciar os resíduos da minha empresa?',
        carbono: 'Quero calcular a pegada de carbono da minha empresa'
      };
      const msg = labels[this.dataset.action];
      if (msg && !isWaiting) sendUserMessage(msg);
    });
  });
  
  // Enviar mensagem ao submeter o formulário
  chatbotForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const message = chatbotInput.value.trim();
    if (message && !isWaiting) {
      sendUserMessage(message);
      chatbotInput.value = '';
    }
  });

  // Envia a mensagem do usuário e busca resposta da IA
  async function sendUserMessage(message) {
    if (isWaiting) return;
    
    isWaiting = true;
    chatbotInput.disabled = true;

    // Exibir mensagem do usuário
    addMessage(message, 'user');
    
    // Adicionar ao histórico local
    conversationHistory.push({ role: 'user', text: message });

    // Exibir indicador de digitação
    const typingId = showTypingIndicator();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history: conversationHistory.slice(0, -1) // envia histórico completo exceto a última msg que já é enviada separada no campo 'message'
        })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      removeTypingIndicator(typingId);

      const botText = data.response || data.message || 'Desculpe, não consegui processar sua mensagem agora. Tente novamente em instantes.';
      
      addMessage(botText, 'bot');
      
      // Adicionar resposta do bot ao histórico
      conversationHistory.push({ role: 'bot', text: botText });

    } catch (error) {
      console.error('Erro no chatbot:', error);
      removeTypingIndicator(typingId);
      const fallback = 'Estou com dificuldades técnicas para me conectar. Por favor, tente novamente em instantes ou entre em contato via **contato@ambienteon.com.br**.';
      addMessage(fallback, 'bot');
    } finally {
      isWaiting = false;
      chatbotInput.disabled = false;
      chatbotInput.focus();
      
      // Limitar histórico para não sobrecarregar requisições futuras
      if (conversationHistory.length > 20) {
        conversationHistory.splice(1, 2); // Remove as mensagens mais antigas mantendo a saudação
      }
    }
  }

  // Renderiza markdown básico (negrito, listas, links)
  function renderMarkdown(text) {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/^• (.+)$/gm, '<li>$1</li>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
      .replace(/\n/g, '<br>');
  }

  // Adiciona mensagem na interface
  function addMessage(text, role) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${role === 'user' ? 'user-message' : 'bot-message'}`;
    const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    messageDiv.innerHTML = `
      <div class="message-avatar">${role === 'user' ? '👤' : '🤖'}</div>
      <div class="message-content">
        <p>${renderMarkdown(text)}</p>
        <span class="message-time">${time}</span>
      </div>
    `;
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  // Indicador de digitação (...)
  function showTypingIndicator() {
    const id = 'typing-' + Date.now();
    const div = document.createElement('div');
    div.className = 'chatbot-message bot-message';
    div.id = id;
    div.innerHTML = `
      <div class="message-avatar">🤖</div>
      <div class="message-content">
        <div class="typing-indicator"><span></span><span></span><span></span></div>
      </div>
    `;
    chatbotMessages.appendChild(div);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    return id;
  }

  function removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  // Mensagem de boas-vindas inicial (apenas se não houver mensagens)
  if (chatbotMessages.children.length <= 1) {
    setTimeout(() => {
      // Já existe uma mensagem no HTML estático ou injetado, 
      // mas vamos reforçar a mensagem de boas-vindas com IA
      if (!chatbotContainer.classList.contains('active')) {
        const notif = document.getElementById('chatbot-notification');
        if (notif) notif.style.display = 'flex';
      }
    }, 2000);
  }
  
  console.log('Chatbot IA (Gemini) inicializado com histórico persistente');
}


function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('ao-animate-visible');
      }
    });
  }, observerOptions);
  
  // Adicionar classes de animação aos elementos
  const animatedElements = [
    '.ao-section-header',
    '.ao-service-card',
    '.ao-case-card',
    '.ao-material-card',
    '.ao-faq-item',
    '.ao-contact-grid > div:first-child',
    '.ao-contact-form'
  ];
  
  animatedElements.forEach((selector, index) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element, elementIndex) => {
      // Adicionar classe base de animação
      element.classList.add('ao-animate');
      
      // Adicionar delay baseado na posição
      if (elementIndex > 0) {
        element.classList.add(`ao-animate-delay-${Math.min(elementIndex + 1, 5)}`);
      }
      
      // Adicionar animações especiais para elementos laterais
      if (selector.includes('.ao-contact-grid')) {
        element.classList.add('ao-animate-left');
        element.classList.remove('ao-animate');
      }
      
      if (selector.includes('.ao-contact-form')) {
        element.classList.add('ao-animate-right');
        element.classList.remove('ao-animate');
      }
      
      // Observar o elemento
      observer.observe(element);
    });
  });
  
  // Animação especial para números nos estudos de caso
  animateCaseNumbers();
}

// Função para animar números
function animateCaseNumbers() {
  const numberElements = document.querySelectorAll('.ao-case-number');
  
  const numberObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const finalNumber = parseInt(element.textContent);
        
        // Evitar animar novamente
        if (element.classList.contains('animated')) return;
        element.classList.add('animated');
        
        // Animação de contador
        let currentNumber = 0;
        const increment = finalNumber / 30; // 30 frames para completar
        
        const timer = setInterval(() => {
          currentNumber += increment;
          if (currentNumber >= finalNumber) {
            element.textContent = finalNumber;
            clearInterval(timer);
          } else {
            element.textContent = Math.floor(currentNumber);
          }
        }, 50);
      }
    });
  }, { threshold: 0.5 });
  
  numberElements.forEach(element => {
    numberObserver.observe(element);
  });
}

// Sistema de Biblioteca de Normas Ambientais
function initializeNormasLibrary() {
  const normasGrid = document.getElementById('normas-grid');
  if (!normasGrid) return;
  
  const searchInput = document.getElementById('normas-search');
  const searchBtn = document.getElementById('normas-search-btn');
  const categoryBtns = document.querySelectorAll('.ao-category-btn');
  
  // Base de dados de normas ambientais
  const normasData = [
    {
      id: 1,
      title: 'Lei 12.305/2010 - Política Nacional de Resíduos Sólidos',
      category: 'federal',
      description: 'Estabelece princípios, objetivos e instrumentos da política nacional de resíduos sólidos.',
      date: '02/08/2010',
      type: 'Lei Federal',
      keywords: ['resíduos', 'sólidos', 'gestão', 'logística reversa'],
      downloadUrl: '#',
      viewUrl: '#'
    },
    {
      id: 2,
      title: 'Lei 6.938/1981 - Política Nacional do Meio Ambiente',
      category: 'federal',
      description: 'Dispõe sobre a Política Nacional do Meio Ambiente, seus fins e mecanismos de formulação e aplicação.',
      date: '31/08/1981',
      type: 'Lei Federal',
      keywords: ['meio ambiente', 'política', 'proteção'],
      downloadUrl: '#',
      viewUrl: '#'
    },
    {
      id: 3,
      title: 'Resolução CONAMA 001/1986 - EIA/RIMA',
      category: 'resolucao',
      description: 'Dispõe sobre o Estudo de Impacto Ambiental e o Relatório de Impacto ao Meio Ambiente.',
      date: '23/01/1986',
      type: 'Resolução CONAMA',
      keywords: ['EIA', 'RIMA', 'impacto ambiental', 'licenciamento'],
      downloadUrl: '#',
      viewUrl: '#'
    },
    {
      id: 4,
      title: 'Resolução CONAMA 237/1997 - Cadastro Técnico Federal',
      category: 'resolucao',
      description: 'Estabelece o Cadastro Técnico Federal de Atividades e Instrumentos de Defesa Ambiental.',
      date: '19/12/1997',
      type: 'Resolução CONAMA',
      keywords: ['cadastro', 'CTF', 'atividades'],
      downloadUrl: '#',
      viewUrl: '#'
    },
    {
      id: 5,
      title: 'Lei Estadual MT 7.116/1996 - Licenciamento Ambiental',
      category: 'estadual',
      description: 'Dispõe sobre o licenciamento ambiental no Estado de Mato Grosso.',
      date: '03/01/1996',
      type: 'Lei Estadual',
      keywords: ['licenciamento', 'MT', 'estadual', 'licença'],
      downloadUrl: '#',
      viewUrl: '#'
    },
    {
      id: 6,
      title: 'Decreto Estadual MT 2.072/1997 - Regulamentação do Licenciamento',
      category: 'estadual',
      description: 'Regulamenta o licenciamento ambiental no Estado de Mato Grosso.',
      date: '07/04/1997',
      type: 'Decreto Estadual',
      keywords: ['regulamentação', 'licenciamento', 'MT'],
      downloadUrl: '#',
      viewUrl: '#'
    },
    {
      id: 7,
      title: 'Portaria IBAMA 260/2007 - Cadastro Estadual de Empreendimentos',
      category: 'portaria',
      description: 'Estabelece procedimentos para o Cadastro Estadual de Empreendimentos.',
      date: '28/09/2007',
      type: 'Portaria IBAMA',
      keywords: ['cadastro', 'empreendimentos', 'procedimentos'],
      downloadUrl: '#',
      viewUrl: '#'
    },
    {
      id: 8,
      title: 'Resolução CONAMA 357/2005 - Classificação das Águas',
      category: 'resolucao',
      description: 'Dispõe sobre a classificação dos corpos de água e diretrizes ambientais.',
      date: '17/03/2005',
      type: 'Resolução CONAMA',
      keywords: ['águas', 'classificação', 'corpos hídricos'],
      downloadUrl: '#',
      viewUrl: '#'
    }
  ];
  
  let currentCategory = 'all';
  let currentSearch = '';
  
  // Função para renderizar normas
  function renderNormas(normas) {
    if (normas.length === 0) {
      normasGrid.innerHTML = `
        <div class="ao-norma-empty" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">📚</div>
          <h3>Nenhuma norma encontrada</h3>
          <p>Tente ajustar seus filtros de busca ou categoria.</p>
        </div>
      `;
      return;
    }
    
    normasGrid.innerHTML = normas.map(norma => `
      <div class="ao-norma-card" data-category="${norma.category}" data-keywords="${norma.keywords.join(' ')}">
        <div class="ao-norma-header">
          <div>
            <h3 class="ao-norma-title">${norma.title}</h3>
            <span class="ao-norma-category">${norma.type}</span>
          </div>
        </div>
        <p class="ao-norma-description">${norma.description}</p>
        <div class="ao-norma-meta">
          <span>📅 ${norma.date}</span>
          <span>🏷️ ${norma.category}</span>
        </div>
        <div class="ao-norma-actions">
          <a href="${norma.viewUrl}" class="ao-norma-btn" target="_blank">
            👁️ Visualizar
          </a>
          <a href="${norma.downloadUrl}" class="ao-norma-btn secondary" download>
            📥 Download
          </a>
          <div class="ao-norma-share">
            <button class="ao-share-btn" data-norma-id="${norma.id}">🔗 Compartilhar</button>
            <div class="ao-share-options" id="share-options-${norma.id}">
              <a href="https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}&title=${encodeURIComponent(norma.title)}" target="_blank">LinkedIn</a>
              <a href="https://twitter.com/intent/tweet?url=${window.location.href}&text=${encodeURIComponent(norma.title)}" target="_blank">Twitter</a>
              <a href="https://www.facebook.com/sharer/sharer.php?u=${window.location.href}" target="_blank">Facebook</a>
              <button class="copy-link-btn" data-link="${window.location.href}">Copiar Link</button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }
  
  // Função para filtrar normas
  function filterNormas() {
    let filteredNormas = normasData;
    
    // Filtrar por categoria
    if (currentCategory !== 'all') {
      filteredNormas = filteredNormas.filter(norma => norma.category === currentCategory);
    }
    
    // Filtrar por busca
    if (currentSearch) {
      const searchLower = currentSearch.toLowerCase();
      filteredNormas = filteredNormas.filter(norma => {
        return norma.title.toLowerCase().includes(searchLower) ||
               norma.description.toLowerCase().includes(searchLower) ||
               norma.keywords.some(keyword => keyword.toLowerCase().includes(searchLower));
      });
    }
    
    renderNormas(filteredNormas);
  }
  
  // Event listeners
  normasGrid.addEventListener('click', function(e) {
    // Botão de compartilhar
    if (e.target.classList.contains('ao-share-btn')) {
      const normaId = e.target.dataset.normaId;
      const shareOptions = document.getElementById(`share-options-${normaId}`);
      
      if (shareOptions) {
        // Fecha outros menus de compartilhamento abertos
        document.querySelectorAll('.ao-share-options').forEach(options => {
          if (options.id !== `share-options-${normaId}`) {
            options.style.display = 'none';
          }
        });
        
        shareOptions.style.display = shareOptions.style.display === 'block' ? 'none' : 'block';
      }
    }
    
    // Botão de copiar link
    if (e.target.classList.contains('copy-link-btn')) {
      const link = e.target.dataset.link;
      navigator.clipboard.writeText(link).then(() => {
        showNotification('Link copiado para a área de transferência!', 'success');
        e.target.closest('.ao-share-options').style.display = 'none';
      }).catch(err => {
        showNotification('Erro ao copiar o link.', 'error');
        console.error('Erro ao copiar link:', err);
      });
    }
  });
  
  // Fechar menus de compartilhamento ao clicar fora
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.ao-norma-share')) {
      document.querySelectorAll('.ao-share-options').forEach(options => {
        options.style.display = 'none';
      });
    }
  });
  
  searchBtn.addEventListener('click', function() {
    currentSearch = searchInput.value.trim();
    filterNormas();
  });
  
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      currentSearch = this.value.trim();
      filterNormas();
    }
  });
  
  searchInput.addEventListener('input', function() {
    if (this.value.trim() === '') {
      currentSearch = '';
      filterNormas();
    }
  });
  
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      categoryBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentCategory = this.dataset.category;
      filterNormas();
    });
  });
  
  // Renderizar normas iniciais
  renderNormas(normasData);
  
  console.log('Biblioteca de normas ambientais inicializada');
}

// Sistema de Modo Escuro e Acessibilidade
function initializeThemeAndAccessibility() {
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  
  // Verificar preferência do usuário ou sistema
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  
  // Aplicar tema inicial
  html.setAttribute('data-theme', initialTheme);
  
  // Alternar tema
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      // Adicionar animação de transição suave
      html.style.transition = 'background-color 0.3s ease, color 0.3s ease';
      setTimeout(() => {
        html.style.transition = '';
      }, 300);
    });
  }
  
  // Melhorias de acessibilidade
  
  // 1. Navegação por teclado melhorada
  document.addEventListener('keydown', function(e) {
    // Alt + T para alternar tema
    if (e.altKey && e.key === 't' && themeToggle) {
      e.preventDefault();
      themeToggle.click();
    }
    
    // Alt + 1 para ir para o topo
    if (e.altKey && e.key === '1') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Alt + 2 para focar no formulário de solicitação
    if (e.altKey && e.key === '2') {
      e.preventDefault();
      const solicitacaoSection = document.getElementById('solicitar');
      if (solicitacaoSection) {
        solicitacaoSection.scrollIntoView({ behavior: 'smooth' });
        const firstInput = solicitacaoSection.querySelector('input, textarea, select');
        if (firstInput) {
          firstInput.focus();
        }
      }
    }
  });
  
  // 2. Foco visível melhorado
  const style = document.createElement('style');
  style.textContent = `
    *:focus {
      outline: 2px solid var(--ao-color-secondary) !important;
      outline-offset: 2px !important;
    }
    
    *:focus-visible {
      outline: 2px solid var(--ao-color-secondary) !important;
      outline-offset: 2px !important;
    }
    
    .skip-link {
      position: absolute;
      top: -40px;
      left: 6px;
      background: var(--ao-color-secondary);
      color: white;
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 1000;
      transition: top 0.3s;
    }
    
    .skip-link:focus {
      top: 6px;
    }
  `;
  document.head.appendChild(style);
  
  // 3. Link para pular para o conteúdo principal
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.textContent = 'Pular para o conteúdo principal';
  skipLink.className = 'skip-link';
  document.body.insertBefore(skipLink, document.body.firstChild);
  
  // 4. Adicionar ID ao conteúdo principal
  const main = document.querySelector('main');
  if (main && !main.id) {
    main.id = 'main-content';
  }
  
  // 5. ARIA labels melhorados
  const forms = document.querySelectorAll('form');
  forms.forEach((form, index) => {
    if (!form.getAttribute('aria-label')) {
      form.setAttribute('aria-label', `Formulário ${index + 1}`);
    }
  });
  
  // 6. Anúncios de mudanças para leitores de tela
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.style.position = 'absolute';
  announcer.style.left = '-10000px';
  announcer.style.width = '1px';
  announcer.style.height = '1px';
  announcer.style.overflow = 'hidden';
  document.body.appendChild(announcer);
  
  // Anunciar mudanças de tema
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      const currentTheme = html.getAttribute('data-theme');
      announcer.textContent = `Tema alterado para ${currentTheme === 'dark' ? 'escuro' : 'claro'}`;
    });
  }
  
  // 7. Suporte a alto contraste
  const highContrastMediaQuery = window.matchMedia('(prefers-contrast: high)');
  if (highContrastMediaQuery.matches) {
    html.classList.add('high-contrast');
  }
  
  highContrastMediaQuery.addEventListener('change', function(e) {
    if (e.matches) {
      html.classList.add('high-contrast');
    } else {
      html.classList.remove('high-contrast');
    }
  });
  
  // 8. Redução de movimento
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) {
    html.classList.add('reduced-motion');
    
    // Desativar animações
    const reducedMotionStyles = document.createElement('style');
    reducedMotionStyles.textContent = `
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    `;
    document.head.appendChild(reducedMotionStyles);
  }
  
  console.log('Sistema de tema e acessibilidade inicializado');
}

// Sistema de Newsletter
function initializeNewsletter() {
  const newsletterForm = document.getElementById('newsletterForm');
  
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const emailInput = document.getElementById('newsletter-email');
      const consentCheckbox = document.getElementById('newsletter-consent');
      
      if (!consentCheckbox.checked) {
        showNotification('Você precisa concordar com a política de privacidade.', 'warning');
        return;
      }
      
      const email = emailInput.value;
      
      // Simulação de envio
      showNotification(`Obrigado por se inscrever! E-mail ${email} cadastrado.`, 'success');
      
      // Limpar formulário
      emailInput.value = '';
      consentCheckbox.checked = false;
      
      // Log no console
      console.log(`Novo assinante da newsletter: ${email}`);
    });
  }
  
  console.log('Sistema de newsletter inicializado');
}

// --- MÓDULO PROFISSIONAL: EMISSÕES & ATIVOS (Inspirado na Emisfera) ---

/**
 * Calcula o inventário profissional seguindo o GHG Protocol (Escopos 1, 2 e 3)
 */
function calcularGHGPro() {
  // Escopo 1: Emissões Diretas
  const gasolina = parseFloat(document.getElementById('ghg-gasolina')?.value) || 0;
  const diesel = parseFloat(document.getElementById('ghg-diesel')?.value) || 0;
  const refrigerantes = parseFloat(document.getElementById('ghg-refrigerantes')?.value) || 0;
  const processos = parseFloat(document.getElementById('ghg-processos')?.value) || 0;

  // Escopo 2: Energia
  const energia = parseFloat(document.getElementById('ghg-energia')?.value) || 0;
  const termica = parseFloat(document.getElementById('ghg-termica')?.value) || 0;

  // Escopo 3: Cadeia de Valor
  const viagens = parseFloat(document.getElementById('ghg-viagens')?.value) || 0;
  const logistica = parseFloat(document.getElementById('ghg-logistica')?.value) || 0;

  // Fatores de emissão detalhados (exemplo simplificado do GHG Protocol Brasil)
  const fatores = {
    gasolina: 2.27, // kgCO2e/L
    diesel: 2.67,   // kgCO2e/L
    refrigerantes: 1430, // GWP médio (ex: R-134a) em kgCO2e/kg
    energia: 0.08,  // kgCO2e/kWh (fator médio SIN)
    viagens: 0.15,  // kgCO2e/km (médio aéreo/terrestre)
    logistica: 0.12 // kgCO2e/ton.km
  };

  const e1 = (gasolina * fatores.gasolina + diesel * fatores.diesel + refrigerantes * fatores.refrigerantes + processos * 1000) / 1000;
  const e2 = (energia * fatores.energia + termica * 50) / 1000;
  const e3 = (viagens * fatores.viagens + logistica * fatores.logistica) / 1000;

  const totalAnual = e1 + e2 + e3;

  // Atualizar UI do Dashboard de Ativos
  const emissõesEl = document.getElementById('asset-emissions');
  const neutralizaçãoEl = document.getElementById('asset-neutralization');
  const valorEl = document.getElementById('asset-market-value');

  if (emissõesEl) {
    animateCounter('#asset-emissions', Math.round(totalAnual));
  }

  // Simulação de neutralização (baseada em dados prévios ou novos ativos)
  const neutralizacao = Math.min(Math.random() * 25, 100);
  if (neutralizaçãoEl) {
    neutralizaçãoEl.textContent = neutralizacao.toFixed(1) + '%';
    
    // Atualizar barra de progresso do roadmap
    const progressBar = document.getElementById('roadmap-progress-bar');
    const progressPercent = document.getElementById('roadmap-percent');
    if (progressBar && progressPercent) {
      progressBar.style.width = neutralizacao + '%';
      progressPercent.textContent = neutralizacao.toFixed(1) + '%';
    }
  }

  // Valor de mercado (R$ 55,00 por crédito - cotação fictícia)
  if (valorEl) {
    const valorMercado = totalAnual * 55;
    valorEl.textContent = valorMercado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  showNotification('Cálculo profissional concluído. Inventário sincronizado.', 'success');
  
  // Persistir dados
  localStorage.setItem('ao_ghg_pro_total', totalAnual);
  localStorage.setItem('ao_ghg_pro_details', JSON.stringify({ e1, e2, e3 }));
}

/**
 * Inicializa o gráfico de Roadmap Net Zero usando Canvas
 */
function initializeNetZeroChart() {
  const canvas = document.getElementById('netzero-chart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  // Limpar
  ctx.clearRect(0, 0, w, h);

  // Eixos
  ctx.strokeStyle = '#e5e7eb';
  ctx.beginPath();
  ctx.moveTo(30, 20);
  ctx.lineTo(30, h - 30);
  ctx.lineTo(w - 20, h - 30);
  ctx.stroke();

  // Curva de Redução (Verde)
  ctx.strokeStyle = '#16a34a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(30, 40);
  ctx.bezierCurveTo(w/2, 40, w/2, h-30, w-20, h-30);
  ctx.stroke();

  // Pontos de Emissão Real (Passado)
  ctx.fillStyle = '#ef4444';
  const points = [
    {x: 30, y: 40},
    {x: 60, y: 45},
    {x: 90, y: 42},
    {x: 120, y: 38}
  ];

  points.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // Texto
  ctx.fillStyle = '#6b7280';
  ctx.font = '10px sans-serif';
  ctx.fillText('2024', 25, h - 15);
  ctx.fillText('2030 (Net Zero)', w - 80, h - 15);
  
  console.log('Gráfico Net Zero inicializado');
}

// Exportar funções para uso global
window.calcularGHGPro = calcularGHGPro;
window.initializeNetZeroChart = initializeNetZeroChart;

// Iniciar componentes específicos se estiver na página de emissões

// --- SISTEMA DE FERRAMENTAS PREMIUM (ALTA ATRAÇÃO) ---

function initializePremiumTools() {
  const modal = document.getElementById('tool-modal');
  const modalClose = document.getElementById('modal-close');
  const modalBody = document.getElementById('modal-body');

  if (!modal || !modalClose || !modalBody) return;

  // Fechar modal
  modalClose.onclick = () => modal.style.display = 'none';
  window.onclick = (event) => {
    if (event.target == modal) modal.style.display = 'none';
  };

  // Botão Verificador de Licença
  const btnLicenca = document.querySelector('#tool-licenca button');
  if (btnLicenca) {
    btnLicenca.onclick = () => {
      openToolModal('licenciamento');
    };
  }

  // Botão Calculadora de Reserva
  const btnReserva = document.querySelector('#tool-reserva button');
  if (btnReserva) {
    btnReserva.onclick = () => {
      openToolModal('reserva');
    };
  }

  // Botão Consultor de CAR
  const btnCAR = document.querySelector('#tool-car button');
  if (btnCAR) {
    btnCAR.onclick = () => {
      openToolModal('car');
    };
  }

  // Botão Checklist
  const btnChecklist = document.querySelector('#tool-checklist button');
  if (btnChecklist) {
    btnChecklist.onclick = () => {
      openToolModal('checklist');
    };
  }

  // Botão Alertas
  const btnAlertas = document.querySelector('#tool-alertas button');
  if (btnAlertas) {
    btnAlertas.onclick = () => {
      openToolModal('alertas');
    };
  }

  function openToolModal(type) {
    modal.style.display = 'flex';
    modalBody.innerHTML = '';

    if (type === 'licenciamento') {
      modalBody.innerHTML = `
        <h3>Verificador de Licença Ambiental (MT)</h3>
        <p>Responda as perguntas abaixo para saber se sua atividade exige licenciamento.</p>
        <div class="ao-tool-form">
          <div class="ao-form-group">
            <label>Tipo de Atividade</label>
            <select id="lic-atividade">
              <option value="">Selecione...</option>
              <option value="agro">Agricultura/Pecuária</option>
              <option value="ind">Indústria</option>
              <option value="const">Construção Civil</option>
              <option value="serv">Serviços</option>
            </select>
          </div>
          <div class="ao-form-group">
            <label>Porte da Empresa</label>
            <select id="lic-porte">
              <option value="pequeno">Pequeno</option>
              <option value="medio">Médio</option>
              <option value="grande">Grande</option>
            </select>
          </div>
          <div class="ao-form-group">
            <label>Possui curso d'água próximo?</label>
            <select id="lic-agua">
              <option value="nao">Não</option>
              <option value="sim">Sim (menos de 50m)</option>
            </select>
          </div>
          <button class="ao-btn ao-btn-primary" onclick="window.runLicensingCheck()">Verificar Necessidade</button>
          <div id="lic-result" class="ao-tool-result"></div>
        </div>
      `;
    } else if (type === 'reserva') {
      modalBody.innerHTML = `
        <h3>Calculadora de Reserva Legal</h3>
        <p>Calcule o percentual exigido de acordo com o bioma da sua propriedade no Mato Grosso.</p>
        <div class="ao-tool-form">
          <div class="ao-form-group">
            <label>Bioma da Propriedade</label>
            <select id="res-bioma">
              <option value="amazonia">Amazônia (80%)</option>
              <option value="cerrado-amazonia">Cerrado na Amazônia Legal (35%)</option>
              <option value="pantanal">Pantanal/Outros (20%)</option>
            </select>
          </div>
          <div class="ao-form-group">
            <label>Área Total (Hectares)</label>
            <input type="number" id="res-area" placeholder="Ex: 500">
          </div>
          <button class="ao-btn ao-btn-primary" onclick="window.runReserveCalc()">Calcular Reserva</button>
          <div id="res-result" class="ao-tool-result"></div>
        </div>
      `;
    } else if (type === 'car') {
      modalBody.innerHTML = `
        <h3>Consultor de Status CAR</h3>
        <p>Informe o número do seu CAR ou CPF/CNPJ para análise de pendências.</p>
        <div class="ao-tool-form">
          <div class="ao-form-group">
            <label>CPF, CNPJ ou Protocolo CAR</label>
            <input type="text" id="car-input" placeholder="000.000.000-00">
          </div>
          <button class="ao-btn ao-btn-primary" onclick="window.runCARConsult()">Analisar Situação</button>
          <div id="car-result" class="ao-tool-result"></div>
        </div>
      `;
    } else if (type === 'checklist') {
      modalBody.innerHTML = `
        <h3>Checklist de Conformidade Ambiental</h3>
        <p>Selecione seu setor para receber o checklist gratuito em seu e-mail.</p>
        <div class="ao-tool-form">
          <div class="ao-form-group">
            <label>Setor de Atuação</label>
            <select id="check-setor">
              <option value="rural">Propriedade Rural</option>
              <option value="posto">Posto de Combustível</option>
              <option value="ind">Indústria Geral</option>
              <option value="const">Construção Civil</option>
            </select>
          </div>
          <div class="ao-form-group">
            <label>Seu E-mail</label>
            <input type="email" id="check-email" placeholder="seu@email.com">
          </div>
          <button class="ao-btn ao-btn-primary" onclick="window.runChecklistDownload()">Enviar Checklist</button>
        </div>
      `;
    } else if (type === 'alertas') {
      modalBody.innerHTML = `
        <h3>Monitoramento de Prazos e Leis</h3>
        <p>Receba alertas sobre vencimentos de licenças e mudanças na legislação da SEMA-MT.</p>
        <div class="ao-tool-form">
          <div class="ao-form-group">
            <label>Nome do Responsável</label>
            <input type="text" id="alert-nome" placeholder="Seu nome">
          </div>
          <div class="ao-form-group">
            <label>WhatsApp ou E-mail</label>
            <input type="text" id="alert-contato" placeholder="(66) 99999-9999">
          </div>
          <button class="ao-btn ao-btn-primary" onclick="window.runAlertSignup()">Ativar Monitoramento</button>
        </div>
      `;
    }
  }
}

// Funções de Processamento das Ferramentas
window.runLicensingCheck = () => {
  const atividade = document.getElementById('lic-atividade').value;
  const porte = document.getElementById('lic-porte').value;
  const agua = document.getElementById('lic-agua').value;
  const resultDiv = document.getElementById('lic-result');

  if (!atividade) {
    alert('Selecione uma atividade');
    return;
  }

  resultDiv.style.display = 'block';
  let msg = '';
  
  if (atividade === 'agro' && porte === 'grande') {
    msg = `<strong>Resultado: Licenciamento Obrigatório.</strong><br>Devido ao porte e atividade agropecuária, você necessita de LO (Licença de Operação).`;
  } else if (agua === 'sim') {
    msg = `<strong>Atenção: Área de Preservação.</strong><br>A proximidade com curso d'água exige estudos específicos de APP e licença especial.`;
  } else {
    msg = `<strong>Resultado: Licenciamento Simplificado.</strong><br>Sua atividade pode se enquadrar na LAS (Licença Ambiental Simplificada).`;
  }

  resultDiv.innerHTML = `${msg}<br><br><a href="contato.html" class="ao-btn ao-btn-sm ao-btn-secondary">Falar com Consultor</a>`;
};

window.runReserveCalc = () => {
  const bioma = document.getElementById('res-bioma').value;
  const area = parseFloat(document.getElementById('res-area').value);
  const resultDiv = document.getElementById('res-result');

  if (isNaN(area)) {
    alert('Informe a área total');
    return;
  }

  let perc = bioma === 'amazonia' ? 0.8 : (bioma === 'cerrado-amazonia' ? 0.35 : 0.2);
  let reserva = area * perc;

  resultDiv.style.display = 'block';
  resultDiv.innerHTML = `
    <strong>Cálculo Concluído:</strong><br>
    Sua Reserva Legal exigida é de <strong>${reserva.toFixed(2)} hectares</strong> (${perc * 100}% da área).<br>
    Deseja saber se você tem passivo ambiental ou créditos para vender?<br><br>
    <a href="carbono-rural.html" class="ao-btn ao-btn-sm ao-btn-secondary">Analisar Potencial de Renda</a>
  `;
};

window.runCARConsult = async () => {
  const input = document.getElementById('car-input').value;
  const resultDiv = document.getElementById('car-result');
  const btn = document.activeElement;

  if (!input) {
    alert('Informe um dado para consulta');
    return;
  }

  resultDiv.style.display = 'block';
  resultDiv.innerHTML = '<em>Consultando bases governamentais (SEMA/SICAR)...</em>';
  if (btn && btn.tagName === 'BUTTON') btn.disabled = true;

  try {
    const response = await fetch('/api/car-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: input })
    });
    const data = await response.json();

    resultDiv.innerHTML = `
      <div style="padding: 1rem; border-radius: 8px; background: rgba(255,255,255,0.05); border-left: 4px solid ${data.riskLevel === 'baixo' ? '#10b981' : (data.riskLevel === 'alto' ? '#ef4444' : '#f59e0b')}">
        <strong>Status: ${data.status}</strong><br>
        <p style="font-size: 0.9rem; margin-top: 0.5rem;">${data.message}</p>
        <button class="ao-btn ao-btn-sm ao-btn-primary" style="margin-top: 1rem;" onclick="window.location.href='contato.html'">Solicitar Relatório Completo</button>
      </div>
    `;
  } catch (error) {
    resultDiv.innerHTML = '<p style="color: #ef4444;">Erro ao conectar com a base de dados. Tente novamente mais tarde.</p>';
  } finally {
    if (btn && btn.tagName === 'BUTTON') btn.disabled = false;
  }
};

window.runChecklistDownload = async () => {
  const email = document.getElementById('check-email').value;
  const setor = document.getElementById('check-setor').value;
  
  if (!email) {
    alert('Informe seu e-mail');
    return;
  }

  // Capturar lead via API de contato
  submitForm({ email, setor }, 'Download de Checklist');
  
  showNotification('Checklist enviado com sucesso para ' + email, 'success');
  const closeBtn = document.getElementById('modal-close');
  if (closeBtn) closeBtn.click();
};

window.runAlertSignup = async () => {
  const contato = document.getElementById('alert-contato').value;
  const nome = document.getElementById('alert-nome').value;

  if (!contato) {
    alert('Informe seu contato');
    return;
  }

  // Capturar lead via API de contato
  submitForm({ nome, contato }, 'Ativação de Alertas');

  showNotification('Monitoramento ativado! Você receberá as novidades em breve.', 'success');
  const closeBtn = document.getElementById('modal-close');
  if (closeBtn) closeBtn.click();
};