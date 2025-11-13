// 📘 LessonData.ts — Banco de lições organizado por fases

import f1q1 from "./LessonDataImages/f1q1.jpeg";

// Fase 2
import f2q1 from "./LessonDataImages/f2q1.jpeg";
import f2q2 from "./LessonDataImages/f2q2.jpeg";
import f2q4 from "./LessonDataImages/f2q4.jpeg";


// Fase 3
import f3q3 from "./LessonDataImages/f3q3.jpeg";


// =======================
// 🔹 FASE 1
// =======================

// Questão 1 – POSCOMP 2009
export const lesson_fase1_q1 = {
  title: "POSCOMP 2009 — Autômatos Finitos Não Determinísticos",
  
  explanation: `Partindo do estado inicial, um autômato aceita qualquer caminho que termine em um de seus estados de aceitação. 
Neste caso, começa em A e deve terminar em D.
Exemplo de notação: δ(A, x) = Y, lê-se "estando no estado A, lendo x, vai para Y".`,

  image: f1q1,

  question: "Considere o autômato finito não-determinístico a seguir. Qual conjunto de transições e estados de aceitação descreve corretamente esse autômato?",

  alternatives: [
    "Estado Inicial A, estados de aceitação C e D\nδ(A, b) = B\nδ(B, a) = C\nδ(C, a) = D",
    "Estado Inicial A, estado de aceitação C\nδ(A, b) = B\nδ(B, a) = C\nδ(C, a) = C",
    "Estado Inicial A, estado de aceitação D\nδ(A, b) = B\nδ(B, a) = D\nδ(B, b) = C\nδ(C, a) = D",
    "Todas as respostas acima estão corretas.",
    "É impossível converter esse autômato finito não determinístico em um autômato finito determinístico."
  ],

  correctAnswer: 0,

  tags: ["AFNDs", "percorrer caminhos", "AFND sem lambda no incial"]
};

// Questão 2 – POSCOMP 2009
export const lesson_fase1_q2 = {
  title: "POSCOMP 2009 — Gramática Regular",

  explanation: `Uma gramática regular gera palavras a partir do símbolo inicial. Cada produção mostra como um símbolo deriva uma sequência de símbolos terminais ou não-terminais.
Exemplo: S → ASb significa "S deriva ASb".`,

  question: "Com base nas regras de produção S → ASb | c e A → a, qual é a linguagem gerada por essa gramática?",

  alternatives: [
    "{aⁿcb | n ∈ ℕ}",
    "{acbⁿ | n ∈ ℕ}",
    "{aⁿcⁿb | n ∈ ℕ}",
    "{aⁿcbⁿ | n ∈ ℕ}",
    "Nenhuma das respostas anteriores"
  ],

  correctAnswer: 3,
  
  tags: ["Gramática Regular", "derivações"]
};

// Questão 3 – POSCOMP 2012
export const lesson_fase1_q3 = {
  title: "POSCOMP 2012 — Conversão de AFN para AFD",

  explanation: `Ao converter um AFN em AFD, cada estado do AFD representa um subconjunto de estados do AFN. O número máximo de estados do AFD é 2^n, onde n é o número de estados do AFN.`,

  question: "Se um AFN tem 6 estados, qual é o número máximo de estados do AFD resultante, considerando os estados inúteis?",

  alternatives: ["12", "36", "64", "1024", "46656"],

  correctAnswer: 2,

  tags: ["AFNDs", "propriedade dos autômatos"]
};

// Questão 4 – POSCOMP 2013
export const lesson_fase1_q4 = {
  title: "POSCOMP 2013 — Cadeia Vazia e Estado Inicial",

  explanation: `Um autômato finito aceita qualquer palavra que termine em um de seus estados de aceitação. Se o estado inicial também for final, ele aceita a cadeia vazia.`,

  question: "Se o estado inicial de um autômato finito também for estado final, o que podemos afirmar sobre esse autômato?",

  alternatives: [
    "não aceita a cadeia vazia.",
    "não tem outros estados finais.",
    "é determinístico.",
    "aceita a cadeia vazia.",
    "é não determinístico."
  ],

  correctAnswer: 3,

  tags: ["AFNDs", "propriedade dos autômatos"]
};

