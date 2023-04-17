import { createContext } from 'react';

const UserContext = createContext({
  client_id: null,
  setClientID: () => {},
});

export {UserContext};
