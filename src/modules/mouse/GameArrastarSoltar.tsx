import React, { useEffect, useMemo, useRef, useState } from "react";
import { WindowFrame } from "@/components/WindowFrame";
import { formatTime } from "./scoring";

const allItems = [
  { id: "foto", label: "foto.jpg", target: "Imagens" },
  { id: "foto2", label: "praia.png", target: "Imagens" },
  { id: "foto3", label: "familia.png", target: "Imagens" },
  { id: "foto4", label: "cidade.jpg", target: "Imagens" },
  { id: "foto5", label: "amigos.jpg", target: "Imagens" },
  { id: "foto6", label: "evento.png", target: "Imagens" },
  { id: "foto7", label: "paisagem.jpg", target: "Imagens" },
  { id: "foto8", label: "animal.png", target: "Imagens" },
  { id: "foto9", label: "casa.jpg", target: "Imagens" },
  { id: "foto10", label: "bolo.png", target: "Imagens" },
  { id: "relatorio", label: "relatorio.docx", target: "Documentos" },
  { id: "texto1", label: "texto.txt", target: "Documentos" },
  { id: "planilha", label: "planilha.xlsx", target: "Documentos" },
  { id: "contrato", label: "contrato.pdf", target: "Documentos" },
  { id: "recibo", label: "recibo.pdf", target: "Documentos" },
  { id: "notas", label: "notas.txt", target: "Documentos" },
  { id: "curriculo", label: "curriculo.docx", target: "Documentos" },
  { id: "relatorio2", label: "relatorio2.docx", target: "Documentos" },
  { id: "lista", label: "lista.docx", target: "Documentos" },
  { id: "orcamento", label: "orcamento.xlsx", target: "Documentos" },
  { id: "video", label: "video.mp4", target: "Vídeos" },
  { id: "video2", label: "aula.mp4", target: "Vídeos" },
  { id: "video3", label: "familia.mp4", target: "Vídeos" },
  { id: "video4", label: "filme.mp4", target: "Vídeos" },
  { id: "video5", label: "evento.mp4", target: "Vídeos" },
  { id: "video6", label: "viagem.mp4", target: "Vídeos" },
  { id: "video7", label: "treino.mp4", target: "Vídeos" },
  { id: "video8", label: "aniversario.mp4", target: "Vídeos" },
  { id: "video9", label: "tutorial.mp4", target: "Vídeos" },
  { id: "video10", label: "show.mp4", target: "Vídeos" }
];

const folders = ["Imagens", "Documentos", "Vídeos"];
const levelSizes = { easy: 4, medium: 8, hard: 16 } as const;
const shuffle = <T,>(items: T[]) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

type GameResult = {
  timeMs: number;
  errors: number;
};

type GameArrastarSoltarProps = {
  onComplete: (result: GameResult) => void;
  level: "easy" | "medium" | "hard";
};

export const GameArrastarSoltar: React.FC<GameArrastarSoltarProps> = ({ onComplete, level }) => {
  const items = useMemo(() => {
    const size = levelSizes[level];
    return shuffle(allItems).slice(0, size);
  }, [level]);
  const [placed, setPlaced] = useState<string[]>([]);
  const [message, setMessage] = useState("Arraste cada arquivo para a pasta correta.");
  const [errors, setErrors] = useState(0);
  const [start, setStart] = useState(() => Date.now());
  const [done, setDone] = useState(false);
  const [shake, setShake] = useState(false);
  const completedRef = useRef(false);
  const itemsRemaining = useMemo(
    () => items.filter((item) => !placed.includes(item.id)),
    [items, placed]
  );

  useEffect(() => {
    setPlaced([]);
    setMessage("Arraste cada arquivo para a pasta correta.");
    setErrors(0);
    setStart(Date.now());
    setDone(false);
    completedRef.current = false;
  }, [level]);

  useEffect(() => {
    if (done && !completedRef.current) {
      completedRef.current = true;
      const timeMs = Date.now() - start;
      onComplete({ timeMs, errors });
    }
  }, [done, errors, onComplete, start]);

  useEffect(() => {
    if (!shake) return;
    const timeout = setTimeout(() => setShake(false), 250);
    return () => clearTimeout(timeout);
  }, [shake]);

  const triggerShake = () => setShake(true);

  const handleDrop = (folder: string, itemId: string) => {
    const item = items.find((entry) => entry.id === itemId);
    if (!item) return;

    if (item.target === folder) {
      setPlaced((prev) => [...prev, itemId]);
      setMessage("Isso! Continue com os outros.");
      if (placed.length + 1 === items.length) {
        setDone(true);
      }
    } else {
      setMessage("Essa pasta não é a correta. Tente de novo com calma.");
      setErrors((prev) => prev + 1);
      triggerShake();
    }
  };

  return (
    <div className="game-area">
      <WindowFrame title="Área de Trabalho" className={shake ? "shake" : ""}>
        <p className="mission">Missão: organize os arquivos nas pastas certas.</p>
        <div className="drag-layout">
          <div className="drag-items">
            {itemsRemaining.map((item) => (
              <div
                key={item.id}
                className="drag-item"
                draggable
                onDragStart={(event) => event.dataTransfer.setData("text/plain", item.id)}
              >
                <span className="icon file" />
                {item.label}
              </div>
            ))}
          </div>
          <div className="drop-zones">
            {folders.map((folder) => (
              <div
                key={folder}
                className="drop-zone"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  const itemId = event.dataTransfer.getData("text/plain");
                  handleDrop(folder, itemId);
                }}
              >
                <span className="icon folder" />
                <span>{folder}</span>
              </div>
            ))}
          </div>
        </div>
      </WindowFrame>
      <div className="feedback">
        <strong>{message}</strong>
        <span>Erros: {errors}</span>
        <span>Tempo: {formatTime(Date.now() - start)}</span>
      </div>
    </div>
  );
};
