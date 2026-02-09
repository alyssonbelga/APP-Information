import React, { useMemo } from "react";
import { BrowserRouter, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ProgressStars } from "@/components/ProgressStars";
import { Toggle } from "@/components/Toggle";
import { useProgress } from "@/store/progress";
import { lessonSteps, mouseLessons } from "@/modules/mouse/lessons";
import { calculateStars, formatTime } from "@/modules/mouse/scoring";
import { GameCliqueSimples } from "@/modules/mouse/GameCliqueSimples";
import { GameCliqueDuplo } from "@/modules/mouse/GameCliqueDuplo";
import { GameArrastarSoltar } from "@/modules/mouse/GameArrastarSoltar";
import "@/styles/app.css";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { progress, setSettings } = useProgress();
  const mouseProgress = progress.modules.mouse.lessons;
  const starsTotal = Object.values(mouseProgress).reduce((sum, lesson) => sum + lesson.stars, 0);
  const percent = Math.round((starsTotal / 9) * 100);
  const lastLesson = progress.modules.mouse.lastLesson ?? "clique-simples";

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Aprenda Info</h1>
          <p>Ensino simples de informática básica.</p>
        </div>
        <div className="settings">
          <Toggle
            label="Texto grande"
            checked={progress.settings.largeText}
            onChange={(value) => setSettings({ largeText: value })}
          />
          <Toggle
            label="Cursor grande"
            checked={progress.settings.largeCursor}
            onChange={(value) => setSettings({ largeCursor: value })}
          />
        </div>
      </header>

      <section className="home-actions">
        <Button onClick={() => navigate(`/mouse/${lastLesson}/tutorial`)}>Começar</Button>
        <Button variant="secondary" onClick={() => navigate(`/mouse/${lastLesson}/tutorial`)}>
          Continuar
        </Button>
        <Button variant="ghost" onClick={() => navigate("/modules")}>Escolher Módulo</Button>
      </section>

      <Card title="Seu progresso no módulo Mouse">
        <div className="progress-row">
          <ProgressStars stars={Math.round(starsTotal / 3)} size="large" />
          <div>
            <strong>{percent}% concluído</strong>
            <p>{starsTotal} de 9 estrelas possíveis.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

const ModuleSelectPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="page">
      <h1>Escolha um módulo</h1>
      <div className="module-grid">
        <Card title="Mouse">
          <p>Aprenda cliques e arrastar.</p>
          <Button onClick={() => navigate("/module/mouse")}>Entrar</Button>
        </Card>
        <Card title="Teclado">
          <p>Em breve.</p>
          <Button disabled>Em breve</Button>
        </Card>
        <Card title="Hardware">
          <p>Em breve.</p>
          <Button disabled>Em breve</Button>
        </Card>
        <Card title="Montagem">
          <p>Em breve.</p>
          <Button disabled>Em breve</Button>
        </Card>
      </div>
      <Button variant="ghost" onClick={() => navigate("/")}>Voltar</Button>
    </div>
  );
};

const MouseModulePage: React.FC = () => {
  const navigate = useNavigate();
  const { progress } = useProgress();

  return (
    <div className="page">
      <h1>Módulo Mouse</h1>
      <div className="lesson-grid">
        {mouseLessons.map((lesson) => {
          const lessonProgress = progress.modules.mouse.lessons[lesson.id];
          return (
            <Card key={lesson.id} title={lesson.title}>
              <p>{lesson.short}</p>
              <ProgressStars stars={lessonProgress?.stars ?? 0} size="large" />
              <Button onClick={() => navigate(`/mouse/${lesson.id}/tutorial`)}>Começar</Button>
            </Card>
          );
        })}
      </div>
      <Button variant="ghost" onClick={() => navigate("/")}>Voltar</Button>
    </div>
  );
};

