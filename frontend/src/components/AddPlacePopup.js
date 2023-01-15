import { formValidator } from '../utils/formValidator';
import PopupWithForm from './PopupWithForm';
import React, { useEffect, useState } from 'react';

export default function AddPlacePopup({ isOpen, onClose, onSubmit, buttonSubmitName }) {
  const [cardInfo, setCardInfo] = useState({ name: '', link: '' });

  /**validation sets */
  const [inputsValidation, setInputsValidation] = useState({
    name: { isValid: false, errorText: '' },
    link: { isValid: false, errorText: '' },
  });

  const buttonStatus = ![inputsValidation.name.isValid, inputsValidation.link.isValid].includes(false);

  useEffect(() => {
    setCardInfo((prevCardInfo) => ({ ...prevCardInfo, name: '', link: '' }));
    setInputsValidation((prevInuptsValidation) => ({
      ...prevInuptsValidation,
      name: { isValid: false, errorText: '' },
      link: { isValid: false, errorText: '' },
    }));
  }, [isOpen]);

  function handleCardChange(evt) {
    const { name, value } = evt.target;
    const validationResult = formValidator(evt);
    setCardInfo((prevUserInfo) => ({ ...prevUserInfo, [name]: value }));
    setInputsValidation((prevInuptsValidation) => ({
      ...prevInuptsValidation,
      [name]: {
        isValid: validationResult.isValid,
        errorText: validationResult.errorText,
      },
    }));
  }

  function handleCardSubmit(evt) {
    evt.preventDefault();
    onSubmit({ name: cardInfo.name, link: cardInfo.link });
    onClose();
  }

  return (
    <PopupWithForm
      name="create-card"
      title="Новое место"
      buttonSubmitName={buttonSubmitName}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleCardSubmit}
      isButtonEnable={buttonStatus}
    >
      <>
        <input
          className="popup__input popup__input_form_photoname"
          type="text"
          name="name"
          id="photoname-input"
          placeholder="Название"
          minLength="2"
          maxLength="30"
          required="required"
          value={cardInfo.name}
          onChange={handleCardChange}
        />
        <span className="popup__input-error photoname-input-error">{inputsValidation.name.errorText}</span>

        <input
          className="popup__input popup__input_form_photolink"
          type="url"
          name="link"
          placeholder="Ссылка на картинку"
          id="url-input"
          required="required"
          value={cardInfo.link}
          onChange={handleCardChange}
        />
        <span className="popup__input-error url-input-error">{inputsValidation.link.errorText}</span>
      </>
    </PopupWithForm>
  );
}
