# jwtg

**Assina um JWT a partir de um payload JSON e copia o token para a área de transferência.**

CLI global, sem servidor e sem rede: lê um arquivo `.json`, assina com o segredo informado e imprime o token no terminal — pronto para colar em um teste de API.

[![npm version](https://img.shields.io/npm/v/jwtg.svg)](https://www.npmjs.com/package/jwtg)

## O que faz

- Lê um payload de um arquivo `.json` (ou usa `{}` quando nenhum arquivo é passado).
- Assina com `jsonwebtoken`, usando HS256 e `noTimestamp: true`.
- Imprime o token, copia **apenas o token** para a área de transferência e mostra o payload e o segredo usados.
- Recusa caminho inexistente, extensão diferente de `.json` e conteúdo que não seja JSON válido.

## Requisitos

- Node.js com npm. O `package.json` **não declara** `engines`, então não há versão mínima documentada.
- Nenhuma variável de ambiente é lida.

## Instalação

```sh
npm i -g jwtg
```

O pacote registra o binário `jwtg` apontando para `index.js`.

## Uso

```sh
jwtg <secret?> <jsonPath?>
```

Os dois argumentos são **posicionais e opcionais**:

| Argumento | Padrão | O que é |
|---|---|---|
| `secret` | `stubJWT` | String usada como chave HMAC. Qualquer string serve; string vazia cai no padrão. |
| `jsonPath` | — | Caminho para um arquivo `.json`. É resolvido com `path.resolve`, então caminhos relativos partem do diretório atual. |

Não existem flags: `--help`, `--version`, `--secret` ou `--payload` não são implementados. O primeiro argumento é sempre o segredo e o segundo é sempre o caminho — uma flag no primeiro lugar vira segredo, no segundo vira caminho inválido.

Sem nenhum argumento, o comando assina um payload vazio com `stubJWT` e ainda copia o token:

```sh
jwtg
```

## Exemplo

`payload.json`:

```json
{
  "sub": "42",
  "role": "admin"
}
```

```sh
jwtg minha-chave ./payload.json
```

Saída real:

```text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MiIsInJvbGUiOiJhZG1pbiJ9.6wIISyXreNTBo10JY-HCDlPtGxFlmG_YHDiw9MPShB8
JSON: { sub: '42', role: 'admin' }
Secret: minha-chave
```

O token acima decodifica para:

```json
{ "alg": "HS256", "typ": "JWT" }
```

```json
{ "sub": "42", "role": "admin" }
```

Como `noTimestamp: true` é fixo, não há claim `iat`; o payload é exatamente o conteúdo do arquivo. Se você precisa de `exp`, `nbf`, `aud` ou `iss`, inclua esses campos no próprio JSON.

## Como o token é montado

1. `process.argv` fornece `secretKey` e `path`.
2. Se `path` foi informado, ele é resolvido e precisa existir **e** ter extensão exatamente `.json` (maiúsculas como `.JSON` são rejeitadas).
3. O arquivo é lido de forma síncrona e passado por `JSON.parse`.
4. `jsonwebtoken.sign(json, secretKey || 'stubJWT', { noTimestamp: true })` gera o token.
5. O token é impresso, gravado no clipboard com `clipboardy.writeSync`, e o payload e o segredo são impressos.

O algoritmo não é configurável: `jsonwebtoken` usa HS256 por padrão e o código não passa `algorithm`.

## Saída e códigos de saída

| Código | Quando |
|---|---|
| `0` | Token gerado e copiado. |
| `1` | Caminho inexistente, extensão diferente de `.json` ou JSON inválido — o código do repositório define `process.exitCode = 1`. |
| `1` | JSON válido que não é um objeto (array, string, número): o `jsonwebtoken` lança uma exceção não tratada, com stack trace. |

Mensagens de erro (stderr), com o caminho absoluto na linha seguinte:

```text
Please, check your path, and select a valid JSON File!
Path: /caminho/absoluto/arquivo.txt
```

```text
Invalid JSON: <mensagem do JSON.parse>
Path: /caminho/absoluto/arquivo.json
```

> [!IMPORTANT]
> O `index.js` deste repositório define `process.exitCode = 1` nos erros de caminho e de JSON, mas a tarball publicada no npm como `1.1.3` **não contém essas atribuições** e encerra com código `0` nos mesmos casos. Se você depende do código de saída em scripts, confira a versão instalada com `npm ls -g jwtg`.

## Segurança

- **O segredo vai para o terminal e para o histórico do shell.** Ao passar `minha-chave` na linha de comando, ela fica registrada no histórico e visível em listagens de processos. Para segredos reais, prefira um segredo descartável de ambiente de teste.
- **O clipboard é compartilhado com outros aplicativos.** Qualquer processo com acesso à área de transferência pode ler o token.
- **`stubJWT` não é segredo.** É apenas o valor padrão para gerar tokens de teste.
- **Nada sai da máquina.** O CLI não faz requisições HTTP; lê o arquivo local, assina e imprime.
- Não há validação de expiração, emissor ou audiência: o objetivo é gerar o token, não verificá-lo.

## Desenvolvimento

```sh
git clone https://github.com/juninmd/jwtg.git
cd jwtg
npm install
node index.js minha-chave ./payload.json
```

Dependências: `jsonwebtoken@^8.5.1` e `clipboardy@^2.1.0`. Não há script de teste no `package.json` nem arquivos de teste no repositório.

## CI

| Workflow | Gatilho | O que roda |
|---|---|---|
| `validate.yml` | PR e push em `main`/`master` | Validação compartilhada de `juninmd/base-actions` |
| `sast.yml` | push em `main`/`master`, manual | SAST compartilhado com `fail-semgrep: false` |
| `security.yml` | push em `main`/`master` | Varredura de segurança compartilhada (job `gitleaks`) |
| `release-drafter.yml` | push em `main`/`master`, PRs | Atualização do rascunho de release |
| `dependabot-auto-merge.yml` | `pull_request_target` | Auto-merge de PRs do Dependabot quando os checks passam |

Nenhum workflow executa uma suíte de testes, porque o repositório não tem uma.

## Limitações

- **Sem `iat`.** O token não carrega data de emissão; APIs que exigem `iat` precisam recebê-lo no payload.
- **Sem expiração automática.** `exp` só existe se estiver no JSON de entrada.
- **Somente HS256.** Não há opção de algoritmo ou de chave assimétrica.
- **Sem flags de CLI.** Não há `--help`, `--version` ou argumentos nomeados; qualquer argumento extra além dos dois primeiros é ignorado.
- **Payload precisa ser objeto.** Arrays e escalares passam pelo `JSON.parse`, mas quebram no `jsonwebtoken` com exceção não tratada.
- **Divergência entre repositório e npm.** A versão publicada (`1.1.3`) não tem o `process.exitCode` presente no `master`; o código de saída em erro é diferente conforme a origem da instalação.
- **Sem arquivo `LICENSE`.** O `package.json` declara MIT, mas o repositório não inclui o texto da licença.

## Licença

O `package.json` declara MIT, mas **não há arquivo `LICENSE`** no repositório.
