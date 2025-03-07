import { useEffect } from "react";

export default function Popup (props) {
    const { onClose, title, children } = props;

    useEffect(() => {
      function handleEscKey(e) {
          if (e.key === 'Escape') {
              onClose();
          }
      }

      document.addEventListener('keydown', handleEscKey);
      return () => {
          document.removeEventListener('keydown', handleEscKey);
      };
  }, [onClose]);

  function handleClickOutside(e) {
    if (e.target.classList.contains('popup')) {
        onClose();
    }
}

    return (
        <div className="popup" onClick={handleClickOutside}>        
          <button 
          aria-label="Close modal"
          type="button"
          className="popup__button popup__button_close"
          onClick={onClose}
          />
          {title && <h3 className="popup__subtitle">{title}</h3>}
          {children}
      </div>
    )
}