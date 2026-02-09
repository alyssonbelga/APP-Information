import React, { useMemo } from "react";
import { BrowserRouter, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ProgressStars } from "@/components/ProgressStars";
import { Toggle } from "@/components/Toggle";
import { useProgress } from "@/store/progress";
import { lessonSteps, mouseLessons } from "@/modules/mouse/lessons";
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
  const [result, setResult] = React.useState<null | { stars: number; timeMs: number; errors: number }>(
    null
  );

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
          <GameComponent
            onComplete={async (gameResult) => {
              setResult(gameResult);
              await updateLesson(lesson.id, gameResult.stars, gameResult.timeMs);
            }}
          />
          {result && (
            <div className="result-box">
              <h3>Parabéns!</h3>
              <p>Você ganhou {result.stars} estrelas.</p>
              <p>Erros: {result.errors}</p>
              <Button onClick={goNext}>Continuar para Fixação</Button>
            </div>
          )}
        </Card>
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
