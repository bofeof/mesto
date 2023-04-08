# Mesto

[Mesto](https://bofeof.nomoredomains.club) is a type of Instagram prototype.  
If https://bofeof.nomoredomains.club (hosting probably expired) is not available you can also check another deployment [Mesto frontend](https://bofeof.github.io/react-mesto-auth) or run Mesto locally.

This project includes [frontend](https://github.com/bofeof/react-mesto-auth) and [backend](https://github.com/bofeof/express-mesto-gha) parts and it's deployed and developed to practice programming skills.

Demo [Demo of Mesto](https://github.com/bofeof/react-mesto-api-full/issues/5)

If you want to create a new user, please, use fake email(for example test@test.com)

## Available functionality runs through the server:

### Standard functionality for users:

- Working with popups to change user avatar, name and bio sections;
- Create new photocards;
- Zoom photocards;
- Toggle like;
- Remove card and confirmation window for this action;
- Login and register with fail or successfull-info popup;
- Available screen width for this app: from 320px to 1280px.

### Additional features for users I hope to implement in the future:

✅ Forms validator: avatar, user, add card, login and register;  
✅ Submit-buttons control for all forms;  
✅ Close all popups by Esc-button and clicking overlay;  
✅ Classic and burger menu, it depends on screen width:

- burger menu (width < 768px);
- classic menu (width > 768px).

✅ 404 page and button for redirection if something is wrong (with multiple slashes).  
✅ JWT in cookie

❔🔜 Muiltilanguage support.

## Technologies:

Frontend:

- JS + React
- HTML, CSS (BEM)
- Webpack

Backend:

- Node.js + Express;
- MongoDb\Mongoose;
- JWT in cookie,
- Nginx
- pm2
- Celebrate
- Winston
- Letsencrypt
- Jest\* (request testing, backend side)

## Backend part:

IP prod 158.160.55.250  
Current prod: https://api.bofeof.nomoredomains.rocks  
or
Local: http://localhost:3000

#### API

- Url: https://api.bofeof.nomoredomains.rocks or http://localhost:3000
- headers: {  
   'Content-Type': 'application/json',  
   'Accept': 'application/json',  
   'Access-Control-Allow-Credentials': true,  
  }  
  'credentials': 'include'

Available endpoints:
| **Method** | **Endpoint** | **Action** | **Auth required** | **Required body data** |
|------------|------------------|------------------------------------------------------------|--------------------------------------|---------------------------|
| POST | /signup | Create user | | {email: '', password: ''} |
| POST | /signin | Log in | | {email: '', password: ''} |
| GET | /users | Get all users | Yes | |
| GET | /users/:userId | Get user by id | Yes | |
| GET | /users/me | Get info about logged in user | Yes | |
| PATCH | /users/me | Update description and name of current user | Yes | {name: '', about: ''} |
| PATCH | /users/me/avatar | Update avatar of current user | Yes | {avatar: ''} |
| GET | /cards | Get all cards from gallery | Yes | |
| POST | /cards | Create new card | Yes | {name: '', link: ''} |
| DELETE | /cards/:cardId | Remove card. User has ability to remove only its own cards | Yes | |
| PUT | /cards/:cardId | Set like | Yes | |
| DELETE | /cards/:cardId | Remove like | Yes | |

🔜 Response codes, messages for user

#### Test (Jest)

Backend part includes request testing for user and cards actions with Jest.  
Use `npm run test`

## How to install and run locally

It may happen that Mesto can not be available due to hosting expiration. You have ability to deploy this app\repo locally.  
So, if you don't want to deploy this app locally you can also check frontend part using [Mesto frontend](https://bofeof.github.io/react-mesto-auth)

### Settings for frontend (./frontend folder). All comands are located in package.json:

You need to change value of REACT_APP_BASE_URL (frontend/src/utils/constants.js)

- `npm install` Install all dependencies before start.
- `npm run build` Builds the app for production to the `build` folder.
- `npm run start` Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Settings for backend (./backend folder). All comands are located in package.json:

- `npm install` Install all dependencies before start.
- `npm run start` Run Mesto server. http://localhost:3000
- `npm run dev` Run server with hot-reload (for dev purposes)
- `npm run test` Jest request-tests for user and cards actions (for dev purposes). Test data is placed in ./backend/test/fixtures. Jest tests - ./backend/tests
