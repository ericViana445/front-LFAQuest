import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Path_player from './pages/Path_player/Path_player.tsx';
import Leaderboard from './pages/Leaderboard/Leaderboard.tsx';
import Perfil from './pages/Perfil/Perfil.tsx';
import Statistics from './pages/Statistics/Statistics.tsx';
import Store from './pages/Store/Store.tsx'; 
import Index from './pages/Index/Index.tsx';
import "./Global.css"


function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Index />} />
        <Route path="/path" element={<Path_player />} />
        <Route path='/profile' element={<Perfil/>} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/store" element={<Store />} /> 
        <Route path="/more" element={<Statistics />} />
        
      </Routes>
    </Router>
  );
}

export default App;