// Questão 5 – ENADE 2005
export const lesson_fase1_q5 = {
  title: "ENADE 2005 — Expressões Aritméticas e Gramáticas",

  explanation: `As gramáticas regulares são usadas para identificar tokens simples, 
  enquanto a gramática livre de contexto define a estrutura da expressão, como a ordem de 
  precedência dos operadores. Assim, expressões aritméticas completas devem ser descritas 
  por uma gramática livre de contexto.`,

  question: `Considere a necessidade de se implementar um componente de software que realiza 
  cálculos de expressões matemáticas simples para as operações básicas (soma, subtração, multiplicação, 
  divisão e exponenciação). O software reproduz na tela do computador a entrada, os resultados parciais 
  e o resultado final da expressão e, ainda, trata os operadores de exponenciação, multiplicação e divisão 
  com precedência sobre os operadores de soma e subtração. Para obter o referido software, é correto que o 
  projetista 

  I) Uma cadeia de caracteres para armazenar e imprimir toda a expressão de entrada. 
  II) Uma gramática regular para identificar as expressões aritméticas válidas.
  III) Um reconhecedor de linguagem regular com autômato finito determinístico.
  IV) Especifique a ordem de precedência dos operadores com uma notação de gramática livre de contexto.
  `,

  alternatives: [
    "defina I e II.",
    "defina III e IV.",
    "defina I, II e IV.",
    "defina I, III e IV.",
    "defina II, III e IV."
  ],

  correctAnswer: 3,

  tags: ["gramática Regular", "propriedades de gramática", "hierarquia de chomsky"]
};

export const lessonsFase1 = [
  lesson_fase1_q1,
  lesson_fase1_q2,
  lesson_fase1_q3,
  lesson_fase1_q4,
  lesson_fase1_q5,
];

// =======================
// 🔹 FASE 2
// =======================

// Questão 1 – POSCOMP 2008
export const lesson_fase2_q1 = {
  title: "POSCOMP 2008 — Autômatos e Cadeias Reconhecidas",

  explanation: `Analise um autômato finito a partir das cadeias que ele reconhece ou rejeita. Os círculos em negrito representam estados de aceitação.`,

  image: f2q1,

  question: "Observando o autômato ao lado, qual das afirmativas sobre reconhecimento de palavras é FALSA?",

  alternatives: [
    "A palavra aaa é reconhecida pelo autômato.",
    "A palavra ababa não é reconhecida pelo autômato.",
    "A palavra vazia é reconhecida pelo autômato.",
    "A palavra aba é reconhecida pelo autômato.",
    "A palavra baba é reconhecida pelo autômato."
  ],

  correctAnswer: 3,

  tags:["AFNDs", "percorrer caminhos", "AFND com lambda no incial"]
};

// Questão 2 – UFG 2024 (adaptada)
export const lesson_fase2_q2 = {
  title: "UFG 2024 — Autômato JFLAP (Adaptado)",

  explanation: `Um autômato aceita ou rejeita palavras dependendo de suas transições e estados finais. Analise as transições para determinar quais cadeias são aceitas.`,

  image: f2q2,

  question: "Qual é a única cadeia de caracteres aceita pelo autômato mostrado acima?",

  alternatives: [
    "010000",
    "001011",
    "100110",
    "110101",
    "111000"
  ],

  correctAnswer: 3,

  tags: ["AFNDs", "percorrer caminhos", "AFND sem lambda no incia"]
};

