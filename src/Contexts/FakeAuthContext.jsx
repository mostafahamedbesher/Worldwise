import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

const intialState = {
  user: null,
  isAuthinecated: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload, isAuthinecated: true };
    case "logout":
      return { ...state, user: null, isAuthinecated: false };
  }
}

const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

function AuthProvider({ children }) {
  const [{ user, isAuthinecated }, dispatch] = useReducer(reducer, intialState);

  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({ type: "login", payload: FAKE_USER });
    }
  }

  function logout() {
    dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider value={{ user, isAuthinecated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("context used outside AuthProvider");
  return context;
}

export { AuthProvider, useAuth };
