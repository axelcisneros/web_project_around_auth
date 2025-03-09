import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Header from './Header/Header.jsx';
import Main from './Main/Main.jsx';
import Footer from './Footer/Footer.jsx';
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute.jsx";
import Login from './Login/Login.jsx';
import Register from './Register/Register.jsx';
import api from '@utils/api.js';
import * as auth from '@utils/auth.js';
import { setToken, getToken } from '@utils/token.js';
import CurrentUserContext from '@contexts/CurrentUserContext.js';
import trueImg from '@assets/images/trueImg.svg';
import falseImg from '@assets/images/falseImg.svg'; 
import messages from '@utils/messages.js';


function App() {
  const [popup, setPopup] = useState(null);
  const [currentUser, setCurrentUser] = useState("");
  const [ isLoading, setIsLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [userData, setUserData] = useState({ username: "", email: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messagePopup, setMessagePopup] = useState({message: "", link: "", linkalt: ""});

  const navigate = useNavigate();

  const location = useLocation();

  function handleOpenPopup(popup) {
    setPopup(popup);
  }
  
  function handleClosePopup() {
    setPopup(null);
  }

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await api.getUserInfo();
        setCurrentUser(data);
      } catch (error) {
        console.error(error);
      }
    };
  
    const getInitialCardsData = async () => {
      try {
        const cards = await api.getInitialCards();
        setCards(cards);
      } catch (error) {
        console.error(error);
      }
    };
        const jwt = getToken();
      
        if (!jwt) {
          return;
        }
        
        // Llama a la función, pasándole el JWT.
        auth
          .getUserInfoAuth(jwt)
          .then(({ username, email }) => {
            // si la respuesta es exitosa, inicia la sesión del usuario, guarda sus
            // datos en el estado y lo dirige a /my-perfil.
            setIsLoggedIn(true);
            setUserData({ username, email });
          })
          .catch(console.error);
  
    getUserData();
    getInitialCardsData();
    
  }, []);

  async function handleCardLike(card) {
    const isLiked = card.isLiked;
  
    await api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
      setCards((state) => state.map((currentCard) => currentCard._id === card._id ? newCard : currentCard));
    }).catch((error) => console.error(error));
  }

    const handleRegistration = ({
      email,
      password
    }) => {
        auth.register( password, email)
         .then(() => {
          setMessagePopup({message: messages.registerTrue, link: trueImg, linkalt: messages.linkaltTrue});
          navigate("/login");
          })
          .catch(() => {console.error; setMessagePopup({message: messages.registerFalse, link: falseImg, linkalt: messages.linkaltFalse});});
    };

      const handleLogin = ({ email, password }) => {
        if (!email || !password) {
          return;
        }
    
        auth
          .authorize(email, password)
          .then((data) => {
            // Verifica que se incluyó un jwt antes de iniciar la sesión del usuario.
            if (data.jwt) {
              setToken(data.jwt);      // guardar el jwt en localStorage
              setUserData(data.user);  // guardar los datos de usuario en el estado
              setIsLoggedIn(true);     // inicia la sesión del usuario
              navigate("/my-perfil");      // enviarlo a /my-perfil
             // Después de iniciar sesión, en lugar de navegar todo el tiempo a /my-perfil,
            // navega a la ubicación que se almacena en state. Si
            // no hay ubicación almacenada, por defecto
            // redirigimos a /my-perfil.
            const redirectPath = location.state?.from?.pathname || "/my-perfil";
            setMessagePopup({message: messages.registerTrue, link: trueImg, linkalt: messages.linkaltTrue});
            navigate(redirectPath);
            }
          })
          .catch(() => {console.error; setMessagePopup({message: messages.registerFalse, link: falseImg, linkalt: messages.linkaltFalse});});
      };

  async function handleCardDelete(cardId) {
    try {
      setIsLoading(true);
      const isId = cardId;
      await api.removeCard(isId);
      
      setCards((state) => state.filter((card) => card._id !== isId));
      setTimeout(() => {
        setIsLoading(false);
        handleClosePopup();
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  } 

  const handleUpdateUser = (name, about) => {
    (async () => {
      setIsLoading(true);
      await api.setUserInfo(name, about).then((newData) => {
      setCurrentUser(newData);
      setTimeout(() => {
        handleClosePopup();
        setIsLoading(false);
      }, 2000);
      });
    })();
  };

  const handleUpdateAvatar = (data) => {
    (async () => {
      setIsLoading(true);
      await api.updateAvatar(data).then((newData) => {
        setCurrentUser(newData);
        setTimeout(() => {
          handleClosePopup();
          setIsLoading(false);
        }, 2000);
      });
    })();
  };

  const handleAddPlaceSubmit = (data) => {
    (async () => {
      setIsLoading(true);
      await api.addCard(data).then((newCard) => {
        setCards([newCard, ...cards]);
        setTimeout(() => {
          handleClosePopup();
          setIsLoading(false);
        }, 2000);
      });
    })();
  };
  

  return (
    <CurrentUserContext.Provider value={{
      currentUser,
      handleUpdateUser,
      handleUpdateAvatar,
      handleAddPlaceSubmit,
      isLoading, disabled,
      setDisabled,
      userData,
      setIsLoggedIn,
      isLoggedIn,
      popup,
      handleOpenPopup,
      handleClosePopup,
      messagePopup,
      }}>
      <div className='page'>
        <Header />
        <Routes>
          <Route
          path="/my-perfil"
          element={
          <ProtectedRoute>
            <Main onOpenPopup={handleOpenPopup} onClosePopup={handleClosePopup} popup={popup} cards={cards} onCardLike={handleCardLike} onCardDelete={handleCardDelete}/>
            <Footer />          
          </ProtectedRoute>
        }/>
        <Route path="/login" element={
          <ProtectedRoute anonymous>
              <Login handleLogin={handleLogin} />
          </ProtectedRoute>
        } />
        <Route path="/register" element={
          <ProtectedRoute anonymous>
              <Register handleRegistration={handleRegistration} />
          </ProtectedRoute>
        } />
        <Route path="*" element={ isLoggedIn ? (<Navigate to="/my-perfil" replace/>) : (<Navigate to="/login" replace/>)}/>
        </Routes>
      </div>
    </CurrentUserContext.Provider>
  )
}

export default App
