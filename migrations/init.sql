CREATE TABLE users(
                      id SERIAL PRIMARY KEY,
                      username TEXT NOT NULL UNIQUE,
                      hashed_password BYTEA NOT NULL,
                      salt BYTEA NOT NULL,
                      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                      modified_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE recipes(
                        id SERIAL PRIMARY KEY,
                        title TEXT NOT NULL,
                        content TEXT NOT NULL,
                        img_url TEXT,
                        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                        modified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                        user_id INT REFERENCES users ON DELETE CASCADE
);
CREATE TABLE ingredients(
                            id SERIAL PRIMARY KEY,
                            name TEXT NOT NULL,
                            amount INT NOT NULL,
                            unit TEXT NOT NULL,
                            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                            modified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                            recipe_id INT REFERENCES recipes ON DELETE CASCADE
)