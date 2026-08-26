import type { Lesson } from "@/features/content/schema";
import { CONCEPTS } from "./concepts";

const {
  variable,
  evaluar,
  distributiva,
  semejantes,
  ec1p,
  intSuma,
  intMult,
  jerarquia,
  potencias,
} = CONCEPTS;

export const LESSON_L5: Lesson = {
  id: "u1-l5",
  title: "Variables y expresiones algebraicas",
  conceptIdsTaught: [variable.id],
  intro: {
    hook: "Ya sabes calcular con números. ¿Y si el número aún no lo conoces? Ahí entra la variable: una letra que guarda un valor mientras lo descubres.",
    intuition: [
      'Piensa en la variable como una caja cerrada con etiqueta "x": adentro hay un número, pero el símbolo funciona igual sin importar cuál sea.',
      'La notación se abrevia: "el triple de n" se escribe $3n$ (sin signo de multiplicar); "a por b" se escribe $ab$.',
      'El orden de las palabras manda en las restas: "5 menos que x" es $x-5$ — a x le quitan 5. Pero "restar x de 5" es al revés: $5-x$.',
    ],
    definition:
      "Una expresión algebraica combina números, variables y operaciones. Convención: $3n=3\\cdot n$, $ab=a\\cdot b$. Para traducir frases, identifica primero quién recibe la acción.",
    workedExamples: [
      '"El doble de un número m, aumentado en 3" → $2m+3$.',
      '"El cociente de p entre 4" → $\\frac{p}{4}$: quien se menciona primero va en el numerador.',
    ],
  },
  guidedPractice: {
    problem: 'Traduce: "el triple de un número $n$, aumentado en 2"',
    steps: [
      {
        instruction: '"El triple de n" se escribe sin signo de multiplicar.',
        result: "$3n$",
      },
      {
        instruction: '"Aumentado en 2" suma 2 al final.',
        result: "$3n+2$",
      },
    ],
    prompt: "Si $n=4$, ¿cuánto vale $3n+2$? (Resuélvelo tú)",
    answer: 14,
    derivation: "(3*4)+2",
  },
  commonMistakes: [
    "Invertir «menos que»: «5 menos que x» es $x-5$, no $5-x$.",
    "Confundir $n^3$ (el cubo de n) con $3n$ (el triple de n) — son operaciones distintas.",
  ],
  exercises: [
    {
      type: "multiple-choice",
      id: "u1l5e1",
      conceptsUsed: [variable.id],
      difficulty: 1,
      prompt: '¿Qué expresión representa "el triple de un número $n$"?',
      hints: [
        { level: 1, text: "Triple significa tres veces." },
        {
          level: 2,
          text: "Tres veces n se escribe sin signo de multiplicación: $3n$.",
        },
      ],
      choices: [
        { id: "a", text: "$3n$", isCorrect: true },
        {
          id: "b",
          text: "$n^3$",
          isCorrect: false,
          feedbackIfWrong:
            'Eso es "n al cubo": multiplicación repetida, no el triple.',
        },
        {
          id: "c",
          text: "$n+3$",
          isCorrect: false,
          feedbackIfWrong:
            'Eso es "n más tres": el triple multiplica, no suma.',
        },
        {
          id: "d",
          text: "$3+n$",
          isCorrect: false,
          feedbackIfWrong:
            "Mismo error que sumar 3: el triple es una multiplicación ($3\\cdot n$).",
        },
      ],
    },
    {
      type: "multiple-choice",
      id: "u1l5e2",
      conceptsUsed: [variable.id],
      difficulty: 1,
      prompt: '"5 menos que $x$" se escribe:',
      hints: [
        {
          level: 1,
          text: '"Menos que" invierte el orden natural: a x le quitas 5.',
        },
        { level: 2, text: "Primero va x, después la resta de 5." },
      ],
      choices: [
        { id: "a", text: "$x-5$", isCorrect: true },
        {
          id: "b",
          text: "$5-x$",
          isCorrect: false,
          feedbackIfWrong:
            "Orden invertido: «5 menos que x» quita 5 DESDE x, así que x va primero.",
        },
        {
          id: "c",
          text: "$x+5$",
          isCorrect: false,
          feedbackIfWrong: "«Menos que» indica resta, no suma.",
        },
        {
          id: "d",
          text: "$5x$",
          isCorrect: false,
          feedbackIfWrong:
            "«5 menos que» no es «5 veces»: eso sería el quíntuple.",
        },
      ],
    },
    {
      type: "true-false",
      id: "u1l5e3",
      conceptsUsed: [variable.id],
      difficulty: 2,
      statement: '"La suma de $a$ y $b$" se puede escribir como $ab$.',
      answer: false,
      explanation:
        "$ab$ significa producto ($a\\cdot b$). La suma de $a$ y $b$ se escribe $a+b$. En álgebra, juntar letras implica multiplicar.",
      hints: [
        {
          level: 1,
          text: "Recuerda qué implica escribir dos variables pegadas.",
        },
      ],
    },
    {
      type: "multiple-choice",
      id: "u1l5e4",
      conceptsUsed: [variable.id],
      difficulty: 2,
      prompt: "El área de un rectángulo de base $b$ y altura $h$ se expresa:",
      hints: [{ level: 1, text: "Área del rectángulo = base por altura." }],
      choices: [
        { id: "a", text: "$bh$", isCorrect: true },
        {
          id: "b",
          text: "$b+h$",
          isCorrect: false,
          feedbackIfWrong:
            "Sumaste las dimensiones: el área requiere multiplicar base por altura.",
        },
        {
          id: "c",
          text: "$2(b+h)$",
          isCorrect: false,
          feedbackIfWrong: "Ese es el perímetro del rectángulo, no su área.",
        },
        {
          id: "d",
          text: "$bh/2$",
          isCorrect: false,
          feedbackIfWrong:
            "Dividir entre 2 es para el área del TRIÁNGULO; el rectángulo no se divide.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u1l5e5",
      conceptsUsed: [variable.id],
      difficulty: 3,
      prompt:
        "El perímetro de un cuadrado de lado $l$ es $4l$. ¿Cuánto vale si $l=7$?",
      hints: [
        { level: 1, text: "Sustituye l por 7 en $4l$ y calcula." },
        { level: 2, text: "$4·7$." },
      ],
      answer: 28,
      derivation: "4*7",
    },
    {
      type: "multiple-choice",
      id: "u1l5e6",
      conceptsUsed: [variable.id],
      difficulty: 3,
      prompt: '"El cociente de $m$ entre 3, aumentado en 1" se escribe:',
      hints: [
        {
          level: 1,
          text: '"Cociente de m entre 3" es $m/3$; "aumentado en 1" suma 1.',
        },
        {
          level: 2,
          text: "La suma afecta al cociente completo, no solo a un término interno.",
        },
      ],
      choices: [
        { id: "a", text: "$\\frac{m}{3}+1$", isCorrect: true },
        {
          id: "b",
          text: "$\\frac{3}{m}+1$",
          isCorrect: false,
          feedbackIfWrong:
            "Cociente invertido: «de m entre 3» pone a m como numerador.",
        },
        {
          id: "c",
          text: "$\\frac{m}{3+1}$",
          isCorrect: false,
          feedbackIfWrong:
            "Agrupaste mal: el +1 está FUERA del cociente, no dentro del denominador.",
        },
        {
          id: "d",
          text: "$m+\\frac{1}{3}$",
          isCorrect: false,
          feedbackIfWrong:
            "Dividiste al revés: es m quien se divide entre 3, no el 1.",
        },
      ],
    },
  ],
};

export const LESSON_L6: Lesson = {
  id: "u1-l6",
  title: "Evaluar expresiones por sustitución",
  conceptIdsTaught: [evaluar.id],
  intro: {
    hook: "Ya escribes expresiones con variables. Evaluarlas es responder: ¿cuánto valen si ya sabes el número? Un taxi cobra $3v+2$; si viajaste $v=4$ veces, pagas $3\\cdot4+2=14$.",
    intuition: [
      "Sustituir es reemplazar cada letra por su valor, SIEMPRE entre paréntesis si es negativo: evita errores de signo.",
      "Después de sustituir, aplica la jerarquía que ya conoces — nada cambia.",
      "Cuidado con los exponentes: en $2a^2$, el cuadrado eleva solo a la letra, no al coeficiente que la acompaña.",
    ],
    definition:
      "Evaluar una expresión en $x=k$ es sustituir cada $x$ por $k$ (usando paréntesis) y simplificar con la jerarquía habitual.",
    workedExamples: [
      "$3x+2$ con $x=4$: $(3\\cdot4)+2=14$.",
      "$2a^2$ con $a=3$: $2\\cdot(3^2)=2\\cdot9=18$ — el 3 se eleva antes de multiplicar por 2.",
    ],
  },
  guidedPractice: {
    problem: "Evalúa $2x+1$ cuando $x=5$.",
    steps: [
      {
        instruction: "Sustituye x por 5, entre paréntesis.",
        result: "$(2\\cdot5)+1$",
      },
      {
        instruction: "Multiplica primero, luego suma.",
        result: "$10+1=11$",
      },
    ],
    prompt: "Ahora resuélvelo tú: evalúa $4y-3$ cuando $y=2$.",
    answer: 5,
    derivation: "(4*2)-3",
  },
  commonMistakes: [
    "Elevar el coeficiente junto con la letra: $2a^2$ con $a=3$ NO es $(2\\cdot3)^2$.",
    "Sustituir negativos sin paréntesis: en $y-7$ con $y=-3$, calcula $(-3)-7$, con cuidado del signo.",
  ],
  exercises: [
    {
      type: "numeric-input",
      id: "u1l6e1",
      conceptsUsed: [evaluar.id, variable.id],
      difficulty: 1,
      prompt: "Evalúa $3x+2$ cuando $x=4$.",
      hints: [
        { level: 1, text: "Sustituye: $(3·4)+2$." },
        { level: 2, text: "Producto primero: $12+2$." },
      ],
      answer: 14,
      derivation: "(3*4)+2",
    },
    {
      type: "numeric-input",
      id: "u1l6e2",
      conceptsUsed: [evaluar.id, variable.id, intSuma.id],
      difficulty: 1,
      prompt: "Evalúa $y-7$ cuando $y=-3$.",
      hints: [
        { level: 1, text: "Sustituye con paréntesis: $(-3)-7$." },
        { level: 2, text: "$(-3)-7=(-3)+(-7)$: ambos negativos, se acumulan." },
      ],
      answer: -10,
      derivation: "(-3)-7",
    },
    {
      type: "multiple-choice",
      id: "u1l6e3",
      conceptsUsed: [evaluar.id, potencias.id],
      difficulty: 2,
      prompt: "Evalúa $2a^2$ cuando $a=3$.",
      hints: [
        {
          level: 1,
          text: "El exponente afecta solo a a: calcula $3^2$ primero.",
        },
        { level: 2, text: "$2·(3^2)=2·9$." },
      ],
      choices: [
        { id: "a", text: "$18$", isCorrect: true },
        {
          id: "b",
          text: "$36$",
          isCorrect: false,
          feedbackIfWrong:
            "Elevaste $(2·3)^2$: el cuadrado afecta SOLO a la variable, no al coeficiente.",
        },
        {
          id: "c",
          text: "$12$",
          isCorrect: false,
          feedbackIfWrong:
            "Multiplicaste antes de elevar: jerarquía dice potencia primero.",
        },
        {
          id: "d",
          text: "$11$",
          isCorrect: false,
          feedbackIfWrong: "Sumaste 2 y 9: el 2 multiplica, no suma.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u1l6e4",
      conceptsUsed: [evaluar.id, jerarquia.id],
      difficulty: 2,
      prompt:
        "Evalúa $\\dfrac{x+y}{2}$ cuando $x=5$ e $y=-1$. (Es el promedio de ambos.)",
      hints: [
        {
          level: 1,
          text: "Sustituye: $((5)+(-1))/2$: primero el numerador completo.",
        },
        { level: 2, text: "Numerador: $5-1=4$; luego divide entre 2." },
      ],
      answer: 2,
      derivation: "((5)+(-1))/2",
    },
    {
      type: "multiple-choice",
      id: "u1l6e5",
      conceptsUsed: [evaluar.id, potencias.id],
      difficulty: 3,
      prompt: "Evalúa $-x^2$ cuando $x=4$.",
      hints: [
        {
          level: 1,
          text: "Sin paréntesis, el signo negativo NO se eleva: es $-(x^2)$.",
        },
        { level: 2, text: "$-(4^2)=-(16)$." },
      ],
      choices: [
        { id: "a", text: "$-16$", isCorrect: true },
        {
          id: "b",
          text: "$16$",
          isCorrect: false,
          feedbackIfWrong:
            "Perdiste el signo: $-x^2$ sin paréntesis es lo mismo que $-(x^2)$. Sería $16$ solo si fuera $(-x)^2$.",
        },
        {
          id: "c",
          text: "$-8$",
          isCorrect: false,
          feedbackIfWrong:
            "Multiplicaste $-2·4$: aquí no hay coeficiente 2, hay una potencia.",
        },
        {
          id: "d",
          text: "$8$",
          isCorrect: false,
          feedbackIfWrong:
            "Calculaste $4·2$: la operación es elevar al cuadrado, luego aplicar el signo.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u1l6e6",
      conceptsUsed: [evaluar.id, intMult.id],
      difficulty: 3,
      prompt: "Evalúa $5-2n$ cuando $n=-3$.",
      hints: [
        { level: 1, text: "Sustituye con paréntesis: $5-2(-3)$." },
        { level: 2, text: "$2(-3)=-6$; luego $5-(-6)$, que es $5+6$." },
      ],
      answer: 11,
      derivation: "5-(2*(-3))",
    },
  ],
};

export const LESSON_L7: Lesson = {
  id: "u1-l7",
  title: "Distributiva y términos semejantes",
  conceptIdsTaught: [distributiva.id, semejantes.id],
  intro: {
    hook: "Compras 3 bolsas idénticas, cada una con x manzanas y 4 naranjas: en total tienes $3x+12$ frutas, sin abrir ninguna bolsa. Eso es la propiedad distributiva trabajando por ti.",
    intuition: [
      "Distribuir es repartir el factor de afuera a CADA término de adentro: $a(b+c)=ab+ac$.",
      "Términos semejantes tienen la MISMA parte variable: $5x$ y $2x$ son semejantes; $5x$ y $2y$, no.",
      "Combinar semejantes es sumar sus coeficientes y dejar la variable intacta: $5x+2x=(5+2)x=7x$, igual que 5 manzanas más 2 manzanas son 7 manzanas.",
    ],
    definition:
      "$a(b+c)=ab+ac$. Dos términos son semejantes si difieren solo en el coeficiente; solo esos se pueden sumar o restar entre sí.",
    workedExamples: [
      "$3(x+4)=3x+12$: el 3 multiplica a los dos términos, no solo al primero.",
      "$7a-3a+2=(7-3)a+2=4a+2$: el $+2$ no tiene pareja semejante, así que se queda como está.",
    ],
  },
  guidedPractice: {
    problem: "Simplifica $2(x+3)$.",
    steps: [
      {
        instruction: "Distribuye el 2 a ambos términos.",
        result: "$2x+6$",
      },
      {
        instruction:
          "No hay términos semejantes que combinar; ya está simplificado.",
        result: "$2x+6$",
      },
    ],
    prompt: "Ahora resuélvelo tú: si $x=4$, ¿cuánto vale $2(x+3)$?",
    answer: 14,
    derivation: "2*(4+3)",
  },
  commonMistakes: [
    "Distribuir sobre un solo término: $3(x+4)$ no es $3x+4$; el 3 también multiplica al 4.",
    "Combinar términos que NO son semejantes: $5x+2x^2$ no se reduce a $7x$ ni a $7x^2$ — se quedan separados.",
  ],
  exercises: [
    {
      type: "multiple-choice",
      id: "u1l7e1",
      conceptsUsed: [distributiva.id, variable.id],
      difficulty: 1,
      prompt: "¿A qué equivale $3(x+4)$?",
      hints: [
        {
          level: 1,
          text: "El 3 multiplica a AMBOS términos dentro del paréntesis.",
        },
        { level: 2, text: "$3x$ más $3·4$." },
      ],
      choices: [
        { id: "a", text: "$3x+12$", isCorrect: true },
        {
          id: "b",
          text: "$3x+4$",
          isCorrect: false,
          feedbackIfWrong:
            "Distribuiste solo sobre el primer término: el 3 también multiplica al 4.",
        },
        {
          id: "c",
          text: "$3x+7$",
          isCorrect: false,
          feedbackIfWrong:
            "Sumaste 3+4 dentro del paréntesis antes de distribuir; la distributiva multiplica, no agrupa así.",
        },
        {
          id: "d",
          text: "$x+12$",
          isCorrect: false,
          feedbackIfWrong:
            "El 3 no multiplicó a la x: debe multiplicar a todos los términos.",
        },
      ],
    },
    {
      type: "multiple-choice",
      id: "u1l7e2",
      conceptsUsed: [semejantes.id],
      difficulty: 1,
      prompt: "Simplifica $5x+2x$.",
      hints: [
        {
          level: 1,
          text: "Son términos semejantes: opera solo los coeficientes.",
        },
        { level: 2, text: "$(5+2)x$." },
      ],
      choices: [
        { id: "a", text: "$7x$", isCorrect: true },
        {
          id: "b",
          text: "$10x$",
          isCorrect: false,
          feedbackIfWrong:
            "Multiplicaste 5·2: combinar semejantes SUMA los coeficientes, no los multiplica.",
        },
        {
          id: "c",
          text: "$10x^2$",
          isCorrect: false,
          feedbackIfWrong:
            "Además de multiplicar coeficientes, elevaste la variable: x sigue siendo x.",
        },
        {
          id: "d",
          text: "$3x$",
          isCorrect: false,
          feedbackIfWrong: "Restaste 5−2: la expresión indica suma (+2x).",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u1l7e3",
      conceptsUsed: [distributiva.id],
      difficulty: 2,
      prompt:
        "Usa la distributiva para calcular $2(6+5)$ como $2·6+2·5$. ¿Cuánto da?",
      hints: [
        { level: 1, text: "$2·6$ más $2·5$." },
        { level: 2, text: "$12+10$." },
      ],
      answer: 22,
      derivation: "(2*6)+(2*5)",
    },
    {
      type: "multiple-choice",
      id: "u1l7e4",
      conceptsUsed: [semejantes.id],
      difficulty: 2,
      prompt: "Simplifica $7a-3a+2$.",
      hints: [
        { level: 1, text: "Solo $7a$ y $-3a$ son semejantes; el 2 va aparte." },
        { level: 2, text: "$(7-3)a+2$." },
      ],
      choices: [
        { id: "a", text: "$4a+2$", isCorrect: true },
        {
          id: "b",
          text: "$4a$",
          isCorrect: false,
          feedbackIfWrong:
            "Perdiste el $+2$: no es semejante a los demás, pero tampoco desaparece.",
        },
        {
          id: "c",
          text: "$6a+2$",
          isCorrect: false,
          feedbackIfWrong: "Restaste mal: $7-3=4$, no 6.",
        },
        {
          id: "d",
          text: "$10a+2$",
          isCorrect: false,
          feedbackIfWrong:
            "Sumaste 7+3: el signo de $-3a$ es negativo, corresponde restar.",
        },
      ],
    },
    {
      type: "true-false",
      id: "u1l7e5",
      conceptsUsed: [semejantes.id],
      difficulty: 3,
      statement: "$4x$ y $3y$ son términos semejantes.",
      answer: false,
      explanation:
        "Para ser semejantes necesitan la MISMA parte variable: x e y son distintas, así que nunca se combinan entre sí.",
      hints: [
        { level: 1, text: "Compara la parte variable de ambos términos." },
      ],
    },
    {
      type: "numeric-input",
      id: "u1l7e6",
      conceptsUsed: [distributiva.id, evaluar.id],
      difficulty: 3,
      prompt:
        "Aplica la distributiva en $-2(3x-5)$ y evalúa el resultado cuando $x=2$.",
      hints: [
        { level: 1, text: "Distribuye: $-6x+10$; luego sustituye x=2." },
        { level: 2, text: "$-6·2+10=-12+10$." },
        { level: 3, text: "Directamente: $-2(6-5)=-2·1$." },
      ],
      answer: -2,
      derivation: "(-2)*(((3*(2)))-(5))",
    },
  ],
};

export const LESSON_L8: Lesson = {
  id: "u1-l8",
  title: "Ecuaciones de un paso",
  conceptIdsTaught: [ec1p.id],
  intro: {
    hook: "Imagina una balanza en equilibrio: de un lado $x+5$, del otro $12$. Para descubrir cuánto vale x sin romper el equilibrio, haces lo mismo en ambos platos.",
    intuition: [
      "Resolver una ecuación es despejar x: aplicas la operación INVERSA a ambos lados por igual.",
      "Si ves $x+5=12$: lo opuesto de «+5» es «−5». Réstale 5 a los dos lados.",
      "Verifica siempre sustituyendo tu respuesta en la ecuación original — si no se cumple, algo salió mal en el camino.",
    ],
    definition:
      "Una ecuación de un paso se resuelve aplicando la operación inversa en ambos lados hasta dejar sola a $x$: suma↔resta, multiplicación↔división.",
    workedExamples: [
      "$x+5=12$: resto 5 en ambos lados → $x=7$. Verificación: $7+5=12$ ✓.",
      "$4x=20$: divido ambos lados entre 4 → $x=5$. Verificación: $4\\cdot5=20$ ✓.",
    ],
  },
  guidedPractice: {
    problem: "$x+7=15$",
    steps: [
      {
        instruction: "El inverso de «+7» es «−7»: réstalo en ambos lados.",
        result: "$x=15-7$",
      },
      {
        instruction: "Calcula.",
        result: "$x=8$",
      },
    ],
    prompt: "Ahora resuélvelo tú: ¿cuánto vale $x$ en $x-4=9$?",
    answer: 13,
    derivation: "9+4",
  },
  commonMistakes: [
    "Operar solo un lado de la balanza: rompe el equilibrio y da una respuesta falsa.",
    "Usar la operación directa en vez de la inversa: en $x+5=12$, sumar otro 5 en lugar de restarlo.",
  ],
  exercises: [
    {
      type: "number-line",
      id: "u1l8e0",
      conceptsUsed: [ec1p.id],
      difficulty: 1,
      prompt: "Ubica en la recta numérica la solución de $x+5=12$.",
      min: 0,
      max: 20,
      step: 1,
      answer: 7,
      derivation: "12-5",
      hints: [
        { level: 1, text: "Resta 5 en ambos lados: $x=12-5$." },
        { level: 2, text: "$12-5=7$." },
      ],
    },
    {
      type: "multiple-choice",
      id: "u1l8e1",
      conceptsUsed: [ec1p.id, intSuma.id],
      difficulty: 1,
      prompt: "Resuelve $x+5=12$.",
      hints: [
        {
          level: 1,
          text: "Para despejar x, aplica la operación inversa de «+5» en ambos lados.",
        },
        { level: 2, text: "Resta 5 a ambos lados: $x=12-5$." },
      ],
      choices: [
        { id: "a", text: "$x=7$", isCorrect: true },
        {
          id: "b",
          text: "$x=17$",
          isCorrect: false,
          feedbackIfWrong:
            "Sumaste 5 en lugar de restarlo: para despejar usas la operación INVERSA.",
        },
        {
          id: "c",
          text: "$x=-7$",
          isCorrect: false,
          feedbackIfWrong: "Error de signo: $12-5$ es positivo.",
        },
        {
          id: "d",
          text: "$x=60$",
          isCorrect: false,
          feedbackIfWrong:
            "Multiplicaste por 5: la operación de la ecuación es una suma, su inversa es restar.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u1l8e2",
      conceptsUsed: [ec1p.id, intSuma.id],
      difficulty: 1,
      prompt: "Resuelve $x-3=10$.",
      hints: [
        { level: 1, text: "El inverso de «−3» es «+3»: súmalo a ambos lados." },
        { level: 2, text: "$x=10+3$." },
      ],
      answer: 13,
      derivation: "(10)+(3)",
    },
    {
      type: "multiple-choice",
      id: "u1l8e3",
      conceptsUsed: [ec1p.id, intMult.id],
      difficulty: 2,
      prompt: "Resuelve $4x=20$.",
      hints: [
        {
          level: 1,
          text: "x está multiplicado por 4: divide ambos lados entre 4.",
        },
        { level: 2, text: "$x=20÷4$." },
      ],
      choices: [
        { id: "a", text: "$x=5$", isCorrect: true },
        {
          id: "b",
          text: "$x=80$",
          isCorrect: false,
          feedbackIfWrong:
            "Multiplicaste por 4: el despeje de «·4» es dividir entre 4.",
        },
        {
          id: "c",
          text: "$x=16$",
          isCorrect: false,
          feedbackIfWrong: "Restaste 4: el inverso de multiplicar es DIVIDIR.",
        },
        {
          id: "d",
          text: "$x=24$",
          isCorrect: false,
          feedbackIfWrong:
            "Sumaste 4: la operación inversa de «·4» es la división.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u1l8e4",
      conceptsUsed: [ec1p.id],
      difficulty: 2,
      prompt: "Resuelve $\\dfrac{x}{3}=6$.",
      hints: [
        {
          level: 1,
          text: "x está dividido entre 3: multiplica ambos lados por 3.",
        },
        { level: 2, text: "$x=3·6$." },
      ],
      answer: 18,
      derivation: "3*6",
    },
    {
      type: "multiple-choice",
      id: "u1l8e5",
      conceptsUsed: [ec1p.id, intSuma.id],
      difficulty: 3,
      prompt: "Resuelve $-2+x=-9$.",
      hints: [
        {
          level: 1,
          text: "El −2 está sumado: su inverso es +2. Súmalo a ambos lados.",
        },
        {
          level: 2,
          text: "$x=-9+2$: dos negativos... ojo, aquí el 2 es positivo.",
        },
        { level: 3, text: "De −9 avanzas 2 hacia la derecha: $−9+2$." },
      ],
      choices: [
        { id: "a", text: "$x=-7$", isCorrect: true },
        {
          id: "b",
          text: "$x=7$",
          isCorrect: false,
          feedbackIfWrong:
            "Perdiste el signo: $-9+2$ queda en territorio negativo.",
        },
        {
          id: "c",
          text: "$x=-11$",
          isCorrect: false,
          feedbackIfWrong:
            "Sumaste $-9-2$: pero el +2 que añades para despejar es positivo.",
        },
        {
          id: "d",
          text: "$x=11$",
          isCorrect: false,
          feedbackIfWrong:
            "Doble error de signo al despejar: revisa $-9+2$ paso a paso.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u1l8e6",
      conceptsUsed: [ec1p.id, intMult.id],
      difficulty: 3,
      prompt: "Resuelve $6x=-42$.",
      hints: [
        {
          level: 1,
          text: "Divide ambos lados entre 6, conservando la regla de signos.",
        },
        { level: 2, text: "$x=(-42)÷6$: signos distintos → negativo." },
      ],
      answer: -7,
      derivation: "((-42))/6",
    },
  ],
};
