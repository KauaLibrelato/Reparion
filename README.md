# Sistema de Gestão de Manutenção de Equipamentos

Este projeto é uma aplicação para gerenciar a manutenção de equipamentos, facilitando a abertura de chamados de manutenção, acompanhamento de ordens de serviço (O.S.) e o gerenciamento dessas tarefas por administradores. O sistema foi criado utilizando a febre do momento, o vibe coding com ChatGPT e v0, com foco em eficiência e fácil integração.

## Funcionalidades

- **Usuário (Funcionário/Supervisor):**
  - Abertura de chamado de manutenção (O.S).
  - Acompanhamento do status do chamado.
  - Histórico de manutenções realizadas.

- **Administrador (Responsável pela manutenção):**
  - Visualização e gerenciamento de chamados.
  - Aprovação e encaminhamento de ordens de serviço.
  - Cadastro de equipamentos e histórico de manutenção.

## Fluxo do Sistema

1. O usuário abre um chamado de manutenção.
2. O administrador recebe e analisa o chamado.
3. O administrador cria ou encaminha a ordem de serviço (O.S).
4. O técnico executa a manutenção.
5. O status do chamado é atualizado no sistema.
6. O usuário recebe uma notificação de conclusão do chamado (por e-mail ou outra forma).

## Estrutura de Telas

### 1. **Tela de Login**
- **Campos:** E-mail, Senha
- **Botão:** Entrar

### 2. **Dashboard (Usuário)**
- Lista de chamados abertos (com status, data, nome do equipamento, setor).
- Botão para abrir novo chamado.
- Filtros (Data, Status).
- Menu lateral com "Meus Chamados" e "Sair".

### 3. **Tela de Abertura de Chamado (Usuário)**
- **Campos:**
  - Nome do Equipamento
  - Setor
  - Descrição do problema
  - Prioridade (Baixa, Média, Alta)
  - Botão: Enviar Chamado

### 4. **Tela de Acompanhamento de Chamado (Administrador)**
- Detalhes do chamado (ID, Equipamento, Setor, Data, Status).
- Timeline do chamado (aberto → em andamento → concluído).

### 5. **Dashboard (Administrador)**
- Quantidade de chamados em aberto.
- Lista de chamados com filtros (Equipamento, Setor, Data, Prioridade, Status).
- Acesso ao histórico de manutenção.
- Menu lateral (Chamados, Equipamentos).

### 6. **Tela de Gerenciamento de Chamados**
- Lista de chamados detalhada.
- Opção para alterar status (Novo → Em andamento → Concluído).
- Campo para adicionar observações técnicas.

### 7. **Tela de Cadastro de Equipamentos**
- Lista de equipamentos cadastrados.
- Botão para adicionar novo equipamento.
- Modal de cadastro com os seguintes campos:
  - Nome
  - Código
  - Data de Aquisição

## Tecnologias utilizadas
-  Next.js
-  TypeScript
-  Shadcn
-  Tailwind
-  ChatGPT
-  v0

