import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import AuthHomePage from './pages/AuthHomePage';
import LoginPage from './pages/LoginPage';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import WelcomeContent from './pages/WelcomeContent';
import Buttons from './pages/Buttons';
import ProfilePage from './pages/ProfilePage';
import PublicProfilePage from './pages/PublicProfilePage';
import ChangeProfile from './pages/ChangeProfile';
import PasswordChange from './pages/PasswordChange';
import AddPost from './posts/AddPost';
import EditPost from './posts/EditPost';
import Comments from './posts/Comments';


function App() {
  return (
    <div className="App">
      <Router>

      <Buttons />
      <Routes>
        <Route exact path="/" element={<WelcomeContent/>}/>
        <Route exact path="/login" element={<LoginPage/>}/>
        <Route exact path="/authhome" element={<AuthHomePage/>}/>
        <Route exact path='/profile/:id' element={<ProfilePage/>}/>
        <Route exact path='/publicprofile/:id' element={<PublicProfilePage/>}/>
        <Route exact path='/changeprofileinfo/:id' element={<ChangeProfile/>}/>
        <Route exact path='/changepasswordpage/:id' element={<PasswordChange/>}/>
        <Route exact path='/addpost' element={<AddPost/>}/>
        <Route exact path='/editpost/:id' element={<EditPost/>}/>
        <Route exact path='/comments' element={<Comments/>}/>
      </Routes>
      </Router>
    </div>
  );
}

export default App;
