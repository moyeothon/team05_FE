import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Writing from './pages/Writing/Writing';
import EmotionMusicPage from './pages/Emotional/EmotionMusicPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/writing" element={<Writing />} />
        <Route path="/emotion" element={<EmotionMusicPage />} />
        {/* 필요한 다른 라우트들 */}
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
