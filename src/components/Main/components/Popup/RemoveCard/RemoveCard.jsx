import { useContext, useEffect } from 'react';
import CurrentUserContext from '@contexts/CurrentUserContext';

export default function RemoveCard(props) {
  const { onCardDelete, onClose } = props;
  const { _id } = props.card;
  const deleteContext = useContext(CurrentUserContext);
  const {isLoading} = deleteContext;

  async function handleDeleteClick(cardId) {
    try {
        await onCardDelete(cardId);
    } catch (error) {
        console.log(error);
}
}

useEffect(() => {
  function handleEnterKey(e) {
      if (e.key === 'Enter') {
        handleDeleteClick(_id);
      }
  }

  document.addEventListener('keydown', handleEnterKey);
  return () => {
      document.removeEventListener('keydown', handleEnterKey);
  };
}, [onClose]);

    return (
        <div className="popup__trash">
            <button type="button" className="popup__button popup__button_trash" onClick={() => handleDeleteClick(_id)} onKeyDown={() => handleEnterKey()}>
              {isLoading ? "Borrando.." : "Sí"}
            </button>
          </div>
    )
}