import type { Lesson } from "@/features/content/schema";
import { CONCEPTS } from "./concepts";

const {
  ec1p,
  intMult,
  ec2p,
  ecParentesis,
  ecFracciones,
  ambosLados,
  plantear,
  desig1p,
  variable,
  jerarquia,
} = CONCEPTS;

export const LESSON_U2L4: Lesson = {
  id: "u2-l4",
  title: "Ecuaciones con denominadores",
  conceptIdsTaught: [ecFracciones.id],
  intro: {
    hook: "Ya abres paréntesis en ecuaciones. Ahora la x aparece dividida: $\\frac{x}{2}=7$. Los denominadores se eliminan multiplicando por ellos — como deshacer una repartición.",
    intuition: [
      "Una división se deshace multiplicando: si ves $x/5$, multiplica ambos lados por 5.",
      "Con coeficiente delante, como $\\frac{2x}{3}$: primero elimina el denominador (×3) y luego el coeficiente (÷2) — de afuera hacia adentro.",
      "Si el numerador es una suma, como $\\frac{x+1}{3}$, multiplicar por 3 libera TODO el numerador de golpe.",
    ],
    definition:
      "En $\\frac{ax}{b}=c$: multiplica ambos lados por $b$ → $ax=bc$, luego divide entre $a$. En $\\frac{x+b}{c}=d$: multiplica por $c$ → $x+b=cd$, luego resta $b$.",
    workedExamples: [
      "$\\frac{x}{2}=7$: multiplico por 2 → $x=14$.",
      "$\\frac{2x}{3}=6$: multiplico por 3 → $2x=18$; divido entre 2 → $x=9$.",
    ],
  },
  guidedPractice: {
    problem: "$\\frac{x}{4}=3$",
    steps: [
      {
        instruction: "Multiplica ambos lados por 4.",
        result: "$x=3\\cdot4$",
      },
      {
        instruction: "Calcula.",
        result: "$x=12$",
      },
    ],
    prompt: "Ahora resuélvelo tú: resuelve $\\frac{x}{6}=2$.",
    answer: 12,
    derivation: "2*6",
  },
  commonMistakes: [
    "Multiplicar solo un lado por el denominador: rompe el equilibrio de la ecuación.",
    "Operar antes de eliminar el denominador — siempre libera primero la x del denominador.",
  ],
  exercises: [
    {
      type: "multiple-choice",
      id: "u2l4e1",
      conceptsUsed: [ecFracciones.id],
      difficulty: 1,
      prompt: "Resuelve $\\frac{x}{2}=7$.",
      hints: [
        {
          level: 1,
          text: "La x está dividida entre 2: multiplica ambos lados por 2.",
        },
        { level: 2, text: "$x=7·2$." },
      ],
      choices: [
        { id: "a", text: "$x=14$", isCorrect: true },
        {
          id: "b",
          text: "$x=3{,}5$",
          isCorrect: false,
          feedbackIfWrong:
            "Dividiste entre 2 en vez de multiplicar: para deshacer «÷2» usas «·2».",
        },
        {
          id: "c",
          text: "$x=9$",
          isCorrect: false,
          feedbackIfWrong:
            "Sumaste 2: la operación inversa de dividir entre 2 es multiplicar por 2.",
        },
        {
          id: "d",
          text: "$x=5$",
          isCorrect: false,
          feedbackIfWrong: "Restaste 2: eso no deshace una división.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u2l4e2",
      conceptsUsed: [ecFracciones.id],
      difficulty: 1,
      prompt: "Resuelve $\\frac{x}{5}=3$.",
      hints: [{ level: 1, text: "Multiplica ambos lados por 5: $x=3·5$." }],
      answer: 15,
      derivation: "3*5",
    },
    {
      type: "multiple-choice",
      id: "u2l4e3",
      conceptsUsed: [ecFracciones.id, intMult.id],
      difficulty: 2,
      prompt: "Resuelve $\\frac{2x}{3}=6$.",
      hints: [
        {
          level: 1,
          text: "Primero elimina el denominador: multiplica por 3 → $2x=18$.",
        },
        { level: 2, text: "Luego divide entre 2." },
      ],
      choices: [
        { id: "a", text: "$x=9$", isCorrect: true },
        {
          id: "b",
          text: "$x=12$",
          isCorrect: false,
          feedbackIfWrong:
            "Restaste el 2 ANTES de eliminar el denominador: primero $·3$ deja $2x=18$.",
        },
        {
          id: "c",
          text: "$x=3$",
          isCorrect: false,
          feedbackIfWrong:
            "Multiplicaste bien por 3 ($2x=18$) pero luego dividiste mal: $18÷2=9$.",
        },
        {
          id: "d",
          text: "$x=36$",
          isCorrect: false,
          feedbackIfWrong:
            "Multiplicaste TAMBIÉN el coeficiente 2 por el denominador: solo los dos MIEMBROS se multiplican.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u2l4e4",
      conceptsUsed: [ecFracciones.id],
      difficulty: 2,
      prompt: "Resuelve $\\frac{3x}{4}=12$.",
      hints: [
        { level: 1, text: "Multiplica por 4: $3x=48$." },
        { level: 2, text: "Divide entre 3: $x=16$." },
      ],
      answer: 16,
      derivation: "(12*4)/3",
    },
    {
      type: "multiple-choice",
      id: "u2l4e5",
      conceptsUsed: [ecFracciones.id, ec1p.id],
      difficulty: 3,
      prompt: "Resuelve $\\frac{x+1}{3}=4$.",
      hints: [
        {
          level: 1,
          text: "Multiplica por 3: todo el numerador queda libre → $x+1=12$.",
        },
        { level: 2, text: "Ahora resta 1 en ambos lados." },
      ],
      choices: [
        { id: "a", text: "$x=11$", isCorrect: true },
        {
          id: "b",
          text: "$x=13$",
          isCorrect: false,
          feedbackIfWrong:
            "Calculaste $4·3$ y SUMASTE el 1 del lado equivocado: tras multiplicar queda $x+1=12$, así que $x=12-1$.",
        },
        {
          id: "c",
          text: "$x=12$",
          isCorrect: false,
          feedbackIfWrong:
            "Olvidaste el paso final: $x+1=12$ aún necesita restar 1.",
        },
        {
          id: "d",
          text: "$x=7$",
          isCorrect: false,
          feedbackIfWrong:
            "Mezclaste órdenes: el denominador se elimina multiplicando AMBOS miembros por 3, sin tocar aún el +1.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u2l4e6",
      conceptsUsed: [ecFracciones.id, ec2p.id],
      difficulty: 3,
      prompt: "Resuelve $\\frac{2x}{5}+1=7$.",
      hints: [
        { level: 1, text: "Primero resta 1: $\\frac{2x}{5}=6$." },
        { level: 2, text: "Multiplica por 5: $2x=30$; divide entre 2." },
        { level: 3, text: "$x=15$." },
      ],
      answer: 15,
      derivation: "((7-1)*5)/2",
    },
  ],
};

export const LESSON_U2L5: Lesson = {
  id: "u2-l5",
  title: "Plantear ecuaciones desde problemas",
  conceptIdsTaught: [plantear.id],
  intro: {
    hook: "Ya resuelves cualquier ecuación lineal. El último paso es el más poderoso: convertir un problema contado con palabras en una ecuación que tú mismo planteas.",
    intuition: [
      "Primero nombra la incógnita: «sea n el número que busco».",
      "Traduce frase por frase: «la suma de» → +, «el doble/triple de» → ×2/×3, «es» o «da» → =.",
      "El orden importa en las restas: pregúntate siempre «¿a quién le hacen algo?» — eso va primero.",
    ],
    definition:
      "Para plantear un problema: 1) nombra la incógnita; 2) traduce cada frase a símbolos respetando el orden de la acción; 3) iguala a lo indicado; 4) resuelve; 5) responde exactamente lo que preguntaron (no siempre es directamente x).",
    workedExamples: [
      '"El triple de un número disminuido en 4 da 20": $3n-4=20$ → $3n=24$ → $n=8$.',
      '"Tres números consecutivos suman 24": sean $n$, $n+1$, $n+2$ → $3n+3=24$ → $n=7$ (el menor de los tres).',
    ],
  },
  guidedPractice: {
    problem: '"Un número aumentado en 3 da 10"',
    steps: [
      {
        instruction: "Plantea la ecuación.",
        result: "$n+3=10$",
      },
      {
        instruction: "Resta 3 en ambos lados.",
        result: "$n=7$",
      },
    ],
    prompt:
      'Ahora resuélvelo tú: "el doble de un número es 16". ¿Cuál es el número?',
    answer: 8,
    derivation: "16/2",
  },
  commonMistakes: [
    "Resolver x y responder otra cosa: si piden «el mayor» y hallaste el menor, falta un paso.",
    "Traducir «menos que» fuera de orden: «7 menos que el doble de n» es $2n-7$, no $7-2n$.",
  ],
  exercises: [
    {
      type: "multiple-choice",
      id: "u2l5e1",
      conceptsUsed: [plantear.id, ec2p.id],
      difficulty: 1,
      prompt: '"Un número aumentado en 5 da 17". ¿Cuál es el número?',
      hints: [
        { level: 1, text: "Plantea $n+5=17$." },
        { level: 2, text: "Resta 5 en ambos lados." },
      ],
      choices: [
        { id: "a", text: "$12$", isCorrect: true },
        {
          id: "b",
          text: "$22$",
          isCorrect: false,
          feedbackIfWrong:
            "Sumaste 5 en lugar de restarlo al despejar: el +5 pasa restando.",
        },
        {
          id: "c",
          text: "$85$",
          isCorrect: false,
          feedbackIfWrong:
            'Multiplicaste por 5: "aumentado en" significa suma, no producto.',
        },
        {
          id: "d",
          text: "$3{,}4$",
          isCorrect: false,
          feedbackIfWrong:
            "Dividiste entre 5: la frase describe una suma, no una división.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u2l5e2",
      conceptsUsed: [plantear.id],
      difficulty: 1,
      prompt:
        "Un servicio cobra 2000 fijos más 300 por hora. Si una factura fue de 4400, ¿cuántas horas trabajó?",
      hints: [
        { level: 1, text: "Plantea $300h+2000=4400$." },
        { level: 2, text: "$300h=2400$; divide entre 300." },
      ],
      answer: 8,
      derivation: "(4400-2000)/300",
    },
    {
      type: "multiple-choice",
      id: "u2l5e3",
      conceptsUsed: [plantear.id, ecParentesis.id],
      difficulty: 2,
      prompt:
        "El perímetro de un rectángulo es 30 y su largo mide el doble del ancho. ¿Cuánto mide el ancho?",
      hints: [
        { level: 1, text: "Ancho $=w$; largo $=2w$. Perímetro: $2(w+2w)=30$." },
        { level: 2, text: "$2(3w)=6w=30$." },
        { level: 3, text: "$w=5$." },
      ],
      choices: [
        { id: "a", text: "$5$", isCorrect: true },
        {
          id: "b",
          text: "$10$",
          isCorrect: false,
          feedbackIfWrong:
            "Hallaste el LARGO: la pregunta pedía el ancho. Relee la pregunta antes de responder.",
        },
        {
          id: "c",
          text: "$7{,}5$",
          isCorrect: false,
          feedbackIfWrong:
            "Usaste perímetro $=$ largo $+$ ancho: faltó duplicar (perímetro del rectángulo suma los DOS pares de lados).",
        },
        {
          id: "d",
          text: "$15$",
          isCorrect: false,
          feedbackIfWrong:
            "Ese es el semiperímetro ($w+2w=15$ lleva a lo mismo, pero 15 no es ni ancho ni largo): termina de resolver.",
        },
      ],
    },
    {
      type: "multiple-choice",
      id: "u2l5e4",
      conceptsUsed: [plantear.id, ambosLados.id],
      difficulty: 2,
      prompt:
        "Ana tiene el triple de lo que tiene Beto; entre juntan 48. ¿Cuánto tiene Beto?",
      hints: [
        { level: 1, text: "Beto $=b$; Ana $=3b$; juntos: $b+3b=48$." },
        { level: 2, text: "$4b=48$; divide entre 4." },
      ],
      choices: [
        { id: "a", text: "$12$", isCorrect: true },
        {
          id: "b",
          text: "$16$",
          isCorrect: false,
          feedbackIfWrong:
            "Dividiste 48 entre 3: pero Beto es UNA parte de CUATRO totales ($b+3b$), no una de tres.",
        },
        {
          id: "c",
          text: "$36$",
          isCorrect: false,
          feedbackIfWrong:
            "Le asignaste a Beto el triple: la frase dice que el TRIPLE es de Ana.",
        },
        {
          id: "d",
          text: "$24$",
          isCorrect: false,
          feedbackIfWrong:
            "Partiste a la mitad: hay cuatro partes iguales ($b$ de Beto más $3b$ de Ana), no dos.",
        },
      ],
    },
    {
      type: "true-false",
      id: "u2l5e5",
      conceptsUsed: [plantear.id, variable.id],
      difficulty: 3,
      statement:
        'Si "la mitad de un número más 4 es 10", la ecuación correcta es $\\frac{n}{2}+4=10$.',
      answer: true,
      explanation:
        '"La mitad de n" es $n/2$; "más 4" suma 4; "es" impone la igualdad. Resolviendo: $n/2=6$ → $n=12$. Verifica: $12/2+4=10$ ✓.',
      hints: [{ level: 1, text: "Traduce fragmento por fragmento y compara." }],
    },
    {
      type: "numeric-input",
      id: "u2l5e6",
      conceptsUsed: [plantear.id, ec2p.id],
      difficulty: 3,
      prompt:
        "Siete veces un número, disminuido en 3, da 46. ¿Cuál es el número?",
      hints: [
        { level: 1, text: "Plantea $7n-3=46$." },
        { level: 2, text: "$7n=49$; divide entre 7." },
      ],
      answer: 7,
      derivation: "(46+3)/7",
    },
  ],
};

export const LESSON_U2L6: Lesson = {
  id: "u2-l6",
  title: "Desigualdades de un paso",
  conceptIdsTaught: [desig1p.id],
  intro: {
    hook: "Ya planteas y resuelves ecuaciones. Un ascensor admite máximo 8 personas: la carga debe ser MENOR O IGUAL que el límite, no exactamente igual. Así nacen las desigualdades.",
    intuition: [
      "Se resuelven casi igual que las ecuaciones — sumar y restar libremente, sin sorpresas.",
      "Pero hay una excepción crítica: al multiplicar o dividir por un número NEGATIVO, el sentido de la desigualdad se voltea.",
      "Compruébalo tú mismo: $3<5$; multiplica ambos por $-1$: $-3$ y $-5$... ahora $-3>-5$. El orden se invirtió.",
    ],
    definition:
      "Sumar o restar en ambos lados nunca cambia el sentido. Multiplicar o dividir por positivo lo conserva; por negativo, lo INVIERTE. La solución es un intervalo, no un solo número.",
    workedExamples: [
      "$x+3>7$: resto 3 → $x>4$ (sin voltear, porque resté).",
      "$-2x<8$: divido entre $-2$ → volteo el sentido → $x>-4$.",
    ],
  },
  guidedPractice: {
    problem: "$x-2>5$",
    steps: [
      {
        instruction: "Sumar en ambos lados nunca voltea la desigualdad.",
        result: "$x>5+2$",
      },
      {
        instruction: "Calcula el límite.",
        result: "$x>7$",
      },
    ],
    prompt:
      "Ahora resuélvelo tú: al resolver $-3x>12$, ¿cuál es el valor límite de x (el número, sin el símbolo de desigualdad)?",
    answer: -4,
    derivation: "12/(-3)",
  },
  commonMistakes: [
    "No voltear al dividir o multiplicar por negativo: $-2x<8$ no es $x<-4$.",
    "Voltear cuando no toca: sumar o restar nunca cambia el sentido de la desigualdad.",
  ],
  exercises: [
    {
      type: "multiple-choice",
      id: "u2l6e1",
      conceptsUsed: [desig1p.id],
      difficulty: 1,
      prompt: "Resuelve $x+3>7$.",
      hints: [
        {
          level: 1,
          text: "Resta 3 en ambos lados: restar NUNCA voltea la desigualdad.",
        },
        { level: 2, text: "$x>7-3$." },
      ],
      choices: [
        { id: "a", text: "$x>4$", isCorrect: true },
        {
          id: "b",
          text: "$x<4$",
          isCorrect: false,
          feedbackIfWrong:
            "Volteaste sin razón: SOLO se invierte al multiplicar o dividir por negativo.",
        },
        {
          id: "c",
          text: "$x>10$",
          isCorrect: false,
          feedbackIfWrong:
            "Pasaste el 3 sumando: al cruzar el signo de desigualdad, el término opera inverso ($7-3$).",
        },
        {
          id: "d",
          text: "$x\\geq 4$",
          isCorrect: false,
          feedbackIfWrong:
            "Confundiste $>$ con $\\geq$: aquí el 4 NO está incluido en la solución.",
        },
      ],
    },
    {
      type: "multiple-choice",
      id: "u2l6e2",
      conceptsUsed: [desig1p.id, intMult.id],
      difficulty: 1,
      prompt: "Resuelve $-2x<8$.",
      hints: [
        {
          level: 1,
          text: "Vas a dividir entre −2: ¡negativo! El sentido se VOLTEA.",
        },
        { level: 2, text: "$x > 8÷(-2)$ con el signo invertido." },
      ],
      choices: [
        { id: "a", text: "$x>-4$", isCorrect: true },
        {
          id: "b",
          text: "$x<-4$",
          isCorrect: false,
          feedbackIfWrong:
            "Dividiste bien entre $-2$ pero olvidaste VOLTEAR la desigualdad: es LA regla clave de esta lección.",
        },
        {
          id: "c",
          text: "$x<4$",
          isCorrect: false,
          feedbackIfWrong:
            "Doble error: perdiste el signo del cociente Y no volteaste la desigualdad.",
        },
        {
          id: "d",
          text: "$x>4$",
          isCorrect: false,
          feedbackIfWrong:
            "Volteaste bien, pero $8÷(-2)$ es negativo: $-4$, no $4$.",
        },
      ],
    },
    {
      type: "true-false",
      id: "u2l6e3",
      conceptsUsed: [desig1p.id],
      difficulty: 2,
      statement:
        "Al multiplicar ambos lados de $3<x$ por $-1$, la desigualdad correcta resulta $-3>x$.",
      answer: true,
      explanation:
        "Multiplicar por negativo invierte el sentido: $(-1)·3>(-1)·x$ → $-3>x$ (equivalente a $x<-3$). Comprobación: $4<5$ → $-4>-5$ ✓.",
      hints: [
        {
          level: 1,
          text: "Prueba con números: $3<5$ y multiplica ambos por $-1$.",
        },
      ],
    },
    {
      type: "multiple-choice",
      id: "u2l6e4",
      conceptsUsed: [desig1p.id],
      difficulty: 2,
      prompt: "¿Cuál de estos valores CUMPLE $x\\leq 5$?",
      hints: [
        { level: 1, text: "En $\\leq$ el valor límite SÍ está incluido." },
        { level: 2, text: "Busca un valor menor o igual que 5." },
      ],
      choices: [
        { id: "a", text: "$5$", isCorrect: true },
        {
          id: "b",
          text: "$6$",
          isCorrect: false,
          feedbackIfWrong: "6 excede el límite: no cumple $x\\leq 5$.",
        },
        {
          id: "c",
          text: "$5{,}1$",
          isCorrect: false,
          feedbackIfWrong:
            "Aunque parezca «casi 5», supera el límite y $\\leq$ no lo admite.",
        },
        {
          id: "d",
          text: "$7$",
          isCorrect: false,
          feedbackIfWrong: "Está muy por encima del límite permitido.",
        },
      ],
    },
    {
      type: "multiple-choice",
      id: "u2l6e5",
      conceptsUsed: [desig1p.id, ecFracciones.id],
      difficulty: 3,
      prompt: "Resuelve $-\\frac{x}{3}\\geq 2$.",
      hints: [
        {
          level: 1,
          text: "Multiplica ambos lados por $-3$: negativo → VOLTEA el sentido.",
        },
        { level: 2, text: "$x \\leq 2·(-3)$." },
        { level: 3, text: "$x\\leq -6$." },
      ],
      choices: [
        { id: "a", text: "$x\\leq -6$", isCorrect: true },
        {
          id: "b",
          text: "$x\\geq -6$",
          isCorrect: false,
          feedbackIfWrong:
            "Multiplicaste por negativo sin voltear: el sentido DEBE invertirse.",
        },
        {
          id: "c",
          text: "$x\\leq 6$",
          isCorrect: false,
          feedbackIfWrong: "Perdiste el signo del producto: $(−3)·2=−6$.",
        },
        {
          id: "d",
          text: "$x\\geq -\\frac{2}{3}$",
          isCorrect: false,
          feedbackIfWrong:
            "Dividiste entre 3 en vez de multiplicar: la x estaba dividida, su inverso es ×3 (con el −3 completo).",
        },
      ],
    },
    {
      type: "multiple-choice",
      id: "u2l6e6",
      conceptsUsed: [desig1p.id, jerarquia.id],
      difficulty: 3,
      prompt: "¿Cuál de estos valores NO es solución de $-3x>9$?",
      hints: [
        {
          level: 1,
          text: "Resuelve primero: divide entre $-3$ y voltearás el sentido → $x<-3$.",
        },
        { level: 2, text: "Busca el valor que NO sea menor que $-3$." },
      ],
      choices: [
        { id: "a", text: "$0$", isCorrect: true },
        {
          id: "b",
          text: "$-4$",
          isCorrect: false,
          feedbackIfWrong:
            "Sí es solución: $-3·(-4)=12>9$ ✓ (y además $-4<-3$).",
        },
        {
          id: "c",
          text: "$-10$",
          isCorrect: false,
          feedbackIfWrong: "Cumple: $-3·(-10)=30>9$ ✓.",
        },
        {
          id: "d",
          text: "$-3{,}5$",
          isCorrect: false,
          feedbackIfWrong:
            "Cumple: es menor que $-3$ y $-3·(-3{,}5)=10{,}5>9$ ✓.",
        },
      ],
    },
  ],
};
