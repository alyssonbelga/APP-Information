import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { WindowFrame } from "@/components/WindowFrame";
import { calculateStars, formatTime } from "./scoring";

const files = ["Foto1.png", "Foto2.png", "Texto.txt", "Planilha.xlsx"];
const targetFile = "Foto2.png";

type GameResult = {
  stars: number;
  timeMs: number;
  errors: number;
};

type GameCliqueSimplesProps = {
  onComplete: (result: GameResult) => void;
};

export const GameCliqueSimples: React.FC<GameCliqueSimplesProps> = ({ onComplete }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [message, setMessage] = useState("Selecione Foto2.png com um clique.");
  const [errors, setErrors] = useState(0);
  const [start] = useState(() => Date.now());
  const [done, setDone] = useState(false);

  const fileItems = useMemo(() => files, []);

  useEffect(() => {
    if (done) {
      const timeMs = Date.now() - start;
      const stars = calculateStars(errors, timeMs);
      onComplete({ stars, timeMs, errors });
    }
  }, [done, errors, onComplete, start]);

  const handleClick = (file: string) => {
    setSelected(file);
    if (file === targetFile) {
      setMessage("Ótimo! Agora clique em Abrir.");
    } else {
      setMessage("Esse não é o arquivo. Tente novamente com calma.");
      setErrors((prev) => prev + 1);
    }
  };

  const handleDoubleClick = () => {
    setMessage("Clique apenas uma vez para selecionar, sem abrir.");
    setErrors((prev) => prev + 1);
  };

  const handleOpen = () => {
    if (selected === targetFile) {
      setDone(true);
    } else {
      setMessage("Selecione Foto2.png antes de abrir.");
      setErrors((prev) => prev + 1);
    }
  };

  return (
    <div className="game-area">
      <WindowFrame title="Explorador de Arquivos">
        <p className="mission">Missão: selecione {targetFile} e clique em Abrir.</p>
        <div className="file-list" onDoubleClick={handleDoubleClick}>
          {fileItems.map((file) => (
            <button
              key={file}
              type="button"
              className={`file-item ${selected === file ? "selected" : ""}`}
              onClick={() => handleClick(file)}
            >
              <span className="icon file" />
              {file}
            </button>
          ))}
        </div>
        <div className="window-actions">
          <Button onClick={handleOpen}>Abrir</Button>
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
