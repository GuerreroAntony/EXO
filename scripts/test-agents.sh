#!/bin/bash
# test-agents.sh — Testa os 4 agentes do call center via API do Gateway
# Uso: ./scripts/test-agents.sh [TOKEN]

set -euo pipefail

TOKEN="${1:-SUBSTITUIR_COM_SEU_TOKEN}"
BASE="http://localhost:18800"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}============================================${NC}"
echo -e "${YELLOW}  Teste dos Agentes — Clínica Sorriso${NC}"
echo -e "${YELLOW}============================================${NC}"
echo ""

# Função para testar um agente
test_agent() {
  local agent="$1"
  local message="$2"
  local label="$3"

  echo -e "${YELLOW}=== Testando $label ===${NC}"
  echo -e "Mensagem: \"$message\""
  echo ""

  response=$(curl -s -w "\n%{http_code}" -X POST "$BASE/api/chat" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"agent\":\"$agent\",\"message\":\"$message\"}" 2>&1)

  http_code=$(echo "$response" | tail -1)
  body=$(echo "$response" | sed '$d')

  if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}[OK] Status: $http_code${NC}"
    echo "$body" | python3 -m json.tool 2>/dev/null || echo "$body"
  else
    echo -e "${RED}[ERRO] Status: $http_code${NC}"
    echo "$body"
  fi

  echo ""
  echo "---"
  echo ""
}

# Testar cada agente
test_agent "recepcionista" "Oi, preciso de ajuda" "Recepcionista (porta de entrada)"
test_agent "sac" "Estou com problema no meu pedido" "SAC (suporte)"
test_agent "cobranca" "Quero saber sobre minha fatura atrasada" "Cobrança (financeiro)"
test_agent "agendamento" "Quero marcar uma consulta de limpeza" "Agendamento"

# Testar roteamento da recepcionista
echo -e "${YELLOW}============================================${NC}"
echo -e "${YELLOW}  Testes de Roteamento (Recepcionista)${NC}"
echo -e "${YELLOW}============================================${NC}"
echo ""

test_agent "recepcionista" "Preciso pagar um boleto atrasado" "Roteamento → Cobrança"
test_agent "recepcionista" "Quero agendar uma consulta com o dentista" "Roteamento → Agendamento"
test_agent "recepcionista" "Tenho uma reclamação sobre meu atendimento" "Roteamento → SAC"
test_agent "recepcionista" "Qual o horário de funcionamento?" "Resposta direta (sem transferir)"

echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}  Testes concluídos!${NC}"
echo -e "${GREEN}============================================${NC}"
