import { Database } from "bun:sqlite";

const db = new Database("database.sqlite");

// Ativa as chaves estrangeiras (no SQLite vêm desativadas por padrão)
db.exec("PRAGMA foreign_keys = ON;");

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        username        TEXT NOT NULL UNIQUE,
        email           TEXT NOT NULL UNIQUE,
        password_hash   TEXT NOT NULL,
        phone           TEXT
    );

    CREATE TABLE IF NOT EXISTS addresses (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id         INTEGER NOT NULL,
        street          TEXT NOT NULL,
        number          TEXT NOT NULL,
        neighborhood    TEXT NOT NULL,
        city            TEXT NOT NULL,
        complement      TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS categories (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        name            TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS restaurants (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        category_id     INTEGER,
        name            TEXT NOT NULL,
        description     TEXT,
        delivery_time   INTEGER NOT NULL,          -- tempo de entrega em minutos
        delivery_fee    REAL NOT NULL DEFAULT 0,
        image           TEXT,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS dishes (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        restaurant_id   INTEGER NOT NULL,
        category_id     INTEGER,
        name            TEXT NOT NULL,
        description     TEXT,
        ingredients     TEXT,
        price           REAL NOT NULL,
        image           TEXT,
        FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS favorites (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id         INTEGER NOT NULL,
        restaurant_id   INTEGER,
        dish_id         INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
        FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE,
        -- o favorito é um restaurante OU um prato, nunca os dois
        CHECK ((restaurant_id IS NOT NULL) + (dish_id IS NOT NULL) = 1)
    );

    CREATE TABLE IF NOT EXISTS orders (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id         INTEGER NOT NULL,
        restaurant_id   INTEGER NOT NULL,
        address_id      INTEGER NOT NULL,
        status          TEXT NOT NULL DEFAULT 'pendente',
        payment_method  TEXT NOT NULL,
        notes           TEXT,
        total           REAL NOT NULL DEFAULT 0,
        created_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
        FOREIGN KEY (address_id) REFERENCES addresses(id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id        INTEGER NOT NULL,
        dish_id         INTEGER NOT NULL,
        quantity        INTEGER NOT NULL CHECK (quantity > 0),
        unit_price      REAL NOT NULL,             -- preço do prato no momento do pedido
        notes           TEXT,                      -- ex.: "sem cebola"
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (dish_id) REFERENCES dishes(id)
    );

    CREATE TABLE IF NOT EXISTS reviews (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id         INTEGER NOT NULL,
        restaurant_id   INTEGER NOT NULL,
        order_id        INTEGER UNIQUE,            -- no máximo uma avaliação por pedido
        rating          INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
        comment         TEXT,
        created_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
    );
`);

export { db };
