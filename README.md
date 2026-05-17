# AO3 Viewer
Previewer for AO3 works, converting Obsidian files or md files into HTML files with the same structure as AO3 works.

## Rodando localmente

### Pre-requisitos

- Bun `>= 1.3`

### 1) Instale as dependencias

```bash
bun install
```

### 2) Configure as variaveis de ambiente

Este projeto usa as seguintes ENVs:

- `OBSIDIAN_VAULT_PATH` (principal): caminho absoluto da pasta do seu vault do Obsidian.
- `PORT` (opcional): porta HTTP do servidor. Padrao: `5173`.

#### OBSIDIAN_VAULT_PATH (explicacao)

Essa variavel aponta para a pasta onde estao seus arquivos `.md` do Obsidian.
O AO3 Viewer usa esse caminho para:

- listar os capitulos (`.md`) na pagina inicial;
- ler o conteudo de cada capitulo para renderizar a pagina.

Se ela nao estiver definida (ou estiver incorreta), o projeto nao consegue encontrar os capitulos.

Exemplos de valor:

- Linux: `/home/seu-usuario/Documentos/Obsidian/Vault`
- WSL: `/mnt/c/Users/seu-usuario/obsidian/Vault`

Exemplo no Linux/WSL:

```bash
export OBSIDIAN_VAULT_PATH="/home/seu-usuario/Documentos/Obsidian/Vault"
```

### 3) Inicie o servidor

Modo desenvolvimento (com reload automatico):

```bash
bun run dev
```

Ou definindo ENV no mesmo comando:

```bash
OBSIDIAN_VAULT_PATH="/home/seu-usuario/Documentos/Obsidian/Vault" bun run dev
```

Modo normal:

```bash
bun run start
```

### 4) Abra no navegador

Por padrao, o servidor sobe em:

```text
http://localhost:5173
```

Se quiser mudar a porta:

```bash
PORT=3000 bun run dev
```

## Acesso pela rede local usando WSL

Se voce roda o servidor dentro do WSL2 e quer abrir no celular (mesma rede local), crie um encaminhamento de porta no Windows.

### 1) Descubra o IP atual do WSL

No terminal do WSL:

```bash
hostname -I
```

Use o primeiro IP retornado (exemplo: `172.26.42.184`).

### 2) Crie o port proxy no Windows (PowerShell como Administrador)

```powershell
netsh interface portproxy add v4tov4 listenport=5173 listenaddress=0.0.0.0 connectport=5173 connectaddress=172.26.42.184
```

Se seu servidor usa outra porta, troque `5173` nos dois campos (`listenport` e `connectport`).

### 3) Libere a porta no Firewall do Windows

```powershell
netsh advfirewall firewall add rule name="WSL 5173" dir=in action=allow protocol=TCP localport=5173
```

### 4) Acesse pelo celular

No celular, abra:

```text
http://IP_DO_WINDOWS:5173
```

Use o IP da maquina Windows na rede local (nao o IP do WSL).

## Observacoes

- O IP do WSL pode mudar ao reiniciar o WSL/Windows. Se parar de funcionar, refaca os passos com o novo IP.
- Para remover a regra antiga do port proxy:

```powershell
netsh interface portproxy delete v4tov4 listenport=5173 listenaddress=0.0.0.0
```