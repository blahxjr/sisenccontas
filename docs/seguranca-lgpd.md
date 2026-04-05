# Segurança e LGPD — EncerraDigital BNB

**Última atualização**: 2026-04-05  
**Referências**: OWASP ASVS v4.0, OWASP Top 10 2021, LGPD Lei 13.709/2018, Resolução BCB 85/2021

---

## 1. Princípios Gerais

- **Defesa em profundidade**: múltiplas camadas de controle (frontend, backend, banco, rede).
- **Menor privilégio**: cada componente acessa apenas o que precisa.
- **Privacidade por design**: minimização de dados desde o início do projeto.
- **Falha segura**: em caso de erro, o sistema nega acesso por padrão.

---

## 2. Controles OWASP ASVS implementados

### Autenticação (ASVS V2)
- [ ] Módulo interno usa autenticação forte (OIDC/SAML corporativo ou MFA)
- [ ] Tokens JWT com expiração curta (ex.: 15min) + refresh token rotativo
- [ ] Senhas nunca armazenadas em texto plano (bcrypt, argon2)
- [ ] Bloqueio de conta após tentativas falhas configurável

### Autorização (ASVS V4)
- [ ] RBAC implementado: perfis `operador`, `supervisor`, `admin`
- [ ] Toda rota interna verifica papel do usuário via Guard
- [ ] Separação total entre endpoints públicos (cliente) e protegidos (interno)

### Validação de Entrada (ASVS V5)
- [ ] DTOs com class-validator em todos os endpoints
- [ ] Tamanho máximo para todos os campos de texto
- [ ] Lista branca de valores para campos enum (motivo, status)
- [ ] Sanitização de HTML em campos de texto livre

### Upload de Arquivos (ASVS V12)
- [ ] Verificação de tipo MIME (não só extensão)
- [ ] Limite de tamanho (ex.: 5MB para PDFs de termo)
- [ ] Armazenamento fora do diretório web (MinIO/S3)
- [ ] Nome de arquivo gerado pelo sistema (nunca o nome original do cliente)
- [ ] Scan de malware quando disponível no ambiente

### Logs e Auditoria (ASVS V7)
- [ ] Logs estruturados (JSON) com nível configurável
- [ ] Dados pessoais mascarados em todos os logs
- [ ] Log de acesso a dados sensíveis no módulo interno
- [ ] Retenção de logs conforme política do banco

### Headers HTTP de Segurança (ASVS V14)
- [ ] Content-Security-Policy (CSP)
- [ ] HTTP Strict Transport Security (HSTS)
- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff
- [ ] Referrer-Policy: no-referrer
- [ ] Permissions-Policy

### Criptografia (ASVS V6)
- [ ] TLS 1.2+ obrigatório em trânsito
- [ ] Dados pessoais sensíveis (número de conta, CPF) criptografados em repouso (AES-256)
- [ ] Chaves de criptografia gerenciadas por variáveis de ambiente / KMS

---

## 3. LGPD — Controles implementados

### Base legal
- Cumprimento de obrigação legal (Art. 7º, II) — encerramento de conta é obrigação regulatória.
- Registro da base legal no modelo de dados.

### Minimização de dados
- Módulo cliente coleta apenas: agência, número de conta, nome do titular, motivo (opcional).
- Nenhum dado de saldo, extrato, contrato ou histórico de transações é coletado ou exibido.

### Consentimento e aceite
- Antes de enviar a solicitação, o cliente aceita explicitamente termos de uso e política de privacidade.
- Registrar: versão do documento, timestamp, IP mascarado.

### Direitos do titular
- Interface para solicitar anonimização/exclusão de dados após prazo regulatório (a implementar).
- Prazo mínimo de retenção definido conforme regulação BACEN (a definir com compliance do banco).

### Notificação de incidentes
- Processo documentado para notificação à ANPD em até 72h em caso de incidente de segurança.
- Contato do DPO (Data Protection Officer) do banco deve ser registrado no sistema.

---

## 4. Itens não implementados (débito de segurança inicial)
Ver `docs/backlog-tecnico.md` para acompanhar a evolução.
