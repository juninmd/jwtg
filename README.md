# jwtg

JWT Generator: cria um token JWT assinado a partir de um payload JSON e o copia para a área de transferência.

## Instalação

```sh
npm i -g jwtg
```

## Uso

```sh
jwtg <secret?> <jsonPath?>
```

- `secret` (opcional): chave usada para assinar o token. Sem ela, usa `stubJWT`.
- `jsonPath` (opcional): caminho para um arquivo `.json` com o payload. Sem ele, o token é gerado com payload vazio.

O token é impresso no terminal, copiado para a área de transferência e o payload e o secret usados são exibidos.

Exemplo:

```sh
jwtg minha-chave ./payload.json
```

Se o caminho não existir, não tiver extensão `.json` ou o conteúdo não for JSON válido, a mensagem de erro é exibida e o processo termina com código de saída `1`.

## Desenvolvimento

1. Clone o repositório.
2. Instale as dependências: `npm install`.
3. Execute localmente: `node index.js <secret?> <jsonPath?>`.

## Arquivos

- `index.js`: ponto de entrada (também registrado como binário `jwtg` em `package.json`).
- `package.json`: metadados, dependências e `bin`.
- `readme.MD`: documentação resumida.
