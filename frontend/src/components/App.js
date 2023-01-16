import { useEffect, useState } from 'react';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';

import { API } from '../utils/API.js';
import { register, login, checkToken } from '../utils/userAuth.js';
import { configAPI } from '../utils/constants.js';

import Header from '../components/Header';
import Main from '../components/Main';
import Footer from '../components/Footer';
import Login from './Login';
import Register from './Register';
import ProptectedRoute from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';
import PageNotFound from './PageNotFound.js';

import ImagePopup from '../components/ImagePopup';
import PopupConfirm from '../components/PopupConfirm';
import EditProfilePopup from '../components/EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';

import { CurrentUserContext, LoggedInContext } from '../contexts/CurrentUserContext';

export default function App() {
  const history = useHistory();
  const api = new API(configAPI);

  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});

  const [loginId, setLoginId] = useState('');
  const [loginEmail, setLoginEmail] = useState('');

  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [isCardZoomPopupOpen, setCardZoomPopupOpen] = useState(false);
  const [isConfirmPopupOpen, setConfirmPopupOpen] = useState(false);
  const [isInfoPopupOpen, setIsInfoPopupOpen] = useState(false);

  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState({});
  const [cardForRemove, setCardForRemove] = useState({});

  const [btnTextAvatarSubmit, setBtnTextAvatarSubmit] = useState('Сохранить');
  const [btnTextUserSubmit, setBtnTextUserSubmit] = useState('Сохранить');
  const [btnTextCardSubmit, setBtnTextCardSubmit] = useState('Создать');
  const [btnTextConfirm, setBtnTextConfirm] = useState('Да');

  // status for info-popup (api requests: login, register)
  const [isSuccessful, setIsSuccessful] = useState(false);

  // first run: check login, get data about gallery and user
  useEffect(() => {
    // check login
    if (localStorage.getItem('mestoToken')) {
      checkToken(localStorage.getItem('mestoToken'))
        .then((res) => {
          // if jwt secret key is changed by dev while user has active session
          if(!res){
            localStorage.clear();
            setLoggedIn(false);
            history.push('/sign-in');
            return
          }
          setLoginId(() => res.data._id);
          setLoginEmail(() => res.data.email);
          setLoggedIn(true);
          history.push('/');

          // get data about user, gallery
          Promise.all([api.getGalleryData(), api.getUserData()])
            .then(([cardsData, userData]) => {
              setCurrentUser(userData.data);
              setCards(cardsData.data);
            })
            .catch((err) => console.log(`Ошибка: ${err}`));
        })
        .catch((err) => {
          localStorage.removeItem('mestoToken');
          setLoggedIn(false);
          console.log(err);
        });
    }
  }, [loggedIn]);

  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
    setCardZoomPopupOpen(true);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((prevStateCards) => prevStateCards.map((c) => (c._id === card._id ? newCard.data : c)));
      })
      .catch((err) => console.log(`Ошибка: ${err}`));
  }

  // before removing card
  function handleAskConfirmationClick(card) {
    setCardForRemove(card);
    setConfirmPopupOpen(true);
  }

  function handleUserLogin(userLoginData) {
    login(userLoginData)
      .then((res) => {
        if (res.token) {
          localStorage.setItem('mestoToken', res.token);
          checkToken(localStorage.getItem('mestoToken'))
            .then((res) => {
              // set user Login Data (id, email)
              setLoginId(() => res.data._id);
              setLoginEmail(() => res.data.email);

              // set res to localstorage
              localStorage.setItem('mestoUserId', loginId);
              localStorage.setItem('mestoUserEmail', loginEmail);

              setLoggedIn(true);
              history.push('/');
            })
            .catch((err) => console.log(err));
        } else {
          setLoggedIn(false);
          setIsSuccessful(false);
          setIsInfoPopupOpen(true);
        }
      })
      .catch(() => {
        setLoggedIn(false);
        setIsSuccessful(false);
        setIsInfoPopupOpen(true);
      });
  }

  function handleUserRegister(userRegisterData) {
    register(userRegisterData)
      .then((res) => {
        if (res.data) {
          setIsSuccessful(true);
          setIsInfoPopupOpen(true);
          history.push('/sign-in');
        } else {
          setIsSuccessful(false);
          setIsInfoPopupOpen(true);
        }
      })
      .catch(() => {
        setIsSuccessful(false);
        setIsInfoPopupOpen(true);
      });
  }

  function handleUserLogout() {
    localStorage.removeItem('mestoUserId');
    localStorage.removeItem('mestoUserEmail');
    localStorage.removeItem('mestoToken');
    setLoggedIn(false);
    history.push('/sign-in');
  }

  function onCardRemove() {
    setBtnTextConfirm(() => 'Удаление...');
    api
      .removePhotoCard(cardForRemove._id)
      .then(() => {
        setCards((prevGallery) => prevGallery.filter((prevCard) => prevCard._id !== cardForRemove._id));
      })
      .catch((err) => console.log(`Ошибка: ${err}`))
      .finally(() => setBtnTextConfirm(() => 'Да'));
  }

  function closeAllPopups() {
    setEditProfilePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setAddPlacePopupOpen(false);
    setConfirmPopupOpen(false);
    setCardZoomPopupOpen(false);

    // popup info
    setIsInfoPopupOpen(false);

    setSelectedCard({});
    setCardForRemove({});
  }

  function onUserUpdate(userData) {
    setBtnTextUserSubmit(() => 'Сохранение...');
    api
      .setUserData(userData)
      .then((userData) => {
        setCurrentUser(userData.data);
      })
      .catch((err) => console.log(`Ошибка: ${err}`))
      .finally(() => setBtnTextUserSubmit(() => 'Cохранить'));
  }

  function onAvatarUpdate(avatarLink) {
    setBtnTextAvatarSubmit(() => 'Сохранение...');
    api
      .changeUserAvatar(avatarLink)
      .then((userData) => {
        setCurrentUser(userData.data);
      })
      .catch((err) => console.log(`Ошибка: ${err}`))
      .finally(() => setBtnTextAvatarSubmit(() => 'Cохранить'));
  }

  function onCardCreate(cardData) {
    setBtnTextCardSubmit(() => {
      return 'Создание...';
    });
    api
      .addPhotoCard(cardData)
      .then((newCard) => {
        setCards((prevCards) => {
          return [newCard.data, ...prevCards];
        });
      })
      .catch((err) => console.log(`Ошибка: ${err}`))
      .finally(() => setBtnTextCardSubmit(() => 'Создать'));
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <LoggedInContext.Provider value={loggedIn}>
        <div className="page page-content">
          <Header onLogOut={handleUserLogout} loginEmail={loginEmail} history={history} />

          <Switch>
            <ProptectedRoute
              path="/"
              exact
              component={Main}
              // props for Main:
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleAskConfirmationClick}
              onClose={closeAllPopups}
              cards={cards}
              card={selectedCard}
            />

            <Route exact path="/sign-up">
              <Register onUserRegister={handleUserRegister} history={history} />
            </Route>

            <Route exact path="/sign-in">
              <Login onUserLogin={handleUserLogin} />
            </Route>

            <Route path="*">
              <PageNotFound history={history}/>
            </Route>

            <Route>{loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}</Route>
          </Switch>

          <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onSubmit={onUserUpdate} buttonSubmitName={btnTextUserSubmit} />

          <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onSubmit={onAvatarUpdate} buttonSubmitName={btnTextAvatarSubmit} />

          <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onSubmit={onCardCreate} buttonSubmitName={btnTextCardSubmit} />

          <ImagePopup card={selectedCard} isOpen={isCardZoomPopupOpen} onClose={closeAllPopups} />

          <PopupConfirm
            title="Вы уверены?"
            buttonConfirmName={btnTextConfirm}
            isOpen={isConfirmPopupOpen}
            onClose={closeAllPopups}
            onConfirm={onCardRemove}
            card={cardForRemove}
          />

          <InfoTooltip isOpen={isInfoPopupOpen} onClose={closeAllPopups} isSuccessful={isSuccessful} />

          <Footer />
        </div>
      </LoggedInContext.Provider>
    </CurrentUserContext.Provider>
  );
}
