import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { WindowFrame } from "@/components/WindowFrame";
import { formatTime } from "./scoring";

const targetFile = "Foto2.png";
const allFiles = [
  targetFile,
  "Foto1.png",
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
const levelSizes = { easy: 5, medium: 15, hard: 30 } as const;

type GameResult = {
  timeMs: number;
  errors: number;
};

type GameCliqueSimplesProps = {
  onComplete: (result: GameResult) => void;
  level: "easy" | "medium" | "hard";
};

export const GameCliqueSimples: React.FC<GameCliqueSimplesProps> = ({ onComplete, level }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [message, setMessage] = useState("Selecione Foto2.png com um clique.");
  const [errors, setErrors] = useState(0);
  const [start, setStart] = useState(() => Date.now());
  const [done, setDone] = useState(false);
  const [shake, setShake] = useState(false);

  const fileItems = useMemo(() => {
    const size = levelSizes[level];
    return allFiles.slice(0, size);
  }, [level]);

  useEffect(() => {
    setSelected(null);
    setMessage("Selecione Foto2.png com um clique.");
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

  const handleClick = (file: string) => {
    setSelected(file);
    if (file === targetFile) {
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
    if (selected === targetFile) {
      setDone(true);
    } else {
      setMessage("Selecione Foto2.png antes de abrir.");
      setErrors((prev) => prev + 1);
      triggerShake();
    }
  };

  return (
    <div className="game-area">
      <WindowFrame title="Explorador de Arquivos" className={shake ? "shake" : ""}>
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
