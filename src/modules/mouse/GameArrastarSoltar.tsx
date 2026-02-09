import React, { useEffect, useMemo, useState } from "react";
import { WindowFrame } from "@/components/WindowFrame";
import { calculateStars, formatTime } from "./scoring";

const items = [
  { id: "foto", label: "foto.jpg", target: "Imagens" },
  { id: "relatorio", label: "relatorio.docx", target: "Documentos" },
  { id: "video", label: "video.mp4", target: "Vídeos" }
];

const folders = ["Imagens", "Documentos", "Vídeos"];

type GameResult = {
  stars: number;
  timeMs: number;
  errors: number;
};

type GameArrastarSoltarProps = {
  onComplete: (result: GameResult) => void;
};

export const GameArrastarSoltar: React.FC<GameArrastarSoltarProps> = ({ onComplete }) => {
  const [placed, setPlaced] = useState<string[]>([]);
  const [message, setMessage] = useState("Arraste cada arquivo para a pasta correta.");
  const [errors, setErrors] = useState(0);
  const [start] = useState(() => Date.now());
  const [done, setDone] = useState(false);
  const itemsRemaining = useMemo(() => items.filter((item) => !placed.includes(item.id)), [placed]);

  useEffect(() => {
    if (done) {
      const timeMs = Date.now() - start;
      const stars = calculateStars(errors, timeMs);
      onComplete({ stars, timeMs, errors });
    }
  }, [done, errors, onComplete, start]);

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
    }
  };

  return (
    <div className="game-area">
      <WindowFrame title="Área de Trabalho">
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
