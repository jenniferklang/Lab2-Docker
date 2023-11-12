CREATE TABLE cities (
  id serial PRIMARY KEY,
  name text UNIQUE NOT NULL,
  population INTEGER NOT NULL
);

CREATE TABLE food_wholesalers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  product TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  city_id INT,
  FOREIGN KEY (city_id) REFERENCES cities(id)
);

INSERT INTO cities (name, population)
VALUES ('Stockholm', 1372565);

INSERT INTO cities (name, population)
VALUES ('Göteborg', 549839);

INSERT INTO food_wholesalers (name, product, price, city_id)
VALUES ('Johan i Hallen', 'Nötfärs', 90.99, 2);

INSERT INTO food_wholesalers (name, product, price, city_id)
VALUES ('Centrala Partihallarna', 'Äpplen', 21.90, 1);
