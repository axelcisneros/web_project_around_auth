import { useContext, useRef, useEffect } from 'react';
import CurrentUserContext from '@contexts/CurrentUserContext';
import useFormValidation from '@utils/useFormValidation.js';

export default function EditAvatar(props) {
  const { validationConfig } = props;
  const userContext = useContext(CurrentUserContext); // Obtiene el objeto currentUser
  const { handleUpdateAvatar, isLoading } = userContext;
  const refAvatar = useRef(); // Crea una referencia 
  const formRef = useRef(null);
  const { resetValidation, errors, isReady } = useFormValidation(validationConfig, formRef);

  useEffect(() => {
    resetValidation();
  }, [isReady]);

  function handleSubmit(e) {
    e.preventDefault();
  
    handleUpdateAvatar({
      avatar: refAvatar.current.value// El valor de la entrada que obtuvimos utilizando la ref  ,
    });
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(onSubmit)();
    }
  };

    return (
        <form className="popup__form" noValidate onSubmit={handleSubmit} ref={formRef} onKeyDown={handleKeyDown}>
            <fieldset className="popup__content">
              <label className="popup__field popup__field_top">
                <input
                  type="url"
                  className="popup__input"
                  placeholder="URL a la imagen"
                  id="i-url-input"
                  ref={refAvatar} // Vincula la referencia al campo de entrada
                  name="userAvatar"
                  required
                />
                <span className="popup__input-error i-url-input-error">{errors.id}</span>
              </label>
              <button
              type="submit"
              className="popup__button"
              >
                {isLoading ? "Guardando.." : "Guardar"}
              </button>
            </fieldset>
          </form>
    );
}