import type { Lesson } from "@/features/content/schema";
import { CONCEPTS } from "./concepts";

const { ec1p, intSuma, intMult, distributiva, ambosLados, ec2p, ecParentesis } =
  CONCEPTS;

export const LESSON_U2L1: Lesson = {
  id: "u2-l1",
  title: "Ecuaciones de dos pasos",
  conceptIdsTaught: [ec2p.id],
  intro: {
    hook: "Un taxi cobra 5 de banderazo más 2 por minuto. Si pagaste 17, ¿cuántos minutos viajaste? Eso es $2m+5=17$: una ecuación de dos pasos.",
    intuition: [
      "Desvestir a un muñeco: te quitas los zapatos ANTES que la bufanda. En $ax+b=c$, primero se quita el $+b$ (suma/resta) y luego el $a$ (multiplicación/división).",
      "El orden de despeje es el INVERSO al orden de operaciones: lo último que se hizo al construir la expresión es lo primero que se deshace.",
      "Todo lo que hagas a un lado de la igualdad, hazlo también al otro: el equilibrio manda.",
    ],
    definition:
      "Para resolver $ax+b=c$: 1) suma o resta $b$ en ambos miembros para aislar el término con $x$; 2) divide (o multiplica) ambos miembros entre $a$. Verifica sustituyendo.",
    workedExamples: [
      "$2x+5=11$: resto 5 → $2x=6$; divido entre 2 → $x=3$. Verificación: $2·3+5=11$ ✓.",
      "$-3x-4=8$: sumo 4 → $-3x=12$; divido entre −3 → $x=-4$. Verificación: $-3·(-4)-4=8$ ✓.",
    ],
  },
  commonMistakes: [
    "Dividir antes de despejar la suma/resta: en $2x+3=11$ calcular $(11÷2)-3$, mezclando el orden.",
    "Perder el signo del coeficiente negativo en la división final: $(−12)÷(−3)$ es $+4$, no $−4$.",
  ],
  exercises: [
    {
      type: "multiple-choice",
      id: "u2l1e1",
      conceptsUsed: [ec2p.id],
      difficulty: 1,
      prompt: "Resuelve $2x+3=11$.",
      hints: [
        { level: 1, text: "Primero quita el +3 restando 3 en ambos lados." },
        { level: 2, text: "$2x=8$; ahora divide entre 2." },
        { level: 3, text: "$x=8÷2=4$." },
      ],
      choices: [
        { id: "a", text: "$x=4$", isCorrect: true },
        {
          id: "b",
          text: "$x=7$",
          isCorrect: false,
          feedbackIfWrong:
            "Sumaste 3 en lugar de restarlo antes de dividir: el despeje usa la operación inversa.",
        },
        {
          id: "c",
          text: "$x=14$",
          isCorrect: false,
          feedbackIfWrong:
            "Multiplicaste por 2 al final: para eliminar un «·2» se DIVIDE entre 2.",
        },
        {
          id: "d",
          text: "$x=2{,}5$",
          isCorrect: false,
          feedbackIfWrong:
            "Dividiste entre 2 antes de quitar el +3: primero se deshace la suma/resta.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u2l1e2",
      conceptsUsed: [ec2p.id],
      difficulty: 1,
      prompt: "Resuelve $3x-5=10$. Escribe el valor de $x$.",
      hints: [
        { level: 1, text: "Suma 5 en ambos lados y después divide entre 3." },
        { level: 2, text: "$3x=15$, luego $x=15÷3$." },
      ],
      answer: 5,
      derivation: "(10+5)/3",
    },
    {
      type: "multiple-choice",
      id: "u2l1e3",
      conceptsUsed: [ec2p.id, intMult.id],
      difficulty: 2,
      prompt: "Resuelve $-2x+7=1$.",
      hints: [
        { level: 1, text: "Resta 7 en ambos lados: queda $-2x=-6$." },
        {
          level: 2,
          text: "Divide entre $-2$: negativo entre negativo da positivo.",
        },
        { level: 3, text: "$x=(-6)÷(-2)=3$." },
      ],
      choices: [
        { id: "a", text: "$x=3$", isCorrect: true },
        {
          id: "b",
          text: "$x=-3$",
          isCorrect: false,
          feedbackIfWrong:
            "Olvidaste que el divisor era $-2$: negativo entre negativo da POSITIVO.",
        },
        {
          id: "c",
          text: "$x=-4$",
          isCorrect: false,
          feedbackIfWrong:
            "Pasaste el $+7$ sumando: al moverlo debe restar: $1-7=-6$.",
        },
        {
          id: "d",
          text: "$x=4$",
          isCorrect: false,
          feedbackIfWrong:
            "Operaste como si fuera $7-1=6$ y luego $6÷...$: el 7 pasa restando al otro lado.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u2l1e4",
      conceptsUsed: [ec2p.id],
      difficulty: 2,
      prompt: "Resuelve $5x-12=18$.",
      hints: [
        { level: 1, text: "Primero suma 12: $5x=30$." },
        { level: 2, text: "Ahora divide entre 5." },
      ],
      answer: 6,
      derivation: "(18+12)/5",
    },
    {
      type: "true-false",
      id: "u2l1e5",
      conceptsUsed: [ec2p.id],
      difficulty: 3,
      statement:
        "En la ecuación $4x-9=15$, el primer paso recomendado es dividir ambos lados entre 4.",
      answer: false,
      explanation:
        "El primer paso es SUMAR 9 para aislar el término con x; dividir primero mezclaría el −9 dentro de la división ($15/4 - 9/4$), complicando el camino.",
      hints: [
        {
          level: 1,
          text: "Recuerda: primero se deshace la suma/resta, después el producto.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u2l1e6",
      conceptsUsed: [ec2p.id, intSuma.id],
      difficulty: 3,
      prompt: "Resuelve $-3x+2=-13$.",
      hints: [
        { level: 1, text: "Resta 2: $-3x=-15$." },
        {
          level: 2,
          text: "Divide entre $-3$: signo negativo ÷ signo negativo = positivo.",
        },
        { level: 3, text: "$x=(-15)÷(-3)$." },
      ],
      answer: 5,
      derivation: "((-13)-2)/(-3)",
    },
  ],
};

export const LESSON_U2L2: Lesson = {
  id: "u2-l2",
  title: "Variables en ambos lados",
  conceptIdsTaught: [ambosLados.id],
  intro: {
    hook: "Dos gimnasios cobran así: A pide 30 fijo; B pide 10 fijo más 4 por visita. ¿Cuándo cuestan igual? Igualar sus fórmulas pone variables en ambos lados.",
    intuition: [
      "La estrategia: junta todas las $x$ en UN lado y todos los números en el otro.",
      "Cuando un término cambia de lado, cambia de signo: $5x = x+12$ → $5x-x=12$.",
      "Termina siendo una ecuación de uno o dos pasos que ya sabes resolver.",
    ],
    definition:
      "En $ax+b=cx+d$: aplica la operación inversa para agrupar $(a-c)x=d-b$ (o equivalente) y despeja. Elige el lado que evite coeficientes negativos cuando sea posible.",
    workedExamples: [
      "$5x=x+12$: resto $x$ en ambos → $4x=12$; divido entre 4 → $x=3$.",
      "$7x-2=3x+10$: resto $3x$ → $4x-2=10$; sumo 2 → $4x=12$; $x=3$.",
    ],
  },
  commonMistakes: [
    "Cambiar de lado sin cambiar el signo: $5x=x+12$ NO se convierte en $5x+x=12$.",
    "Dividir constantes entre sí «en paralelo»: en $4x-3=2x+5$ no puedes hacer $x=(5-3)/(4-2)=1$.",
  ],
  exercises: [
    {
      type: "multiple-choice",
      id: "u2l2e1",
      conceptsUsed: [ambosLados.id, ec1p.id],
      difficulty: 1,
      prompt: "Resuelve $5x=x+12$.",
      hints: [
        {
          level: 1,
          text: "Pasa la $x$ del derecho al izquierdo restando: $5x-x=12$.",
        },
        { level: 2, text: "$4x=12$; divide entre 4." },
      ],
      choices: [
        { id: "a", text: "$x=3$", isCorrect: true },
        {
          id: "b",
          text: "$x=2$",
          isCorrect: false,
          feedbackIfWrong:
            "Pasaste la $x$ SUMANDO: $5x+x=6x$. Al cambiar de lado, el signo se invierte.",
        },
        {
          id: "c",
          text: "$x=4$",
          isCorrect: false,
          feedbackIfWrong:
            "Agrupaste mal los coeficientes: $5x-x=4x$, no $3x$.",
        },
        {
          id: "d",
          text: "$x=6$",
          isCorrect: false,
          feedbackIfWrong:
            "Obtuviste $6x=12$ pero olvidaste dividir entre el coeficiente correcto tras agrupar bien ($4x$).",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u2l2e2",
      conceptsUsed: [ambosLados.id],
      difficulty: 1,
      prompt: "Resuelve $7x=2x+15$.",
      hints: [
        { level: 1, text: "Resta $2x$ en ambos lados: $5x=15$." },
        { level: 2, text: "$x=15÷5$." },
      ],
      answer: 3,
      derivation: "(15)/((7)-(2))",
    },
    {
      type: "multiple-choice",
      id: "u2l2e3",
      conceptsUsed: [ambosLados.id, ec2p.id],
      difficulty: 2,
      prompt: "Resuelve $4x-3=2x+5$.",
      hints: [
        { level: 1, text: "Junta las x a la izquierda: $4x-2x=5+3$." },
        { level: 2, text: "$2x=8$; divide entre 2." },
        { level: 3, text: "$x=4$." },
      ],
      choices: [
        { id: "a", text: "$x=4$", isCorrect: true },
        {
          id: "b",
          text: "$x=1$",
          isCorrect: false,
          feedbackIfWrong:
            "Dividiste constantes y coeficientes «en paralelo» ($5-3$ sobre $4-2$): cada lado se simplifica COMPLETO, no término a término cruzado.",
        },
        {
          id: "c",
          text: "$x=2$",
          isCorrect: false,
          feedbackIfWrong:
            "Moviste términos sin invertir algún signo: revisa que $-3$ pase como $+3$ y $2x$ como $-2x$.",
        },
        {
          id: "d",
          text: "$x=8$",
          isCorrect: false,
          feedbackIfWrong:
            "Llegaste a $2x=8$ pero no dividiste entre 2: aún falta el paso final.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u2l2e4",
      conceptsUsed: [ambosLados.id],
      difficulty: 2,
      prompt: "Resuelve $9x+4=4x+24$.",
      hints: [
        { level: 1, text: "Resta $4x$ y también el 4: $9x-4x=24-4$." },
        { level: 2, text: "$5x=20$." },
      ],
      answer: 4,
      derivation: "(24-4)/((9)-(4))",
    },
    {
      type: "true-false",
      id: "u2l2e5",
      conceptsUsed: [ambosLados.id],
      difficulty: 3,
      statement:
        "En $6x+2=2x+10$, restar $2x$ en ambos miembros es un primer paso válido.",
      answer: true,
      explanation:
        "Cualquier operación aplicada a AMBOS lados conserva la igualdad. Restar $2x$ deja $4x+2=10$, camino válido hacia $x=2$.",
      hints: [
        {
          level: 1,
          text: "¿Se conserva el equilibrio si operas en ambos lados?",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u2l2e6",
      conceptsUsed: [ambosLados.id, ec2p.id],
      difficulty: 3,
      prompt: "Resuelve $11x-7=5x+17$.",
      hints: [
        { level: 1, text: "Agrupa: $11x-5x=17+7$." },
        { level: 2, text: "$6x=24$." },
        { level: 3, text: "$x=24÷6$." },
      ],
      answer: 4,
      derivation: "(17+7)/((11)-(5))",
    },
  ],
};

export const LESSON_U2L3: Lesson = {
  id: "u2-l3",
  title: "Paréntesis en ecuaciones",
  conceptIdsTaught: [ecParentesis.id],
  intro: {
    hook: "Tres cajas iguales con x canicas cada una, más sueltan 4 en total... Cuando una ecuación trae paréntesis, la distributiva abre el camino.",
    intuition: [
      "Dos caminos equivalentes: DISTRIBUIR el factor, o DIVIDIR ambos lados entre él si divide exacto.",
      "Distribuir significa multiplicar a TODOS los términos de adentro, con sus signos.",
      "Tras abrir paréntesis, la ecuación vuelve a ser de «dos pasos» o «variables en ambos lados», que ya dominas.",
    ],
    definition:
      "Para resolver ecuaciones con paréntesis: aplica $a(b+c)=ab+ac$ para eliminarlos (o divide ambos miembros por el factor común), luego resuelve como ecuación lineal conocida.",
    workedExamples: [
      "$2(x+4)=14$: distribuyo → $2x+8=14$; $2x=6$; $x=3$. (Camino alterno: divido entre 2 → $x+4=7$.)",
      "$4(x-2)=2x+6$: distribuyo → $4x-8=2x+6$; agrupo → $2x=14$; $x=7$.",
    ],
  },
  commonMistakes: [
    "Distribuir sobre un solo término: $2(x+4)$ NO es $2x+4$.",
    "Perder el signo al distribuir negativos: $-3(x-2)=-3x+6$, no $-3x-6$.",
  ],
  exercises: [
    {
      type: "multiple-choice",
      id: "u2l3e1",
      conceptsUsed: [ecParentesis.id, distributiva.id],
      difficulty: 1,
      prompt: "Resuelve $2(x+4)=14$.",
      hints: [
        {
          level: 1,
          text: "Distribuye: $2x+8=14$. O divide ambos lados entre 2 primero.",
        },
        { level: 2, text: "$2x=6$; divide entre 2." },
      ],
      choices: [
        { id: "a", text: "$x=3$", isCorrect: true },
        {
          id: "b",
          text: "$x=5$",
          isCorrect: false,
          feedbackIfWrong:
            "Distribución incompleta: hiciste $2x+4=14$. El 2 multiplica TAMBIÉN al 4.",
        },
        {
          id: "c",
          text: "$x=11$",
          isCorrect: false,
          feedbackIfWrong:
            "Tras dividir entre 2 quedó $x+4=7$: el $+4$ pasa RESTANDO, no quedándose.",
        },
        {
          id: "d",
          text: "$x=28$",
          isCorrect: false,
          feedbackIfWrong:
            "Multiplicaste ambos lados por 2 otra vez: el paréntesis ya estaba multiplicando.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u2l3e2",
      conceptsUsed: [ecParentesis.id],
      difficulty: 1,
      prompt: "Resuelve $3(x-2)=9$.",
      hints: [
        { level: 1, text: "Divide ambos lados entre 3: $x-2=3$." },
        { level: 2, text: "$x=3+2$." },
      ],
      answer: 5,
      derivation: "(9/3)+2",
    },
    {
      type: "multiple-choice",
      id: "u2l3e3",
      conceptsUsed: [ecParentesis.id, ambosLados.id],
      difficulty: 2,
      prompt: "Resuelve $4(x-2)=2x+6$.",
      hints: [
        { level: 1, text: "Distribuye: $4x-8=2x+6$." },
        { level: 2, text: "Agrupa: $4x-2x=6+8$." },
        { level: 3, text: "$2x=14$." },
      ],
      choices: [
        { id: "a", text: "$x=7$", isCorrect: true },
        {
          id: "b",
          text: "$x=4$",
          isCorrect: false,
          feedbackIfWrong:
            "Distribuiste incompleto: $4(x-2)$ es $4x-8$, no $4x-2$.",
        },
        {
          id: "c",
          text: "$x=-1$",
          isCorrect: false,
          feedbackIfWrong:
            "Al mover el $-8$ debe pasar como $+8$: agrupaste $6-8$ en lugar de $6+8$.",
        },
        {
          id: "d",
          text: "$x=14$",
          isCorrect: false,
          feedbackIfWrong: "Llegaste a $2x=14$ pero falta dividir entre 2.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u2l3e4",
      conceptsUsed: [ecParentesis.id, distributiva.id],
      difficulty: 2,
      prompt: "Resuelve $2(3x-1)=16$.",
      hints: [
        { level: 1, text: "Distribuye: $6x-2=16$." },
        { level: 2, text: "$6x=18$; divide entre 6." },
      ],
      answer: 3,
      derivation: "(16+2)/6",
    },
    {
      type: "true-false",
      id: "u2l3e5",
      conceptsUsed: [ecParentesis.id, distributiva.id],
      difficulty: 3,
      statement:
        "Para resolver $4(x+1)=2x+10$, distribuir el 4 primero es un camino válido.",
      answer: true,
      explanation:
        "Sí: $4x+4=2x+10$ lleva a $2x=6$ y $x=3$. También valdría dividir ambos lados entre 2 antes; hay varios caminos correctos.",
      hints: [
        {
          level: 1,
          text: "¿Aplicar la distributiva rompe el equilibrio o lo preserva?",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u2l3e6",
      conceptsUsed: [ecParentesis.id, distributiva.id, ec2p.id],
      difficulty: 3,
      prompt: "Resuelve $3(2x+1)-4=11$.",
      hints: [
        { level: 1, text: "Distribuye: $6x+3-4=11$." },
        { level: 2, text: "$6x-1=11$; suma 1: $6x=12$." },
        { level: 3, text: "$x=12÷6$." },
      ],
      answer: 2,
      derivation: "(11+4-3)/6",
    },
  ],
};
