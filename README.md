# Nosso Território 2.2 + Cartões

Dois PWAs em arquivo único para GitHub Pages, no mesmo projeto Firebase (`nosso-territorio-5bc39`).

| Pasta | O que é | Quem usa |
|---|---|---|
| `nosso-territorio/` | App principal: mapa com territórios e quadras clicáveis, ficha, programação de campo, pontos de saída, Início com ciclo de cobertura e painel de atenção, editor de quadras, cartões de casas, backups automáticos | Quem administra (login com e-mail/senha ou Google) |
| `nosso-territorio-cartoes/` | App Cartões: marcação de casas por quadra, três visitas, funciona sem internet e sem login | Publicadores (abre sozinho, sem código; também pelo QR Code de cada território) |

## 1. Subir no GitHub

Crie dois repositórios (ou use duas pastas em um só, cada uma com o Pages apontando para a pasta):

1. **nosso-territorio** → copie o conteúdo de `nosso-territorio/` para a raiz do repositório.
2. **nosso-territorio-cartoes** → copie o conteúdo de `nosso-territorio-cartoes/` para a raiz.

Em cada um: Settings → Pages → Deploy from a branch → `main` / `(root)`.

Os endereços ficarão como `https://SEU-USUARIO.github.io/nosso-territorio/` e `https://SEU-USUARIO.github.io/nosso-territorio-cartoes/`.

## 2. Configurar o Firebase (uma vez)

No console do projeto `nosso-territorio-5bc39`:

1. **Authentication → Sign-in method**: além de E-mail/senha e Google (já ativos), **ative "Anônimo"**. É assim que o app Cartões escreve sem login e sem código.
2. **Authentication → Settings → Authorized domains**: confirme que `SEU-USUARIO.github.io` está na lista.
3. **Firestore → Rules**: cole o conteúdo de `nosso-territorio/firestore.rules` e publique. As regras garantem que:
   - só a sua conta lê e escreve os dados da congregação (`congregacoes/{seu uid}`), os backups e o documento público;
   - os publicadores (usuários anônimos do app Cartões) só podem marcar casas, datar visitas e acrescentar/corrigir/remover números — não criam nem apagam cartões, nem tocam nos territórios;
   - o documento `config/padrao` diz ao app Cartões qual congregação usar; só a conta administradora o grava.
4. Não é preciso criar índices: as consultas usam um único campo.

## 3. Primeira abertura do app principal

1. Entre com a mesma conta do app anterior. Se não houver dados novos ainda, o app **migra sozinho** o documento antigo (`usuarios/{uid}`) ou o `localStorage` da versão anterior. Também dá para usar "Restaurar de arquivo" em Configurações com um `nosso-territorio-AAAA-MM-DD.json`.
2. Em Configurações, confira nome, cidade e quantidade de territórios (58).
3. Em **App Cartões → "Importar / atualizar cartões do PDF"**: cria na nuvem os 418 cartões de quadra com os 3.917 números de casa extraídos do "Número das Casas.pdf" (arquivo `casas.json`). Pode repetir sem risco: cria os que faltam e, nos que já existem, só troca a lista de números quando o `casas.json` mudou — marcações, visitas e números adicionados pelos publicadores são mantidos. Alguns territórios (5, 6, 7, 8, 10, 11, 17, 24, 30, 37, 38, 49, 52, 53) estão em branco no próprio PDF; os publicadores podem acrescentar os números pelo app.
4. Ao abrir, o app registra sozinho a sua conta como a congregação do app Cartões (`config/padrao`). Em Configurações → App Cartões aparece "Conectado".

## 4. Primeira abertura do app Cartões

O publicador só abre o app: ele entra anonimamente, lê `config/padrao` e já mostra os territórios. Precisa de internet apenas nessa primeira abertura; depois abre mesmo sem sinal, e as marcações ficam no aparelho e sobem sozinhas quando houver conexão (persistência offline do próprio Firestore, com fila de escrita).

## Nomes das ruas (2.2)

O `mapa-base.webp` agora é só o desenho (quadras, hachuras, ruas): todo o texto do PDF foi retirado dele. Os nomes das ruas e os demais rótulos vêm do arquivo `mapa-ruas.json` (544 textos com posição, ângulo e tamanho extraídos do próprio PDF) e são desenhados em vetor por cima do mapa, com contorno branco — ficam nítidos em qualquer zoom e também na imagem do "Compartilhar no WhatsApp". Em Configurações → Mapa dá para escolher o tamanho (Normal, Grande ou Muito grande; vale para a tela e para a imagem compartilhada). Os números dos territórios continuam sendo os círculos do app.

## 4b. QR Codes dos cartões (novo na 2.1)

Cada território tem um QR Code que abre o app Cartões **direto naquele território** (link `.../nosso-territorio-cartoes/?t=12`), já na tela de escolher a quadra e a letra (A/B) e ver os números das casas. Não precisa de login nem de código.

