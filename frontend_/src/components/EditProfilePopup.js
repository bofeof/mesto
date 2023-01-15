import { formValidator } from '../utils/formValidator';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import React, { useState, useEffect, useContext } from 'react';

export default function EditProfilePopup({ isOpen, onClose, onSubmit, buttonSubmitName }) {
  const currentUser = useContext(CurrentUserContext);
  const [userInfo, setUserInfo] = useState({ name: currentUser.name, about: currentUser.about });

  /**validation sets */
  const [inputsValidation, setInputsValidation] = useState({
    name: { isValid: true, errorText: '' },
    about: { isValid: true, errorText: '' },
  });

  const buttonStatus = ![inputsValidation.name.isValid, inputsValidation.about.isValid].includes(false);

  useEffect(() => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      name: currentUser.name,
      about: currentUser.about,
    }));

    setInputsValidation((prevInuptsValidation) => ({
      ...prevInuptsValidation,
      name: { isValid: true, errorText: '' },
      about: { isValid: true, errorText: '' },
    }));
  }, [isOpen, currentUser.name, currentUser.about]);

  function handleUserChange(evt) {
    const { name, value } = evt.target;
    const validationResult = formValidator(evt);
    setUserInfo((prevUserInfo) => ({ ...prevUserInfo, [name]: value }));
    setInputsValidation((prevInuptsValidation) => ({
      ...prevInuptsValidation,
      [name]: {
        isValid: validationResult.isValid,
        errorText: validationResult.errorText,
      },
    }));
  }

  function handleUserSubmit(evt) {
    evt.preventDefault();
    onSubmit({ name: userInfo.name, about: userInfo.about });
    onClose();
  }

  return (
    <PopupWithForm
      name="edit-user"
      title="Редактировать профиль"
      buttonSubmitName={buttonSubmitName}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleUserSubmit}
      isButtonEnable={buttonStatus}
    >
      <>
        <input
          className="popup__input popup__input_form_name"
          type="text"
          name="name"
          id="username-input"
          placeholder="Имя"
          minLength="2"
          maxLength="40"
          required="required"
          onChange={handleUserChange}
          value={userInfo.name || ''}
        />
        <span className="popup__input-error username-input-error"> {inputsValidation.name.errorText}</span>

        <input
          className="popup__input popup__input_form_job"
          type="text"
          name="about"
          id="jobinfo-input"
          placeholder="О себе"
          minLength="2"
          maxLength="200"
          required="required"
          onChange={handleUserChange}
          value={userInfo.about || ''}
        />
        <span className="popup__input-error jobinfo-input-error">{inputsValidation.about.errorText}</span>
      </>
    </PopupWithForm>
  );
}
