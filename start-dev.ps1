# EncerraDigital — Script de inicialização do ambiente de desenvolvimento
# Uso: .\start-dev.ps1
# Flags opcionais:
#   -SemInterno   Não sobe o frontend-interno
#   -SoDocker     Sobe apenas a infraestrutura Docker

param(
  [switch]$SemInterno,
  [switch]$SoDocker
)

$Root = $PSScriptRoot

function Escrever-Cabecalho {
  Write-Host ""
  Write-Host "  ╔══════════════════════════════════════════════╗" -ForegroundColor DarkRed
  Write-Host "  ║      EncerraDigital — Banco do Nordeste      ║" -ForegroundColor DarkRed
  Write-Host "  ║         Ambiente de Desenvolvimento          ║" -ForegroundColor DarkRed
  Write-Host "  ╚══════════════════════════════════════════════╝" -ForegroundColor DarkRed
  Write-Host ""
}

function Verificar-Prerequisitos {
  Write-Host "  [1/4] Verificando pré-requisitos..." -ForegroundColor Cyan

  foreach ($cmd in @("docker", "pnpm", "node")) {
    if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) {
      Write-Host "  ✗ '$cmd' não encontrado. Instale antes de continuar." -ForegroundColor Red
      exit 1
    }
  }

  Write-Host "  ✓ docker, pnpm e node disponíveis" -ForegroundColor Green
}

function Subir-Docker {
  Write-Host ""
  Write-Host "  [2/4] Subindo infraestrutura Docker..." -ForegroundColor Cyan
  Set-Location $Root

  # Verifica se o daemon está acessível; se não, abre o Docker Desktop e aguarda
  $daemonOk = docker info 2>&1 | Select-String "Server Version"
  if (-not $daemonOk) {
    Write-Host "  → Docker Desktop não encontrado. Iniciando..." -ForegroundColor Yellow
    $dockerDesktop = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    if (Test-Path $dockerDesktop) {
      Start-Process $dockerDesktop
    } else {
      Write-Host "  ✗ Docker Desktop não encontrado em '$dockerDesktop'. Abra manualmente e tente novamente." -ForegroundColor Red
      exit 1
    }

    Write-Host "  → Aguardando Docker daemon (até 90s)..." -ForegroundColor Yellow
    $tentativas = 0
    do {
      Start-Sleep -Seconds 5
      $tentativas++
      $daemonOk = docker info 2>&1 | Select-String "Server Version"
    } while (-not $daemonOk -and $tentativas -lt 18)

    if (-not $daemonOk) {
      Write-Host "  ✗ Docker daemon não respondeu após 90s. Verifique o Docker Desktop." -ForegroundColor Red
      exit 1
    }
    Write-Host "  ✓ Docker Desktop pronto" -ForegroundColor Green
  }

  docker compose -f infra/docker-compose.dev.yml up -d 2>&1 | Out-Null

  Write-Host "  ✓ PostgreSQL, Redis e MinIO disponíveis" -ForegroundColor Green
}

function Verificar-Dependencias {
  Write-Host ""
  Write-Host "  [3/4] Verificando dependências (pnpm install)..." -ForegroundColor Cyan
  Set-Location $Root

  if (-not (Test-Path "node_modules") -and -not (Test-Path "frontend-cliente/node_modules")) {
    pnpm install
  } else {
    Write-Host "  ✓ Dependências já instaladas" -ForegroundColor Green
  }
}

function Iniciar-Servidores {
  Write-Host ""
  Write-Host "  [4/4] Iniciando servidores..." -ForegroundColor Cyan
  Set-Location $Root

  # Backend + Frontend Cliente juntos
  Write-Host "  → Backend (3333) + Frontend Cliente (3000) iniciando em nova janela..." -ForegroundColor Yellow
  Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$Root'; pnpm dev" -WindowStyle Normal

  # Frontend Interno (opcional)
  if (-not $SemInterno) {
    Start-Sleep -Seconds 2
    Write-Host "  → Frontend Interno (3001) iniciando em nova janela..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$Root'; pnpm dev:interno" -WindowStyle Normal
  }
}

function Mostrar-Urls {
  Write-Host ""
  Write-Host "  ┌─────────────────────────────────────────────────┐" -ForegroundColor DarkCyan
  Write-Host "  │  Aguarde alguns segundos e acesse:              │" -ForegroundColor DarkCyan
  Write-Host "  │                                                  │" -ForegroundColor DarkCyan
  Write-Host "  │  Frontend Cliente  →  http://localhost:3000      │" -ForegroundColor DarkCyan
  Write-Host "  │  Página Demo       →  http://localhost:3000/demo │" -ForegroundColor DarkCyan
  Write-Host "  │  Frontend Interno  →  http://localhost:3001      │" -ForegroundColor DarkCyan
  Write-Host "  │  Backend API       →  http://localhost:3333      │" -ForegroundColor DarkCyan
  Write-Host "  │  Swagger           →  http://localhost:3333/api/docs │" -ForegroundColor DarkCyan
  Write-Host "  │  MinIO Console     →  http://localhost:9001      │" -ForegroundColor DarkCyan
  Write-Host "  └─────────────────────────────────────────────────┘" -ForegroundColor DarkCyan
  Write-Host ""
  Write-Host "  Para encerrar: feche as janelas dos servidores e rode:" -ForegroundColor Gray
  Write-Host "  docker compose -f infra/docker-compose.dev.yml down" -ForegroundColor Gray
  Write-Host ""
}

# ── Execução ────────────────────────────────────────────────────────────────
Escrever-Cabecalho
Verificar-Prerequisitos
Subir-Docker

if (-not $SoDocker) {
  Verificar-Dependencias
  Iniciar-Servidores
}

Mostrar-Urls