// Questão 3 – CESPE 2022
export const lesson_fase2_q3 = {
  title: "CESPE 2022 — Autômatos Determinísticos",

  explanation: `Autômatos determinísticos possuem exatamente uma transição para cada símbolo de entrada a partir de cada estado, enquanto autômatos não determinísticos podem ter múltiplas opções.`,

  question: "Sobre autômatos finitos determinísticos, qual das alternativas descreve corretamente seu comportamento?",

  alternatives: [
    "corresponde à função de transição que recebe um estado ou um símbolo de entrada que sempre retorna um conjunto de estados como resultado.",
    "tem a capacidade de adivinhar algo sobre sua entrada ao testar valores.",
    "pode, para cada entrada, transitar a partir do seu estado atual em um e somente um estado.",
    "permite zero, uma ou n transições para os estados de entrada.",
    "consegue estar em vários estados ao mesmo tempo."
  ],

  correctAnswer: 2,

  tags: ["AFDs", "propriedade dos autômatos"]
};

// Questão 4 – POSCOMP 2022 (Adaptada)
export const lesson_fase2_q4 = {
  title: "POSCOMP 2022 — Linguagem Aceita por AFD",

  explanation: `Um AFD aceita um conjunto específico de palavras. A análise envolve entender o padrão das cadeias que passam pelo autômato e chegam a estados finais.`,

  image: f2q4,

  question: "Qual é a linguagem aceita pelo autômato determinístico mostrado acima?",

  alternatives: [
    "L = {awa: w ∈ {a,b}*}",
    "L = {w ∈ {a,b}* : |w a| = 1}",
    "L = {w ∈ {a,b}* : |w a| ≥ 0}",
    "L = {w ∈ {a,b}* : |w a| ≤ 3}",
    "L = {w ∈ {a,b}* : |w a| é par e |w b| ≤ 3}"
  ],

  correctAnswer: 2,

  tags: ["AFDs", "percorrer caminhos"]
};

// Questão 5 – ENADE 2008
export const lesson_fase2_q5 = {
  title: "ENADE 2008 — Tipos de Gramática",

  explanation: `Analise as regras de produção da gramática e sua classificação na hierarquia de Chomsky. Observe quais cadeias são geradas e se existe equivalência com gramática regular.`,

  question: "Considerando a gramática abaixo, qual afirmação correta podemos fazer sobre ela?\nS → AB\nAB → AAB\nA → a\nB → b",

  alternatives: [
    "A gramática G é ambígua.",
    "A gramática G é uma gramática livre de contexto.",
    "A cadeia aabbb é gerada por essa gramática.",
    "É possível encontrar uma gramática regular equivalente a G.",
    "A gramática G gera a cadeia nula."
  ],

  correctAnswer: 3,

  tags:["Gramática Regular", "derivações", "propriedades das gramáticas"]
};

export const lessonsFase2 = [
  lesson_fase2_q1,
  lesson_fase2_q2,
  lesson_fase2_q3,
  lesson_fase2_q4,
  lesson_fase2_q5,
];

// =======================
// 🔹 FASE 3
// =======================

// Questão 1 – POSCOMP 2011
export const lesson_fase3_q1 = {
  title: "POSCOMP 2011 — Gramática Livre de Contexto para Expressão Regular",

  explanation: `Concatenação é quando um símbolo é lido em seguida do outro. Ex: "ab" lê-se "a" concatenado com "b".
A estrela de Kleene representa a leitura de todas as concatenações daquele elemento. Ex: a* = a⁰, a¹, a², a³…`,

  question: "Considere a gramática livre de contexto: S → aS | Sb | c. Qual expressão regular gera a mesma linguagem que a gramática definida acima?",

  alternatives: [
    "a*cb*",
    "a+b+c",
    "a+cb+",
    "ca*b*",
    "ca+b+"
  ],

  correctAnswer: 0,

  tags: ["expressão regular", "análise de cadeia", "estrela de kleene"]
};