- **Endereço do app Cartões**: em Configurações → App Cartões há o campo "Endereço do app Cartões" e o botão "Localizar / verificar endereço". Ao abrir, o app confere o endereço configurado; se não encontrar o app Cartões lá, procura sozinho entre os seus sites do GitHub Pages (pela API pública do GitHub) e salva o endereço certo — aparece "✓ Endereço confirmado". Se o app Cartões estiver num domínio próprio, digite o endereço no campo (ex.: `https://usuario.github.io/NOME-DO-REPOSITORIO/`).
- **Para colar atrás do cartão físico**: Configurações → App Cartões → "QR Codes para imprimir". Escolha o tamanho (25 a 40 mm) e use "Imprimir / salvar PDF" (impressão do celular ou do computador) ou "Baixar folhas (PNG)" (imagens A4, uma etiqueta por território, com número e nome, com linha de corte).
- **Um território só**: abra o território no mapa → botão "QR Code" → "Enviar por WhatsApp", "Copiar link" ou "Baixar imagem".
- **Ao compartilhar com o dirigente**: no "Compartilhar no WhatsApp" do território há a chave "Enviar junto o QR Code dos cartões" (ligada por padrão): vai o recorte do mapa + a imagem do QR Code + o texto, que já inclui o link dos cartões.
- Se o app Cartões já estiver instalado no celular do dirigente, o Android abre o link dentro do app; se não, abre no navegador (e dá para instalar de lá).

## Se o app Cartões ficar em "Não foi possível conectar"

A partir da 2.1.1 a mensagem diz a causa e mostra o código entre parênteses. As causas comuns:

- `auth/admin-restricted-operation` ou `auth/operation-not-allowed`: o provedor **Anônimo** não está ativado (Firebase → Authentication → Sign-in method → Adicionar provedor → Anônimo → Ativar).
- `permission-denied`: as regras do `firestore.rules` não foram publicadas (Firestore Database → Regras → colar → Publicar).
- `sem-padrao`: o app principal ainda não registrou a congregação. Abra o app principal logado uma vez; em Configurações → App Cartões deve aparecer "Conectado".
- `unavailable`: o navegador não alcançou `firestore.googleapis.com` (bloqueador de anúncios, antivírus, rede corporativa). Teste em outra rede ou no celular.
- `not-found` / `failed-precondition`: o banco Firestore ainda não foi criado no projeto `nosso-territorio-5bc39`.

## Se a tela de login não responder

A tela de login mostra uma linha de status embaixo ("versão 2.2.0 · pronto para entrar"). Se aparecer "os scripts do Firebase não carregaram", é internet/bloqueio; se aparecer "o Firebase ainda não respondeu", feche e abra de novo. Qualquer erro de JavaScript ou do Firestore aparece numa faixa vermelha na parte de baixo da tela — mande esse texto para diagnóstico.

Se o app novo foi publicado no mesmo endereço do antigo: o service worker antigo pode entregar a página velha até a segunda abertura. Abra o endereço no navegador, recarregue duas vezes, ou desinstale o PWA antigo e instale de novo. Abrir o `index.html` direto do arquivo (file://) não funciona: use sempre o endereço do GitHub Pages.

## 5. Arquivos de dados do app principal

- `mapa-base.webp` — o "Mapa Geral.pdf" renderizado (6000 px de largura). Para trocar de mapa, gere outro WebP com a mesma proporção e **mude a versão em `sw.js`** (`CACHE`).
- `mapa-geo.json` — contorno clicável, posição do número, retângulo e **quadras** (polígonos) de cada território, extraídos do PDF a 400 dpi. Ajustes feitos no editor ("Ajustar quadras") são salvos na nuvem (`qover`), por cima deste arquivo; o arquivo em si não muda.
- `casas.json` — cartões de quadra e números de casa, usados só na importação inicial.
- `assetlinksmodelo.json` — modelo para o TWA (Android). Para usar, preencha e publique em `/.well-known/assetlinks.json`.

## 6. Atualizações

O service worker busca `index.html` sempre pela rede primeiro, então basta fazer commit. Para os demais arquivos (mapa, geometria, ícones) é preciso subir a versão de `CACHE` em `sw.js`.

## Estrutura no Firestore

```
config/padrao                        { cong: <uid do administrador>, nome }   ← lido pelo app Cartões
congregacoes/{uid}                   { v, t{...}, p{items}, s{items}, cfg{...}, qover{...} }
congregacoes/{uid}/publico/dados     { nomes{k:{n,a}}, cong, city }      ← lido pelo app Cartões
congregacoes/{uid}/cartoes/{m_q}     { mapa, quadra, casas[], extra[], del[], ren{}, c{casa:[0|1,0|1,0|1]}, v[{d,p}x3], ts }
congregacoes/{uid}/backups/{id}      { kind, ts, size, data (JSON) }
```
