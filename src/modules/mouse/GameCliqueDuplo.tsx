import React, { useEffect, useState } from "react";
import { WindowFrame } from "@/components/WindowFrame";
import { calculateStars, formatTime } from "./scoring";

const folders = ["Fotos", "Música", "Documentos"];
const targetFolder = "Fotos";

type GameResult = {
  stars: number;
  timeMs: number;
  errors: number;
};

type GameCliqueDuploProps = {
  onComplete: (result: GameResult) => void;
};

export const GameCliqueDuplo: React.FC<GameCliqueDuploProps> = ({ onComplete }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [message, setMessage] = useState("Abra a pasta Fotos com dois cliques.");
  const [errors, setErrors] = useState(0);
  const [start] = useState(() => Date.now());
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) {
      const timeMs = Date.now() - start;
      const stars = calculateStars(errors, timeMs);
      onComplete({ stars, timeMs, errors });
    }
  }, [done, errors, onComplete, start]);

  const handleClick = (folder: string) => {
    setSelected(folder);
    setMessage("Um clique só seleciona. Agora faça dois cliques.");
  };

  const handleDoubleClick = (folder: string) => {
    if (folder === targetFolder) {
      setDone(true);
    } else {
      setMessage("Essa não é a pasta certa. Procure Fotos.");
      setErrors((prev) => prev + 1);
    }
  };

  return (
    <div className="game-area">
      <WindowFrame title="Pastas">
        <p className="mission">Missão: abra a pasta {targetFolder}.</p>
        <div className="folder-grid">
          {folders.map((folder) => (
            <button
              key={folder}
              type="button"
              className={`folder-item ${selected === folder ? "selected" : ""}`}
              onClick={() => handleClick(folder)}
              onDoubleClick={() => handleDoubleClick(folder)}
            >
              <span className="icon folder" />
              {folder}
            </button>
          ))}
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