// Questão 2 – POSCOMP 2022
export const lesson_fase3_q2 = {
  title: "POSCOMP 2022 — Gramática Regular para Expressão Regular",

  explanation: `L(r) significa "L aceita a expressão r". Uma expressão regular pode representar os tipos de palavras geradas por uma gramática específica.`,

  question: "Dado a gramática regular (G), determine qual é a expressão regular (r), tal que L(r) = L(G): S → abS | S | a",

  alternatives: [
    "r = (ab)*a",
    "r = aba*",
    "r = a*(ba)",
    "r = (a+b)*a*",
    "r = (ab) + a"
  ],

  correctAnswer: 0,

  tags: ["expressão regular", "análise de cadeia"]
};

// Questão 3 – IFB 2017
export const lesson_fase3_q3 = {
  title: "IFB 2017 — Expressões Regulares e Autômatos",

  explanation: `Observe como cada expressão regular descreve a necessidade de pelo menos um "1" para alcançar o estado final. Compare o comportamento do autômato: ele aceita qualquer sequência de 0's antes, mas precisa encontrar um 1 obrigatório para chegar ao estado final.`,

  image: f3q3,

  question: `Leia as afirmativas sobre expressões regulares associadas ao autômato da figura:

I) A expressão regular 0*1(1+00*1)* representa o autômato da figura.
II) A expressão regular 0*1*1+11*0*1 representa o autômato da figura.
III) A expressão regular (0+1)*1 representa o autômato da figura.

Assinale somente a alternativa que apresenta todas as afirmativas CORRETAS.`,

  alternatives: [
    "Somente I e II",
    "Somente I e III",
    "Somente II",
    "Somente II e III",
    "Somente I"
  ],

  correctAnswer: 1,

  tags: ["expressão regular", "análise de cadeia"]
};

// Questão 4 – POSCOMP 2003
export const lesson_fase3_q4 = {
  title: "POSCOMP 2003 — Gramática para Expressão Regular",

  explanation: `O símbolo (|) indica que o símbolo inicial pode derivar um dos resultados - "ou" um "ou" outro. Analise como os resultados da derivação formam o padrão de palavras geradas.`,

  question: `Uma gramática G é definida por G=({x,y,z},{S,W,X,Y,Z},P,S) onde P são:
S → WZ
W → X|Y
X → x|xX
Y → y|yY
Z → z|zZ

Qual das expressões regulares abaixo corresponde a esta gramática?`,

  alternatives: [
    "(xx*|yy*)zz*",
    "xx*|yy*|zz*",
    "xx*(yy*|zz*)",
    "(xx|yy)*zz*",
    "xx*yy*zz*"
  ],

  correctAnswer: 0,

  tags: ["expressão regular", "análise de cadeia", "estrela de kleene"]
};

// Questão 5 – POSCOMP 2009 (Adaptado)
export const lesson_fase3_q5 = {
  title: "POSCOMP 2009 — Linguagem com Número Par de a's",

  explanation: `A linguagem L = {ω | ω ∈ Σ* e o número de a's em ω é par} inclui todas as cadeias onde a quantidade de 'a's é par, incluindo zero.`,

  question: `Seja o alfabeto Σ = {a, b} e a linguagem regular L = {ω | ω ∈ Σ* e o nº de a's em ω é par}. Qual das expressões regulares abaixo gera essa linguagem?`,

  alternatives: [
    "(a b* a b*)*",
    "((a a)* | b*)*",
    "(b* | (a a)* | b*)*",
    "(b*ab*ab*)*|b*",
    "(a a | b)"
  ],

  correctAnswer: 3,

  tags: ["expressão regular", "análise de cadeia", "estrela de kleene"]
};

export const lessonsFase3 = [
  lesson_fase3_q1,
  lesson_fase3_q2,
  lesson_fase3_q3,
  lesson_fase3_q4,
  lesson_fase3_q5,
];

// =======================
// 🔹 FASE 4
// =======================

