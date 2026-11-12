let DATA=window.BOOK_DATA,events=DATA.events,layoutPages=[],eventToPage=new Map(),p=0,cover=true,single=matchMedia('(max-width:760px)').matches,zoom=1,busy=false,paginateTimer,stableReadingAnchor=null;const imageRefs=new Map();const $=id=>document.getElementById(id),stage=$('stage'),coverScreen=$('coverScreen'),flip=$('flip');
function safeGet(k){try{return localStorage.getItem(k)}catch{return null}}function safeSet(k,v){try{localStorage.setItem(k,v)}catch{}}function rememberAnchor(id){if(!id)return;stableReadingAnchor=id;safeSet('draven-reader-anchor',id);safeSet('draven-reader-event',id)}function currentAnchor(){return stableReadingAnchor||safeGet('draven-reader-anchor')||safeGet('draven-reader-event')||layoutPages[p]?.firstEvent}
function hashAnchor(){try{return decodeURIComponent(location.hash.slice(1))}catch{return ''}}
function linkFor(id){const url=new URL(location.href);url.hash=encodeURIComponent(id);return url.href}
async function copyText(value){try{await navigator.clipboard.writeText(value);return true}catch{const input=document.createElement('textarea');input.value=value;input.style.cssText='position:fixed;left:-9999px';document.body.appendChild(input);input.select();const ok=document.execCommand('copy');input.remove();return ok}}
function flashButton(button,text){const old=button.textContent;button.textContent=text;setTimeout(()=>button.textContent=old,1800)}
async function copyReadingLink(){if(cover)openBook();const id=layoutPages[p]?.firstEvent||currentAnchor();if(!id)return;const ok=await copyText(linkFor(id));flashButton($('copyPosition'),ok?'Link copiado':'Copie o endereço')}
async function copyImageRef(id,button){const match=/^c(\d+)/i.exec(id),chapter=match?Number(match[1]):0,code=imageRefs.get(id)||id;const message=`Draven Dark\nCapítulo ${chapter}\nIlustração ${code}\nReferência permanente: ${linkFor(id)}`;const ok=await copyText(message);flashButton(button,ok?'Copiado':code)}
function pageForAnchor(id){let found=eventToPage.get(id);if(found!==undefined)return found;const mark=id?.lastIndexOf('#');if(mark>0){const sourceId=id.slice(0,mark),offset=Number(id.slice(mark+1));if(Number.isFinite(offset))for(let i=0;i<layoutPages.length;i++)if(layoutPages[i].events.some(e=>(e.sourceEventId||e.eventId)===sourceId&&(e.startOffset||0)<=offset&&offset<(e.endOffset??Infinity)))return i}return undefined}
function esc(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function buildNode(e){if(e.type==='image'){const size=e.layoutWidth&&e.layoutHeight?` style="width:${e.layoutWidth}px;height:${e.layoutHeight}px"`:'';const ref=imageRefs.get(e.eventId)||e.eventId;return `<figure class="${e.large?'large':''}" data-event="${e.eventId}"><img src="${esc(e.src)}" alt="${esc(e.alt)}" width="${e.pixelWidth}" height="${e.pixelHeight}" loading="lazy"${size}><button class="image-ref" data-copy-image="${esc(e.eventId)}" title="Copiar referência da ilustração" aria-label="Copiar referência ${esc(ref)}">${esc(ref)}</button>${e.alt?`<figcaption>${esc(e.alt)}</figcaption>`:''}</figure>`}let cls=e.type==='heading'?'source-heading':e.type==='caption'?'caption':/^\s*[—–]/.test(e.text)?'dialogue':/^[a-záàâãéêíóôõúç]/.test(e.text)?'continued':'';if(e.isContinuation)cls+=' continued';if(e.text==='Nota ao leitor')cls+=' intro-note';return `<p class="${cls}" data-event="${e.eventId}">${esc(e.text)}</p>`}
function setSingle(v){single=!!v;stage.classList.toggle('single',single);$('singleToggle').classList.toggle('active',single)}
function measureBody(){return $('measureLeaf').querySelector('.leaf-body')}
function pageShell(index,measure=false){let folio=measure?'':String(index+1);return `<div class="leaf-topline"><span>DRAVEN DARK · CRÔNICAS DE UMA FORMAÇÃO</span><span>${folio}</span></div><div class="leaf-body"></div>`}
function paginate(anchor=null){
 if(!DATA)return;
 const anchorId=anchor||currentAnchor();
 const host=$('measureLeaf'),bookRect=$('book').getBoundingClientRect();
 host.style.cssText=`position:fixed;left:-20000px;top:0;display:flex;visibility:hidden;width:${single?bookRect.width:bookRect.width/2}px;height:${bookRect.height}px;z-index:-1`;
 host.innerHTML=pageShell(0,true);
 const body=measureBody(),pages=[];
 let current={events:[],firstEvent:null};pages.push(current);
 const setBody=list=>{host.classList.toggle('intro-page',list.some(e=>e.type==='heading'&&e.text==='Nota ao leitor'));body.innerHTML=list.map(buildNode).join('')};
 const fits=list=>{setBody(list);return body.scrollHeight<=body.clientHeight+1};
 const startPage=()=>{current={events:[],firstEvent:null};pages.push(current)};
 const add=(ev)=>{if(!current.firstEvent)current.firstEvent=ev.sourceEventId&&ev.startOffset?`${ev.sourceEventId}#${ev.startOffset}`:ev.eventId;current.events.push(ev)};
 const makeTextPart=(source,start,text,part)=>({...source,text,eventId:start?`${source.eventId}@${start}`:source.eventId,sourceEventId:source.eventId,startOffset:start,endOffset:start+text.length,isContinuation:part>0});
 const largestFittingPart=(source,remaining,start,part)=>{
  let low=1,high=remaining.length,best=0;
  while(low<=high){
   const mid=Math.floor((low+high)/2);let cut=mid;
   if(mid<remaining.length){const prefix=remaining.slice(0,mid);const boundary=Math.max(prefix.lastIndexOf(' '),prefix.lastIndexOf('\n'),prefix.lastIndexOf('\t'),prefix.lastIndexOf('\r'));if(boundary>0)cut=boundary+1;}
   const candidate=makeTextPart(source,start,remaining.slice(0,cut),part);
   if(fits([...current.events,candidate])){best=cut;low=mid+1}else high=mid-1;
  }
  return best;
 };
 for(const source of events){
  if(source.type==='heading'&&current.events.length)startPage();
  let normalized;
  if(source.type==='image'){
   const ratio=source.pixelWidth/source.pixelHeight,mobile=matchMedia('(max-width:760px)').matches;
   const limit=window.innerHeight*(mobile?(source.large?.39:.30):(source.large?.51:.36));
   const maxWidth=Math.max(80,body.clientWidth-18),layoutWidth=Math.min(maxWidth,limit*ratio);
   normalized={...source,layoutWidth,layoutHeight:layoutWidth/ratio};
  }else normalized={...source,sourceEventId:source.eventId,startOffset:0,endOffset:source.text.length,isContinuation:false};
  if(fits([...current.events,normalized])){add(normalized);continue;}
  if(current.events.length){startPage();}
  if(fits([normalized])){add(normalized);continue;}
  if(source.type==='image'){
   if(current.events.length){startPage();}
   const ratio=source.pixelWidth/source.pixelHeight,fitHeight=Math.max(100,body.clientHeight-92);
   const scaled={...normalized,large:false,layoutHeight:fitHeight,layoutWidth:Math.min(body.clientWidth-18,fitHeight*ratio)};
   scaled.layoutHeight=scaled.layoutWidth/ratio;
   if(fits([...current.events,scaled])){add(scaled);continue;}
   let smaller=scaled;
   while(smaller.layoutHeight>100){smaller={...smaller,layoutHeight:smaller.layoutHeight*.9,layoutWidth:smaller.layoutHeight*.9*ratio};if(fits([...current.events,smaller]))break;}
   add(smaller);continue;
  }
  let remaining=source.text,start=0,part=0;
  while(remaining.length){
   let cut=largestFittingPart(source,remaining,start,part);
   if(!cut&&current.events.length){startPage();cut=largestFittingPart(source,remaining,start,part);}
   if(!cut){cut=Math.min(remaining.length,1);}
   const fragment=makeTextPart(source,start,remaining.slice(0,cut),part);
   add(fragment);remaining=remaining.slice(cut);start+=cut;part++;
   if(remaining.length)startPage();
  }
 }
 layoutPages=pages.filter(pg=>pg.events.length);eventToPage.clear();
 layoutPages.forEach((pg,i)=>pg.events.forEach(ev=>{
  if(!eventToPage.has(ev.eventId))eventToPage.set(ev.eventId,i);
  if(ev.sourceEventId){const exact=`${ev.sourceEventId}#${ev.startOffset}`;eventToPage.set(exact,i);if(!eventToPage.has(ev.sourceEventId))eventToPage.set(ev.sourceEventId,i);}
 }));
 host.style.visibility='';
 let targetPage=anchorId?eventToPage.get(anchorId):undefined;
 if(targetPage===undefined&&anchorId){const mark=anchorId.lastIndexOf('#');if(mark>0){const sourceId=anchorId.slice(0,mark),offset=Number(anchorId.slice(mark+1));for(let i=0;i<layoutPages.length&&targetPage===undefined;i++){const ev=layoutPages[i].events.find(x=>x.sourceEventId===sourceId&&x.startOffset<=offset&&offset<x.endOffset);if(ev)targetPage=i;}}}
 if(targetPage!==undefined)p=targetPage;else p=Math.min(p,layoutPages.length-1);
 if(!single&&p%2)p=Math.max(0,p-1);
 rememberAnchor(anchorId||layoutPages[p]?.firstEvent);
 render();
}
function paintLeaf(el,index){if(index<0||index>=layoutPages.length){el.innerHTML='';el.classList.add('blank');el.classList.remove('intro-page');return}el.classList.remove('blank');const pg=layoutPages[index];el.classList.toggle('intro-page',pg.events.some(e=>e.type==='heading'&&e.text==='Nota ao leitor'));el.innerHTML=pageShell(index);el.querySelector('.leaf-body').innerHTML=pg.events.map(buildNode).join('');el.querySelectorAll('figure img').forEach(img=>img.onclick=()=>openLightbox(img.src,img.alt));}
function contentProgress(){if(cover||!events.length)return 0;const anchor=currentAnchor();if(!anchor)return Math.round((p+1)/Math.max(1,layoutPages.length)*100);let sourceId=anchor,offset=0;const mark=anchor.lastIndexOf('#');if(mark>0){sourceId=anchor.slice(0,mark);offset=Number(anchor.slice(mark+1))||0}const index=events.findIndex(e=>e.eventId===sourceId);if(index<0)return Math.round((p+1)/Math.max(1,layoutPages.length)*100);let total=0,before=0;for(let i=0;i<events.length;i++){const e=events[i],weight=e.type==='image'?240:Math.max(1,(e.text||'').length);if(i<index)before+=weight;else if(i===index){const fraction=typeof e.text==='string'&&e.text.length?Math.min(1,Math.max(0,offset/e.text.length)):0;before+=weight*fraction}total+=weight}return Math.round(before/Math.max(1,total)*100)}
function render(){if(!DATA||!layoutPages.length)return;let li=single?-1:p,ri=single?p:p+1;paintLeaf($('leftLeaf'),li);paintLeaf($('rightLeaf'),ri);$('pageLabel').textContent=cover?'Capa':`Páginas ${p+1}${single?'':'–'+Math.min(p+2,layoutPages.length)} de ${layoutPages.length}`;let pct=contentProgress();$('progress').style.width=pct+'%';$('progressLabel').textContent=pct+'%';$('prev').disabled=cover||p<=0;$('prev').style.opacity=$('prev').disabled?.35:1;$('next').style.opacity=p>=layoutPages.length-1?.35:1;if(!currentAnchor())rememberAnchor(layoutPages[p]?.firstEvent);safeSet('draven-reader-page',String(p));}
function showCover(){cover=true;coverScreen.classList.remove('hidden');render()}function openBook(){cover=false;coverScreen.classList.add('hidden');let saved=safeGet('draven-reader-bookmark')||currentAnchor();if(saved&&eventToPage.has(saved)){rememberAnchor(saved);p=eventToPage.get(saved)}else p=0;if(!single&&p%2)p=Math.max(0,p-1);$('openingFlare').classList.remove('go');void $('openingFlare').offsetWidth;$('openingFlare').classList.add('go');render()}
function turn(n,dir,anchor=null){if(busy)return;n=Math.max(0,Math.min(layoutPages.length-1,n));if(n===p)return;cover=false;coverScreen.classList.add('hidden');let oldIndex=single?p:(dir>0?p+1:p);paintLeaf($('flipFront'),Math.min(layoutPages.length-1,oldIndex));paintLeaf($('flipBack'),n);flip.className='flip-sheet '+(dir>0?'turn-next':'turn-prev');busy=true;setTimeout(()=>{p=n;p=Math.max(0,Math.min(layoutPages.length-1,p));rememberAnchor(anchor||layoutPages[p]?.firstEvent);render();flip.className='flip-sheet';busy=false},860)}
function next(){if(cover){openBook();return}let n=p+(single?1:2);if(n<layoutPages.length)turn(n,1)}function prev(){if(cover)return;if(p<=0){showCover();return}let n=p-(single?1:2);if(n<0){showCover();return}turn(n,-1)}
function goToEvent(id){let n=eventToPage.get(id);if(n===undefined)return;rememberAnchor(id);if(!single&&n%2)n=Math.max(0,n-1);if(cover){cover=false;coverScreen.classList.add('hidden');p=n;render()}else if(Math.abs(n-p)>2){p=n;render()}else turn(n,n>p?1:-1,id);$('tocPanel').classList.remove('open')}
function zoomBy(d){let id=currentAnchor()||layoutPages[p]?.firstEvent;zoom=Math.max(.8,Math.min(1.3,+(zoom+d).toFixed(2)));document.documentElement.style.setProperty('--read-scale',zoom);$('zoomLabel').textContent=Math.round(zoom*100)+'%';paginate(id)}
function openLightbox(src,alt){$('lightboxImg').src=src;$('lightboxImg').alt=alt||'Ilustração original';$('lightbox').classList.add('open')}
function boot(){DATA=window.BOOK_DATA;events=DATA.events;const counts={};for(const e of events)if(e.type==='image'){const chapter=Number(/^c(\d+)/i.exec(e.eventId)?.[1]||0);counts[chapter]=(counts[chapter]||0)+1;imageRefs.set(e.eventId,`DD-C${String(chapter).padStart(2,'0')}-${String(counts[chapter]).padStart(2,'0')}`)}$('coverImg').src=DATA.cover;$('tocFoot').textContent=`${DATA.toc.length} capítulos · Edição ilustrada`;$('tocList').innerHTML=DATA.toc.map(x=>`<button class="toc-item" data-event="${esc(x.eventId)}">${esc(x.title)}<span>${String(x.sourcePage-1).padStart(2,'0')}</span></button>`).join('');$('tocList').onclick=e=>{let b=e.target.closest('[data-event]');if(b)goToEvent(b.dataset.event)};setSingle(single);const linked=hashAnchor(),saved=safeGet('draven-reader-anchor')||safeGet('draven-reader-event');stableReadingAnchor=linked||saved;paginate(linked||saved);const target=pageForAnchor(linked||saved);if(target!==undefined){p=single?target:target-(target%2);cover=false;coverScreen.classList.add('hidden');rememberAnchor(linked||saved)}else{cover=true;coverScreen.classList.remove('hidden')}render()}
$('openBook').onclick=openBook;$('next').onclick=next;$('prev').onclick=prev;$('returnCover').onclick=showCover;$('zoomIn').onclick=()=>zoomBy(.1);$('zoomOut').onclick=()=>zoomBy(-.1);$('singleToggle').onclick=()=>{let id=currentAnchor()||layoutPages[p]?.firstEvent;setSingle(!single);paginate(id)};$('bookmark').onclick=()=>{let id=currentAnchor()||layoutPages[p]?.firstEvent;if(id){safeSet('draven-reader-bookmark',id);$('bookmark').textContent='⚑✓';setTimeout(()=>$('bookmark').textContent='⚑',1000)}};$('tocToggle').onclick=()=>$('tocPanel').classList.toggle('open');$('tocClose').onclick=()=>$('tocPanel').classList.remove('open');$('present').onclick=async()=>{document.body.classList.toggle('presentation');if(!document.fullscreenElement)await document.documentElement.requestFullscreen?.();else await document.exitFullscreen?.()};$('help').onclick=()=>$('tocPanel').classList.add('open');$('lightboxClose').onclick=()=>$('lightbox').classList.remove('open');$('lightbox').onclick=e=>{if(e.target===$('lightbox'))$('lightbox').classList.remove('open')};$('stage').addEventListener('touchstart',e=>window.touchX=e.touches[0].clientX,{passive:true});$('stage').addEventListener('touchend',e=>{let dx=e.changedTouches[0].clientX-window.touchX;if(Math.abs(dx)>60)(dx<0?next:prev)()},{passive:true});document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='PageDown')next();if(e.key==='ArrowLeft'||e.key==='PageUp')prev();if(e.key==='Escape'){$('tocPanel').classList.remove('open');$('lightbox').classList.remove('open');if(document.fullscreenElement)document.exitFullscreen();document.body.classList.remove('presentation')}if(e.key==='+'||e.key==='=')zoomBy(.1);if(e.key==='-')zoomBy(-.1)});function scheduleRepagination(){const anchor=currentAnchor();const responsiveSingle=matchMedia('(max-width:760px)').matches;if(responsiveSingle!==single)setSingle(responsiveSingle);clearTimeout(paginateTimer);paginateTimer=setTimeout(()=>paginate(anchor),140)}window.addEventListener('resize',scheduleRepagination);window.addEventListener('orientationchange',scheduleRepagination);document.addEventListener('fullscreenchange',scheduleRepagination);window.addEventListener('pagehide',()=>rememberAnchor(currentAnchor()));boot();

