# TERMINAL 1 — Infraestrutura + Pipeline de Voz

## CONTEXTO RÁPIDO
Estou montando um call center com IA como serviço. Uso OpenClaw (framework open-source de agentes IA) rodando em Docker numa VPS. Preciso que até o final do dia eu consiga ligar para um número e um agente de IA atenda, converse comigo por voz em português brasileiro, e execute ações (agendar, consultar info, abrir ticket).

## O QUE VOCÊ PRECISA FAZER (nesta ordem)

### 1. Setup do VPS
- Ubuntu 24.04 LTS
- Instalar: Docker, Docker Compose, Caddy v2, Node.js 20+, Git
- Firewall (UFW): liberar apenas 22, 80, 443
- Criar estrutura de diretórios:
```
/opt/openclaw/
├── docker-compose.yml
├── caddy/Caddyfile
├── scripts/
├── templates/
├── monitoring/
└── clients/
    └── callcenter-demo/
        ├── data/
        │   ├── workspace-recepcionista/
        │   │   ├── SOUL.md
        │   │   └── knowledge/
        │   ├── workspace-cobranca/
        │   │   ├── SOUL.md
        │   │   └── knowledge/
        │   ├── workspace-sac/
        │   │   ├── SOUL.md
        │   │   └── knowledge/
        │   └── workspace-agendamento/
        │       ├── SOUL.md
        │       └── knowledge/
        ├── .env
        └── openclaw.json
```

### 2. Docker Compose
Container único para o cliente demo com:
- Imagem: `openclaw/openclaw:latest`
- Porta gateway: 18800:3001
- Porta voz: 3334:3334
- mem_limit: 3g
- cpus: 1.5
- Security: read_only, cap_drop ALL, cap_add NET_BIND_SERVICE, no-new-privileges
- Volume: ./clients/callcenter-demo/data:/app/data
- env_file: ./clients/callcenter-demo/.env

### 3. Caddy (Reverse Proxy + TLS)
- Subdomínio pro dashboard: callcenter.DOMINIO.com → localhost:18800
- Subdomínio pro voice webhook: voice.DOMINIO.com → localhost:3334
- TLS automático via Let's Encrypt

### 4. Pipeline de Voz — USAR VAPI (mais rápido de implementar)
Vapi é um middleware que abstrai todo o pipeline de voz (STT + TTS + turn detection).

Fluxo:
```
Twilio recebe ligação → Vapi processa (STT via Deepgram) → texto vai pro OpenClaw → agente responde → Vapi faz TTS → áudio volta pro caller
```

Passos:
1. Criar conta no Twilio (twilio.com) — comprar número brasileiro (+55)
2. Criar conta no Vapi (vapi.ai)
3. No container OpenClaw, instalar skills do Vapi:
   ```bash
   npx skills add VapiAI/skills
   ```
4. Configurar o assistente de voz via Vapi Dashboard ou API:
   - Nome: "Recepcionista CallCenter"
   - Modelo: claude-sonnet-4-6 (ou gpt-4o-mini pra economizar no teste)
   - Transcrição: Deepgram Nova-3, idioma pt-BR
   - Voz: portuguesa brasileira feminina (ElevenLabs ou Deepgram Aura)
   - Primeira mensagem: "Olá, aqui é da [Empresa], como posso ajudar?"
   - Vincular ao número Twilio comprado
5. Configurar webhook do Vapi apontando pro OpenClaw Gateway:
   - URL: https://voice.DOMINIO.com/voice/webhook
   - O Vapi envia o texto transcrito pro OpenClaw, recebe a resposta, e converte em áudio

### 5. Arquivo .env
```bash
OPENCLAW_GATEWAY_TOKEN=<gerar com openssl rand -hex 32>
OPENCLAW_DATA_DIR=/app/data
ANTHROPIC_API_KEY=<API key da Anthropic>
VAPI_API_KEY=<API key do Vapi>
TWILIO_ACCOUNT_SID=<SID do Twilio>
TWILIO_AUTH_TOKEN=<Token do Twilio>
TWILIO_PHONE_NUMBER=<Número comprado +55...>
```

### 6. openclaw.json (config dos agentes)
```json
{
  "agents": {
    "defaults": {
      "model": "claude-sonnet-4-6"
    },
    "list": [
      {
        "id": "recepcionista",
        "workspace": "/app/data/workspace-recepcionista",
        "model": "claude-sonnet-4-6"
      },
      {
        "id": "cobranca",
        "workspace": "/app/data/workspace-cobranca",
        "model": "claude-sonnet-4-6"
      },
      {
        "id": "sac",
        "workspace": "/app/data/workspace-sac",
        "model": "claude-haiku-4-5"
      },
      {
        "id": "agendamento",
        "workspace": "/app/data/workspace-agendamento",
        "model": "claude-haiku-4-5"
      }
    ]
  },
  "bindings": [
    {
      "agentId": "recepcionista",
      "match": { "channel": "voice", "direction": "inbound" }
    },
    {
      "agentId": "sac",
      "match": { "channel": "whatsapp" }
    }
  ],
  "plugins": {
    "entries": {
      "voice-call": {
        "enabled": true,
        "config": {
          "provider": "twilio",
          "fromNumber": "${TWILIO_PHONE_NUMBER}",
          "twilio": {
            "accountSid": "${TWILIO_ACCOUNT_SID}",
            "authToken": "${TWILIO_AUTH_TOKEN}"
          },
          "serve": {
            "port": 3334,
            "path": "/voice/webhook"
          },
          "inboundPolicy": "allow",
          "allowFrom": ["*"],
          "streaming": {
            "enabled": true,
            "sttProvider": "deepgram",
            "ttsProvider": "elevenlabs"
          },
          "maxDurationSeconds": 300,
          "staleCallReaperSeconds": 360
        }
      }
    }
  }
}
```

### 7. Testar
1. `docker-compose up -d` — subir container
2. `docker logs openclaw-callcenter-demo -f` — verificar se subiu sem erro
3. Ligar pro número Twilio — verificar se o agente atende e fala
4. Se não funcionar via Vapi, testar pipeline alternativo direto (Voice Call Plugin nativo do OpenClaw com Deepgram + ElevenLabs)

## PRIORIDADE ABSOLUTA
O objetivo #1 é: **ligar pro número e ouvir o agente atender em português**. Todo o resto é secundário. Se Vapi der problema, tente o Voice Call Plugin nativo. Se o plugin nativo der problema, use o Vapi Dashboard direto sem passar pelo OpenClaw no primeiro momento — o importante é validar que a voz funciona hoje.

## CREDENCIAIS NECESSÁRIAS (vou fornecer)
- IP do VPS + acesso SSH
- API key Anthropic
- Conta Twilio (SID + Token + Número)
- Conta Vapi (API Key)
- Domínio configurado (para TLS)
