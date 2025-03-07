import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import CurrentUserContext from '@contexts/CurrentUserContext';
import errorMessages from '@utils/errorMessages';
import { validateInput, INPUT_USER_NAME_MIN_LENGTH, INPUT_USER_NAME_MAX_LENGTH, INPUT_USER_ABOUT_MAX_LENGTH } from '@utils/validationUtils';

export default function EditProfile(props) {
  const { validationConfig: config } = props;
  const userContext = useContext(CurrentUserContext);
  const { currentUser, handleUpdateUser, isLoading } = userContext;
  const [disabled, setDisabled] = useState(true);
  const { register, handleSubmit, watch, setError, clearErrors, formState: { errors, isValid }, trigger } = useForm({
    defaultValues: {
      userName: currentUser.name,
      userAbout: currentUser.about,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    trigger();
  }, [trigger]);

  useEffect(() => {
    setDisabled(!isValid);
  }, [isValid]);

  const watchedValues = watch();

  useEffect(() => {
    const hasErrors = Object.keys(errors).length > 0;
    const hasEmptyFields = Object.values(watchedValues).some(value => value.trim() === '');

    setDisabled(hasErrors || hasEmptyFields);
  }, [errors, watchedValues]);

  const onSubmit = (data) => {
    handleUpdateUser(data.userName, data.userAbout);
  };

  const handleValidation = (e) => {
    const input = e.target;
    input.setCustomValidity('');

    if (!input.checkValidity()) {
      const errorMessage = validateInput(input, errorMessages);

      input.setCustomValidity(errorMessage);
      setError(input.name, {
        type: 'manual',
        message: errorMessage,
      });
    } else {
      input.setCustomValidity('');
      clearErrors(input.name);
    }

    input.reportValidity();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(onSubmit)();
    }
  };

  return (
    <form className="popup__form" noValidate onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown}>
      <fieldset className="popup__content">
        <label className="popup__field popup__field_top">
          <input
            type="text"
            className={`popup__input ${errors.userName ? config.inputErrorClass : ''}`}
            placeholder="Nombre"
            id="name-input"
            {...register('userName', { 
              required: errorMessages.required,
              minLength: { value: INPUT_USER_NAME_MIN_LENGTH, message: errorMessages.minLength },
              maxLength: { value: INPUT_USER_NAME_MAX_LENGTH, message: errorMessages.maxLength },
            })}
            onInput={handleValidation}
            onBlur={handleValidation}
          />
          {errors.userName && <span className={`popup__input-error ${config.errorClass}`}>{errors.userName.message}</span>}
        </label>
        <label className="popup__field">
          <input
            type="text"
            className={`popup__input ${errors.userAbout ? config.inputErrorClass : ''}`}
            placeholder="Acerca de mí"
            id="about-input"
            {...register('userAbout', { 
              required: errorMessages.required,
              minLength: { value: INPUT_USER_NAME_MIN_LENGTH, message: errorMessages.minLength },
              maxLength: { value: INPUT_USER_ABOUT_MAX_LENGTH, message: errorMessages.maxLength },
            })}
            onInput={handleValidation}
            onBlur={handleValidation}
          />
          {errors.userAbout && <span className={`popup__input-error ${config.errorClass}`}>{errors.userAbout.message}</span>}
        </label>
        <button
          type="submit"
          className={`popup__button ${disabled ? config.inactiveButtonClass : ''}`}
          disabled={disabled}
        >
          {isLoading ? 'Guardando...' : 'Guardar'}
        </button>
      </fieldset>
    </form>
  );
}
