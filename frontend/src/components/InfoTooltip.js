import { useEffect } from 'react';

export default function InfoTooltip({ isOpen, onClose, isSuccessful }) {
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

  return (
    <div className={`popup popup__info ${isOpen ? 'popup_opened' : ''}`} onClick={handleClickOverlay}>
      <div className="popup__container">
        <button type="button" className="popup__close-button" onClick={onClose}></button>
        <div className="popup__form popup__info">
          <div className={`popup__info-status ${isSuccessful ? 'popup__info-ok' : 'popup__info-err'}`}></div>
          <h3 className="popup__info-text">
            {isSuccessful ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз.'}
          </h3>
        </div>
      </div>
    </div>
  );
}
