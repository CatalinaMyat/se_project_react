import { createContext } from "react";

// Will hold the logged-in user's object (or null if logged out)
const CurrentUserContext = createContext(null);

export default CurrentUserContext;
