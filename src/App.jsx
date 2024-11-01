import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Writing from './pages/Writing/Writing';
import EmotionMusicPage from './pages/Emotional/EmotionMusicPage';
import Calender from './pages/Calender/Calender.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Start from './pages/StartApp';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/writing" element={<Writing />} />
        <Route path="/emotion" element={<EmotionMusicPage />} />
        <Route path="/calendar" element={<Calender />} />
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </BrowserRouter>
  );
}

export default App;
