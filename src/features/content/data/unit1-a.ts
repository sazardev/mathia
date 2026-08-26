import type { Lesson } from "@/features/content/schema";
import { CONCEPTS } from "./concepts";

const { intSuma, intMult, potencias, jerarquia } = CONCEPTS;

export const LESSON_L1: Lesson = {
  id: "u1-l1",
  title: "Sumar y restar enteros",
  conceptIdsTaught: [intSuma.id],
  intro: {
    hook: "Vives en el piso −2 de un edificio (dos plantas bajo tierra) y subes 9 pisos en el ascensor. ¿En qué piso quedas? Sumar números con signo es justo eso: contar pasos en una recta.",
    intuition: [
      "Dibuja una recta: los negativos a la izquierda del 0, los positivos a la derecha. Sumar te mueve a la derecha; restar, a la izquierda.",
      "Atajo sin dibujar nada: si los signos son distintos, resta los valores absolutos y quédate con el signo del número más grande. $-4+9$: $9-4=5$, y como el $9$ manda, el resultado es $+5$.",
      "Restar un negativo es como cancelar una deuda: te la quitan de encima, así que en realidad suma. $6-(-3)=6+3=9$.",
    ],
    definition:
      'Signos iguales: suma los valores absolutos y conserva el signo. Signos distintos: resta el menor del mayor y usa el signo del que "pesa" más. Restar equivale a sumar el opuesto: $a-b=a+(-b)$.',
    workedExamples: [
      "$-7+12$: signos distintos, así que $12-7=5$; como el $12$ es mayor y positivo, el resultado es $5$.",
      "$6-(-3)$: restar un negativo es sumar → $6+3=9$.",
    ],
  },
  guidedPractice: {
    problem: "$-5+8$",
    steps: [
      {
        instruction:
          "Los signos son distintos (−5 negativo, 8 positivo): resta los valores absolutos.",
        result: "$8-5=3$",
      },
      {
        instruction:
          "El resultado toma el signo del número con mayor valor absoluto (el 8, positivo).",
        result: "Resultado: $+3$",
      },
    ],
    prompt: "Ahora resuélvelo tú: ¿cuánto es $-6+10$?",
    answer: 4,
    derivation: "(-6)+10",
  },
  commonMistakes: [
    "Pensar que signos distintos siempre dan negativo: $-4+9=5$, no $-13$ — depende de cuál valor absoluto es mayor.",
    "Olvidar que restar un negativo se convierte en suma: $-6-(-10)$ es $-6+10=4$, no $-16$.",
  ],
  exercises: [
    {
      type: "number-line",
      id: "u1l1e0",
      conceptsUsed: [intSuma.id],
      difficulty: 1,
      prompt: "Ubica en la recta numérica el resultado de $-4+9$.",
      min: -10,
      max: 10,
      step: 1,
      answer: 5,
      derivation: "(-4)+9",
      hints: [
        {
          level: 1,
          text: "Ubica $-4$ en la recta y cuenta 9 pasos hacia la derecha.",
        },
        {
          level: 2,
          text: "Signos distintos: resta $9-4$ y usa el signo del mayor (positivo).",
        },
      ],
    },
    {
      type: "multiple-choice",
      id: "u1l1e1",
      conceptsUsed: [intSuma.id],
      difficulty: 1,
      prompt: "¿Cuánto es $-4+9$?",
      hints: [
        {
          level: 1,
          text: "Ubica $-4$ en la recta numérica y avanza 9 pasos hacia la derecha.",
        },
        { level: 2, text: "De 9 restale 4, porque los signos son distintos." },
        {
          level: 3,
          text: "Como el 9 es mayor en valor absoluto y es positivo, el resultado es positivo: $9-4$.",
        },
      ],
      choices: [
        { id: "a", text: "$5$", isCorrect: true },
        {
          id: "b",
          text: "$-13$",
          isCorrect: false,
          feedbackIfWrong:
            "Sumaste valores absolutos como si ambos fueran negativos. Con signos distintos se resta el menor del mayor.",
        },
        {
          id: "c",
          text: "$13$",
          isCorrect: false,
          feedbackIfWrong:
            "Ignoraste el signo del $-4$. El valor absoluto menor se resta, no se suma.",
        },
        {
          id: "d",
          text: "$-5$",
          isCorrect: false,
          feedbackIfWrong:
            "Elegiste el signo del término menor ($-4$). El resultado toma el signo del de mayor valor absoluto (+9).",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u1l1e2",
      conceptsUsed: [intSuma.id],
      difficulty: 1,
      prompt: "Calcula $8-15$.",
      hints: [
        { level: 1, text: "$8-15$ es lo mismo que $8+(-15)$." },
        {
          level: 2,
          text: "Signos distintos: resta $15-8$ y conserva el signo del mayor.",
        },
        {
          level: 3,
          text: "El mayor en valor absoluto es 15 (negativo), así que el resultado es negativo.",
        },
      ],
      answer: -7,
      derivation: "8-(15)",
    },
    {
      type: "multiple-choice",
      id: "u1l1e3",
      conceptsUsed: [intSuma.id],
      difficulty: 2,
      prompt:
        "La temperatura es de $-3\\,^\\circ\\mathrm{C}$ y sube $8\\,^\\circ\\mathrm{C}$. ¿Cuál es la temperatura final?",
      hints: [
        { level: 1, text: '"Subir" significa sumar: $-3+8$.' },
        {
          level: 2,
          text: "Con signos distintos, calcula $8-3$ y usa el signo del mayor.",
        },
      ],
      choices: [
        { id: "a", text: "$5\\,^\\circ\\mathrm{C}$", isCorrect: true },
        {
          id: "b",
          text: "$-11\\,^\\circ\\mathrm{C}$",
          isCorrect: false,
          feedbackIfWrong:
            "Trataste la subida como bajada: sumar una subida acerca al cero desde negativos, no aleja.",
        },
        {
          id: "c",
          text: "$11\\,^\\circ\\mathrm{C}$",
          isCorrect: false,
          feedbackIfWrong:
            "Ignoraste que la temperatura inicial era negativa; no puedes sumar valores absolutos aquí.",
        },
        {
          id: "d",
          text: "$-5\\,^\\circ\\mathrm{C}$",
          isCorrect: false,
          feedbackIfWrong:
            "El resultado tomó el signo del número menor. Debe tomar el del de mayor valor absoluto (+8).",
        },
      ],
    },
    {
      type: "true-false",
      id: "u1l1e4",
      conceptsUsed: [intSuma.id],
      difficulty: 2,
      statement: "Es cierto que $-6-(-10)=4$.",
      answer: true,
      explanation:
        "Restar un negativo equivale a sumar su opuesto: $-6+10=4$. Es uno de los errores más comunes creer que queda $-16$ o $-4$.",
      hints: [
        { level: 1, text: "Restar $(-10)$ es lo mismo que sumar $+10$." },
        {
          level: 2,
          text: "$-6+10$: signos distintos, calcula $10-6$ con signo positivo.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u1l1e5",
      conceptsUsed: [intSuma.id],
      difficulty: 3,
      prompt:
        "Un ascensor parte del piso 2, baja 7 pisos y luego sube 4. ¿En qué piso queda?",
      hints: [
        { level: 1, text: "Traduce: $2-7+4$." },
        { level: 2, text: "Primero $2-7=-5$; luego súmale 4." },
      ],
      answer: -1,
      derivation: "(2-7)+4",
    },
    {
      type: "numeric-input",
      id: "u1l1e6",
      conceptsUsed: [intSuma.id],
      difficulty: 3,
      prompt: "Calcula $(-12)-(-20)+(-5)$.",
      hints: [
        {
          level: 1,
          text: "Transforma las restas de negativos: $(-12)+20+(-5)$.",
        },
        { level: 2, text: "Primero $-12+20=8$; después réstale 5." },
        { level: 3, text: "Resultado parcial 8, luego $8-5=3$." },
      ],
      answer: 3,
      derivation: "((-12)-(-20))+(-5)",
    },
  ],
};

export const LESSON_L2: Lesson = {
  id: "u1-l2",
  title: "Multiplicar y dividir enteros",
  conceptIdsTaught: [intMult.id],
  intro: {
    hook: "Ya sabes sumar y restar números con signo. Multiplicarlos y dividirlos es incluso más simple: solo cuentas cuántos signos negativos hay.",
    intuition: [
      "Cuenta los negativos en la operación: si son un número par (0, 2, 4...), el resultado es positivo; si son impares, negativo.",
      "Piensa en deudas: quitarte 3 deudas de 6 —es decir, $(-3)\\cdot(-6)$— te hace ganar, por eso da positivo: $18$.",
      "La división obedece exactamente la misma regla de signos que la multiplicación.",
    ],
    definition:
      "Mismo signo → producto (o cociente) positivo. Distinto signo → negativo. El valor absoluto se multiplica o divide normalmente.",
    workedExamples: [
      "$(-5)\\cdot4$: signos distintos → negativo. $5\\cdot4=20$, resultado $-20$.",
      "$(-24)\\div(-3)$: mismo signo → positivo. $24\\div3=8$.",
    ],
  },
  guidedPractice: {
    problem: "$(-4)\\cdot5$",
    steps: [
      {
        instruction:
          "Cuenta los signos negativos: hay uno solo (impar) → el resultado será negativo.",
        result: "Signo: negativo.",
      },
      {
        instruction: "Multiplica los valores absolutos.",
        result: "$4\\cdot5=20$, así que $(-4)\\cdot5=-20$.",
      },
    ],
    prompt: "Ahora resuélvelo tú: ¿cuánto es $(-6)\\cdot(-3)$?",
    answer: 18,
    derivation: "(-6)*(-3)",
  },
  commonMistakes: [
    "Invertir la regla: pensar que $(-3)\\cdot(-6)$ da negativo — dos negativos se cancelan y dan positivo.",
    "Mezclar suma con multiplicación: $x+x$ es $2x$ (se suman), pero $x\\cdot x$ es $x^2$ (se multiplican) — son operaciones distintas.",
  ],
  exercises: [
    {
      type: "multiple-choice",
      id: "u1l2e1",
      conceptsUsed: [intMult.id],
      difficulty: 1,
      prompt: "¿Cuánto es $(-3)\\cdot(-6)$?",
      hints: [
        { level: 1, text: "Aplica la regla de signos: mismo signo." },
        {
          level: 2,
          text: "Mismo signo → resultado positivo. Multiplica $3·6$.",
        },
      ],
      choices: [
        { id: "a", text: "$18$", isCorrect: true },
        {
          id: "b",
          text: "$-18$",
          isCorrect: false,
          feedbackIfWrong:
            "Invertiste la regla de signos: dos negativos multiplicados dan positivo.",
        },
        {
          id: "c",
          text: "$-9$",
          isCorrect: false,
          feedbackIfWrong: "Sumaste los números en lugar de multiplicarlos.",
        },
        {
          id: "d",
          text: "$9$",
          isCorrect: false,
          feedbackIfWrong:
            "Sumaste valores absolutos. Aquí la operación es multiplicación: $3·6=18$.",
        },
      ],
    },
    {
      type: "multiple-choice",
      id: "u1l2e2",
      conceptsUsed: [intMult.id],
      difficulty: 1,
      prompt: "¿Cuánto es $36 \\div (-4)$?",
      hints: [
        {
          level: 1,
          text: "División sigue la misma regla de signos que la multiplicación.",
        },
        { level: 2, text: "Signos distintos → negativo. Divide $36÷4$." },
      ],
      choices: [
        { id: "a", text: "$-9$", isCorrect: true },
        {
          id: "b",
          text: "$9$",
          isCorrect: false,
          feedbackIfWrong:
            "Olvidaste el signo: divisor y dividendo tienen signos distintos, el cociente es negativo.",
        },
        {
          id: "c",
          text: "$-8$",
          isCorrect: false,
          feedbackIfWrong: "Casi: el cociente correcto de $36÷4$ es 9, no 8.",
        },
        {
          id: "d",
          text: "$-32$",
          isCorrect: false,
          feedbackIfWrong: "Restaste en lugar de dividir.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u1l2e3",
      conceptsUsed: [intMult.id],
      difficulty: 2,
      prompt: "Calcula $(-5)\\cdot 4 \\cdot (-2)$.",
      hints: [
        {
          level: 1,
          text: "Multiplica de izquierda a derecha aplicando la regla de signos dos veces.",
        },
        { level: 2, text: "$(−5)·4=−20$; luego $(−20)·(−2)$." },
        { level: 3, text: "Negativo por negativo da positivo: $20·2=40$." },
      ],
      answer: 40,
      derivation: "((-5)*4)*(-2)",
    },
    {
      type: "true-false",
      id: "u1l2e4",
      conceptsUsed: [intMult.id],
      difficulty: 2,
      statement: "El producto de dos enteros negativos siempre es positivo.",
      answer: true,
      explanation:
        "Por la regla de signos: mismo signo → producto positivo. Esto vale para cualquier par de negativos.",
      hints: [
        { level: 1, text: "Piensa en $(−2)·(−3)$ y en la regla de signos." },
      ],
    },
    {
      type: "numeric-input",
      id: "u1l2e5",
      conceptsUsed: [intMult.id],
      difficulty: 3,
      prompt: "Calcula $((-24)\\div(-3))-(-2)$.",
      hints: [
        {
          level: 1,
          text: "Resuelve primero la división: mismo signo → positivo.",
        },
        { level: 2, text: "$(−24)÷(−3)=8$; luego $8−(−2)=8+2$." },
      ],
      answer: 10,
      derivation: "((-24)/(-3))-(-2)",
    },
    {
      type: "order-steps",
      id: "u1l2e6",
      conceptsUsed: [intMult.id],
      difficulty: 3,
      prompt: "Ordena los pasos para calcular $(-2)\\cdot(-3)\\cdot(-4)$.",
      steps: [
        {
          id: "s1",
          text: "Cuenta los signos negativos: hay tres (impar) → el resultado final será negativo.",
        },
        {
          id: "s2",
          text: "Multiplica los valores absolutos: $2\\cdot3\\cdot4=24$.",
        },
        { id: "s3", text: "Aplica el signo: el resultado es $-24$." },
      ],
      correctOrder: ["s1", "s2", "s3"],
      hints: [
        {
          level: 1,
          text: "Primero decide el signo del resultado, después calcula el valor.",
        },
        {
          level: 2,
          text: "Con tres negativos (impar), el resultado final es negativo.",
        },
      ],
    },
    {
      type: "match-pairs",
      id: "u1l2e7",
      conceptsUsed: [intMult.id],
      difficulty: 3,
      prompt: "Relaciona cada operación con el signo de su resultado.",
      pairs: [
        { left: "$(-3)\\cdot(-5)$", right: "Positivo" },
        { left: "$(-8)\\div 2$", right: "Negativo" },
        { left: "$4\\cdot(-7)$", right: "Negativo" },
        { left: "$(-15)\\div(-3)$", right: "Positivo" },
      ],
      hints: [
        {
          level: 1,
          text: "Mismo signo en ambos factores → positivo. Signos distintos → negativo.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u1l2e8",
      conceptsUsed: [intMult.id],
      difficulty: 3,
      prompt: "Calcula $(-6)\\cdot(-2)\\cdot(-1)\\cdot 3$.",
      hints: [
        {
          level: 1,
          text: "Multiplica de izquierda a derecha, dos factores a la vez.",
        },
        { level: 2, text: "$(-6)\\cdot(-2)=12$; luego $12\\cdot(-1)=-12$." },
        { level: 3, text: "Finalmente $-12\\cdot3$." },
      ],
      answer: -36,
      derivation: "(((-6)*(-2))*(-1))*3",
    },
  ],
};

export const LESSON_L3: Lesson = {
  id: "u1-l3",
  title: "Potencias y raíces cuadradas perfectas",
  conceptIdsTaught: [potencias.id],
  intro: {
    hook: "Ya dominas multiplicar. Las potencias son multiplicaciones del mismo número, repetidas: un virus que se duplica cada hora (1, 2, 4, 8…) crece como $2$ elevado a algo.",
    intuition: [
      '$2^4$ significa "2 multiplicado por sí mismo 4 veces": $2\\cdot2\\cdot2\\cdot2=16$. NO es $2\\times4$.',
      "El paréntesis decide si el signo se eleva: $(-3)^2=(-3)(-3)=9$ (exponente par, dos negativos se cancelan), pero $-3^2=-(3^2)=-9$ (el signo queda fuera).",
      "La raíz cuadrada pregunta al revés: ¿qué número multiplicado por sí mismo da esto? $\\sqrt{81}=9$ porque $9\\cdot9=81$. Truco: memoriza los cuadrados perfectos (1, 4, 9, 16, 25…) para reconocerlos al vuelo.",
    ],
    definition:
      "$a^n$ = producto de $n$ factores iguales a $a$. Si $b^2=a$ con $b\\geq 0$, entonces $\\sqrt{a}=b$ (raíz principal). Sin paréntesis, el signo negativo NO se eleva: $-a^2=-(a^2)$.",
    workedExamples: [
      "$(-4)^2=(-4)\\cdot(-4)=16$: exponente par, el signo desaparece.",
      "$\\sqrt{144}=12$ porque $12\\cdot12=144$.",
    ],
  },
  guidedPractice: {
    problem: "$2^5$",
    steps: [
      {
        instruction: "Escribe la multiplicación repetida de 2, cinco veces.",
        result: "$2\\cdot2\\cdot2\\cdot2\\cdot2$",
      },
      {
        instruction: "Multiplica paso a paso: 2, 4, 8, 16, 32.",
        result: "$2^5=32$",
      },
    ],
    prompt: "Ahora resuélvelo tú: ¿cuánto es $4^3$?",
    answer: 64,
    derivation: "4^3",
  },
  commonMistakes: [
    "Calcular $2^4$ como $2\\times4=8$: una potencia es multiplicación repetida, no el número por el exponente.",
    "Confundir $(-3)^2=9$ con $-3^2=-9$: sin paréntesis el signo NO participa de la potencia.",
  ],
  exercises: [
    {
      type: "multiple-choice",
      id: "u1l3e1",
      conceptsUsed: [potencias.id],
      difficulty: 1,
      prompt: "¿Cuánto es $2^4$?",
      hints: [
        { level: 1, text: "Desarrolle la multiplicación repetida: $2·2·2·2$." },
        {
          level: 2,
          text: "Ve emparejando: $2·2=4$, otro $2·2=4$, multiplica $4·4$.",
        },
      ],
      choices: [
        { id: "a", text: "$16$", isCorrect: true },
        {
          id: "b",
          text: "$8$",
          isCorrect: false,
          feedbackIfWrong:
            "Calculaste $2·4$: una potencia NO es el número por el exponente, es multiplicación repetida.",
        },
        {
          id: "c",
          text: "$6$",
          isCorrect: false,
          feedbackIfWrong:
            "Sumaste $2+4$. La potencia indica productos, no sumas.",
        },
        {
          id: "d",
          text: "$4$",
          isCorrect: false,
          feedbackIfWrong: "Solo desarrollaste $2·2$: faltan dos factores más.",
        },
      ],
    },
    {
      type: "multiple-choice",
      id: "u1l3e2",
      conceptsUsed: [potencias.id],
      difficulty: 1,
      prompt: "¿Cuánto es $(-3)^2$?",
      hints: [
        {
          level: 1,
          text: "El paréntesis incluye el signo: multiplica $(−3)·(−3)$.",
        },
        { level: 2, text: "Negativo por negativo da positivo." },
      ],
      choices: [
        { id: "a", text: "$9$", isCorrect: true },
        {
          id: "b",
          text: "$-9$",
          isCorrect: false,
          feedbackIfWrong:
            "Confundiste $(-3)^2$ con $-(3^2)$. Con paréntesis el signo SÍ se eleva: par da positivo.",
        },
        {
          id: "c",
          text: "$6$",
          isCorrect: false,
          feedbackIfWrong:
            "Multiplicaste $3·2$: la base completa $(−3)$ se multiplica por sí misma, no por el exponente.",
        },
        {
          id: "d",
          text: "$-6$",
          isCorrect: false,
          feedbackIfWrong:
            "Mezclaste dos errores: el producto es $3·3$ y el signo par da positivo.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u1l3e3",
      conceptsUsed: [potencias.id],
      difficulty: 2,
      prompt: "Calcula $5^3$.",
      hints: [
        { level: 1, text: "$5^3=5·5·5$." },
        { level: 2, text: "Primero $5·5=25$; luego $25·5$." },
      ],
      answer: 125,
      derivation: "5^3",
    },
    {
      type: "multiple-choice",
      id: "u1l3e4",
      conceptsUsed: [potencias.id],
      difficulty: 2,
      prompt: "¿Cuánto es $\\sqrt{81}$?",
      hints: [
        {
          level: 1,
          text: "Busca el número positivo que multiplicado por sí mismo da 81.",
        },
        { level: 2, text: "Prueba $9·9$." },
      ],
      choices: [
        { id: "a", text: "$9$", isCorrect: true },
        {
          id: "b",
          text: "$40{,}5$",
          isCorrect: false,
          feedbackIfWrong:
            "Dividiste entre 2: la raíz cuadrada busca un factor repetido, no la mitad.",
        },
        {
          id: "c",
          text: "$-9$",
          isCorrect: false,
          feedbackIfWrong:
            "Aunque $(−9)^2=81$, el símbolo $\\sqrt{\\;}$ representa la raíz principal (positiva).",
        },
        {
          id: "d",
          text: "$27$",
          isCorrect: false,
          feedbackIfWrong:
            "Eso sería $81÷3$: la raíz cuadrada divide el número en DOS factores iguales, no tres.",
        },
      ],
    },
    {
      type: "true-false",
      id: "u1l3e5",
      conceptsUsed: [potencias.id],
      difficulty: 3,
      statement: "Es cierto que $(-2)^3=-8$.",
      answer: true,
      explanation:
        "Exponente impar sobre base negativa: $(−2)·(−2)·(−2)=4·(−2)=−8$. Impar conserva el signo negativo.",
      hints: [
        { level: 1, text: "Desarrolla $(−2)(−2)(−2)$ paso a paso." },
        { level: 2, text: "Los primeros dos dan $+4$; luego $4·(−2)$." },
      ],
    },
    {
      type: "numeric-input",
      id: "u1l3e6",
      conceptsUsed: [potencias.id],
      difficulty: 3,
      prompt: "Calcula $\\sqrt{144}+3^2$.",
      hints: [
        {
          level: 1,
          text: "Primero cada potencia/raíz por separado: $\\sqrt{144}$ y $3^2$.",
        },
        { level: 2, text: "$12+9$." },
      ],
      answer: 21,
      derivation: "(144^(1/2))+(3^2)",
    },
    {
      type: "order-steps",
      id: "u1l3e7",
      conceptsUsed: [potencias.id],
      difficulty: 3,
      prompt: "Ordena los pasos para calcular $(-2)^4$.",
      steps: [
        {
          id: "s1",
          text: "Identifica que el exponente es par: el signo negativo desaparecerá.",
        },
        {
          id: "s2",
          text: "Multiplica los valores absolutos cuatro veces: $2\\cdot2\\cdot2\\cdot2=16$.",
        },
        {
          id: "s3",
          text: "Como el exponente es par, el resultado es positivo: $16$.",
        },
      ],
      correctOrder: ["s1", "s2", "s3"],
      hints: [
        {
          level: 1,
          text: "Primero decide el signo según si el exponente es par o impar.",
        },
        { level: 2, text: "Exponente par → el resultado siempre es positivo." },
      ],
    },
    {
      type: "match-pairs",
      id: "u1l3e8",
      conceptsUsed: [potencias.id],
      difficulty: 3,
      prompt: "Relaciona cada potencia o raíz con su valor.",
      pairs: [
        { left: "$3^2$", right: "$9$" },
        { left: "$\\sqrt{49}$", right: "$7$" },
        { left: "$(-2)^3$", right: "$-8$" },
        { left: "$\\sqrt{100}$", right: "$10$" },
      ],
      hints: [
        {
          level: 1,
          text: "Recuerda los cuadrados perfectos y que exponente impar conserva el signo.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u1l3e9",
      conceptsUsed: [potencias.id],
      difficulty: 3,
      prompt: "Calcula $\\sqrt{25}\\cdot(-2)^3$.",
      hints: [
        { level: 1, text: "Resuelve la raíz y la potencia por separado." },
        { level: 2, text: "$\\sqrt{25}=5$; $(-2)^3=-8$." },
        { level: 3, text: "Multiplica $5\\cdot(-8)$." },
      ],
      answer: -40,
      derivation: "(25^(1/2))*((-2)^3)",
    },
  ],
};

export const LESSON_L4: Lesson = {
  id: "u1-l4",
  title: "Jerarquía de operaciones",
  conceptIdsTaught: [jerarquia.id],
  intro: {
    hook: "Ya sabes sumar, multiplicar y elevar potencias. Pero si los mezclas en una sola expresión, ¿por dónde empiezas? Todo el mundo usa el mismo orden — sin él, cada quien obtendría una respuesta distinta.",
    intuition: [
      "El orden es siempre igual: 1º paréntesis, 2º potencias y raíces, 3º multiplicaciones y divisiones (izq→der), 4º sumas y restas (izq→der).",
      'No es que la multiplicación sea "más fuerte" en la vida real — es un acuerdo para que todos leamos las expresiones igual.',
      "Una fracción actúa como un paréntesis invisible: todo el numerador se calcula junto antes de dividir.",
    ],
    definition:
      "Jerarquía de operaciones: paréntesis → potencias/raíces → productos y cocientes (izquierda a derecha) → sumas y restas (izquierda a derecha).",
    workedExamples: [
      "$10-2\\cdot3$: primero el producto → $10-6=4$.",
      "$(2+3)\\cdot4^2$: paréntesis primero ($5$), luego potencia ($16$), luego producto → $5\\cdot16=80$.",
    ],
  },
  guidedPractice: {
    problem: "$3+4\\cdot2$",
    steps: [
      {
        instruction:
          "Identifica qué va primero: el producto tiene prioridad sobre la suma.",
        result: "Calcula $4\\cdot2=8$ primero.",
      },
      {
        instruction: "Ahora suma el resultado.",
        result: "$3+8=11$",
      },
    ],
    prompt: "Ahora resuélvelo tú: ¿cuánto es $20-3\\cdot4$?",
    answer: 8,
    derivation: "20-(3*4)",
  },
  commonMistakes: [
    "Resolver de izquierda a derecha sin jerarquía: $2+3\\cdot4$ NO es $(2+3)\\cdot4=20$; el producto va primero: $2+12=14$.",
    "Olvidar que multiplicación y división tienen la MISMA prioridad y se resuelven en el orden en que aparecen, de izquierda a derecha.",
  ],
  exercises: [
    {
      type: "numeric-input",
      id: "u1l4e1",
      conceptsUsed: [jerarquia.id],
      difficulty: 1,
      prompt: "Calcula $2+3\\cdot 4$.",
      hints: [
        { level: 1, text: "Antes de sumar, resuelve el producto." },
        { level: 2, text: "$3·4=12$; luego $2+12$." },
      ],
      answer: 14,
      derivation: "2+(3*4)",
    },
    {
      type: "multiple-choice",
      id: "u1l4e2",
      conceptsUsed: [jerarquia.id],
      difficulty: 1,
      prompt: "¿Cuánto es $10-2\\cdot 3$?",
      hints: [
        {
          level: 1,
          text: "El producto va primero, aunque esté escrito después.",
        },
        { level: 2, text: "$2·3=6$; luego $10-6$." },
      ],
      choices: [
        { id: "a", text: "$4$", isCorrect: true },
        {
          id: "b",
          text: "$24$",
          isCorrect: false,
          feedbackIfWrong:
            "Operaste izquierda a derecha: hiciste $(10−2)·3$. La multiplicación tiene prioridad sobre la resta.",
        },
        {
          id: "c",
          text: "$8$",
          isCorrect: false,
          feedbackIfWrong: "Hiciste $10−2=8$ y olvidaste aplicar el $·3$.",
        },
        {
          id: "d",
          text: "$30$",
          isCorrect: false,
          feedbackIfWrong:
            "Multiplicaste $10·3$ como si el 10 formara parte del producto; solo el 2 multiplica.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u1l4e3",
      conceptsUsed: [jerarquia.id, potencias.id],
      difficulty: 2,
      prompt: "Calcula $(2+3)\\cdot 4^2$.",
      hints: [
        {
          level: 1,
          text: "Paréntesis primero; después la potencia; después el producto.",
        },
        { level: 2, text: "$(2+3)=5$ y $4^2=16$; luego $5·16$." },
      ],
      answer: 80,
      derivation: "(2+3)*(4^2)",
    },
    {
      type: "numeric-input",
      id: "u1l4e4",
      conceptsUsed: [jerarquia.id, intMult.id],
      difficulty: 2,
      prompt: "Calcula $100\\div(-5)+2\\cdot(-3)$.",
      hints: [
        {
          level: 1,
          text: "Divisiones y productos primero (con sus reglas de signos).",
        },
        { level: 2, text: "$100÷(−5)=−20$ y $2·(−3)=−6$; luego suma ambos." },
        { level: 3, text: "$−20+(−6)=−26$." },
      ],
      answer: -26,
      derivation: "(100/(-5))+(2*(-3))",
    },
    {
      type: "multiple-choice",
      id: "u1l4e5",
      conceptsUsed: [jerarquia.id, potencias.id],
      difficulty: 3,
      prompt:
        '¿Qué expresión representa "al doble de 5, réstale el cubo de 2"?',
      hints: [
        { level: 1, text: '"Doble de 5" es $2·5$; "cubo de 2" es $2^3$.' },
        { level: 2, text: "«Réstale A a B» se traduce $B-A$." },
        { level: 3, text: "Queda $2·5-2^3$, que vale $10-8$." },
      ],
      choices: [
        { id: "a", text: "$2\\cdot 5-2^3$", isCorrect: true },
        {
          id: "b",
          text: "$(2\\cdot 5-2)^3$",
          isCorrect: false,
          feedbackIfWrong:
            "Agrupaste todo dentro del cubo: el cubo aplica SOLO al 2, según la frase.",
        },
        {
          id: "c",
          text: "$2\\cdot(5-2)^3$",
          isCorrect: false,
          feedbackIfWrong:
            "Agrupaste la resta dentro del paréntesis: la frase no agrupa nada antes del cubo.",
        },
        {
          id: "d",
          text: "$2\\cdot 5+2^3$",
          isCorrect: false,
          feedbackIfWrong:
            "Sumaste el cubo en lugar de restarlo: la frase indica una resta ($-$), no una suma.",
        },
      ],
    },
    {
      type: "true-false",
      id: "u1l4e6",
      conceptsUsed: [jerarquia.id],
      difficulty: 3,
      statement:
        "Al resolver $4+6\\div 2$, la división se hace antes que la suma y el resultado es 7.",
      answer: true,
      explanation:
        "Jerarquía: primero $6÷2=3$, luego $4+3=7$. Hacerlo de izquierda a derecha daría erróneamente 5.",
      hints: [
        {
          level: 1,
          text: "División y multiplicación van antes que suma y resta.",
        },
      ],
    },
  ],
};
