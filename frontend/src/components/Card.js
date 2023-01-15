import React, { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

export default function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  function handleZoomClick() {
    onCardClick(card);
  }

  function handleCardLike() {
    onCardLike(card);
  }

  function handleCardDelete() {
    onCardDelete(card);
  }

  const currentUser = useContext(CurrentUserContext);
  const isOwnCard = currentUser._id === card.owner._id;
  const isCardLiked = card.likes.some((user) => user._id === currentUser._id);

  return (
    <li className="gallery__item">
      <button type="button" className="gallery__remove-button" style={{ display: isOwnCard ? 'block' : 'none' }} onClick={handleCardDelete}></button>
      <img className="gallery__item-photo" src={card.link} alt={card.name} onClick={handleZoomClick} />
      <div className="gallery__item-description">
        <h2 className="gallery__item-name">{card.name}</h2>
        <div className="gallery__like-container">
          <button
            type="button"
            className={`gallery__like-button ${isCardLiked ? 'gallery__like-button_active' : ''}`}
            onClick={handleCardLike}
          ></button>
          <div className="gallery__like-counter">{card.likes.length}</div>
        </div>
      </div>
    </li>
  );
}
