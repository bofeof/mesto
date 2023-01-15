import React from 'react';
import userEditInfoIcon from '../images/edit/edit-avatar.png';
import defaultUserAvatar from '../images/avatar.jpg';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import Card from './Card';

export default function Main(props) {
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main className="content">
      <section className="user">
        <div className="user__avatar-container user__avatar-editor" onClick={props.onEditAvatar}>
          <img className="user__avatar" src={currentUser.avatar || defaultUserAvatar} alt={`Фото пользователя: ${currentUser.name}`} />
          <div className="user__avatar-overlay">
            <img className="user__avatar-icon" src={userEditInfoIcon} alt="Иконка редактирования аватара" />
          </div>
        </div>

        <div className="user__info">
          <div className="user__header">
            <h1 className="user__name">{currentUser.name}</h1>
            <button type="button" className="user__edit-button" onClick={props.onEditProfile}></button>
          </div>
          <p className="user__job">{currentUser.about}</p>
        </div>
        <button className="user__add-button" type="button" onClick={props.onAddPlace}></button>
      </section>

      {/* gallery */}
      <section aria-label="Галлерея мест">
        <ul className="gallery">
          {props.cards.map((card) => {
            return (
              <Card key={card._id} card={card} onCardClick={props.onCardClick} onCardLike={props.onCardLike} onCardDelete={props.onCardDelete} />
            );
          })}
        </ul>
      </section>
    </main>
  );
}