function atlasPhaseUnlocked(phase,entry,all){if(all)return true;const at=eventToPage.get(phase.unlock||entry.spoiler);return at!==undefined&&!cover&&p>=at}
function atlasGroup(entry){if(entry.id==='draven')return 'protagonist';if(['pai','mae'].includes(entry.id))return 'family';if(['instrutor','rival','colega-prova'].includes(entry.id))return 'training';return 'external'}function atlasCard(entry,i,selected,full){const phases=entry.phases.map((phase,j)=>({phase,j})).filter(x=>atlasPhaseUnlocked(x.phase,entry,full));if(!phases.length)return `<article class="atlas-card locked" data-group="${atlasGroup(entry)}"><div class="atlas-lock">✦<br><b>Personagem ainda não encontrado</b><small>Continue a leitura para desbloquear.</small></div></article>`;const active=phases.find(x=>x.j===selected)||phases[phases.length-1],phase=active.phase;return `<article class="atlas-card" data-group="${atlasGroup(entry)}"><div data-profile-view="${i}"><img class="atlas-portrait" src="${phase.image}" alt="${esc(entry.name)} — ${esc(phase.label)}"><div class="atlas-copy"><small>${esc(entry.role)} · ${esc(phase.age)}</small><h3>${esc(entry.name)}</h3><p>${esc(entry.description)}</p></div><div class="atlas-phases">${phases.map(x=>`<button class="${x.j===active.j?'active':''}" data-profile="${i}" data-phase="${x.j}">${esc(x.phase.label)}</button>`).join('')}</div></div></article>`}
function paintAtlas(){const all=$('atlasReveal').checked,filter=$('atlasFilters').querySelector('.active')?.dataset.atlasFilter||'all';$('atlasContent').innerHTML=DATA.atlas.map((entry,i)=>atlasCard(entry,i,0,all)).join('');$('atlasContent').querySelectorAll('.atlas-card[data-group]').forEach(card=>card.hidden=filter!=='all'&&card.dataset.group!==filter)}$('atlasFilters').onclick=e=>{const b=e.target.closest('[data-atlas-filter]');if(!b)return;$('atlasFilters').querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));paintAtlas()};
$('atlasToggle').onclick=()=>{$('atlasPanel').classList.add('open');paintAtlas()};
$('atlasClose').onclick=()=> $('atlasPanel').classList.remove('open');
$('atlasReveal').onchange=paintAtlas;
$('atlasContent').onclick=e=>{const photo=e.target.closest('.atlas-portrait');if(photo){openLightbox(photo.src,photo.alt);return}const b=e.target.closest('[data-profile][data-phase]');if(!b)return;const i=Number(b.dataset.profile),j=Number(b.dataset.phase),entry=DATA.atlas[i];$('atlasContent').querySelector(`[data-profile-view="${i}"]`).innerHTML=atlasCard(entry,i,j,$('atlasReveal').checked)};
document.addEventListener('keydown',e=>{if(e.key==='Escape')$('atlasPanel').classList.remove('open')});
$('copyPosition').onclick=copyReadingLink;
stage.addEventListener('click',e=>{const button=e.target.closest('[data-copy-image]');if(button){e.preventDefault();e.stopPropagation();copyImageRef(button.dataset.copyImage,button)}});
window.addEventListener('hashchange',()=>{const id=hashAnchor(),target=pageForAnchor(id);if(target===undefined)return;cover=false;coverScreen.classList.add('hidden');p=single?target:target-(target%2);rememberAnchor(id);render()});
