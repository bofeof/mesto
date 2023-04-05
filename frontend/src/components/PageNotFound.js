export default function PageNotFound({ history }) {
  function handleRedirectStartPage() {
    history.push('/');
  }

  return (
    <>
      <div className="page__not-found-button" onClick={handleRedirectStartPage}>
        {' '}
        &larr; Назад
      </div>
      <div className="page__not-found"></div>
    </>
  );
}
