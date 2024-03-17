import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

const Error = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      {isRouteErrorResponse(error) && (
        <>
          <p>Sorry, an unexpected error has occurred.</p>
          <p>
            <i>{error.statusText || error.data?.message}</i>
          </p>
        </>
      )}
    </div>
  );
};

export default Error;
