# Nosso Território 2.0 + Cartões

Dois PWAs em arquivo único para GitHub Pages, no mesmo projeto Firebase (`nosso-territorio-d1b6b`).

| Pasta | O que é | Quem usa |
|---|---|---|
| `nosso-territorio/` | App principal: mapa com territórios e quadras clicáveis, ficha, programação de campo, pontos de saída, Início com ciclo de cobertura e painel de atenção, editor de quadras, cartões de casas, backups automáticos | Quem administra (login com e-mail/senha ou Google) |
| `nosso-territorio-cartoes/` | App Cartões: marcação de casas por quadra, três visitas, funciona sem internet e sem login | Publicadores (entram com o código da congregação) |

## 1. Subir no GitHub

Crie dois repositórios (ou use duas pastas em um só, cada uma com o Pages apontando para a pasta):

1. **nosso-territorio** → copie o conteúdo de `nosso-territorio/` para a raiz do repositório.
2. **nosso-territorio-cartoes** → copie o conteúdo de `nosso-territorio-cartoes/` para a raiz.

Em cada um: Settings → Pages → Deploy from a branch → `main` / `(root)`.

Os endereços ficarão como `https://SEU-USUARIO.github.io/nosso-territorio/` e `https://SEU-USUARIO.github.io/nosso-territorio-cartoes/`.

## 2. Configurar o Firebase (uma vez)

No console do projeto `nosso-territorio-d1b6b`:

1. **Authentication → Sign-in method**: além de E-mail/senha e Google (já ativos), **ative "Anônimo"**. É assim que o app Cartões escreve sem login.
2. **Authentication → Settings → Authorized domains**: confirme que `SEU-USUARIO.github.io` está na lista.
3. **Firestore → Rules**: cole o conteúdo de `nosso-territorio/firestore.rules` e publique. As regras garantem que:
   - só a sua conta lê e escreve os dados da congregação (`congregacoes/{seu uid}`), os backups e o documento público;
   - quem tem o código (usuários anônimos do app Cartões) só pode marcar casas, datar visitas e acrescentar/corrigir/remover números — não cria nem apaga cartões, nem toca nos territórios.
4. Não é preciso criar índices: as consultas usam um único campo.

## 3. Primeira abertura do app principal

1. Entre com a mesma conta do app anterior. Se não houver dados novos ainda, o app **migra sozinho** o documento antigo (`usuarios/{uid}`) ou o `localStorage` da versão anterior. Também dá para usar "Restaurar de arquivo" em Configurações com um `nosso-territorio-AAAA-MM-DD.json`.
2. Em Configurações, confira nome, cidade e quantidade de territórios (58).
3. Em **App Cartões → "Importar cartões do PDF"**: cria na nuvem os 403 cartões de quadra com os 3.828 números de casa extraídos do "Número das Casas.pdf" (arquivo `casas.json`). Só cria os que ainda não existem, então pode repetir sem risco.
4. Copie o **código da congregação** (gerado automaticamente; "Gerar novo código" invalida os aparelhos antigos) e passe aos publicadores.

## 4. Primeira abertura do app Cartões

O publicador digita o código uma vez. Daí em diante o app abre direto, mesmo sem internet; as marcações ficam no aparelho e sobem sozinhas quando houver sinal (é a persistência offline do próprio Firestore, com fila de escrita).

## 5. Arquivos de dados do app principal

- `mapa-base.webp` — o "Mapa Geral.pdf" renderizado (6000 px de largura). Para trocar de mapa, gere outro WebP com a mesma proporção e **mude a versão em `sw.js`** (`CACHE`).
- `mapa-geo.json` — contorno clicável, posição do número, retângulo e **quadras** (polígonos) de cada território, extraídos do PDF a 400 dpi. Ajustes feitos no editor ("Ajustar quadras") são salvos na nuvem (`qover`), por cima deste arquivo; o arquivo em si não muda.
- `casas.json` — cartões de quadra e números de casa, usados só na importação inicial.
- `assetlinksmodelo.json` — modelo para o TWA (Android). Para usar, preencha e publique em `/.well-known/assetlinks.json`.

## 6. Atualizações

O service worker busca `index.html` sempre pela rede primeiro, então basta fazer commit. Para os demais arquivos (mapa, geometria, ícones) é preciso subir a versão de `CACHE` em `sw.js`.

## Estrutura no Firestore

```
codigos/{CODIGO}                     { cong: <uid do administrador> }
congregacoes/{uid}                   { v, t{...}, p{items}, s{items}, cfg{...}, qover{...} }
congregacoes/{uid}/publico/dados     { nomes{k:{n,a}}, cong, city }      ← lido pelo app Cartões
congregacoes/{uid}/cartoes/{m_q}     { mapa, quadra, casas[], extra[], del[], ren{}, c{casa:[0|1,0|1,0|1]}, v[{d,p}x3], ts }
congregacoes/{uid}/backups/{id}      { kind, ts, size, data (JSON) }
```
