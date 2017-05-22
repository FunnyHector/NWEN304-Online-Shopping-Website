/***********************
     Creating tables
 ***********************/

CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username CHARACTER VARYING(255) NOT NULL,
    password CHARACTER VARYING(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username CHARACTER VARYING(255) NOT NULL,
    password CHARACTER VARYING(255) NOT NULL,  -- not sure if we need to store their password if we use OATH
    email CHARACTER VARYING(255) UNIQUE NOT NULL,
    first_name CHARACTER VARYING(255),
    last_name CHARACTER VARYING(255),
    address CHARACTER VARYING(255),
    contact_no CHARACTER VARYING(255),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    last_visit_on TIMESTAMP,

    CONSTRAINT emailFormatCheck CHECK (email ~ '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
    CONSTRAINT contactFormatCheck CHECK (contact_no ~ '^(\+64|0)\d{9}$')
);

CREATE TABLE IF NOT EXISTS artists (
    id SERIAL PRIMARY KEY,
    artist_name CHARACTER VARYING(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS albums (
    id SERIAL PRIMARY KEY,
    title CHARACTER VARYING(255) NOT NULL,
    description TEXT,
    released_on DATE,
    genre CHARACTER VARYING(255),
    image BYTEA,
    is_compilation BOOLEAN NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    artist_id INTEGER REFERENCES artists (id)
);

CREATE TABLE IF NOT EXISTS songs (
    id SERIAL PRIMARY KEY,
    title CHARACTER VARYING(255) NOT NULL,
    track_no SMALLINT NOT NULL,
    artist_id INTEGER REFERENCES artists (id),
    album_id INTEGER REFERENCES albums (id)
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS order_details (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders (id),
    album_id INTEGER REFERENCES albums (id),
    quantity INTEGER NOT NULL,

    CONSTRAINT quantityCheck CHECK (quantity > 0)
);


/***********************
  Populating test data
 ***********************/

INSERT INTO admins (username, password) VALUES
    ('admin', 'admin');

INSERT INTO users (username, password, email, first_name, last_name, address, contact_no, created_at) VALUES
    ('123', '123', 'abc@abc.com', '123', '123', 'test_address', '0212345678', default),
    ('Slade', 'slade', 'slade@slade.com', 'Slade', 'Butler', 'Slade''s home address', '0222222222', default),
    ('Bonnie', 'bonnie', 'bonnie@bonnie.com', 'Bonnie', 'Liao', 'Bonnie''s home address', '+64211111111', default),
    ('Hector', 'hector', 'hector@hector.com', 'Hector', 'Zhao', 'Hector''s address', '+64211603955', default);

INSERT INTO artists (artist_name) VALUES
    ('Various Artist'),
    ('Sonic Youth'),
    ('Kiasmos');

INSERT INTO albums (title, released_on, is_compilation, price, artist_id) VALUES
    ('If I Were a Carpenter', '1994-09-03', true, 29.99, (SELECT id FROM artists WHERE artist_name = 'Various Artist')),
    ('Kiasmos', '2014-10-27', false, 39.99, (SELECT id FROM artists WHERE artist_name = 'Kiasmos'));

INSERT INTO songs (title, track_no, artist_id, album_id) VALUES
    ('Superstar', 3, (SELECT id FROM artists WHERE artist_name = 'Sonic Youth'), (SELECT id FROM albums WHERE title = 'If I Were a Carpenter')),
    ('Looped', 3, (SELECT id FROM artists WHERE artist_name = 'Kiasmos'), (SELECT id FROM albums WHERE title = 'Kiasmos'));

INSERT INTO orders (user_id) VALUES
    ((SELECT id FROM users WHERE username = 'Hector'));

INSERT INTO order_details (order_id, album_id, quantity) VALUES
    (1, (SELECT id FROM albums WHERE title = 'If I Were a Carpenter'), 5),
    (1, (SELECT id FROM albums WHERE title = 'Kiasmos'), 5);
