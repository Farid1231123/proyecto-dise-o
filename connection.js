const sql = require("mssql");

const config = {
  server: "localhost", // si usas otro nombre de servidor, cámbialo aquí
  user: "sa", // tu usuario SQL Server
  password: "12345", // tu contraseña SQL Server
  database: "BDTIENDA", // el nombre de tu base de datos
  options: {
    encrypt: false, // true si usas Azure
    trustServerCertificate: true // necesario para entorno local
  }
};

// Conectar a SQL Server
sql.connect(config)
  .then(() => {
    console.log("✅ Conexión exitosa a SQL Server");
  })
  .catch(err => {
    console.error("❌ Error de conexión:", err.message);
  });

module.exports = sql;
