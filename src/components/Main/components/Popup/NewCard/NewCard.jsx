import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import CurrentUserContext from '@contexts/CurrentUserContext';
import errorMessages from '@utils/errorMessages';
import { INPUT_CARD_NAME_MIN_LENGTH, INPUT_CARD_NAME_MAX_LENGTH } from '@utils/validationUtils';

export default function NewCard(props) {
  const { validationConfig: config } = props;
  const userContext = useContext(CurrentUserContext);
  const { handleAddPlaceSubmit, isLoading } = userContext;
  const [disabled, setDisabled] = useState(true);
  const [touchedFields, setTouchedFields] = useState({ cardTitle: false, cardLink: false });
  const { register, handleSubmit, watch, setError, clearErrors, formState: { errors, isValid }, trigger } = useForm({
    defaultValues: {
      cardTitle: '',
      cardLink: '',
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
    handleAddPlaceSubmit({ name: data.cardTitle, link: data.cardLink });
  };

  const handleValidation = (e) => {
    const input = e.target;
    const value = input.value.trim();
    let errorMessage = '';

    setTouchedFields((prev) => ({ ...prev, [input.name]: true }));

    if (!value) {
      errorMessage = errorMessages.required;
    } else if (input.type === 'url' && !/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(value)) {
      errorMessage = errorMessages.url;
    } else if (value.length < INPUT_CARD_NAME_MIN_LENGTH) {
      errorMessage = errorMessages.minLength;
    } else if (value.length > INPUT_CARD_NAME_MAX_LENGTH && input.type !== 'url') {
      errorMessage = errorMessages.maxLength;
    }

    if (errorMessage) {
      setError(input.name, {
        type: 'manual',
        message: errorMessage,
      });
    } else {
      clearErrors(input.name);
    }
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
            className={`popup__input ${errors.cardTitle ? config.inputErrorClass : ''}`}
            placeholder="Titulo"
            id="title-input"
            {...register('cardTitle', { 
              required: errorMessages.required,
              minLength: { value: INPUT_CARD_NAME_MIN_LENGTH, message: errorMessages.minLength },
              maxLength: { value: INPUT_CARD_NAME_MAX_LENGTH, message: errorMessages.maxLength },
            })}
            onInput={handleValidation}
            onBlur={handleValidation}
          />
          {touchedFields.cardTitle && errors.cardTitle && <span className={`popup__input-error ${config.errorClass}`}>{errors.cardTitle.message}</span>}
        </label>
        <label className="popup__field">
          <input
            type="url"
            className={`popup__input ${errors.cardLink ? config.inputErrorClass : ''}`}
            placeholder="URL a la imagen"
            id="url-input"
            {...register('cardLink', {
              required: errorMessages.required,
              pattern: {
                value: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i,
                message: errorMessages.url,
              },
            })}
            onInput={handleValidation}
            onBlur={handleValidation}
          />
          {touchedFields.cardLink && errors.cardLink && <span className={`popup__input-error ${config.errorClass}`}>{errors.cardLink.message}</span>}
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
