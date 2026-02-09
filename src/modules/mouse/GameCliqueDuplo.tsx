import React, { useEffect, useState } from "react";
import { WindowFrame } from "@/components/WindowFrame";
import { formatTime } from "./scoring";

const targetFolder = "Fotos";
const allFolders = [
  targetFolder,
  "Música",
  "Documentos",
  "Downloads",
  "Projetos",
  "Trabalho",
  "Estudos",
  "Fotos 2024",
  "Fotos 2023",
  "Receitas",
  "Finanças",
  "Viagens",
  "Jogos",
  "Backup",
  "Livros",
  "Cursos",
  "Notas",
  "Rascunhos",
  "Imagens",
  "Vídeos",
  "Planilhas",
  "Contas",
  "Clientes",
  "Musicas Antigas",
  "Documentos Pessoais",
  "Projetos Antigos",
  "Arquivos",
  "Temp",
  "Relatorios",
  "Contratos"
];
const levelSizes = { easy: 5, medium: 15, hard: 30 } as const;

type GameResult = {
  timeMs: number;
  errors: number;
};

type GameCliqueDuploProps = {
  onComplete: (result: GameResult) => void;
  level: "easy" | "medium" | "hard";
};

export const GameCliqueDuplo: React.FC<GameCliqueDuploProps> = ({ onComplete, level }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [message, setMessage] = useState("Abra a pasta Fotos com dois cliques.");
  const [errors, setErrors] = useState(0);
  const [start, setStart] = useState(() => Date.now());
  const [done, setDone] = useState(false);
  const [shake, setShake] = useState(false);

  const folders = React.useMemo(() => {
    const size = levelSizes[level];
    return allFolders.slice(0, size);
  }, [level]);

  useEffect(() => {
    setSelected(null);
    setMessage("Abra a pasta Fotos com dois cliques.");
    setErrors(0);
    setStart(Date.now());
    setDone(false);
  }, [level]);

  useEffect(() => {
    if (done) {
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
      triggerShake();
    }
  };

  return (
    <div className="game-area">
      <WindowFrame title="Pastas" className={shake ? "shake" : ""}>
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
