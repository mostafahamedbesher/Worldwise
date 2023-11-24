import { useCities } from "../Contexts/CitiesContext";
import styles from "./CountriesList.module.css";
import CountryItem from "./CountryItem";
import Spinner from "./Spinner";

function CountriesList() {
  const { cities, isLoading } = useCities();
  const countries = cities;

  if (isLoading) return <Spinner />;

  //create array that holds all country names
  const countriesNames = countries.map((country) => country.country);

  return (
    <ul className={styles.countryList}>
      {countries
        .filter((country, i) => i === countriesNames.indexOf(country.country))
        .map((country) => (
          <CountryItem country={country} key={country.id} />
        ))}
    </ul>
  );
}

export default CountriesList;
