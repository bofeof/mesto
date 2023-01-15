import IdentityForm from './IdentityForm';

export default function Register({ onUserRegister, history }) {
  function handleSignUp(userRegisterData) {
    onUserRegister(userRegisterData);
  }

  function handleRedirect(evt) {
    evt.preventDefault();
    history.push('/sign-in');
  }

  return (
    <>
      <IdentityForm
        header="Регистрация"
        buttonName="Зарегистрироваться"
        onClick={handleSignUp}
        askSignIn={
          <p className="identity__signin-ask">
            Уже зарегистрированы?{' '}
            <a className="identity__signin-link" href="./sign-in" onClick={handleRedirect}>
              Войти
            </a>
          </p>
        }
      />
    </>
  );
}
