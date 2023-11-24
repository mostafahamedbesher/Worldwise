// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import styles from "./Form.module.css";
import Button from "./Button";

import BackButton from "./BackButton";
import Spinner from "./Spinner";
import { useUrlPosition } from "../hooks/useUrlPosition";
import { useCities } from "../Contexts/CitiesContext";
import { useNavigate } from "react-router-dom";
import Message from "./Message";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [isLoadingGeocoding, setIsloadingGeocoding] = useState(false);
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");
  const [geocodingErr, setGeocodingErr] = useState("");

  const [lat, lng] = useUrlPosition();

  const { setCurrentCity } = useCities();

  const { createCity, isLoading } = useCities();

  const navigate = useNavigate();

  const newAddedCity = {
    cityName,
    date: date.toISOString(),
    position: {
      lat,
      lng,
    },
    country,
    emoji,
    notes,
  };

  async function handleSubmit(e) {
    {
      e.preventDefault();

      if (!cityName || !date) return;

      await createCity(newAddedCity);
      // setCurrentCity(newAddedCity);
      navigate("/app/cities");
    }
  }

  //fetch city data
  useEffect(
    function () {
      if (!lat && !lng) return;

      async function fetchCityData() {
        try {
          setIsloadingGeocoding(true);
          setGeocodingErr("");
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
          );

          const data = await res.json();
          // console.log(data);

          if (!data.countryCode)
            throw new Error(
              "That doesnot seem to be a city. click somewhere else 😅"
            );

          setCityName(data.city || data.locality || "");
          setCountry(data.countryName);
          setEmoji(convertToEmoji(data.countryCode));
        } catch (err) {
          setGeocodingErr(err.message);
        } finally {
          setIsloadingGeocoding(false);
        }
      }

      fetchCityData();
    },
    [lat, lng]
  );

  if (!lat && !lng) return <Message message={"Start by clicking on the map"} />;

  if (geocodingErr) return <Message message={geocodingErr} />;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      {isLoadingGeocoding ? (
        <Spinner />
      ) : (
        <>
          <div className={styles.row}>
            <label htmlFor="cityName">City name</label>
            <input
              id="cityName"
              onChange={(e) => setCityName(e.target.value)}
              value={cityName}
            />
            <span className={styles.flag}>{emoji}</span>
          </div>

          <div className={styles.row}>
            <label htmlFor="date">When did you go to {cityName}?</label>
            {/* <input
              id="date"
              onChange={(e) => setDate(e.target.value)}
              value={formatDate(date)}
            /> */}

            <DatePicker
              id="date"
              selected={date}
              onChange={(date) => setDate(date)}
              dateFormat="dd/MM/yyyy"
            />
          </div>

          <div className={styles.row}>
            <label htmlFor="notes">Notes about your trip to {cityName}</label>
            <textarea
              id="notes"
              onChange={(e) => setNotes(e.target.value)}
              value={notes}
            />
          </div>

          <div className={styles.buttons}>
            <Button type="primary">Add</Button>
            <BackButton />
          </div>
        </>
      )}
    </form>
  );
}

export default Form;
