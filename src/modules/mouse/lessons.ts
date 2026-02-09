export type LessonId = "clique-simples" | "clique-duplo" | "arrastar-soltar";

export type LessonDefinition = {
  id: LessonId;
  title: string;
  short: string;
  tutorial: string[];
  demo: string[];
  fixacao: string[];
};

export const mouseLessons: LessonDefinition[] = [
  {
    id: "clique-simples",
    title: "Clique simples",
    short: "Selecionar e abrir com um clique.",
    tutorial: [
      "Clique simples serve para selecionar um item.",
      "Clique uma vez e solte o botão do mouse.",
      "Para abrir, use o botão " +
        "Abrir" +
        " depois de selecionar."
    ],
    demo: [
      "Veja como o arquivo fica destacado.",
      "Um clique seleciona, não abre.",
      "Agora clique no botão Abrir." 
    ],
    fixacao: [
      "Na vida real: um clique só seleciona.",
      "Use o botão Abrir quando houver.",
      "Você pode repetir até ficar confortável." 
    ]
  },
  {
    id: "clique-duplo",
    title: "Clique duplo",
    short: "Abrir pastas com dois cliques rápidos.",
    tutorial: [
      "Clique duplo abre pastas e arquivos.",
      "São dois cliques rápidos, sem segurar.",
      "Um clique só seleciona." 
    ],
    demo: [
      "Veja a pasta ficar selecionada.",
      "Agora faça dois cliques para abrir.",
      "Pronto! Você entrou na pasta." 
    ],
    fixacao: [
      "Dica: use dois cliques leves.",
      "Se abrir errado, volte e tente de novo.",
      "Com prática fica automático." 
    ]
  },
  {
    id: "arrastar-soltar",
    title: "Arrastar e soltar",
    short: "Mover arquivos segurando o botão do mouse.",
    tutorial: [
      "Clique e segure para arrastar.",
      "Leve o arquivo até a pasta correta.",
      "Solte o botão para mover." 
    ],
    demo: [
      "Veja o arquivo seguir o cursor.",
      "A pasta certa fica destacada.",
      "Solte em cima da pasta." 
    ],
    fixacao: [
      "Na vida real, organize suas pastas assim.",
      "Se errar, arraste de volta.",
      "Você está indo muito bem." 
    ]
  }
];

export const lessonSteps = ["tutorial", "demo", "game", "fixacao"] as const;
export type LessonStep = (typeof lessonSteps)[number];
