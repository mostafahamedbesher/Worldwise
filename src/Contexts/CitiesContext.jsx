import { createContext, useContext, useEffect, useReducer } from "react";

// const BASE_URL = "http://localhost:8000";
const BASE_URL = "https://worldwise-server-nw3c.onrender.com";

const CitiesContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: action.payload };
    case "updateCities":
      return { ...state, cities: action.payload };
    case "createCity":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "updateCurrentCity":
      return { ...state, currentCity: action.payload };
    case "deleteCity":
      return {
        ...state,
        cities: state.cities.filter((delCity) => delCity.id !== action.payload),
        currentCity: {},
      };
    default:
      throw new Error("Unknown action type");
  }
}

const intialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
};

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    intialState
  );

  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  useEffect(function () {
    async function getCities() {
      try {
        // setIsLoading(true);
        dispatch({ type: "loading", payload: true });
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        // setCities(data);
        dispatch({ type: "updateCities", payload: data });
      } catch {
        alert("There was an error fetching data...");
      } finally {
        // setIsLoading(false);
        dispatch({ type: "loading", payload: false });
      }
    }

    getCities();
  }, []);

  async function getCurrentCity(id) {
    try {
      // setIsLoading(true);
      dispatch({ type: "loading", payload: true });
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      // setCurrentCity(data);
      dispatch({ type: "updateCurrentCity", payload: data });
    } catch {
      alert("There was an error fetching data...");
    } finally {
      dispatch({ type: "loading", payload: false });
      // setIsLoading(false);
    }
  }

  async function createCity(newCity) {
    try {
      // setIsLoading(true);
      dispatch({ type: "loading", payload: true });
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: { "Content-type": "application/json" },
      });
      const data = await res.json();
      // setCities((cities) => [...cities, data]);
      dispatch({ type: "createCity", payload: data });
    } catch {
      alert("There was an error fetching data...");
    } finally {
      // setIsLoading(false);
      dispatch({ type: "loading", payload: false });
    }
  }

  async function deleteCity(id) {
    try {
      // setIsLoading(true);
      dispatch({ type: "loading", payload: true });
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });

      // setCities((cities) => cities.filter((delCity) => delCity.id !== id));
      dispatch({
        type: "deleteCity",
        payload: id,
      });
    } catch {
      alert("There was an error deleting city...");
    } finally {
      // setIsLoading(false);
      dispatch({ type: "loading", payload: false });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        // setCurrentCity,
        getCurrentCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("The CitiesContext was used before CitiesProvider");

  return context;
}

export { CitiesProvider, useCities };
