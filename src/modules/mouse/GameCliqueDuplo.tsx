import React, { useEffect, useMemo, useRef, useState } from "react";
import { WindowFrame } from "@/components/WindowFrame";
import { formatTime } from "./scoring";

const allFolders = [
  "Fotos",
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
const shuffle = (items: string[]) => {
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

type GameCliqueDuploProps = {
  onComplete: (result: GameResult) => void;
  level: "easy" | "medium" | "hard";
};

export const GameCliqueDuplo: React.FC<GameCliqueDuploProps> = ({ onComplete, level }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [message, setMessage] = useState("Abra todas as pastas com dois cliques.");
  const [opened, setOpened] = useState<string[]>([]);
  const [errors, setErrors] = useState(0);
  const [start, setStart] = useState(() => Date.now());
  const [done, setDone] = useState(false);
  const [shake, setShake] = useState(false);
  const completedRef = useRef(false);

  const folders = useMemo(() => {
    const size = levelSizes[level];
    return shuffle(allFolders).slice(0, size);
  }, [level]);

  useEffect(() => {
    setSelected(null);
    setMessage("Abra todas as pastas com dois cliques.");
    setOpened([]);
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

  const handleClick = (folder: string) => {
    setSelected(folder);
    setMessage("Um clique só seleciona. Agora faça dois cliques.");
  };

  const handleDoubleClick = (folder: string) => {
    if (opened.includes(folder)) {
      setMessage("Essa pasta já foi aberta. Escolha outra.");
      setErrors((prev) => prev + 1);
      triggerShake();
      return;
    }

    const updated = [...opened, folder];
    setOpened(updated);
    if (updated.length === folders.length) {
      setDone(true);
    } else {
      setMessage(`Boa! Ainda faltam ${folders.length - updated.length} pastas.`);
    }
  };

  return (
    <div className="game-area">
      <WindowFrame title="Pastas" className={shake ? "shake" : ""}>
        <p className="mission">Missão: abra todas as pastas desta lista.</p>
        <div className="folder-grid">
          {folders.map((folder) => (
            <button
              key={folder}
              type="button"
              className={`folder-item ${selected === folder ? "selected" : ""} ${
                opened.includes(folder) ? "opened" : ""
              }`}
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
