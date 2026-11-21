// Narrative draft layered on the existing edition. Stable event IDs and assets remain unchanged.
// This file is deliberately separate so the approved edition can be compared before publication.
(() => {
  const book = window.BOOK_DATA;
  const rename = text => typeof text === 'string' ? text.replaceAll('Draven', 'Ryusen') : text;
  book.title = 'Ryusen Kurogane Dark';
  book.cover = 'referencias-oficiais/ryusen-partida-aprovada.png';
  book.atlas.forEach(person => {
    person.name = rename(person.name);
    person.role = rename(person.role);
    person.description = rename(person.description);
    person.phases.forEach(phase => { phase.label = rename(phase.label); });
  });
  book.events.forEach(event => {
    event.text = rename(event.text);
    event.alt = rename(event.alt);
  });
  const protagonist = book.atlas.find(person => person.id === 'draven');
  protagonist.name = 'Ryusen Kurogane Dark';
  protagonist.description = 'Filho das famílias Dark e Kurogane. Jovem de olhos vermelhos e cabelo branco que escolhe a magia conjurada pelas mãos como especialidade. Competitivo, disciplinado e independente; suas fases visuais e os objetos que passa a usar são revelados conforme a leitura avança.';
  protagonist.phases[18].unlock = 'c16-i16';
  protagonist.phases[18].image = 'assets/ryusen/atlas/phase-18-ryusen-oficial.png';
  for (const phase of protagonist.phases.slice(19)) phase.unlock = 'c17-p9';
  protagonist.phases[19].image = 'assets/ryusen/atlas/phase-19-ryusen-oficial.png';
  protagonist.phases[20].image = 'assets/ryusen/atlas/phase-20-ryusen-oficial.png';
  protagonist.phases[21].image = 'assets/ryusen/atlas/phase-21-ryusen-oficial.png';
  const mother = book.atlas.find(person => person.id === 'mae');
  mother.role = 'Família Kurogane · mãe de Ryusen · nome não definido';
  mother.description = 'Rosto e cabelos prateados preservados da ilustração original. Sua família de origem conserva uma tradição de forja e produção de armas; ela mantém vestimentas e referências culturais próprias. Nome, situação atual e posição política não definidos.';

  const edits = {
    'c1-p9': 'Ninguém prometeu que a vida seria fácil. Ninguém falou de destino. O nome foi dito uma vez, com a firmeza de algo que passaria a pertencer ao mundo: Ryusen Kurogane Dark. Dark vinha do pai; Kurogane, da mãe. O segundo nome não anunciava uma habilidade secreta, e nenhum dos dois sobrenomes poderia escolher por ele o homem que se tornaria. Uma lente de diagnóstico, embutida num braço de latão ao lado da cama, registrou os sinais do recém-nascido sem interromper a conversa. O pai conferiu a leitura; a mãe corrigiu a posição de uma manta.',
    'c2-p11': 'Naquela semana, um estojo selado chegou pela caixa de comunicação do alojamento. Dentro havia uma carta da mãe. Não era longa. Ela contava uma lembrança de sua infância entre pessoas que trabalhavam o metal: o calor da oficina, o cuidado de temperar uma lâmina e a irritação que sentia quando alguém confundia tradição com obrigação. Os Kurogane eram sua família de origem, escrevia ela; faziam armas, mas uma peça só valia pelo trabalho e pelas escolhas de quem a segurava. Não havia promessa de poder naquela lembrança.',
    'c5-p1': 'A carta seguinte chegou pelo relé de comunicação do alojamento, lacrada e seca apesar da chuva. O estojo de parede acendeu três pontos âmbar; um dos homens responsáveis pela distribuição retirou o envelope e chamou Ryusen pelo nome. Nenhuma mulher vivia ou treinava ali. Não era uma escolha dos rapazes: a cultura Dark barrava mulheres do território, embora ninguém naquela rotina discutisse o alcance exato da regra. A voz da mãe chegava em papel, à distância, e o menino aprendera a reconhecer a letra antes mesmo de abrir a dobra.',
    'c2-p2': 'O território era grande o bastante para a infância parecer sem fronteiras. Florestas escuras fechavam o horizonte em alguns pontos; mais perto, casas de pedra e madeira se agrupavam em torno de caminhos batidos. Sob a arquitetura antiga, redes discretas de energia, comunicação e monitoramento mantinham as instalações funcionando com precisão que o menino ainda não sabia medir. As estruturas de treino serviam ao uso diário; a vida seguia entre chuva, refeições, trabalho e exercícios.',
    'c2-p10': 'No ano seguinte, aos sete anos, uma tarde no mesmo pátio foi dedicada ao equilíbrio e aos passos. Ryusen caiu duas vezes. Na terceira, terminou a travessia sem tocar o chão com as mãos. Contou o resultado em voz alta, para que ninguém pudesse fingir que não vira. Um dos meninos respondeu com um encolher de ombros. Ryusen guardou a indiferença como se fosse um insulto.',
    'c2-p13': 'À noite, aos sete anos, quando os músculos começaram a doer, Ryusen tentou refazer a centelha sozinho. A luz surgiu por um segundo e apagou. Ele tentou outra vez. O instrutor passou pela porta, viu o brilho breve e não entrou.',
    'c3-p2': 'O pátio estava úmido da chuva da noite. Os bastões escorregavam nas mãos; os meninos em volta formavam um círculo irregular, quietos demais para fingir que não se importavam. Na quadra contígua, outros rapazes treinavam defesa contra armas de fogo e combate com lâminas; nenhum daqueles exercícios dependia de magia. O instrutor percorreu as regras mais uma vez: sem golpes na cabeça, sem continuar depois do sinal. Ryusen confirmou com um aceno impaciente. Queria que começassem.',
    'c6-p4': 'A estrada atravessava uma garganta entre colinas. Pedra clara, reforçada por ligas escuras, sustentava um sistema de transporte por cabos e contrapesos. Uma cabine fechada avançava sobre o vale em trilhos suspensos, sem ruído além do atrito controlado das rodas. Sensores distribuídos acompanhavam tensão, velocidade e travas em tempo real; o instrumento portátil do guia recebia as leituras e avisava quando a cabine podia seguir. Não havia feitiço naquele movimento, mas uma engenharia precisa, capaz de operar com segurança muito além do que as antigas formas de pedra e metal sugeriam.',
    'c6-p12': 'Na entrega, Ryusen carregou uma caixa pequena sem pedir ajuda. O rapaz que o provocara segurou a outra ponta quando o peso começou a pender. Ryusen aceitou a mão sem agradecer, depois corrigiu o nó da alça para que não tornasse a escorregar. Crescera ouvindo que pedir ajuda era fraqueza; naquele momento, deixar a caixa cair só para sustentar o orgulho lhe pareceu uma estupidez. A cooperação durou menos que a irritação dos dois, mas funcionou.',
    'c7-p1': 'Ryusen tinha treze anos quando voltou a sair do território e percebeu que a primeira viagem não lhe ensinara quase nada sobre uma cidade. Depois da catástrofe de Belzebu, a reconstrução avançara em ritmos diferentes; ali, ele tentou olhar para o conjunto: os canais cobertos sob a rua, os elevadores de carga escondidos em torres de pedra, as lanternas que ajustavam a luz sem fumaça e as estações de comunicação encaixadas nas paredes dos edifícios. Placas de vidro exibiam rotas e leituras atualizadas em tempo real; a rede coordenava transporte e distribuição por toda a cidade, enquanto os mecanismos permaneciam ocultos na alvenaria. O lugar preservava a silhueta medieval, mas operava com uma integração de rede e controle muito além dos registros tecnológicos que Ryusen conhecia.',
    'c9-p10': 'Ryusen passou o polegar pela faixa carmesim presa à sua alça. A carta da mãe lhe voltara à lembrança: gosto não era obrigação, e tradição não era autorização para mandar nos outros. Entre os Dark ainda sobrevivia uma máxima antiga, repetida como sinal de autonomia: pedir ajuda era mostrar fraqueza. Ryusen crescera ouvindo-a e às vezes a confundia com orgulho; agora começava a perceber que cooperar por escolha não era entregar a própria vontade. Ele não achava que a frase da mãe se aplicasse a tudo. Mas aquele colega não lhe devia uma disputa.',
    'c4-p12': 'À tarde, Ryusen voltou à centelha entre as mãos. Conseguiu mantê-la acesa por três passos lentos antes que o movimento a desfizesse. Não era uma vitória que pudesse anunciar. No fim do treino, encontrou o pai à entrada do alojamento. O homem tinha vindo tratar de assuntos comuns da família e soubera da prova; não o felicitou por ter chegado em segundo, nem o consolou. Abriu a mão e mostrou um pequeno medalhão com o brasão Dark, de metal escuro gasto nas bordas. Disse que o objeto lhe pertencia por ser filho daquela família, não por ter vencido alguma disputa. Ryusen o recebeu calado. O pai acrescentou que carregar um nome era lembrar o que se fazia com ele, sobretudo quando ninguém aplaudia. Os Dark tinham prestígio, mas não exigiam que todos seguissem um só caminho: a família respeitava a força construída pela magia, pelas armas, pelo estudo ou pelo trabalho técnico. Não houve cerimônia, plateia ou juramento. À noite, Ryusen deixou o medalhão ao lado do caderno para que a corrente não se prendesse durante o exercício; antes de dormir, tornou a colocá-lo. Pediu outra tentativa de magia para o dia seguinte.',
    'c5-p2': 'Aos onze anos, Ryusen já tinha cartas guardadas dentro do caderno. Não as exibia e tampouco admitia que esperava por elas. Naquela, a mãe descrevia os Kurogane por uma memória concreta: uma oficina onde se discutia a curva de uma lâmina com a mesma seriedade com que se escolhia o tecido para protegê-la. Não lhe oferecia uma história de reis ou uma lista de nomes. Falava de mãos, materiais e da paciência exigida para corrigir um erro antes que o metal esfriasse.',
    'c5-p4': 'Com a carta vinha um retalho de tecido bordado. O desenho lembrava padrões que a mãe associava à vida entre os Kurogane, sem estabelecer um brasão oficial nem atribuir ao tecido qualquer poder. Ela o enviara para que Ryusen reconhecesse uma parte de sua origem; não para que vestisse um papel decidido por outros. Acrescentava que não suportava quando transformavam gosto em obrigação, nem tradição em desculpa para mandar na vida alheia.',
    'c5-p9': 'No dia seguinte, escolheu uma faixa de tecido escuro para prender o próprio cabelo durante o treino. O retalho da carta ficou guardado. Ryusen não tentou copiar o bordado e não vestiu uma identidade pronta. Prendeu o medalhão Dark sob a roupa para que não batesse no peito enquanto corria; ao tocar o metal, pensou no retalho de outra família dentro do caderno. Nenhum dos dois objetos decidia por ele. Pegou apenas a ideia de que uma escolha podia ser sua — e que ninguém precisava aprová-la para que valesse.',
    'c8-p1': 'Aos quatorze anos, Ryusen já se destacava entre os jovens nos exercícios que exigiam conjurar e ajustar magia diretamente pelas mãos. Percebia pequenas mudanças de ritmo antes de muitos colegas e aprendia depressa quando um método falhava. O talento não o tornava infalível: queria que a magia obedecesse à mesma lógica de uma disputa física, em que podia pressionar o adversário até abrir vantagem. A luz comum entre as mãos não respondia ao orgulho, e esse limite o irritava mais que uma derrota visível.',
    'c10-p1': 'Aos quinze anos, Ryusen já não confundia a centelha com um truque. Em sequências curtas, seu controle e sua leitura de espaço superavam a maior parte dos rapazes da mesma formação; ainda assim, prolongar o esforço enquanto corria permanecia difícil. Escolhera a magia como especialidade e a conjurava pelas próprias mãos, sem cajado ou varinha. O treino físico e o bastão lhe ensinavam distância e tempo, mas não substituíam o trabalho preciso exigido pela luz.',
    'c13-p10': 'A travessia não lhe dera um feito grandioso para contar. Deu-lhe a lembrança de que uma máquina confiável dependia de redundância, leitura cuidadosa e gente disposta a esperar. Ryusen continuava preferindo agir primeiro. Tinha vencido exercícios suficientes para reconhecer o próprio talento, mas começava a suspeitar que a próxima distância a superar não se media apenas contra os rapazes de sua idade.',
    'c14-p8': 'Concluíram a sequência sem apagar a luz. O mostrador registrou um tempo bom, superior ao da maior parte das duplas jovens, e nenhuma interrupção. Ryusen sabia o quanto contribuíra, mas também sabia que o colega sustentara o ritmo quando ele próprio queria acelerá-lo. O resultado pertencia aos dois. A precisão dele chamara atenção desde cedo, mas ainda dependia de concentração e de um parceiro capaz de acompanhar as mudanças de ritmo.',
    'c14-p9': '— Na próxima, tentamos uma marca a mais — disse Ryusen. O colega ergueu a sobrancelha, como quem já esperava que ele pedisse mais. Ryusen juntou as mãos e formou uma luz estável, depois a conduziu pelo percurso marcado no piso. No último ponto, tentou fazê-la mudar de direção sem reduzir o passo. O brilho oscilou, escapou da linha e se apagou antes de alcançar a argola de metal. Nenhuma peça se moveu. O erro fora dele: calculara a curva como se a energia obedecesse à pressa com que a ordenara.',
    'c14-p10': '— Pare — disse o instrutor. Ryusen já havia recuado da marca. Olhou para as próprias mãos, sem ferimento, e para a leitura no mostrador. Tentou refazer o gesto de memória; a luz surgiu, mas repetiu a mesma oscilação. O colega não riu nem se aproximou. O instrutor pediu que ambos descrevessem o que tinham visto e encerrou a sequência. Ryusen queria uma explicação imediata. Recebeu uma observação mais simples: a rapidez com que aprendia era incomum entre os jovens, mas não compensava um fundamento que ainda falhava sob pressão.',
    'c14-p11': 'Nos dias seguintes, Ryusen voltou ao salão para praticar a curva da luz, primeiro parado, depois em movimento. Aprendeu a interromper a tentativa quando o foco se desfazia, em vez de forçar energia para além do que conseguia controlar. Sua facilidade para perceber padrões continuou a diferenciá-lo da maior parte dos jovens; diante dos veteranos, contudo, ainda precisava de instrução, repetição e limites. O talento que já possuía não o tornava invencível. Apenas lhe dava mais cedo problemas que os outros ainda não precisavam resolver.',
    'c15-p10': 'Quando o relé se apagou, Ryusen voltou ao treino. Conjurou a luz pelas mãos e tentou conduzi-la por uma curva estreita entre as marcas do piso. A primeira tentativa se desfez antes do fim; na seguinte, manteve o brilho por mais um passo, mas perdeu precisão ao acelerar. Registrou no caderno a distância e o ponto em que a luz oscilara. O que lera sobre a Oamem continuava sem resposta, mas não era uma justificativa para transformar exercício em missão. Fechou o caderno e recomeçou pelo movimento básico.',
    'c16-p1': 'Aos dezoito anos, Ryusen já reconhecia a própria mão em alguns detalhes: o fecho carmesim escolhido por ele, o corte das mangas e o modo como combinava peças Dark com linhas que lembravam as imagens das cartas da mãe. No treino, a magia conjurada pelas mãos continuava sua especialidade; as vitórias sobre os jovens da sua geração eram reais, sem colocá-lo acima dos veteranos. O cabelo branco era preso para não atrapalhar os olhos, com o penteado que mais tarde integraria sua aparência adulta.',
    'c16-p2': 'Naquela tarde, voltou a uma carta antiga. A mãe descrevia o trabalho dos Kurogane com o metal e a atenção dada à bainha, ao equilíbrio e à manutenção de uma arma. Na margem, esboçara um dos padrões que enviara no retalho anos antes. Não explicava uma origem mística nem uma importância política. Escrevera apenas que aquele desenho lhe lembrava a oficina e as pessoas entre as quais aprendera a distinguir acabamento de cuidado. Ryusen releu o trecho e guardou-o junto às referências visuais reunidas ao longo dos anos.',
    'c16-p4': 'Entre as figuras, separou as formas que fariam parte da composição oficial sobre braços, peito, pescoço e costas. Queria que acompanhassem o movimento do corpo e sua escolha de roupa, não que anunciassem um poder. O demônio e o dragão eram imagens pessoais; não espíritos, profecias ou uma segunda herança. Ryusen recusou qualquer traço que sugerisse que as marcas lhe concederiam uma habilidade.',
    'c16-p17': 'Quando viu o conjunto inteiro, Ryusen reconheceu a composição que escolhera, ainda sujeita aos cuidados de cicatrização. O rosto no espelho era o mesmo; as marcas não tornavam sua magia mais forte. A roupa preta e carmesim que começou a montar depois delas respeitava o movimento de seus braços e deixava espaço para os símbolos das duas famílias. Ainda faltava decidir como protegeria a parte inferior do rosto sem esconder os olhos nem atrapalhar a respiração. Lembrou-se de formas vistas nas cartas maternas e desenhou uma meia máscara Oni que não copiava um objeto de família: seria uma peça sua, feita para o corpo e a vida que construíra. Nada daquilo o tornava veterano.',
    'c16-p18': 'Na volta, guardou a carta da mãe no mesmo compartimento da pasta. Não contou aos colegas do território o que cada linha das tatuagens significava. Mais tarde, trouxe da cidade uma meia máscara simples, ainda sem acabamento, e a ajustou com as próprias mãos. Testou a fixação em movimento, retirou uma tira que pressionava a orelha e refez o encaixe até poder respirar e enxergar sem esforço. Pintou a superfície de preto e carmesim, seguindo o desenho Oni que escolhera; não acrescentou um brasão nem a tratou como peça obrigatória dos Dark ou herança mágica dos Kurogane. Usou-a em duas práticas de deslocamento e descobriu que precisava soltar a tira durante pausas longas. Quando o instrutor perguntou se pretendia usá-la em cada treino, Ryusen respondeu que decidiria conforme a tarefa. Guardou-a ao lado do equipamento. O medalhão paterno continuou no peito; a máscara era outra coisa, moldada por suas próprias escolhas.',
    'c17-p1': 'Aos dezenove anos, Ryusen voltou ao salão de avaliação para uma última sequência antes de deixar a rotina de formação. O instrutor dividiu a prova em deslocamento, leitura de sinais, conjuração pelas mãos e controle da energia em movimento. Os rapazes da mesma geração já o tratavam como o competidor a superar. Isso não alterava as marcas estabelecidas pelos homens mais experientes nem o fato de que ele ainda começava a construir uma prática própria.',
    'c17-p2': 'Ryusen começou rápido demais e perdeu o primeiro sinal. O instrutor mandou reiniciar. Na segunda tentativa, leu o painel, ajustou a respiração e concluiu o trecho comum com precisão superior à dos outros jovens. A luz surgiu firme entre as mãos. Ao conduzi-la pela curva final, acelerou antes da hora; o brilho oscilou e se apagou. Ele parou antes de atingir a marca seguinte. Não escondera o erro, tampouco precisava fingir que os primeiros trechos não tinham sido bons.',
    'c17-p4': 'O registro apontou um resultado excepcional no percurso e na conjuração básica, além de uma interrupção na última curva. Ryusen leu as linhas duas vezes. Teria preferido que a primeira apagasse a segunda, mas o papel não se prestava a elogios. Anotou o tempo, o ponto em que a luz oscilara e a distância que ainda faltava. O instrutor não chamou aquilo de derrota nem de domínio.',
    'c17-p8': 'Ryusen guardou o caderno. Continuava competitivo e frio o bastante para não confundir reconhecimento com intimidade. A caminho da saída, recebeu um estojo e uma carta que a mãe deixara preparados para aquela passagem. A entrega não informava onde ela estava naquele momento. A carta retomava a oficina Kurogane sem narrar uma história política: ela havia pedido a ferreiros de sua família que fizessem uma katana para ele, equilibrada para alguém que conjurava com as mãos e também precisava lutar de perto. Queria que Ryusen conhecesse o trabalho por trás da lâmina e carregasse as duas famílias sem pedir a nenhuma delas que escolhesse seu caminho. O padrão discreto da guarda lembrava o retalho que ele guardara aos onze anos, sem apresentar um brasão familiar definido. Não havia promessa de magia na espada.',
    'c17-p9': 'Dentro do estojo, a katana tinha a mesma sobriedade cuidadosa da carta: empunhadura firme, bainha bem ajustada, detalhes Kurogane que Ryusen reconheceu dos desenhos maternos. Testou o equilíbrio sem desembainhá-la diante dos outros e a guardou para a viagem. As tatuagens permaneceram parcialmente cobertas pelo traje preto e carmesim. Sob o tecido, o medalhão que o pai lhe dera aos dez anos repousava contra o peito. A meia máscara Oni, ajustada e pintada por ele, estava presa ao lado da bolsa; podia usá-la quando lhe fosse útil, sem que alguém a tivesse imposto. Ryusen não recebeu uma missão nem uma arma capaz de decidir sua campanha. Saiu com talento, experiência de formação e muito que ainda precisava aprender.',
    'c17-p10': 'Do lado de fora, a passagem aguardava aberta. Ryusen parou um instante, sentiu o peso real da espada ao lado da bolsa e olhou para trás. Os rapazes que deixava haviam sido seus rivais; os veteranos permaneciam uma medida distante. Passou o medalhão para dentro da roupa, ajustou a meia máscara sobre a parte inferior do rosto e seguiu até o limiar. A campanha começaria depois daquele passo. O que ele faria nela ainda não estava escrito.'
  };
  for (const [id, text] of Object.entries(edits)) {
    const event = book.events.find(item => item.eventId === id);
    if (!event || event.type !== 'text') throw new Error(`Missing draft paragraph ${id}`);
    event.text = text;
  }
  function moveAfter(eventId, anchorId) {
    const image = book.events.find(event => event.eventId === eventId);
    if (!image || image.type !== 'image') throw new Error(`Missing image ${eventId}`);
    book.events = book.events.filter(event => event.eventId !== eventId);
    const at = book.events.findIndex(event => event.eventId === anchorId);
    if (at < 0) throw new Error(`Missing anchor ${anchorId}`);
    book.events.splice(at + 1, 0, image);
  }
  const samples = {
    'c4-practice-detail': ['c4-medalhao-dark.png', 'O pai entrega o medalhão Dark a Ryusen aos dez anos, após a derrota numa prova comum.'],
    'c14-detail': ['c14-despertar-correntes.png', 'Ryusen e seu colega praticam a condução de uma luz mágica por um percurso marcado no salão de treinamento.'],
    'c16-focus-final': ['c16-tatuagens-revisao.png', 'O artista confere as linhas finais das tatuagens de Ryusen, de acordo com a imagem oficial protegida.'],
    'c16-session-finished-final': ['c16-criacao-mascara-oni.png', 'Ryusen ajusta e pinta pessoalmente a meia máscara Oni preta e carmesim.'],
    'c17-departure-final': ['c17-carta-katana.png', 'Ryusen lê a carta da mãe diante da katana Kurogane recém-entregue.'],
    'c17-limiar-final': ['c17-partida-oficial.png', 'Ryusen deixa o território com traje oficial, meia máscara Oni, medalhão Dark e katana Kurogane.']
  };

  for (const [id, [file, alt]] of Object.entries(samples)) {
    const image = book.events.find(event => event.eventId === id);
    if (!image || image.type !== 'image') throw new Error(`Missing sample slot ${id}`);
    image.src = `assets/ryusen/amostras-prioritarias/${file}`;
    image.alt = alt;
    image.pixelWidth = 1024;
    image.pixelHeight = 1536;
  }
  // This slot used to depict an unconfirmed supernatural chain. Keep its position and count,
  // but show the already-approved ordinary paired-magic practice instead.
  const c14DetailSlot = book.events.find(event => event.eventId === 'c14-detail');
  if (c14DetailSlot) {
    c14DetailSlot.src = 'assets/ryusen/recreated-2026/narrative/c14-paired-magic-correction.png';
    c14DetailSlot.alt = 'Ryusen pratica magia comum em parceria, conduzindo uma luz entre as mãos durante o exercício.';
    c14DetailSlot.pixelWidth = 1024;
    c14DetailSlot.pixelHeight = 1536;
  }
  const nightSpark = book.events.find(event => event.eventId === 'c2-night-spark-final');
  if (nightSpark?.type === 'image') nightSpark.alt = 'Aos sete anos, Ryusen tenta uma última vez manter a centelha pequena e instável depois do treino.';
  const correctedClothesImage = book.events.find(event => event.eventId === 'c16-chosen-clothes-final');
  if (!correctedClothesImage || correctedClothesImage.type !== 'image') throw new Error('Missing corrected illustration slot');
  correctedClothesImage.src = 'assets/draven/recreated-2026/narrative/c16-chosen-clothes-final-anatomy-v2.webp';
  const correctedClearanceImage = book.events.find(event => event.eventId === 'c13-waiting-clearance-final');
  if (!correctedClearanceImage || correctedClearanceImage.type !== 'image') throw new Error('Missing clearance illustration slot');
  correctedClearanceImage.src = 'assets/draven/recreated-2026/narrative/c13-waiting-clearance-final-anatomy-v2.webp';
  correctedClearanceImage.pixelWidth = 1080;
  correctedClearanceImage.pixelHeight = 1456;
  const distinctPracticeImage = book.events.find(event => event.eventId === 'c10-i3');
  if (!distinctPracticeImage || distinctPracticeImage.type !== 'image') throw new Error('Missing practice illustration slot');
  distinctPracticeImage.src = 'assets/draven/recreated-2026/narrative/c10-i3-distinct-v2.webp';
  distinctPracticeImage.alt = 'Ryusen, aos quinze anos, reacende uma centelha instável junto ao medidor enquanto o instrutor observa.';
  // The picture shows the two competitors reading the gauge, not writing.
  book.events.find(event => event.eventId === 'c8-written-result-final').alt =
    'Aos quatorze anos, Ryusen e o colega observam no medidor os resultados de estabilidade e tempo do exercício de luz.';
  // Keep the seven-year-old visual with the later part of the chapter, after the age-six first lesson.
  moveAfter('c2-i4', 'c2-p9');
  moveAfter('c14-detail', 'c14-p9');
  moveAfter('c16-session-finished-final', 'c16-p18');
  moveAfter('c17-departure-final', 'c17-p8');
  moveAfter('c17-limiar-final', 'c17-p10');
  const protectedImage = book.events.find(event => event.eventId === 'c16-i16');
  if (protectedImage?.src !== 'assets/draven/recreated-2026/narrative/c16-i16.webp') throw new Error('Protected illustration moved or replaced');
  book.revisionDraft = { name: 'Ryusen Kurogane Dark', changedParagraphs: Object.keys(edits), prioritySamples: Object.keys(samples), protectedImageId: 'c16-i16', imageReviewPending: true };
})();
