import { BrowserRouter, Route, Routes } from "react-router";
import LiveQuizHostPage from "@/pages/LiveQuiz/LiveQuizHostPage";
import LiveQuizPlayerPage from "@/pages/LiveQuiz/LiveQuizPlayerPage";
import BuzzerHost from "@/pages/Buzzer/BuzzerHost";
import BuzzerPlayer from "@/pages/Buzzer/BuzzerPlayer";
import GameApp from "@/pages/Game";
import MainLayout from "@/layouts/MainLayout";
import HomeHCM from "@/pages/HomeHCM/HomeHCM";
import One from "@/pages/HomeHCM/One/One";
import Two from "@/pages/HomeHCM/Two/Two";
import Three from "@/pages/HomeHCM/Three/Three";
import Four from "@/pages/HomeHCM/Four/Four";
import Five from "@/pages/HomeHCM/Five/Five";
import ChatFullPage from "@/pages/Chat/ChatFullPage";

export default function MainRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* HCM202 LIVE QUIZ: Classroom Game Show with QR Code as Primary App */}
        <Route index element={<LiveQuizHostPage />} />
        <Route path="/host" element={<LiveQuizHostPage />} />
        <Route path="/live" element={<LiveQuizHostPage />} />
        <Route path="/join" element={<LiveQuizPlayerPage />} />
        <Route path="/play" element={<LiveQuizPlayerPage />} />
        <Route path="/player" element={<LiveQuizPlayerPage />} />

        {/* Speed Buzzer mode */}
        <Route path="/buzzer" element={<BuzzerHost />} />
        <Route path="/buzzer-play" element={<BuzzerPlayer />} />

        {/* Supplementary Academic Exploration */}
        <Route path="/game" element={<GameApp />} />

        {/* Textbook Document reading sub-routes */}
        <Route path="/doc" element={<MainLayout />}>
          <Route index element={<HomeHCM />} />
          <Route path="1" element={<One />} />
          <Route path="2" element={<Two />} />
          <Route path="3" element={<Three />} />
          <Route path="4" element={<Four />} />
          <Route path="5" element={<Five />} />
          <Route path="chat" element={<ChatFullPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
