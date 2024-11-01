import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Writing from './pages/Writing/Writing';
import EmotionMusicPage from './pages/Emotional/EmotionMusicPage';
import Calender from './pages/Calender/Calender.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Start from './pages/StartApp';
import NewUserPage from './pages/NewUserPage';
import ExistingUserPage from './pages/ExistingUserPage';
import DiaryDetailPage from './pages/DiaryDetail/DiaryDetailPage';
import Search from './pages/Search/Search';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/new-user" element={<NewUserPage />} />
        <Route path="/existing-user" element={<ExistingUserPage />} />
        <Route path="/writing" element={<Writing />} />
        <Route path="/emotion" element={<EmotionMusicPage />} />
        <Route path="/calendar" element={<Calender />} />
        <Route path="/diary-detail" element={<DiaryDetailPage />} />
        <Route path="/search" element={<Search />} />
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
