import { Link } from 'react-router-dom';

export default function Forbidden() {
  return (
    <>
      <h1>You can't open this page</h1>
      <p>Your account type does not have permission to see it.</p>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </>
  );
}