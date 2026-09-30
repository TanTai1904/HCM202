import React from 'react';
import { useLiveQuizStore } from '@/store/liveQuizStore';
import { LiveQuizHostHome } from '@/components/liveQuizHost/LiveQuizHostHome';
import { LiveQuizHostCreate } from '@/components/liveQuizHost/LiveQuizHostCreate';
import { LiveQuizHostWaitingRoom } from '@/components/liveQuizHost/LiveQuizHostWaitingRoom';
import { LiveQuizHostRoundIntro } from '@/components/liveQuizHost/LiveQuizHostRoundIntro';
import { LiveQuizHostQuestion } from '@/components/liveQuizHost/LiveQuizHostQuestion';
import { LiveQuizHostResult } from '@/components/liveQuizHost/LiveQuizHostResult';
import { LiveQuizHostLeaderboard } from '@/components/liveQuizHost/LiveQuizHostLeaderboard';
import { LiveQuizHostGameOver } from '@/components/liveQuizHost/LiveQuizHostGameOver';

export const LiveQuizHostPage: React.FC = () => {
  const {
    step,
    roomId,
    teams,
    activeTeamIds,
    players,
    connectionStatus,
    currentRound,
    currentQuestionIndex,
    totalQuestions,
    currentQuestion,
    timeRemaining,
    isTimerPaused,
    answersSubmitted,
    roundScoreDelta,
    goToHome,
    goToCreate,
    createRoom,
    startGame,
    tickTimer,
    pauseTimer,
    resumeTimer,
    revealAnswer,
    nextQuestion,
    showLeaderboard,
    hideLeaderboard,
    endGame,
    resetGame,
  } = useLiveQuizStore();

  switch (step) {
    case 'HOME':
      return <LiveQuizHostHome onStart={goToCreate} />;

    case 'CREATE':
      return <LiveQuizHostCreate onBack={goToHome} onCreate={createRoom} />;

    case 'WAITING_ROOM':
      return (
        <LiveQuizHostWaitingRoom
          roomId={roomId}
          teams={teams}
          activeTeamIds={activeTeamIds}
          players={players}
          connectionStatus={connectionStatus}
          onStartGame={startGame}
        />
      );

    case 'ROUND_INTRO':
      return (
        <LiveQuizHostRoundIntro
          round={currentRound}
          questionIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
        />
      );

    case 'QUESTION':
      if (!currentQuestion) return null;
      return (
        <LiveQuizHostQuestion
          round={currentRound}
          questionIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
          question={currentQuestion}
          timeRemaining={timeRemaining}
          isTimerPaused={isTimerPaused}
          teams={teams}
          activeTeamIds={activeTeamIds}
          players={players}
          answersSubmitted={answersSubmitted}
          onTickTimer={tickTimer}
          onPauseTimer={pauseTimer}
          onResumeTimer={resumeTimer}
          onRevealAnswer={revealAnswer}
          onNextQuestion={nextQuestion}
          onShowLeaderboard={showLeaderboard}
          onEndGame={endGame}
        />
      );

    case 'RESULT':
      if (!currentQuestion) return null;
      return (
        <LiveQuizHostResult
          question={currentQuestion}
          questionIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
          teams={teams}
          activeTeamIds={activeTeamIds}
          roundScoreDelta={roundScoreDelta}
          onNextQuestion={nextQuestion}
          onShowLeaderboard={showLeaderboard}
        />
      );

    case 'LEADERBOARD':
      return (
        <LiveQuizHostLeaderboard
          teams={teams}
          activeTeamIds={activeTeamIds}
          onBack={hideLeaderboard}
        />
      );

    case 'GAME_OVER':
      return (
        <LiveQuizHostGameOver
          teams={teams}
          activeTeamIds={activeTeamIds}
          players={players}
          totalQuestions={totalQuestions}
          onPlayAgain={resetGame}
        />
      );

    default:
      return <LiveQuizHostHome onStart={goToCreate} />;
  }
};

export default LiveQuizHostPage;