const LessonFlowPage: React.FC = () => {
  const navigate = useNavigate();
  const { lessonId, step } = useParams();
  const { updateLesson } = useProgress();
  const lesson = mouseLessons.find((entry) => entry.id === lessonId);
  const currentStep = step as (typeof lessonSteps)[number];
  const stepIndex = lessonSteps.indexOf(currentStep);
  const levels = ["easy", "medium", "hard"] as const;
  const [levelIndex, setLevelIndex] = React.useState(0);
  const [levelResults, setLevelResults] = React.useState<
    { timeMs: number; errors: number; hits: number; total: number; stars: number }[]
  >([]);
  const [result, setResult] = React.useState<
    null | { stars: number; timeMs: number; errors: number }
  >(null);
  const [taskRequest, setTaskRequest] = React.useState("");
  const [stageResult, setStageResult] = React.useState<null | {
    timeMs: number;
    errors: number;
    hits: number;
    total: number;
    stars: number;
  }>(null);

  React.useEffect(() => {
    setLevelIndex(0);
    setLevelResults([]);
    setResult(null);
    setTaskRequest("");
    setStageResult(null);
  }, [lessonId, step]);

  if (!lesson || !currentStep) {
    return (
      <div className="page">
        <p>Essa lição não existe.</p>
        <Button onClick={() => navigate("/")}>Voltar</Button>
      </div>
    );
  }

  const goNext = async () => {
    const nextStep = lessonSteps[stepIndex + 1];
    if (nextStep) {
      navigate(`/mouse/${lesson.id}/${nextStep}`);
    } else {
      navigate("/module/mouse");
    }
  };

  const GameComponent = useMemo(() => {
    if (lesson.id === "clique-simples") return GameCliqueSimples;
    if (lesson.id === "clique-duplo") return GameCliqueDuplo;
    return GameArrastarSoltar;
  }, [lesson.id]);

  const renderTextList = (items: string[]) => (
    <ul className="text-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );

  const levelLabel = {
    easy: "Fácil (4 itens)",
    medium: "Médio (8 itens)",
    hard: "Difícil (16 itens)"
  } as const;

  return (
    <div className="page">
      <header className="lesson-header">
        <div>
          <h1>{lesson.title}</h1>
          <p>Etapa: {currentStep.toUpperCase()}</p>
        </div>
        <Button variant="ghost" onClick={() => navigate("/module/mouse")}>Sair</Button>
      </header>

      {currentStep === "tutorial" && (
        <Card title="Tutorial">
          {renderTextList(lesson.tutorial)}
          <Button onClick={goNext}>Continuar</Button>
        </Card>
      )}

      {currentStep === "demo" && (
        <Card title="Demonstração">
          {renderTextList(lesson.demo)}
          <Button onClick={goNext}>Ir para o jogo</Button>
        </Card>
      )}

      {currentStep === "game" && (
        <Card title="Jogo">
          <div className="task-request">
            <strong>Solicitação da tarefa:</strong>
            <span>{taskRequest || "Carregando instruções..."}</span>
          </div>
          <div className="level-header">
            <strong>Nível: {levelLabel[levels[levelIndex]]}</strong>
            <span>
              Etapa {levelIndex + 1} de {levels.length}
            </span>
          </div>
          <GameComponent
            key={`${lesson.id}-${levels[levelIndex]}`}
            level={levels[levelIndex]}
            onRequestChange={setTaskRequest}
            onComplete={async (gameResult) => {
              const stars = calculateStars(gameResult.errors, gameResult.timeMs);
              setStageResult({ ...gameResult, stars });
            }}
          />
        </Card>
      )}

      {stageResult && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Etapa concluída!</h3>
            <div className="modal-grid">
              <div>
                <strong>Acertos:</strong> {stageResult.hits} de {stageResult.total}
              </div>
              <div>
                <strong>Erros:</strong> {stageResult.errors}
              </div>
              <div>
                <strong>Tempo:</strong> {formatTime(stageResult.timeMs)}
              </div>
              <div>
                <strong>Nota:</strong> {stageResult.stars} estrelas
              </div>
            </div>
            <Button
              onClick={async () => {
                setLevelResults((prev) => {
                  const updatedResults = [...prev, stageResult];
                  if (levelIndex === levels.length - 1) {
                    const totalErrors = updatedResults.reduce(
                      (sum, entry) => sum + entry.errors,
                      0
                    );
                    const totalTime = updatedResults.reduce((sum, entry) => sum + entry.timeMs, 0);
                    const stars = calculateStars(totalErrors, totalTime);
                    const summary = { stars, timeMs: totalTime, errors: totalErrors };
                    setResult(summary);
                    void updateLesson(lesson.id, summary.stars, summary.timeMs);
                  }
                  return updatedResults;
                });
                setStageResult(null);
                if (levelIndex < levels.length - 1) {
                  setLevelIndex((prevIndex) => prevIndex + 1);
                  return;
                }
                goNext();
              }}
            >
              Continuar
            </Button>
          </div>
        </div>
      )}

      {currentStep === "fixacao" && (
        <Card title="Fixação">
          {renderTextList(lesson.fixacao)}
          <Button onClick={goNext}>Concluir</Button>
        </Card>
      )}
    </div>
  );
};

export const App: React.FC = () => {
  const { progress } = useProgress();
  const className = `${progress.settings.largeText ? "text-large" : ""} ${
    progress.settings.largeCursor ? "cursor-large" : ""
  }`;

  return (
    <div className={`app-shell ${className}`.trim()}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/modules" element={<ModuleSelectPage />} />
          <Route path="/module/mouse" element={<MouseModulePage />} />
          <Route path="/mouse/:lessonId/:step" element={<LessonFlowPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};
