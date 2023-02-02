// this user is only user-manipulation: create, login, edit user-info
// after tests this user will be deleted
const newUser = {
  email: 'user@jest.com',
  password: '111111',
};

const invalidNewUser = {
  email: 'user',
  password: '111111',
};

const newUserInfo = {
  name: 'polna',
  about: 'dddd',
};

const newUserAvatar = {
  avatar: 'https://i.pinimg.com/originals/9a/43/c5/9a43c564d79134433ddf0556b6d5e192.jpg',
};

const invalidUserInfo = {
  name: 'p',
  about: 'd',
  avatar: 'pinimg.com/originals/9a/43/c5/9a43c564d79134433ddf0556b6d5e192.jpg',
};

const invalidUserAvatar = {
  avatar: 'pinimg.com/originals/9a/43/c5/9a43c564d79134433ddf0556b6d5e192.jpg',
};

const invalidUserId = "63d429720a2d97b7b5852d2*";

// these data about user and card are for cards manipulation
const newCard = {
  name: 'by user@test.com',
  link: 'https://devhumor.com/content/uploads/images/June2022/learning_programming.jpg',
};

// you can use any card id from another user
// we want to check the possibility of removing card that was created by another person
const anotherCardId = "63d5d73b6c890d040eb0f2fd";

const invalidNameNewCard = {
  name: '',
  link: 'https://devhumor.com/content/uploads/images/June2022/learning_programming.jpg',
};

const invalidLinkNewCard = {
  name: 'by user@jest.com',
  link: 'htt.com/content/uploads/images/June2022/learning_programming.jpg',
};
const invalidCardId = '63d42a090a2d97b7b5852d2A';

module.exports = {
  newUser,
  invalidUserId,
  invalidNewUser,
  newUserInfo,
  newUserAvatar,
  invalidUserInfo,
  invalidUserAvatar,
  newCard,
  anotherCardId,
  invalidNameNewCard,
  invalidLinkNewCard,
  invalidCardId,
};
