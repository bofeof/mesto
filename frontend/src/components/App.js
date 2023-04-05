import { useEffect, useState } from 'react';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';

import MainAPI from '../utils/MainAPI.js';
import UserAuthAPI from '../utils/UserAuthAPI.js';
import { CONFIG_API } from '../utils/requestConstants.js';
import clearLocalStorage from '../utils/clearLocalStorage.js';

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
  const mainAPI = new MainAPI(CONFIG_API);
  const userAuthAPI = new UserAuthAPI(CONFIG_API);

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

  function showPopUpError() {
    setIsSuccessful(false);
    setIsInfoPopupOpen(true);
  }

  // first run: check login, get data about gallery and user
  useEffect(() => {
    // check login

    userAuthAPI
      .checkCurrentUser()
      .then((res) => {
        // if jwt secret key is changed by dev while user has active session
        if (!res || !res.data) {
          clearLocalStorage();
          setLoggedIn(false);
          history.push('/sign-in');
          return;
        }

        setLoginId(() => res.data._id);
        setLoginEmail(() => res.data.email);
        setLoggedIn(true);

        if (loggedIn && ['', '/', '/sign-in', 'sign-up'].includes(history.location.pathname)) {
          history.push('/');
        }

        // get data about user, gallery
        Promise.all([mainAPI.getGalleryData(), mainAPI.getUserData()])
          .then(([cardsData, userData]) => {
            setCurrentUser(userData.data);
            setCards(cardsData.data);
          })
          .catch((err) => console.log(`Ошибка: ${err.message}`));
      })
      .catch((err) => {
        setLoggedIn(false);
        console.log(err.message);
      });
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
    mainAPI
      .changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((prevStateCards) => prevStateCards.map((c) => (c._id === card._id ? newCard.data : c)));
      })
      .catch((err) => console.log(`Ошибка: ${err.message}`));
  }

  // before removing card
  function handleAskConfirmationClick(card) {
    setCardForRemove(card);
    setConfirmPopupOpen(true);
  }

  function handleUserLogin(userLoginData) {
    userAuthAPI
      .login(userLoginData)
      .then((res) => {
        if (res.message === 'Пользователь зашел в аккаунт') {
          userAuthAPI
            .checkCurrentUser()
            .then((userData) => {
              // set user Login Data (id, email)
              setLoginId(() => userData.data._id);
              setLoginEmail(() => userData.data.email);

              // set res to localstorage
              localStorage.setItem('mestoUserId', loginId);
              localStorage.setItem('mestoUserEmail', loginEmail);

              setLoggedIn(true);
              history.push('/');
            })
            .catch((err) => console.log(err.message));
        } else {
          throw new Error({ message: 'Необходима авторизация' });
        }
      })
      .catch((err) => {
        console.log(err.message);
        setLoggedIn(false);
        showPopUpError();
      });
  }

  function handleUserRegister(userRegisterData) {
    userAuthAPI
      .register(userRegisterData)
      .then((res) => {
        if (res.data) {
          setIsSuccessful(true);
          setIsInfoPopupOpen(true);
          history.push('/sign-in');
        } else {
          showPopUpError();
        }
      })
      .catch((err) => {
        console.log(err.message);
        showPopUpError();
      });
  }

  function handleUserLogout() {
    userAuthAPI
      .logout()
      .then((res) => {
        clearLocalStorage();
        setLoggedIn(false);
        history.push('/sign-in');
      })
      .catch((err) => {
        console.log(err.message);
        showPopUpError();
      });
  }

  function onCardRemove() {
    setBtnTextConfirm(() => 'Удаление...');
    mainAPI
      .removePhotoCard(cardForRemove._id)
      .then(() => {
        setCards((prevGallery) => prevGallery.filter((prevCard) => prevCard._id !== cardForRemove._id));
      })
      .catch((err) => console.log(`Ошибка: ${err.message}`))
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
    mainAPI
      .setUserData(userData)
      .then((userData) => {
        setCurrentUser(userData.data);
      })
      .catch((err) => console.log(`Ошибка: ${err.message}`))
      .finally(() => setBtnTextUserSubmit(() => 'Cохранить'));
  }

  function onAvatarUpdate(avatarLink) {
    setBtnTextAvatarSubmit(() => 'Сохранение...');
    mainAPI
      .changeUserAvatar(avatarLink)
      .then((userData) => {
        setCurrentUser(userData.data);
      })
      .catch((err) => console.log(`Ошибка: ${err.message}`))
      .finally(() => setBtnTextAvatarSubmit(() => 'Cохранить'));
  }

  function onCardCreate(cardData) {
    setBtnTextCardSubmit(() => {
      return 'Создание...';
    });
    mainAPI
      .addPhotoCard(cardData)
      .then((newCard) => {
        setCards((prevCards) => {
          return [newCard.data, ...prevCards];
        });
      })
      .catch((err) => console.log(`Ошибка: ${err.message}`))
      .finally(() => setBtnTextCardSubmit(() => 'Создать'));
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <LoggedInContext.Provider value={loggedIn}>
        <div className="page page-content">
          <Header onLogOut={handleUserLogout} loginEmail={loginEmail} history={history} />

          <Switch>
            <ProptectedRoute
              exact
              path="/"
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
              <PageNotFound history={history} />
            </Route>

            <Route>{loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}</Route>
          </Switch>

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onSubmit={onUserUpdate}
            buttonSubmitName={btnTextUserSubmit}
          />

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onSubmit={onAvatarUpdate}
            buttonSubmitName={btnTextAvatarSubmit}
          />

          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onSubmit={onCardCreate}
            buttonSubmitName={btnTextCardSubmit}
          />

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
