import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/Button";
import { WindowFrame } from "@/components/WindowFrame";
import { formatTime } from "./scoring";

const allFiles = [
  "Foto1.png",
  "Foto2.png",
  "Foto3.png",
  "Foto4.png",
  "Texto.txt",
  "Planilha.xlsx",
  "Relatorio.pdf",
  "Musica.mp3",
  "Video.mp4",
  "Notas.docx",
  "Receita.docx",
  "ListaCompras.txt",
  "Agenda.pdf",
  "Trabalho.pptx",
  "Historico.pdf",
  "Mapa.png",
  "Desenho.png",
  "Livro.epub",
  "Contrato.pdf",
  "Calendario.xlsx",
  "Projeto.zip",
  "Apresentacao.pptx",
  "FotoViagem.jpg",
  "Lembrete.txt",
  "Senha.txt",
  "Documento1.docx",
  "Documento2.docx",
  "Imagem.png",
  "Caderno.pdf",
  "RelatorioFinal.pdf"
];
const levelSizes = { easy: 4, medium: 8, hard: 16 } as const;
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

type GameCliqueSimplesProps = {
  onComplete: (result: GameResult) => void;
  level: "easy" | "medium" | "hard";
  onRequestChange: (request: string) => void;
};

export const GameCliqueSimples: React.FC<GameCliqueSimplesProps> = ({
  onComplete,
  level,
  onRequestChange
}) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [targets, setTargets] = useState<string[]>([]);
  const [fileItems, setFileItems] = useState<string[]>([]);
  const [message, setMessage] = useState("Prepare-se para selecionar arquivos.");
  const [errors, setErrors] = useState(0);
  const [start, setStart] = useState(() => Date.now());
  const [done, setDone] = useState(false);
  const [shake, setShake] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    setSelected(null);
    const size = levelSizes[level];
    const shuffled = shuffle(allFiles).slice(0, size);
    const targetOrder = shuffle(shuffled);
    setTargets(targetOrder);
    setFileItems(shuffled);
    setMessage(`Selecione ${targetOrder[0]} com um clique.`);
    onRequestChange(`Selecione ${targetOrder[0]} e clique em Abrir.`);
    setErrors(0);
    setStart(Date.now());
    setDone(false);
    completedRef.current = false;
  }, [level, onRequestChange]);

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

  const handleClick = (file: string) => {
    setSelected(file);
    if (file === targets[0]) {
      setMessage("Ótimo! Agora clique em Abrir.");
    } else {
      setMessage("Esse não é o arquivo. Tente novamente com calma.");
      setErrors((prev) => prev + 1);
      triggerShake();
    }
  };

  const handleDoubleClick = () => {
    setMessage("Clique apenas uma vez para selecionar, sem abrir.");
    setErrors((prev) => prev + 1);
    triggerShake();
  };

  const handleOpen = () => {
    if (selected === targets[0]) {
      const nextTargets = targets.slice(1);
      if (nextTargets.length === 0) {
        setDone(true);
      } else {
        setTargets(nextTargets);
        setSelected(null);
        setMessage(`Agora selecione ${nextTargets[0]}.`);
        onRequestChange(`Selecione ${nextTargets[0]} e clique em Abrir.`);
      }
    } else {
      setMessage("Selecione o arquivo certo antes de abrir.");
      setErrors((prev) => prev + 1);
      triggerShake();
    }
  };

  return (
    <div className="game-area">
      <WindowFrame title="Explorador de Arquivos" className={shake ? "shake" : ""}>
        <p className="mission">Missão: selecione o arquivo pedido e clique em Abrir.</p>
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
