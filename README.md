# Mesto 

[Mesto]( https://bofeof.nomoredomains.club) is a type of Instagram prototype. This project includes [frontend](https://github.com/bofeof/react-mesto-auth) and [backend](https://github.com/bofeof/express-mesto-gha) parts and it's deployed and developed to practice programming skills.

Click this [link](https://bofeof.nomoredomains.club) to check it out.


## Available functionality runs through the server:

### Standard functionality for users:
 
* Working with popups to change user avatar, name and bio sections;
* Create new photocards;
* Zoom photocards;
* Toggle like;
* Remove card and confirmation window for this action;
* Login and register with fail or successfull-info popup;
* Available screen width for this app: from 320px to 1280px.


 ### Additional features for users I hope to implement in the future:
✅ Forms validator: avatar, user, add card, login and register;  
✅ Submit-buttons control for all forms;  
✅ Close all popups by Esc-button and clicking overlay;  
✅ Classic and burger menu, it depends on screen width:
* burger menu (width < 768px);  
* classic menu (width > 768px).

✅ 404 page and button for redirection if something is wrong.
 
 🔜 Muiltilanguage support.


## Technologies:

Frontend:
* JS + React
* HTML, CSS (BEM)
* Webpack

Backend:
* Node.js + Express;
* MongoDb\Mongoose;
* JWT,
* Nginx
* pm2
* Celebrate
* Winston
* Letsencrypt 
* Jest*

## Backend part:
IP 51.250.12.246  
Host: https://51.250.12.246 or http://localhost:3000  

#### API
\under construction\

#### Test (Jest)
Backend part includes request testing for user and cards actions with Jest.  
Use `npm run test`


## How to install and run locally

It may happen that Mesto can not be available due to hosting expiration. You have ability to deploy this app\repo locally.  
So, if you don't want to deploy this app locally you can also check frontend part using [Mesto frontend](https://bofeof.github.io/react-mesto-auth)

### Settings for frontend (./frontend folder). All comands are located in package.json:

* `npm install` Install all dependencies before start.
* `npm run build` Builds the app for production to the `build` folder.
* `npm run start` Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Settings for backend (./backend folder). All comands also are located in package.json:

* `npm install` Install all dependencies before start.
* `npm run build` Builds the app for production to the `build` folder.
* `npm run start` Run Mesto server. http://localhost:3000
* `npm run dev` Run server with hot-reload (for dev purposes)


















