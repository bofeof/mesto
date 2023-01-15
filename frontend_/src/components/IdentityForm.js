import { useState, useEffect } from 'react';
import { formValidator } from '../utils/formValidator';

export default function IdentityForm({ header, buttonName, onClick, askSignIn }) {
  const [userInfo, setUserInfo] = useState({ email: '', password: '' });

  /**validation sets */
  const [inputsValidation, setInputsValidation] = useState({
    email: { isValid: false, errorText: '' },
    password: { isValid: false, errorText: '' },
  });

  const buttonStatus = ![inputsValidation.email.isValid, inputsValidation.password.isValid].includes(false);

  useEffect(() => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      email: '',
      password: '',
    }));

    setInputsValidation((prevInuptsValidation) => ({
      ...prevInuptsValidation,
      email: { isValid: false, errorText: '' },
      password: { isValid: false, errorText: '' },
    }));
  }, []);

  function handleInputChange(evt) {
    const { name, value } = evt.target;
    const validationResult = formValidator(evt);
    setUserInfo((prevUserInfo) => ({ ...prevUserInfo, [name]: value }));
    setInputsValidation((prevInuptsValidation) => ({
      ...prevInuptsValidation,
      [name]: {
        isValid: validationResult.isValid,
        errorText: validationResult.errorText,
      },
    }));
  }

  function handleFormSubmit(evt) {
    evt.preventDefault();
    onClick({ password: userInfo.password, email: userInfo.email });
  }

  return (
    <div className="identity__container">
      <h3 className="identity__header">{header}</h3>
      <form className="identity__form" noValidate>
        <input
          className="identity__form-input"
          type="email"
          name="email"
          autoComplete="username"
          id="email-input"
          placeholder="Email"
          required="required"
          value={userInfo.email}
          onChange={handleInputChange}
        ></input>
        <span className="identity__input-error">{inputsValidation.email.errorText}</span>

        <input
          className="identity__form-input"
          type="password"
          name="password"
          autoComplete="current-password"
          id="password"
          minLength="6"
          placeholder="Пароль"
          required="required"
          value={userInfo.password}
          onChange={handleInputChange}
        ></input>
        <span className="identity__input-error">{inputsValidation.password.errorText}</span>

        <button className="identity__form-button" onClick={handleFormSubmit} disabled={!buttonStatus}>
          {buttonName}
        </button>

        {askSignIn}
      </form>
    </div>
  );
}
