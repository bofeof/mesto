import { formValidator } from '../utils/formValidator';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import React, { useEffect, useState, useRef, useContext } from 'react';

export default function EditAvatarPopup({ isOpen, onClose, onSubmit, buttonSubmitName }) {
  const currentUser = useContext(CurrentUserContext);
  const avatarRef = useRef();

  /**validation sets */
  const [inputsValidation, setInputsValidation] = useState({
    avatar: { isValid: true, errorText: '' },
  });

  const buttonStatus = ![inputsValidation.avatar.isValid].includes(false);

  useEffect(() => {
    avatarRef.current.value = currentUser.avatar;
    setInputsValidation((prevInuptsValidation) => ({
      ...prevInuptsValidation,
      avatar: { isValid: true, errorText: '' },
    }));
  }, [isOpen, currentUser.avatar]);

  function handleAvatarChange(evt) {
    const { name } = evt.target;
    const validationResult = formValidator(evt);
    setInputsValidation((prevInuptsValidation) => ({
      ...prevInuptsValidation,
      [name]: {
        isValid: validationResult.isValid,
        errorText: validationResult.errorText,
      },
    }));
  }

  function handleAvatarSubmit(evt) {
    evt.preventDefault();
    onSubmit({ avatar: avatarRef.current.value });
    onClose();
  }

  return (
    <PopupWithForm
      name="change-avatar"
      title="Обновить аватар"
      buttonSubmitName={buttonSubmitName}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleAvatarSubmit}
      isButtonEnable={buttonStatus}
    >
      <>
        <input
          className="popup__input popup__input_form_avatar"
          type="url"
          name="avatar"
          placeholder="Ссылка на аватар"
          id="url-input-avatar"
          required="required"
          ref={avatarRef}
          onChange={handleAvatarChange}
        />

        <span className="popup__input-error url-input-avatar-error">{inputsValidation.avatar.errorText}</span>
      </>
    </PopupWithForm>
  );
}
