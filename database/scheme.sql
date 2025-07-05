-- Création de la table des agents
CREATE TABLE IF NOT EXISTS agents (
                                      id SERIAL PRIMARY KEY,
                                      hostname TEXT NOT NULL UNIQUE,
                                      ip TEXT,
                                      os TEXT,
                                      last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table des métriques
CREATE TABLE IF NOT EXISTS metrics (
                                       id SERIAL PRIMARY KEY,
                                       agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    cpu_usage REAL,
    ram_total BIGINT,
    ram_used BIGINT,
    ram_free BIGINT,
    disk_total BIGINT,
    disk_used BIGINT,
    net_sent BIGINT,
    net_recv BIGINT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
