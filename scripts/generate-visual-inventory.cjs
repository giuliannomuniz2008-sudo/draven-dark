const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const context = {}; context.window = context; vm.createContext(context);
for (const name of ['book-data.js', 'ryusen-revision.js']) vm.runInContext(fs.readFileSync(path.join(root, name), 'utf8'), context, { filename: name });
const book = context.BOOK_DATA;
let chapter = '';
const visuals = [];
for (const event of book.events) {
  if (event.type === 'heading') chapter = event.text;
  if (event.type === 'image') visuals.push({ chapter, id: event.eventId, src: event.src, alt: event.alt, width: event.pixelWidth, height: event.pixelHeight, exists: fs.existsSync(path.join(root, event.src)) });
}
const manuallyReviewed = new Set(['c1-i3','c5-chosen-sash-final','c8-i4','c9-magic-duo-final','c14-i3','c14-reset-pair-final','c14-discussao-final','c14-focus-final','c14-focus','c14-detail']);
const escape = value => String(value).replaceAll('|', '\\|').replaceAll('\n', ' ');
let out = '# Inventário visual do livro\n\n';
out += `Atualizado em 22/11/2026. ${visuals.length} posições narrativas; ${book.atlas[0].phases.length} fases de Ryusen; ${book.atlas.length} personagens. O leitor aplica os caminhos depois de carregar ryusen-revision.js.\n\n`;
out += '## Imagens narrativas\n\n| Capítulo | ID | Arquivo | Alt/descrição narrativa | Arquivo e metadados | Triagem visual |\n|---|---|---|---|---|---|\n';
for (const item of visuals) out += `| ${escape(item.chapter)} | ${item.id} | ${item.src} | ${escape(item.alt)} | ${item.exists ? `${item.width}×${item.height} · presente` : 'AUSENTE'} | ${manuallyReviewed.has(item.id) ? 'Inspecionada em tamanho original' : 'Triagem em mosaico; ampliação individual pendente'} |\n`;
out += '\n## Atlas de Ryusen\n\n| Fase | Idade | Rótulo | Arquivo | Estado |\n|---:|---|---|---|---|\n';
for (let index = 0; index < book.atlas[0].phases.length; index++) {
  const phase = book.atlas[0].phases[index];
  const highResChecked = [9, 14, 15].includes(index);
  out += `| ${index + 1} | ${escape(phase.age)} | ${escape(phase.label)} | ${phase.image} | ${!fs.existsSync(path.join(root, phase.image)) ? 'AUSENTE' : highResChecked ? 'Inspecionada em tamanho original' : 'Triagem em mosaico; ampliação individual pendente'} |\n`;
}
out += '\n## Retratos dos demais personagens\n\n';
for (const person of book.atlas.slice(1)) out += `- **${escape(person.name)}** — ${escape(person.role)}. ${person.phases.length} fase(s); retrato verificado na triagem visual em mosaico; ampliação individual pendente.\n`;
out += '\n## Pendências visuais registradas\n\n- DD-C17-01, DD-C17-02 e DD-C17-03: edição localizada restrita às tatuagens ainda depende de ferramenta de máscara precisa.\n- c16-i16, c17-limiar-final, c17-departure-final e atlas-phase-21 permanecem protegidas.\n- A revisão por metadados, vínculo narrativo e presença do arquivo cobre as 98 posições. A inspeção ampliada de cada imagem e das 22 fases não é presumida por este inventário; os estados individuais acima mostram o que ainda precisa de conferência.\n';
if (visuals.length !== 98) throw new Error(`Expected 98 images, got ${visuals.length}`);
if (visuals.some(item => !item.exists)) throw new Error('One or more narrative image paths are missing');
fs.writeFileSync(path.join(root, 'INVENTARIO-VISUAL.md'), out, 'utf8');
console.log(`Inventário atualizado: ${visuals.length} imagens narrativas, ${book.atlas[0].phases.length} fases, ${book.atlas.length} personagens.`);
