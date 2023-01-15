import { useEffect } from 'react';

export default function PopupConfirm({ title, buttonConfirmName, isOpen, onClose, onConfirm, card }) {
  // additional close-func by esc and overlay for popup
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscClose);
    }

    function handleEscClose(evt) {
      if (evt.key === 'Escape') {
        onClose();
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscClose);
    };
    
  }, [isOpen, onClose]);

  function handleClickOverlay(evt) {
    if (
      evt.target.classList.contains('popup') ||
      evt.target.classList.contains('popup__container') ||
      evt.target.classList.contains('popup__img-container')
    ) {
      onClose();
    }
  }

  function approveRemoving() {
    onConfirm(card);
    onClose();
  }

  return (
    <div className={`popup popup_confirm ${isOpen ? 'popup_opened' : ''}`} onClick={handleClickOverlay}>
      <div className="popup__container">
        <button type="button" className="popup__close-button" onClick={onClose}></button>
        <div className="popup__form popup__form_confirm">
          <h3 className="popup__form-header popup__form-header_confirm">{title}</h3>
          <button onClick={approveRemoving} className="popup__button popup__submit-button popup__save-button" type="submit" name="confirm">
            {buttonConfirmName}
          </button>
        </div>
      </div>
    </div>
  );
}
