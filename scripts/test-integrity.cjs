const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const context = {};
context.window = context;
vm.createContext(context);
for (const file of ['book-data.js', 'ryusen-revision.js', 'kurogane-book-data.js', 'kurogane-revision.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
}
const book = context.BOOK_DATA;
const kurogane = context.KUROGANE_BOOK_DATA;
assert.equal(kurogane.toc.length, 22, '22 capítulos de Kurogane (obra proposta)');
assert.equal(kurogane.events.filter(e => e.type === 'heading').length, 22, 'sumário do segundo volume corresponde aos capítulos');
assert.equal(new Set(kurogane.events.map(e => e.eventId)).size, kurogane.events.length, 'IDs independentes do segundo volume sem duplicatas');
assert.ok(kurogane.proposal, 'segundo volume marcado como narrativa proposta');
assert.equal(kurogane.events.filter(e => e.type === 'image').length, 42, '40 ilustrações existentes e duas cenas comerciais integradas');
assert.ok(fs.existsSync(path.join(root, kurogane.cover)), 'capa Kurogane local presente');
for (const event of kurogane.events) if (event.type === 'image') {
  assert.ok(fs.existsSync(path.join(root, event.src)), `imagem Kurogane integrada: ${event.eventId}`);
  assert.ok(event.pixelWidth > 0 && event.pixelHeight > 0, `metadados de dimensão Kurogane: ${event.eventId}`);
}
assert.ok(kurogane.events.some(e => e.eventId === 'k14-p1' && /mãe de Ryusen.*encomendava uma katana/i.test(e.text)), 'a encomenda materna aparece na passagem narrativa proposta');
assert.ok(kurogane.events.every(e => !e.text || !/destino da mãe|mãe morreu|mãe desapareceu/i.test(e.text)), 'destino da mãe permanece indefinido');
assert.ok(kurogane.events.every(e => !e.text || !/poderes hereditários|espada encantada|derrotar Sondark/i.test(e.text)), 'proposta não cria poderes hereditários ou supremacia sobre Sondark');
assert.equal(kurogane.events.filter(e => /-regional-context$/.test(e.eventId)).length, 22, 'os 22 capítulos receberam expansão proposta de identidade regional');
assert.equal(kurogane.events.filter(e => e.type === 'image' && /-i0[23]$/.test(e.eventId)).length, 18, '18 cenas já existentes preservadas');
assert.ok(kurogane.events.some(e => e.eventId === 'k18-oamem-order'), 'negociação Oamem integrada');
assert.match(kurogane.events.find(e => e.eventId === 'k18-p1').text, /primeiro um pedido anônimo.*Recusou a encomenda.*contrato separado/i, 'recusa retratada em KUR-18-01 é distinta do contrato Oamem aceito');
assert.match(kurogane.events.find(e => e.eventId === 'k18-p2').text, /segunda proposta terminou em venda.*sem amizade, aliança ou promessa de defesa/i, 'venda à Oamem não implica aliança');
assert.ok(kurogane.events.some(e => e.eventId === 'k21-dark-order'), 'negociação Dark integrada');
assert.ok(kurogane.events.filter(e => e.type === 'image').every(e => /^assets\/kurogane\/narrative\/.+\.webp$/.test(e.src)), 'imagens Kurogane em WebP com caminhos relativos');
assert.ok(kurogane.events.filter(e => e.type === 'image').every(e => { const file = path.join(root,e.src); const dims = require('node:child_process').execFileSync('python',['-c',"from PIL import Image;import sys; im=Image.open(sys.argv[1]);print(str(im.width)+','+str(im.height))",file],{encoding:'utf8'}).trim().split(',').map(Number); return e.pixelWidth===dims[0]&&e.pixelHeight===dims[1]; }), 'metadados de dimensão correspondem aos arquivos Kurogane');
assert.equal(book.toc.length, 17, '17 capítulos');
assert.equal(book.events.filter(e => e.type === 'image').length, 99, '98 espaços narrativos preservados e uma nova ilustração complementar');
assert.ok(book.events.some(e => e.eventId === 'c5-mother-two-swords-reference'), 'referência visual materna integrada após a carta do capítulo 5');
assert.equal(book.atlas[0].phases.length, 22, '22 fases de Ryusen');
assert.equal(book.atlas.length, 8, '8 fichas de personagens');
assert.ok(fs.existsSync(path.join(root, book.cover)), 'capa local presente');
const ids = book.events.map(e => e.eventId);
assert.equal(new Set(ids).size, ids.length, 'IDs de eventos sem duplicatas');
const missing = [];
for (const event of book.events) if (event.type === 'image') {
  if (!event.src || /^([a-z]+:|[\\/]|[A-Za-z]:)/i.test(event.src)) missing.push(event.eventId + ': caminho não local/relativo');
  else if (!fs.existsSync(path.join(root, event.src))) missing.push(event.eventId + ': ' + event.src);
  if (!event.alt || !Number.isFinite(event.pixelWidth) || !Number.isFinite(event.pixelHeight) || event.pixelWidth <= 0 || event.pixelHeight <= 0) missing.push(event.eventId + ': metadados de imagem incompletos');
}
for (const person of book.atlas) for (const phase of person.phases) if (!fs.existsSync(path.join(root, phase.image))) missing.push(person.name + ': ' + phase.image);
assert.deepEqual(missing, [], 'todas as imagens narrativas e do Atlas existem');
assert.equal(book.toc.length, book.events.filter(e => e.type === 'heading').length, 'sumário e capítulos têm a mesma contagem');
for (let i = 0; i < book.toc.length; i++) assert.equal(book.toc[i].eventId, book.events.filter(e => e.type === 'heading')[i].eventId, `capítulo ${i + 1} mantém o vínculo do sumário`);
assert.equal(book.events.find(e => e.eventId === 'c13-waiting-clearance-final').src, 'assets/draven/recreated-2026/narrative/c13-waiting-clearance-final-anatomy-v2.webp', 'correção anatômica integrada');
assert.equal(book.events.find(e => e.eventId === 'c16-i16').src, 'assets/draven/recreated-2026/narrative/c16-i16.webp', 'imagem protegida preservada');
const protectedBytes = fs.readFileSync(path.join(root, 'assets/draven/recreated-2026/narrative/c16-i16.webp'));
const protectedBlob = execFileSync('git', ['hash-object', 'assets/draven/recreated-2026/narrative/c16-i16.webp'], { cwd: root, encoding: 'utf8' }).trim();
assert.equal(protectedBlob, 'bbd5bebbceec3428253f79302ec221af577ce653', 'arquivo c16-i16 protegido permanece byte a byte intacto');
assert.ok(crypto.createHash('sha256').update(protectedBytes).digest('hex').length === 64, 'hash do recurso protegido calculável');
for (const [file, expected] of [
  ['assets/ryusen/amostras-prioritarias/c17-carta-katana.png', '0e702d6c365c462cd022c7a390a4516c61ea586c'],
  ['assets/ryusen/amostras-prioritarias/c17-partida-oficial.png', 'fe9227a4861b71454ac2994370c95eedcdf95b38'],
  ['assets/ryusen/atlas/phase-21-ryusen-oficial.png', '9e02141563bf6f8676629af03726392e422f3d7b']
]) assert.equal(execFileSync('git', ['hash-object', file], { cwd: root, encoding: 'utf8' }).trim(), expected, `${file} continua intacta`);
assert.ok(book.events.findIndex(e => e.eventId === 'c2-i4') > book.events.findIndex(e => e.eventId === 'c2-p9'), 'imagem de Ryusen aos sete anos aparece após a primeira cena aos seis');
const text = id => book.events.find(e => e.eventId === id)?.text || '';
assert.match(text('c2-p10'), /aos sete anos/i, 'cronologia do capítulo 2 marca a idade de sete anos');
assert.match(text('c4-p12'), /filho único.*buscar superar e matar o próprio pai/i, 'a tradição Dark é aplicada ao único filho sem determinar o resultado');
assert.match(text('c3-p2'), /armas de fogo.*lâminas.*nenhum daqueles exercícios dependia de magia/i, 'formação inclui vias de combate não mágicas');
assert.match(text('c6-p12'), /pedir ajuda era fraqueza/i, 'tradição Dark é apresentada sem torná-la regra universal');
assert.match(text('c7-p1'), /silhueta medieval.*integração de rede e controle/i, 'tecnologia avançada integrada à estética medieval');
assert.match(text('c5-p1'), /a cultura Dark barrava mulheres do território.*alcance exato da regra/i, 'misoginia Dark descrita sem inventar seus mecanismos');
assert.match(text('c7-p1'), /catástrofe de Belzebu.*reconstrução avançara em ritmos diferentes/i, 'ambientação pós-catástrofe e reconstrução desigual');
assert.match(text('c14-p11'), /diante dos veteranos.*instrução, repetição e limites/i, 'talento de Ryusen não o coloca acima dos veteranos');
assert.doesNotMatch(book.events.filter(e => e.type === 'text').map(e => e.text).join('\n'), /despertar das correntes|manifestação rara|elo sobrenatural|correntes sobrenaturais de Ryusen/i, 'Ryusen não recebe poder de correntes nem despertar não aprovado');
for (const [id, expected] of [
  ['c14-i3', 'assets/ryusen/recreated-2026/narrative/c14-solo-control.png'],
  ['c14-reset-pair-final', 'assets/ryusen/recreated-2026/narrative/c14-solo-failed-curve.png'],
  ['c14-focus', 'assets/ryusen/recreated-2026/narrative/c14-rival-observes.png'],
  ['c14-detail', 'assets/ryusen/recreated-2026/narrative/c14-solo-fading-light.png']
]) {
  const event = book.events.find(e => e.eventId === id);
  assert.equal(event.src, expected, `${id} aponta para a cena revisada`);
  assert.ok(fs.existsSync(path.join(root, event.src)), `${id} tem ilustração integrada`);
}
const c9MagicImage = book.events.find(e => e.eventId === 'c9-magic-duo-final');
assert.equal(c9MagicImage.src, 'assets/draven/recreated-2026/narrative/c9-magic-duo-final.webp', 'cena C9 original que já mostra luzes separadas é preservada');
assert.match(c9MagicImage.alt, /suportes separados.*própria luz/i, 'legenda do C9 descreve duas práticas individuais');
const c14Text = book.events.filter(e => e.eventId.startsWith('c14-p')).map(e => e.text).join('\n');
assert.doesNotMatch(c14Text, /exercício em dupla|exercícios em dupla|parceiro capaz|resultado pertencia aos dois|luz comum entre|alternavam o ritmo/i, 'capítulo 14 não apresenta magia cooperativa como treino');
assert.match(c14Text, /avaliação individual/i, 'capítulo 14 usa avaliação individual de magia');
assert.match(c14Text, /espada de treino.*resistência/i, 'capítulo 14 mostra práticas independentes e diversas');
assert.match(text('c8-p2'), /lados opostos.*manter a centelha acesa/i, 'disputa mágica C8 é competitiva, cada jovem conduz a própria luz');
assert.match(book.events.find(e => e.eventId === 'c8-i4').alt, /disputam.*exercício mágico básico/i, 'legenda da disputa C8 corresponde a práticas paralelas');
const c9Text = book.events.filter(e => e.eventId.startsWith('c9-p')).map(e => e.text).join('\n');
assert.doesNotMatch(c9Text, /trabalho em pares|ritmo comum|alternar a condução de uma luz/i, 'capítulo 9 não centraliza treinamento colaborativo de magia');
assert.match(c9Text, /cada um em sua raia/i, 'capítulo 9 preserva rivalidade em provas individuais');
assert.match(book.events.find(e => e.eventId === 'c2-p3').text, /reservou a Ryusen.*nem todos tinham a mesma aptidão/i, 'magia infantil é prática de Ryusen, não currículo universal');
const visualInventory = fs.readFileSync(path.join(root, 'INVENTARIO-VISUAL.md'), 'utf8');
for (const code of ['DD-C17-01', 'DD-C17-02', 'DD-C17-03', 'c16-i16']) assert.ok(visualInventory.includes(code), `inventário visual registra ${code}`);
assert.doesNotMatch(text('c15-p10'), /habilidade herdada/i, 'o leitor não afirma que Ryusen herdou os poderes de Sondark');
assert.match(text('c17-p9'), /aos dez anos|dera aos dez anos/i, 'medalhão recebido na infância permanece coerente');
assert.match(text('c17-p9'), /A meia máscara Oni/i, 'máscara é individual e posterior ao treinamento');
assert.match(text('c17-p8'), /A katana fora encomendada aos ferreiros Kurogane/i, 'katana vem da encomenda materna aos Kurogane');
assert.match(text('c17-p9'), /medalhão.*aos dez anos/i, 'medalhão Dark recebido na infância');
assert.equal(book.title, 'Ryusen Kurogane Dark', 'identidade do protagonista atualizada');
assert.ok(book.atlas[0].phases.length === 22, 'todas as fases do Atlas de Ryusen preservadas');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert.match(html, /id="volumePrev"/, 'biblioteca tem controle anterior acessível');
assert.match(html, /id="volumeNext"/, 'biblioteca tem controle seguinte acessível');
assert.match(html, /id="kurogane-book-data\.js|kurogane-book-data\.js\?v=/, 'dados do segundo volume incluídos');
assert.match(fs.readFileSync(path.join(root, 'reader.js'), 'utf8'), /kurogane-reader-/, 'novo volume usa progresso local separado');
assert.equal((html.match(/src="ryusen-revision\.js/g) || []).length, 1, 'script de revisão Ryusen incluído uma vez');
assert.equal((html.match(/src="kurogane-revision\.js/g) || []).length, 1, 'script de revisão Kurogane incluído uma vez');
assert.match(fs.readFileSync(path.join(root, 'html-reader.css'), 'utf8'), /\.leaf-body\{overflow:hidden/, 'sem rolagem interna em páginas');
const readerCss = fs.readFileSync(path.join(root, 'html-reader.css'), 'utf8');
assert.match(readerCss, /@media\(max-width:1000px\)/, 'controles compactos antes de tablet/desktop estreito');
assert.match(readerCss, /@media\(max-width:480px\)/, 'barra e progresso ajustados para celular pequeno');
assert.doesNotMatch(html, /(?:src|href)=["']https?:\/\//i, 'HTML sem scripts, estilos ou recursos remotos');
for (const file of ['style.css', 'html-reader.css', 'reader.js', 'ryusen-revision.js', 'kurogane-revision.js']) assert.ok(fs.existsSync(path.join(root, file)), `recurso local presente: ${file}`);
const reader = fs.readFileSync(path.join(root, 'reader.js'), 'utf8');
for (const file of ['style.css', 'html-reader.css', 'reader.js', 'ryusen-revision.js', 'kurogane-revision.js']) assert.doesNotMatch(fs.readFileSync(path.join(root, file), 'utf8'), /@import\s+url\s*\(|url\(\s*["']?https?:|(?:src|href)\s*=\s*["']https?:/i, `${file} não depende de rede`);
assert.match(reader, /scrollHeight<=body\.clientHeight\+1/, 'paginação mede o conteúdo contra a altura disponível');
assert.match(reader, /largestFittingPart/, 'parágrafos são divididos para continuar em folhas seguintes');
assert.match(reader, /scheduleRepagination/, 'mudanças de orientação e tela recalculam a paginação');
assert.match(reader, /draven-reader-anchor/, 'posição de leitura persiste localmente');
assert.match(reader, /atlasPhaseUnlocked/, 'fases do Atlas são desbloqueadas pelo progresso');
assert.match(readerCss, /@media\(max-width:480px\)\{\.atlas-content\{grid-template-columns:minmax\(0,1fr\)/, 'Atlas usa coluna ampla e texto maior em celular estreito');
assert.match(reader, /busy=false\},900\)/, 'estado de virada aguarda a animação concluir');
assert.match(fs.readFileSync(path.join(root, 'style.css'), 'utf8'), /turnNext 900ms/, 'duração visual da virada coincide com o leitor');
assert.match(html, /id="atlasToggle"[^>]*aria-label=/, 'atalho do Atlas tem rótulo acessível');
assert.match(html, /id="codexToggle"[^>]*aria-label=/, 'atalho do Códice tem rótulo acessível');
assert.match(html, /codex-data\.js\?v=/, 'dados do Códice carregados localmente');
assert.match(html, /codex-ui\.js\?v=/, 'interface do Códice carregada localmente');
const codexContext = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'codex-data.js'), 'utf8'), codexContext);
assert.ok(codexContext.window.RYUSEN_CODEX.sections.length >= 15, 'Códice contém referência temática suficiente');
for (const status of ['Confirmado', 'Interpretação narrativa', 'Pendente']) assert.ok(codexContext.window.RYUSEN_CODEX.sections.some(section => section.status === status), `Códice separa ${status}`);
assert.ok(codexContext.window.RYUSEN_CODEX.sections.some(section => /não está estabelecido se Ryusen tem uma Inata/i.test(section.text)), 'Códice reserva decisão de Inata ao mestre');
const revisionSource = fs.readFileSync(path.join(root, 'ryusen-revision.js'), 'utf8');
const editBlock = revisionSource.match(/const edits = \{([\s\S]*?)\n  \};/);
assert.ok(editBlock, 'bloco de revisões encontrado');
const editIds = [...editBlock[1].matchAll(/^\s*'([^']+)'\s*:/gm)].map(match => match[1]);
assert.equal(new Set(editIds).size, editIds.length, 'revisões de parágrafo sem chaves duplicadas');
console.log('OK: 17 capítulos, 98 posições originais + 1 ilustração complementar, 22 fases de Ryusen, 8 personagens, 22 capítulos e 42 imagens Kurogane; IDs, metadados, recursos locais, c16-i16 e estrutura offline verificados.');
