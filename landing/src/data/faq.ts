export type FaqItem = {
  question: string;
  answer: string;
};

export const FAQ: FaqItem[] = [
  {
    question: "¿Mathia funciona sin internet?",
    answer:
      "Sí, por completo. Es una app de escritorio offline-first: instalas una vez y todo el contenido, tu progreso y tus estadísticas viven en tu computadora. La red nunca es un requisito.",
  },
  {
    question: "¿Es gratis?",
    answer:
      "Sí. Mathia es software libre bajo licencia Apache-2.0, sin paywalls, sin suscripciones ni vidas que comprar.",
  },
  {
    question: "¿Qué diferencia hay con Duolingo?",
    answer:
      "Mathia enseña álgebra real con pedagogía de práctica espaciada y recuperación activa, sin cuentas ni conexión a internet — piensa en ella como el «Duolingo del álgebra», pero privada y sin anuncios.",
  },
  {
    question: "¿En qué sistemas operativos puedo descargar Mathia?",
    answer:
      "Windows, macOS y Linux. Descarga el instalador correspondiente desde la página de releases en GitHub.",
  },
  {
    question: "¿Mathia recopila mis datos?",
    answer:
      "No. No hay cuentas, no hay telemetría ni analítica dentro de la app. Todo tu progreso se guarda localmente en tu equipo.",
  },
];