// Questão 1 – ENADE 2014
export const lesson_fase4_q1 = {
  title: "ENADE 2014 — Análise de Expressões Regulares",

  explanation: `Pense na paridade dos a's - a linguagem exige que haja pares de a (0, 2, 4, ...). Construa a expressão agrupando dois a por vez, permitindo qualquer número de b antes, entre e depois desses pares.`,

  question: `Considere as expressões regulares:
R1 = a*ba*ba*ba*
R2 = a*(a | b)a(a | b)*
R3 = a*ab*a(a | b)
R4 = (a | b)*

Em relação às linguagens definidas, conclui-se que a cadeia abbb está contida apenas nas linguagens definidas por:`,

  alternatives: [
    "R1 e R4",
    "R2 e R3",
    "R2 e R4",
    "R1 e R3",
    "R2, R3 e R4"
  ],

  correctAnswer: 0,

  tags: ["expressão regular", "análise de cadeia", "fecho", "estrela de kleene"]
};

// Questão 2 – POSCOMP 2014
export const lesson_fase4_q2 = {
  title: "POSCOMP 2014 — Descrição de Linguagem por Expressão Regular",

  explanation: `As derivações, mesmo que possam ser geradas infinitamente, devem respeitar a ordem em que estão sendo colocadas. Analise o padrão estabelecido pela expressão regular.`,

  question: `Considere a expressão regular: (c*a[abc]*b[abc]*) | c*. Assinale a alternativa que descreve, corretamente, todas as cadeias geradas por essa expressão regular.`,

  alternatives: [
    "Cadeias sobre o alfabeto {a,b,c} onde o primeiro a precede o primeiro b",
    "Cadeias sobre o alfabeto {a,b,c} com um número par de a's",
    "Cadeias sobre o alfabeto {a,b,c} contendo a substring baa",
    "Cadeias sobre o alfabeto {a,b,c} contendo um número ímpar de c's",
    "Cadeias sobre o alfabeto {a,b,c} terminadas por c"
  ],

  correctAnswer: 0,

  tags: ["expressão regular", "análise de cadeia"]
};

// Questão 3 – POSCOMP 2015
export const lesson_fase4_q3 = {
  title: "POSCOMP 2015 — União de Linguagens Regulares",

  explanation: `Observe que R1 gera cadeias que começam com "a" e R2 com "b". Assim, suas linguagens são diferentes, mas juntas cobrem todas as cadeias não vazias do alfabeto {a, b}.`,

  question: `Considere as expressões regulares sobre o alfabeto {a, b}:
R1 = a(a ∪ b)*
R2 = b(a ∪ b)*

Se L(R) é a linguagem associada a uma expressão regular R, é correto afirmar que:`,

  alternatives: [
    "L(R1) = L(R2)",
    "L(R2) = {w | w termina com b}",
    "existe um autômato finito determinístico cuja linguagem é igual a L(R1) ∪ L(R2)",
    "se R3 é uma expressão regular tal que L(R3) = L(R1) ∩ L(R2), então L(R3) é uma linguagem infinita",
    "um autômato finito não determinístico que reconheça L(R1) ∪ L(R2) tem, pelo menos, quatro estados"
  ],

  correctAnswer: 2,

  tags: ["expressão regular", "análise de cadeia", "fechos", "união", "interseção", "estrela de kleene"]
};

// Questão 4 – POSCOMP 2003
export const lesson_fase4_q4 = {
  title: "POSCOMP 2003 — Propriedades de Autômatos e Expressões Regulares",

  explanation: `Antes de decidir, relembre o que cada conceito realmente significa. AFD e AFND reconhecem a mesma classe de linguagens (as regulares), e toda expressão regular pode ser convertida em um autômato finito.`,

  question: `Considere as afirmações sobre autômatos finitos e expressões regulares:

I. A classe de linguagens aceita por um AFD não é a mesma que um AFND.
II. Para algumas expressões regulares não é possível construir um AFD.
III. A expressão regular (b+ba)+ aceita os strings de b's e a's começando com b e não tendo dois a's consecutivos.

Selecione a afirmativa correta:`,

  alternatives: [
    "As afirmativas I e II são verdadeiras",
    "As afirmativas I e III são falsas",
    "Apenas a afirmativa III é verdadeira",
    "As afirmativas II e III são falsas",
    "As afirmativas I e III são verdadeiras"
  ],

  correctAnswer: 2,

  tags: ["AFDs", "AFNDs", "expressão regular"]
};

