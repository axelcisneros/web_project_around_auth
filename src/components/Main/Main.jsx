import { useContext } from 'react';
import Popup from '../Main/components/Popup/Popup.jsx';
import NewCard from '../Main/components/Popup/NewCard/NewCard.jsx';
import EditProfile from '../Main/components/Popup/EditProfile/EditProfile.jsx';
import EditAvatar from '../Main/components/Popup/EditAvatar/EditAvatar.jsx';
import RemoveCard from '../Main/components/Popup/RemoveCard/RemoveCard.jsx';
import Card from '../Main/components/Card/Card.jsx';
import ImagePopup from '../Main/components/Popup/ImagePopup/ImagePopup.jsx';
import CurrentUserContext from '@contexts/CurrentUserContext.js';
import { validationConfig } from '@utils/validationConfig.js';

function Main(props) {
    const { popup, onOpenPopup, onClosePopup, cards, onCardLike, onCardDelete } = props;
    const newCardPopup = { title: "Nuevo lugar", children: <NewCard validationConfig={validationConfig} /> };
    const editProfolePopup = { title: "Nuevo lugar", children: <EditProfile validationConfig={validationConfig} /> };
    const editAvatarPopup = { title: "Nuevo avatar", children: <EditAvatar validationConfig={validationConfig} /> };
    const { currentUser } = useContext(CurrentUserContext);

    function handleCardClick(card) {
        onOpenPopup({ children: <ImagePopup card={card} /> });
    }

    function handleTrashClick(card) {
        onOpenPopup({ title: "¿Estás seguro?", children: <RemoveCard onCardDelete={onCardDelete} card={card}/> });
    }

    return (
        <main className="main">
            <div className="main__profile">
                <div className="main__content-image">
                    <img src={currentUser.avatar}
                    alt="profile-image"
                    className="main__profile-image"
                    />
                    <button 
                    type="button"
                    className="main__button main__button_img"
                    onClick={() => onOpenPopup(editAvatarPopup)}
                    >
                        &#x1F58C;
                    </button>
                </div>
                <div className="main__content-paragraph">
                    <p className="main__paragraph main__paragraph_name">{currentUser.name}</p>
                    <p className="main__paragraph main__paragraph_job">{currentUser.about}</p>
                    <button
                    type="button"
                    className="main__button main__button_edit"
                    onClick={() => onOpenPopup(editProfolePopup)}
                    >
                    &#x1F58C;
                    </button>
                </div>
                <button
                aria-label="Add card" 
                type="button" 
                className="main__button main__button_add" 
                onClick={() => onOpenPopup(newCardPopup)}>
                &#x1F7A3;
                </button>
            </div>
            <ul className="main__gallery">
                {cards.map((card) => (
                    <Card
                    key={card._id}
                    card={card}
                    handleCardClick={handleCardClick}
                    onCardLike={onCardLike}
                    handleTrashClick={handleTrashClick}
                    />
                ))}
            </ul>
            {popup && (
                <Popup onClose={onClosePopup} title={popup.title}>
                {popup.children}
            </Popup>
        )}
        </main>
    );
}

export default Main;