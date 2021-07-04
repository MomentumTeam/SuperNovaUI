/** @format */

import { Link } from 'react-router-dom';

/**
 * Display page not found message and link button to help the lost and stupid user to go to home page.
 */
const NotFound = () => (
  <div>
    <h1>NOT FOUND</h1>
    <Link to='/'>Go Home</Link>
  </div>
);

export default NotFound;
