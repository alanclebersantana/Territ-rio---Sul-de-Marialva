# Nosso Território 2.5 + Cartões + Dirigente

Dois PWAs em arquivo único para GitHub Pages, no mesmo projeto Firebase (`nosso-territorio-5bc39`).

| Pasta | O que é | Quem usa |
|---|---|---|
| `nosso-territorio/` | App principal: mapa com territórios e quadras clicáveis, ficha, programação de campo, pontos de saída, Início com ciclo de cobertura e painel de atenção, editor de quadras, cartões de casas, backups automáticos | Quem administra (login com e-mail/senha ou Google) |
| `nosso-territorio-dirigente/` | App Dirigente: territórios designados, mapa, quadras pendentes e conclusão | Dirigentes de campo (entram com o código que o administrador envia) |
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

## Onde cada app está publicado

| App | Endereço | Como atualizar |
|---|---|---|
| Principal | `https://alanclebersantana.github.io/Territ-rio---Sul-de-Marialva/` | GitHub: trocar os arquivos de `nosso-territorio/` no repositório |
| Cartões | `https://casassulmarialva.netlify.app/` | Netlify → site → Deploys → arrastar o `cartoes-netlify.zip` (ou a pasta `nosso-territorio-cartoes/`) |
| Dirigente | `https://dirigentesdecampo.netlify.app/` | Netlify → site → Deploys → arrastar o `dirigente-netlify.zip` (ou a pasta `nosso-territorio-dirigente/`) |

Esses dois endereços já vêm preenchidos como padrão no app principal (Configurações → App Cartões / App Dirigente); os campos só precisam ser editados se os sites mudarem.

## Páginas de instalação (2.5.2)

Cada app secundário tem a sua página instaladora na pasta `instalar/`, publicada junto com ele:

- Cartões: `https://casassulmarialva.netlify.app/instalar/`
- Dirigente: `https://dirigentesdecampo.netlify.app/instalar/`

A página usa o manifest e o service worker do app, por isso o botão **"Instalar o app"** abre a janela de instalação nativa no Android/Chrome; no iPhone mostra o passo a passo do Safari. Tem também "Abrir o app no navegador", "Enviar pelo WhatsApp" e um QR Code da própria página. Em Configurações → Páginas de instalação, o app principal mostra os dois links prontos para enviar ou copiar.

## App Dirigente (2.5)

Terceiro app, na pasta `nosso-territorio-dirigente/` (publicado no Netlify, como o Cartões). Cada dirigente de campo entra com um **código de 6 números** e vê só os territórios designados a ele: abre o mapa do território (com as ruas nítidas e as quadras numeradas), toca nas quadras que ficaram pendentes e marca "Território concluído". Tudo chega ao app principal sozinho.

Como funciona no app principal (Configurações → App Dirigente):

1. Preencha "Endereço do app Dirigente" com o endereço onde você publicou o app (ex.: `https://dirigentedoterritorio.netlify.app/`) e salve.
2. "+ Novo dirigente": informe o nome **exatamente como você escreve em "Responsável"** na ficha do território. O app gera o código.
3. "Enviar" manda pelo WhatsApp uma mensagem com o endereço do app, o código e os territórios designados.
4. Designar = pôr o nome dele em "Responsável" e iniciar o território. Enquanto o território não estiver concluído, ele aparece no app do dirigente.
5. Quando o dirigente marca quadras pendentes ou conclui, o app principal aplica a mudança (quadras pendentes, data de conclusão, registro no histórico com o nome dele) e avisa com uma mensagem. Para desfazer, basta editar a ficha normalmente.

Firestore: os documentos ficam em `congregacoes/{uid}/dirigentes/{código}` (gravados pelo app principal, só leitura para o dirigente) e `congregacoes/{uid}/retornos/{código_território}` (o dirigente, anônimo, grava apenas `pend`, `done`, `ts`). **Publique o `firestore.rules` novo**, que inclui essas duas coleções, e mantenha o provedor Anônimo ativo.

## App Cartões: edição protegida e dias sem casas (2.4)

- **Editar casas**: botão no rodapé do cartão. Pede confirmação para entrar no modo de edição e oferece três ações, cada uma com confirmação própria: *Editar números* (lápis em cada casa), *Excluir selecionados* (toque nas casas e depois em "Excluir N selecionadas") e *Excluir todos*.
- **Datas das visitas**: não se digitam mais. A data e o período (manhã, tarde ou noite, pelo horário do celular) entram sozinhos na 1ª, 2ª ou 3ª coluna quando a primeira casa daquela coluna é marcada.
- **"Não falamos em nenhuma casa no dia"**: botões 1º / 2º / 3º dia no fim do cartão registram a data e o período do dia sem marcar casa alguma (ficam desativados quando já há casas marcadas naquele dia). No app principal esse registro aparece na ficha do cartão.

## Aba Histórico e registro S-13 (2.3)

A aba **Histórico** lista os territórios concluídos: cada conclusão fica registrada com data de início (designação), data de conclusão e dirigente. O registro permanece mesmo que o território seja reaberto; se for concluído de novo com a mesma data de início, o mesmo registro é atualizado. Dá para ver por território ou por dirigente, filtrar por período e corrigir qualquer registro pelo ✎.

**Imprimir / salvar PDF** gera o formulário **S-13-T "Registro de Designação de Território"**: todos os territórios (1 a N) em ordem, 20 por folha A4, com até quatro designações por linha (nome do dirigente, data da designação, data da conclusão) e a coluna "Última data concluída" preenchida com a última conclusão anterior ao período. Escolha o ano de serviço (1º de setembro a 31 de agosto) ou um período personalizado; territórios em andamento aparecem com a data da designação e a conclusão em branco; se um território tiver mais de quatro designações no período, ele continua na linha seguinte.

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

A tela de login mostra uma linha de status embaixo ("versão 2.5.5 · pronto para entrar"). Se aparecer "os scripts do Firebase não carregaram", é internet/bloqueio; se aparecer "o Firebase ainda não respondeu", feche e abra de novo. Qualquer erro de JavaScript ou do Firestore aparece numa faixa vermelha na parte de baixo da tela — mande esse texto para diagnóstico.

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
