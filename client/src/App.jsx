import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Protected from './components/ProtectedRoute.jsx';
import  Login  from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import  Home  from './pages/home.jsx';
import { AuthProvider } from "./context/auth.jsx";
import Upload from "./pages/Upload.jsx";
import Profile from "./pages/Profile.jsx";
import ProfileEdit from './pages/ProfileEdit.jsx';



const App =() => {
  return (
    <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route
        path = "/"
        element = { <Protected> <Home /></Protected> }
        />

        <Route path = "/login" element = {<Login />} />
        <Route path = "/register" element = {<Register />}/>
        <Route path= "/upload" element= {<Protected><Upload /></Protected> }/>
        <Route path = "/users/:username" element={<Protected><Profile /></Protected>}/>
        <Route path= "/edit-profile" element={<Protected><ProfileEdit/> </Protected>}/>
        <Route path = "*" element = {<Navigate to = "/" replace />} />
      </Routes>
    </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