// Questão 5 – POSCOMP 2005
export const lesson_fase4_q5 = {
  title: "POSCOMP 2005 — Linguagem com Restrição de Ocorrência",

  explanation: `Σ representa o alfabeto, assim Σ* representa todas as combinações possíveis para aquele alfabeto. Analise uma expressão que garanta a ordem de a's seguido de b's de modo que independente do tamanho siga este padrão.`,

  question: `Seja Σ = {a, b}. Uma expressão regular denotando a linguagem L = {w ∈ Σ* tal que toda ocorrência de "a" em w é imediatamente seguida de "b"} é:`,

  alternatives: [
    "(a*b)*",
    "(b+ab)*",
    "a*b",
    "b+(ab)*",
    "(ab)*"
  ],

  correctAnswer: 1,

  tags: ["expressão regular", "análise de cadeia", "padrão de ocorrência"]
};

export const lessonsFase4 = [
  lesson_fase4_q1,
  lesson_fase4_q2,
  lesson_fase4_q3,
  lesson_fase4_q4,
  lesson_fase4_q5,
];


// =======================
// 🔹 FASE 5 - Lema do Bombeamento
// =======================

// Questão 1 – Sipser Exemplo 1.73
export const lesson_fase5_q1 = {
  title: "Sipser Exemplo 1.73 — Lema do Bombeamento para {0ⁿ1ⁿ}",

  explanation: `O Lema do Bombeamento é usado para provar que linguagens não são regulares. Para uma linguagem ser regular, deve existir um número de bombeamento p tal que qualquer string s com |s| ≥ p possa ser dividida em xyz satisfazendo as condições do lema.`,

  question: `Complete a prova usando o Lema do Bombeamento para mostrar que A = {0ⁿ1ⁿ | n ≥ 0} não é regular:

Prova:
Suponha, para fins de contradição, que A é _______ (1).
Pelo lema do bombeamento, existe um número p chamado _______ (2), tal que toda string s ∈ A com |s| ≥ p pode ser decomposta como s = xyz, com |xy| ≤ p, |y| > 0 e para todo i ≥ 0, xyⁱz ∈ A.

Escolhemos s = _______ (3). Essa string pertence a A e possui comprimento maior que p.

Analisemos as possíveis formas de y:

1. Caso 1: y contém apenas o símbolo _______ (4).
   Ao bombear (i=2), obtemos xyyz, que terá mais 0s que 1s.

2. Caso 2: y contém apenas o símbolo _______ (5).
   O bombeamento produz uma string com mais 1s que 0s.

3. Caso 3: y contém tanto 0s quanto 1s.
   Ao bombear, a string xyyz terá os 1s fora de ordem, quebrando o formato _______ (6).

Em todos os casos, ocorre contradição. Logo, A não é regular.`,

  alternatives: [
    "(1) regular; (2) comprimento de bombeamento; (3) 0ᵖ1ᵖ; (4) 0; (5) 1; (6) todos os 0s seguidos de todos os 1s",
    "(1) livre de contexto; (2) limite superior; (3) 0ᵖ1ᵖ; (4) 0; (5) 1; (6) balanceado",
    "(1) regular; (2) comprimento mínimo; (3) 1ᵖ0ᵖ; (4) 1; (5) 0; (6) com igual número de 0s e 1s",
    "(1) recursiva; (2) comprimento de bombeamento; (3) 0ᵖ1ᵖ; (4) 0; (5) 1; (6) com prefixo 0 e sufixo 1"
  ],

  correctAnswer: 0,

  tags: ["lema do bombeamento", "linguagem não regular", "0n1n"]
};

