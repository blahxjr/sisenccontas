# Backlog de Produto — EncerraDigital BNB

**Última atualização**: 2026-04-06  
**Formato**: Histórias de usuário com critérios de aceite

---

## Épico 1: Jornada do Cliente — Módulo Público

### US-001 — Formulário de encerramento guiado ⚠️ Parcial
**Como** cliente do BNB,  
**Quero** ser guiado por um formulário multi-etapa passo a passo,  
**Para que** eu possa solicitar o encerramento da minha conta sem precisar ir à agência.

**Critérios de aceite**:
- [x] O formulário coleta: agência (cascata UF→Agência), número de conta, nome do titular, motivo (opcional), dados complementares (cheque, saldo, endereço, email)
- [ ] O fluxo pode ser interrompido e retomado (sessão temporária) *(não implementado)*
- [x] O cliente pode usar o formulário multi-etapa (3 etapas + tela de sucesso)
- [ ] Chatbot guiado disponível como alternativa *(desabilitado — formulário substitui)*
- [x] Todas as etapas têm mensagens claras em linguagem simples
- Status: ⚠️ Parcial (formulário ✅ | chatbot ❌)

### US-002 — Geração automática do Termo de Encerramento ✅ Concluído
**Como** cliente,  
**Quero** que o sistema gere automaticamente o Termo de Encerramento com meus dados,  
**Para que** eu não precise preencher manualmente o documento.

**Critérios de aceite**:
- [x] O sistema gera o termo a partir dos dados do formulário
- [x] O PDF gerado segue o padrão normativo do BNB (modelo 3303-40-64 v.020)
- [x] O termo contém cabeçalho vermelho/laranja BNB, 14 seções obrigatórias, seção de Recibo do Banco e rodapé normativo
- [x] Texto não se sobrepõe (quebra de linha por largura real de pixel, paginação real)
- [x] Botão "Gerar PDF para Assinatura" disponível na tela de sucesso do formulário
- Status: ✅ Concluído

### US-003 — Upload do termo assinado ✅ Concluído
**Como** cliente,  
**Quero** fazer o upload do termo assinado eletronicamente,  
**Para que** a solicitação seja registrada sem precisar ir à agência.

**Critérios de aceite**:
- [x] O sistema aceita apenas arquivos PDF (validação magic bytes `%PDF`)
- [x] Limite de tamanho: 10MB (implementado como 10MB; critério original 5MB atualizado)
- [x] O upload é confirmado via componente `UploadTermoAssinado` com drag-drop, progress bar e estados visuais
- [x] Hash SHA-256 calculado por arquivo; armazenado no MinIO sem exposição do caminho
- [x] Instrução gov.br/ICP-Brasil apresentada ao cliente na tela de sucesso
- Status: ✅ Concluído

---

## Épico 2: Operações Internas — Módulo Interno

### US-004 — Listagem de solicitações pendentes ✅ Concluído
**Como** operador interno do BNB,  
**Quero** visualizar todas as solicitações de encerramento pendentes,  
**Para que** eu possa processá-las em ordem de chegada.

**Critérios de aceite**:
- [x] Lista com badges de status (PENDENTE/EM_ANALISE/CONCLUIDO/CANCELADO/REJEITADO)
- [x] Paginação dos resultados
- [x] Acesso apenas para usuários autenticados com perfil `operador` ou superior
- Status: ✅ Concluído

### US-005 — Visualização e tratamento de solicitação ✅ Concluído
**Como** operador,  
**Quero** visualizar os detalhes de uma solicitação e atualizar seu status,  
**Para que** eu possa concluir ou rejeitar o encerramento.

**Critérios de aceite**:
- [x] Exibe dados da solicitação com descriptografia AES-256-CBC (titularNome, numeroConta, emailCliente, contaTransferencia)
- [x] Permite alterar status (PATCH `/interno/solicitacoes/:id/status`)
- [x] Todo acesso a dados pessoais é registrado em log de auditoria (`[AUDITORIA] operador=X acessou id=Y`)
- [x] Seção de documentos: botão "Gerar Termo", tabela de documentos com download via URL presignada
- Status: ✅ Concluído

---

## Épico 3: Apresentação e Conformidade

### US-006 — Página de demonstração visual (/demo) ✅ Concluído
**Como** stakeholder do projeto BNB,  
**Quero** acessar uma página de demonstração visual do sistema,  
**Para que** eu possa avaliar o fluxo e a conformidade sem precisar de acesso ao ambiente de desenvolvimento.

**Critérios de aceite**:
- [x] Página standalone em `/demo` (sem login, sem header/footer do layout principal)
- [x] Hero com identidade visual BNB (vermelho/laranja)
- [x] Badges de conformidade LGPD/OWASP/BNB
- [x] Preview interativo do formulário (4 etapas clicáveis)
- [x] Preview do dashboard do operador (linhas selecionáveis)
- [x] Tabela de arquitetura técnica (7 camadas)
- [x] Grid de segurança (10 controles OWASP/LGPD)
- [x] Roadmap visual (8 fases, 6✅ 2⏳)
- Status: ✅ Concluído

### US-007 — Autenticação SSO corporativa real — ⏸️ Próxima fase
**Como** operador interno do BNB,  
**Quero** autenticar no sistema com minha conta corporativa (AD/SSO),  
**Para que** não seja necessário gerenciar credenciais separadas para o sistema.

**Critérios de aceite**:
- [ ] Integração OIDC ou SAML com provedor de identidade corporativo BNB
- [ ] Sessão JWT com claims de perfil (operador/supervisor) vindos do IdP
- [ ] Remover credenciais mock (BNB0001/BNB0002) do ambiente de produção
- [ ] Logout revoga sessão no IdP
- Status: ⏸️ Fase 8

---

## Legenda de Status
- 🔲 Não iniciado
- 🔄 Em andamento
- ✅ Concluído
- ⚠️ Parcial
- ⏸️ Bloqueado / Próxima fase
- ❌ Cancelado
