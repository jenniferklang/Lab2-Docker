const express = require("express"),
  path = require("path");
const cors = require("cors");
const app = express(),
  port = process.env.PORT || 3000;

const dotenv = require("dotenv"),
  { Client } = require("pg");
dotenv.config();

const client = new Client({
  connectionString: process.env.PGURI,
  password: process.env.DB_PASSWORD,
});

client.connect();
app.use(cors());

app.get("/api", async (_request, response) => {
  try {
    console.log("Inkommande GET-anrop till /api");
    const query = `
      SELECT cities.id AS city_id, cities.name AS city_name, food_wholesalers.name AS grossist_name, food_wholesalers.product, food_wholesalers.price
      FROM cities
      LEFT JOIN food_wholesalers ON cities.id = food_wholesalers.city_id;
    `;
    const { rows } = await client.query(query);
    response.send(rows);
  } catch (error) {
    console.error("Något gick fel: ", error);
    response.status(500).send("Något gick fel vid hämtning av stadsdata");
  }
});

app.get("/api/city/:city_id", (request, response) => {
  const cityId = request.params.city_id;
  const query = `
    SELECT cities.id AS city_id, cities.name AS city_name, food_wholesalers.name AS grossist_name, food_wholesalers.product, food_wholesalers.price
    FROM cities
    LEFT JOIN food_wholesalers ON cities.id = food_wholesalers.city_id
    WHERE cities.id = $1;
  `;

  client
    .query(query, [cityId])
    .then(({ rows }) => {
      response.send(rows);
    })
    .catch((error) => {
      console.error("Något gick fel: ", error);
      response.status(500).send("Något gick fel vid hämtning av stadsdata");
    });
});

app.delete(
  "/api/city/:city_id/grossist/:grossist_name",
  (request, response) => {
    const cityId = request.params.city_id;
    const grossistName = request.params.grossist_name;
    const query = `
      DELETE FROM food_wholesalers
      WHERE city_id = $1 AND name = $2;
    `;

    client
      .query(query, [cityId, grossistName])
      .then(() => {
        console.log(
          `Grossist ${grossistName} borttagen från stad med ID ${cityId}`
        );
        response.send("Grossist deleted successfully.");
      })
      .catch((error) => {
        console.error("Något gick fel: ", error);
        response.status(500).send("Något gick fel vid borttagning av grossist");
      });
  }
);

app.post("/api/city/:city_id/grossist", (request, response) => {
  const cityId = request.params.city_id;
  let query;

  if (cityId === "1") {
    query = `
      INSERT INTO food_wholesalers (name, product, price, city_id)
      VALUES ('Centrala partihallen', 'Äpplen', 21.9, $1);
    `;
  } else if (cityId === "2") {
    query = `
      INSERT INTO food_wholesalers (name, product, price, city_id)
      VALUES ('Johan i Hallen', 'Nötfärs', 90.99, $1);
    `;
  } else {
    return response.status(400).send("Ogiltig stad vald");
  }

  client
    .query(query, [cityId])
    .then(({ rows }) => {
      console.log(`Grossist tillagd i stad med ID ${cityId}`);
      response.status(201).json(rows[0]);
    })
    .catch((error) => {
      console.error("Något gick fel: ", error);
      response.status(500).send("Något gick fel vid tillägg av grossist");
    });
});

app.use(express.static(path.join(path.resolve(), "public")));

app.listen(port, () => {
  console.log(`Redo på http://localhost:${port}/`);
});