// Questão 2 – Sipser Exemplo 1.75
export const lesson_fase5_q2 = {
  title: "Sipser Exemplo 1.75 — Lema do Bombeamento para {ww}",

  explanation: `A linguagem B = {ww | w ∈ {0,1}*} contém strings que são duplicatas de alguma string w. O Lema do Bombeamento pode mostrar que essa linguagem não é regular através de uma escolha cuidadosa da string s.`,

  question: `Complete a prova usando o Lema do Bombeamento para mostrar que B = {ww | w ∈ {0,1}*} não é regular:

Prova:
Suponha que B é regular. Pelo lema do bombeamento, existe p tal que toda string s ∈ B com |s| ≥ p pode ser decomposta como s = xyz, com |xy| ≤ p, |y| > 0 e para todo i ≥ 0, xyⁱz ∈ B.

Escolhemos s = _______ (1). Essa string pertence a B e tem comprimento maior que p.

A _______ (2) (que diz que xyⁱz ∈ B para todo i ≥ 0) será crucial, pois sem ela poderíamos bombear s escolhendo x e z vazios.

No entanto, com essa condição, a prova segue porque y deve conter apenas _______ (3).

Se bombearmos (i=2), obtemos xyyz, que não pertence a B, pois a estrutura _______ (4) de ww é quebrada.

Escolhemos 0ᵖ10ᵖ1 para capturar a "essência" da não regularidade de B. Se tivéssemos escolhido 0ᵖ0ᵖ, ela poderia ser _______ (5) sem violar a forma B.

Portanto, obtemos uma contradição, e concluímos que B não é _______ (6).`,

  alternatives: [
    "(1) 0ᵖ10ᵖ1; (2) condição 3; (3) 0s; (4) duplicada; (5) bombeada; (6) regular",
    "(1) 0ᵖ1ᵖ; (2) condição 2; (3) 1s; (4) balanceada; (5) dividida; (6) livre de contexto",
    "(1) 1ᵖ01ᵖ0; (2) condição 1; (3) 0s e 1s; (4) simétrica; (5) comprimida; (6) recursiva",
    "(1) 0ᵖ0ᵖ; (2) condição 3; (3) 0s; (4) duplicada; (5) bombeada; (6) regular"
  ],

  correctAnswer: 0,

  tags: ["lema do bombeamento", "linguagem não regular", "ww"]
};

// Questão 3 – Sipser Exemplo 1.77
export const lesson_fase5_q3 = {
  title: "Sipser Exemplo 1.77 — Lema do Bombeamento para {0ⁱ1ʲ | i > j}",

  explanation: `A linguagem C = {0ⁱ1ʲ | i > j} contém strings onde o número de 0s é estritamente maior que o número de 1s. O bombeamento para baixo (i=0) é frequentemente útil para linguagens que envolvem relações de quantidade entre símbolos.`,

  question: `Complete a prova usando o Lema do Bombeamento para mostrar que C = {0ⁱ1ʲ | i > j} não é regular:

Prova:
Suponha que C é regular. Pelo lema do bombeamento, existe p tal que toda string s ∈ C com |s| ≥ p pode ser decomposta como s = xyz, com |xy| ≤ p, |y| > 0 e para todo i ≥ 0, xyⁱz ∈ C.

Escolhemos _______ (1). Essa string está em C porque possui exatamente um 0 a mais que o número de 1s.

Pelo lema, s pode ser decomposta como xyz. Como |xy| ≤ p, a parte y contém apenas o símbolo _______ (2).

Primeiro, tentemos bombear para cima (i=2): o número de 0s aumenta, mas xy²z ainda está em C. Nenhuma contradição ocorre.

Agora, consideremos o caso _______ (3) bombeando para baixo. A string resultante é xy⁰z = xz, que tem menos 0s que s.

Como s tinha apenas um 0 a mais que 1s, a string xz passa a ter _______ (4). Portanto, xz ∉ C, o que contradiz a _______ (5).

Assim, chegamos a uma contradição. Logo, C não é _______ (6).`,

  alternatives: [
    "(1) 0ᵖ⁺¹1ᵖ; (2) 0; (3) i = 0; (4) o mesmo número de 0s e 1s; (5) condição 3; (6) regular",
    "(1) 0ᵖ1ᵖ; (2) 1; (3) i = 1; (4) mais 1s que 0s; (5) condição 2; (6) livre de contexto",
    "(1) 0ᵖ1ᵖ⁻¹; (2) 0; (3) i = 2; (4) menos 0s que 1s; (5) condição 1; (6) recursiva",
    "(1) 1ᵖ0ᵖ⁺¹; (2) 1; (3) i = 0; (4) o mesmo número de 0s e 1s; (5) condição 3; (6) regular"
  ],

  correctAnswer: 0,

  tags: ["lema do bombeamento", "linguagem não regular", "bombeamento para baixo"]
};



