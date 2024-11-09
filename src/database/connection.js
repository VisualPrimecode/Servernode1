import pkg from "pg";
const { Pool } = pkg;

const dbSettings = {
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "paginatiojavier",
    password: process.env.DB_PASSWORD || "95054459Cl.",
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false
};

const pool = new Pool(dbSettings);

export const getConnection = async () => {
    try {
        const client = await pool.connect();
        return client;
    } catch (error) {
        console.error("Error connecting to PostgreSQL:", error);
        throw error;
    }
};

export const executeQuery = async (query, params) => {
    const client = await getConnection();
    try {
        const res = await client.query(query, params);
        return res.rows;
    } finally {
        client.release();
    }
};
