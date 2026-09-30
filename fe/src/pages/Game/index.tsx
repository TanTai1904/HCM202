import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { Navbar } from '@/components/layout/Navbar';
import { HostControls } from '@/components/game/HostControls';

import { Home } from './Home';
import { HowToPlay } from './HowToPlay';
import { TeamSelectCount } from './TeamSelectCount';
import { TeamSetup } from './TeamSetup';
import { TeamReady } from './TeamReady';
import { JourneyMap } from './JourneyMap';
import { QuickQuizRound } from './QuickQuizRound';
import { TruthCheckRound } from './TruthCheckRound';
import { DecodeIdeaRound } from './DecodeIdeaRound';
import { RealLifeRound } from './RealLifeRound';
import { ChapterSummary } from './ChapterSummary';
import { FinalBetting } from './FinalBetting';
import { FinalBattleRound } from './FinalBattleRound';
import { ResultPodium } from './ResultPodium';
import { QuestionBankManager } from './QuestionBankManager';
import { SettingsModal } from './SettingsModal';

export const GameApp: React.FC = () => {
  const { currentPhase, presentationMode } = useGameStore();

  const renderPhaseComponent = () => {
    switch (currentPhase) {
      case 'HOME':
        return <Home />;
      case 'HOW_TO_PLAY':
        return <HowToPlay />;
      case 'TEAM_SELECT_COUNT':
        return <TeamSelectCount />;
      case 'TEAM_SETUP':
        return <TeamSetup />;
      case 'TEAM_READY':
        return <TeamReady />;
      case 'MAP_OVERVIEW':
        return <JourneyMap />;
      case 'ROUND_1_QUIZ':
        return <QuickQuizRound />;
      case 'ROUND_2_TRUTH':
        return <TruthCheckRound />;
      case 'ROUND_3_DECODE':
        return <DecodeIdeaRound />;
      case 'ROUND_4_SCENARIO':
        return <RealLifeRound />;
      case 'CHAPTER_SUMMARY':
        return <ChapterSummary />;
      case 'FINAL_BETTING':
        return <FinalBetting />;
      case 'FINAL_BATTLE':
        return <FinalBattleRound />;
      case 'RESULT':
        return <ResultPodium />;
      case 'QUESTION_BANK':
        return <QuestionBankManager />;
      case 'SETTINGS':
        return <SettingsModal />;
      default:
        return <Home />;
    }
  };

  return (
    <div className={`min-h-screen bg-[#FAF7EF] text-slate-800 flex flex-col font-sans antialiased bg-historic-mesh ${
      presentationMode ? 'text-lg select-none' : ''
    }`}>
      {/* Top Bar */}
      <Navbar />

      {/* Main Dynamic View */}
      <main className="flex-1 flex flex-col">
        {renderPhaseComponent()}
      </main>

      {/* Host / Teacher Mode Floating Panel */}
      <HostControls />
    </div>
  );
};

export default GameApp;
