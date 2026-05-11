# Roteiro de Testes - AmbienteOn

Este documento serve como guia para verificar todas as funcionalidades do sistema AmbienteOn. Siga os passos abaixo para garantir que o site está funcionando corretamente.

**URL de Acesso:** [http://localhost:8000](http://localhost:8000)

---

## 1. Navegação e Responsividade
- [ ] Abra o site em um navegador Desktop.
- [ ] Verifique se o menu de navegação está visível e funcional.
- [ ] Redimensione a janela para o tamanho de um celular (ou use as ferramentas de desenvolvedor `F12` -> `Ctrl+Shift+M`).
- [ ] Verifique se o menu se transforma em um ícone de hambúrguer e se abre ao clicar.
- [ ] Teste a rolagem da página e observe as animações de entrada dos elementos.

## 2. Solicitação de Serviços
- [ ] Role até a seção "Nossos Serviços".
- [ ] Marque alguns serviços (ex: "Licenciamento Ambiental", "Consultoria de Carbono").
- [ ] Verifique se os serviços selecionados aparecem no formulário de solicitação no final da página.
- [ ] Preencha o formulário com dados de teste.
- [ ] Clique em "Enviar Solicitação" e verifique a notificação de sucesso.

## 3. Ferramentas Ambientais

### Calculadora de Carbono
- [ ] Acesse a seção de Calculadora de Pegada de Carbono.
- [ ] Preencha os campos com valores fictícios (ex: 100 litros de gasolina, 200 kWh de energia).
- [ ] Clique em "Calcular Pegada".
- [ ] Verifique se o resultado é exibido e se o gráfico é gerado.
- [ ] Clique em "Solicitar Neutralização" e veja se o formulário principal é preenchido automaticamente com "Consultoria de Carbono".

### Mapa de Legislação
- [ ] Acesse a seção de Mapa de Legislação.
- [ ] Passe o mouse sobre o estado de Mato Grosso (MT).
- [ ] Verifique se o tooltip exibe informações sobre a legislação estadual.
- [ ] Clique no estado e verifique se o formulário é preenchido com interesse em legislação de MT.

### Dashboard de Sustentabilidade
- [ ] Acesse a seção de Dashboard.
- [ ] Observe se os gráficos (Resíduos, Emissões, Água) são carregados e animados.
- [ ] Interaja com os gráficos (passe o mouse).

## 4. Agendamento Online
- [ ] Acesse a seção de Agendamento.
- [ ] Selecione um serviço (ex: "Consultoria Inicial").
- [ ] Escolha uma data no calendário.
- [ ] Selecione um horário disponível.
- [ ] Verifique o resumo do agendamento.
- [ ] Confirme o agendamento e verifique a mensagem de sucesso.

## 5. Biblioteca de Normas
- [ ] Acesse a seção "Biblioteca de Normas".
- [ ] Utilize a barra de busca para procurar por "água" ou "resíduos".
- [ ] Filtre por categoria (ex: "Leis Federais", "Normas MT").
- [ ] Verifique se os cards de normas são filtrados corretamente.
- [ ] Teste o botão de "Compartilhar" em um card e veja as opções (LinkedIn, Twitter, Copiar Link).

## 6. Certificados e Selos
- [ ] Acesse a seção de Certificados.
- [ ] Verifique se os selos (ISO 14001, etc.) estão visíveis com seus status.

## 7. Chatbot Ambiental
- [ ] Localize o ícone do robô no canto inferior direito.
- [ ] Clique para abrir o chat.
- [ ] Envie uma mensagem como "Olá" ou selecione uma ação rápida (ex: "Licenciamento").
- [ ] Verifique se o bot responde adequadamente.
- [ ] Teste palavras-chave como "carbono", "resíduos", "contato".

## 8. Modo Escuro e Acessibilidade
- [ ] Clique no botão de alternância de tema (sol/lua) no topo da página.
- [ ] Verifique se o site muda para o modo escuro corretamente (cores de fundo, texto).
- [ ] Pressione `Tab` para navegar pelos elementos focáveis e verificar o anel de foco.

## 9. Newsletter
- [ ] Vá até o final da página, antes do rodapé.
- [ ] Digite um e-mail no campo de newsletter.
- [ ] Tente enviar sem marcar a caixa de consentimento (deve falhar).
- [ ] Marque a caixa e envie. Verifique a mensagem de sucesso.

## 10. Área Administrativa (Backoffice)
- [ ] Acesse [http://localhost:8000/admin.html](http://localhost:8000/admin.html).
- [ ] Faça login com `admin` / `admin123`.
- [ ] Verifique se o dashboard carrega com os dados.
- [ ] Verifique a tabela de solicitações recentes (deve incluir as que você fez no teste).
- [ ] Teste o botão de "Exportar Relatório".
