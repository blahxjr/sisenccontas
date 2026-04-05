# Backlog de Produto — EncerraDigital BNB

**Última atualização**: 2026-04-05  
**Formato**: Histórias de usuário com critérios de aceite

---

## Épico 1: Jornada do Cliente — Módulo Público

### US-001 — Chatbot de encerramento guiado
**Como** cliente do BNB,  
**Quero** ser guiado por um chatbot passo a passo,  
**Para que** eu possa solicitar o encerramento da minha conta sem precisar ir à agência.

**Critérios de aceite**:
- [ ] O chatbot coleta: agência, número de conta, nome do titular, motivo (opcional)
- [ ] O fluxo pode ser interrompido e retomado (sessão temporária)
- [ ] O cliente pode escolher entre chatbot ou formulário manual
- [ ] Todas as etapas têm mensagens claras em linguagem simples
- [ ] Status: 🔲 Não iniciado

### US-002 — Geração automática do Termo de Encerramento
**Como** cliente,  
**Quero** que o sistema gere automaticamente o Termo de Encerramento com meus dados,  
**Para que** eu não precise preencher manualmente o documento.

**Critérios de aceite**:
- [ ] O sistema gera o termo a partir dos dados do formulário/chatbot
- [ ] O termo é exibido para revisão antes do download
- [ ] O PDF gerado segue o padrão normativo do BNB
- [ ] Status: 🔲 Não iniciado

### US-003 — Upload do termo assinado
**Como** cliente,  
**Quero** fazer o upload do termo assinado eletronicamente via gov.br,  
**Para que** a solicitação seja registrada sem precisar ir à agência.

**Critérios de aceite**:
- [ ] O sistema aceita apenas arquivos PDF
- [ ] Limite de tamanho: 5MB
- [ ] O upload é confirmado com protocolo de solicitação
- [ ] Status: 🔲 Não iniciado

---

## Épico 2: Operações Internas — Módulo Interno

### US-004 — Listagem de solicitações pendentes
**Como** operador interno do BNB,  
**Quero** visualizar todas as solicitações de encerramento pendentes,  
**Para que** eu possa processá-las em ordem de chegada.

**Critérios de aceite**:
- [ ] Lista com filtros por status, agência e período
- [ ] Paginação dos resultados
- [ ] Acesso apenas para usuários autenticados com perfil `operador` ou superior
- [ ] Status: 🔲 Não iniciado

### US-005 — Visualização e tratamento de solicitação
**Como** operador,  
**Quero** visualizar os detalhes de uma solicitação e atualizar seu status,  
**Para que** eu possa concluir ou rejeitar o encerramento.

**Critérios de aceite**:
- [ ] Exibe dados da solicitação e documento assinado
- [ ] Permite alterar status com justificativa obrigatória
- [ ] Todo acesso a dados pessoais é registrado em log de auditoria
- [ ] Status: 🔲 Não iniciado

---

## Legenda de Status
- 🔲 Não iniciado
- 🔄 Em andamento
- ✅ Concluído
- ⏸️ Bloqueado
- ❌ Cancelado
