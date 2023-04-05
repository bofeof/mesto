import IdentityForm from './IdentityForm';

export default function Login({ onUserLogin }) {
  function handleSignIn(userLoginData) {
    onUserLogin(userLoginData);
  }

  return (
    <IdentityForm
      header="Вход"
      buttonName="Войти"
      onClick={handleSignIn}
      askSignIn={<p className="identity__signin-ask"></p>}
    />
  );
}