export const lesson_fase5_q4 = {
  title: "FCM 2018 — Teorema do Bombeamento",

  explanation: `O Teorema do Bombeamento pode ser usado para provar que uma linguagem não é regular, nunca o contrário. Ele mostra que, se uma linguagem não pode ser "bombeada", então não é regular.`,

  question: "Sobre o Teorema do Bombeamento para linguagens regulares, é INCORRETO afirmar que",

  alternatives: [
    "se uma linguagem L não é regular, pode-se demonstrar que de fato L não é regular, utilizando-se o Teorema do Bombeamento.",
    "Para toda linguagem regular L e toda palavra suficientemente grande pertencente a L, é possível afirmar que há um trecho desta palavra que pode ser repetido quantas vezes desejarmos para se obterem outras palavras de L.",
    "O Teorema do Bombeamento pode ser utilizado para mostrar que a linguagem L, composta por palavras cujo comprimento é um número primo, não é regular.",
    "O enunciado do Teorema do Bombeamento possui diversos quantificadores lógicos, sendo eles existenciais e universais.",
    "O Teorema do Bombeamento pode ser utilizado para mostrar que a linguagem composta por palavras formadas por uma quantidade qualquer de 0's, seguida da mesma quantidade de 1's, não é regular."
  ],

  correctAnswer: 0,

  tags: ["lema do bombeamento", "propriedades do Lema do bombeamento para de LR"]
};

// Questão 8 – POSCOMP 2022
export const lesson_fase5_q5 = {
  title: "POSCOMP 2022 — Lema do Bombeamento",

  explanation: `O lema do bombeamento mostra que, para linguagens regulares, existe um ponto em que o autômato repete estados, formando um ciclo. Assim, a palavra pode ser dividida em partes (x, y, z) que podem ser repetidas sem sair da linguagem.`,

  question: `Sobre o lema do bombeamento para as linguagens regulares, analise as assertivas a seguir:

I. Se uma linguagem é Regular, então é aceita por um Autômato Finito Determinístico o qual possui um número finito e predefinido de n estados.
II. Se o autômato reconhece uma entrada w de comprimento maior ou igual a n, obrigatoriamente o autômato assume algum estado q mais de uma vez, então existe um ciclo na função programa que passa por q.
III. A entrada w pode ser dividida em 3 subpalavras w = xyz tal que |xy| <= n, |y| >= 1 e onde y é a parte de w reconhecida pelo ciclo na função programa.
IV. O Lema do bombeamento não pode ser utilizado para provar que uma determinada linguagem é Não Regular.

Quais estão corretas?`,

  alternatives: [
    "Apenas I e II.",
    "Apenas III e IV.",
    "Apenas I, II e III.",
    "Apenas II, III e IV.",
    "I, II, III e IV."
  ],

  correctAnswer: 2,

  tags: ["lema do bombeamento", "propriedades do Lema do bombeamento para de LR"]
};



export const lessonsFase5 = [
  lesson_fase5_q1,
  lesson_fase5_q2,
  lesson_fase5_q3,
  lesson_fase5_q4,
  lesson_fase5_q5,
];