import sql from "mssql"

const dbSettings = {
    user: "clauadmin",
    password: "1234",
    server: "localhost",
    database: "LaDataBase",
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
}

export const getConnection = async () => {
    try {
        const pool = await sql.connect(dbSettings);
        return pool;
    }catch (error) {
        console.error(error);
    }
};