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

// these data about user and card are for cards manipulation
const currentUser = {
  email: 'user@test.com',
  password: '111111',
};

const newCard = {
  name: 'by user@test.com',
  link: 'https://devhumor.com/content/uploads/images/June2022/learning_programming.jpg',
};

module.exports = {
  newUser,
  invalidNewUser,
  newUserInfo,
  newUserAvatar,
  invalidUserInfo,
  invalidUserAvatar,
  currentUser,
  newCard,
};
