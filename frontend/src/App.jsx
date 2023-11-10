import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [deleteClicked, setDeleteClicked] = useState(false);

  useEffect(() => {
    if (selectedCity) {
      fetch(`/api/city/${selectedCity}`)
        .then((response) => response.json())
        .then((result) => {
          setData(result);
        });
    }
  }, [selectedCity]);

  useEffect(() => {
    fetch("/api")
      .then((response) => response.json())
      .then((result) => {
        setData(result);
      });
  }, []);

  useEffect(() => {
    setDeleteClicked(false);
  }, [selectedCity]);

  const handleDeleteGrossist = (selectedCity, grossistName) => {
    fetch(`/api/city/${selectedCity}/grossist/${grossistName}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setDeleteClicked(true);
          return fetch(`/api/city/${selectedCity}`);
        } else {
          throw new Error("Failed to delete grossist.");
        }
      })
      .then((response) => response.json())
      .then((result) => {
        setData(result);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleAddStockholmGrossist = () => {
    console.log("Återställ Sthlm-knapp klickades.");
    fetch(`/api/city/1/grossist`, {
      method: "POST",
    })
      .then((response) => {
        if (response.ok) {
          return fetch(`/api/city/1`);
        } else {
          throw new Error("Failed to add Stockholm grossist.");
        }
      })
      .then((response) => response.json())
      .then((result) => {
        setData(result);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleAddGoteborgGrossist = () => {
    console.log("Återställ Gbg-knapp klickades.");
    fetch(`/api/city/2/grossist`, {
      method: "POST",
    })
      .then((response) => {
        if (response.ok) {
          return fetch(`/api/city/2`);
        } else {
          throw new Error("Failed to add Göteborg grossist.");
        }
      })
      .then((response) => response.json())
      .then((result) => {
        setData(result);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <h1>Livsmedelsgrossister</h1>
      <div className="dropdown-container">
        <select
          className="dropdown"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="">Välj en stad</option>
          <option value="1">Stockholm</option>
          <option value="2">Göteborg</option>
        </select>
      </div>

      {selectedCity && (
        <div className="card">
          <div>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((grossist) => (
                <ul key={grossist.city_id}>
                  <p>{grossist.city_name}</p>
                  <p>{grossist.grossist_name}</p>
                  <p>{grossist.product}</p>
                  <p>{grossist.price}</p>
                  <button
                    onClick={() => {
                      handleDeleteGrossist(
                        grossist.city_id,
                        grossist.grossist_name
                      );
                    }}
                  >
                    Ta bort
                  </button>

                  {deleteClicked && selectedCity === "1" ? (
                    <>
                      {" "}
                      <button onClick={handleAddStockholmGrossist}>
                        Lägg till Sthlm Grossist på nytt
                      </button>
                    </>
                  ) : null}
                  {deleteClicked && selectedCity === "2" ? (
                    <>
                      {" "}
                      <button onClick={handleAddGoteborgGrossist}>
                        Lägg till Gbg Grossist på nytt
                      </button>
                    </>
                  ) : null}
                </ul>
              ))
            ) : (
              <p>Ingen data tillgänglig än.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
