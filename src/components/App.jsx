import { useState, useEffect } from 'react';
import Header from './Header/Header.jsx';
import Main from './Main/Main.jsx';
import Footer from './Footer/Footer.jsx';
import api from '@utils/api.js';
import CurrentUserContext from '@contexts/CurrentUserContext.js';


function App() {
  const [popup, setPopup] = useState(null);
  const [currentUser, setCurrentUser] = useState("");
  const [ isLoading, setIsLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const [disabled, setDisabled] = useState(true);

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
  
    getUserData();
    getInitialCardsData();
  }, []);

  async function handleCardLike(card) {
    const isLiked = card.isLiked;
  
    await api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
      setCards((state) => state.map((currentCard) => currentCard._id === card._id ? newCard : currentCard));
    }).catch((error) => console.error(error));
  }

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
    <CurrentUserContext.Provider value={{currentUser, handleUpdateUser, handleUpdateAvatar, handleAddPlaceSubmit, isLoading, disabled, setDisabled}}>
      <div className='page'>
        <Header />
        <Main
        onOpenPopup={handleOpenPopup}
        onClosePopup={handleClosePopup}
        popup={popup} 
        cards={cards}
        onCardLike={handleCardLike}
        onCardDelete={handleCardDelete}/>
        <Footer />
      </div>
    </CurrentUserContext.Provider>
  )
}

export default App
