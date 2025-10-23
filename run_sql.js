require('dotenv').config();
const sql = require('mssql');
const fs = require('fs');
const path = require('path');

// Mostrar datos cargados desde el .env
console.log(`📦 Conectando a la base de datos: ${process.env.DB_SERVER}`);
console.log(`📘 Base de datos: ${process.env.DB_DATABASE}`);

// Validar variables obligatorias
if (!process.env.DB_SERVER || !process.env.DB_DATABASE) {
  console.error("❌ ERROR: Faltan variables en el archivo .env o no se están cargando correctamente.");
  console.log("Configuración actual:", {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
      encrypt: process.env.DB_ENCRYPT === 'true',
      trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true'
    }
  });
  process.exit(1);
}

// Leer archivo SQL
const sqlFilePath = path.join(__dirname, 'municipalidad_huancayo.sql');
console.log("Leyendo archivo SQL:", sqlFilePath);

if (!fs.existsSync(sqlFilePath)) {
  console.error("❌ ERROR: No se encontró el archivo SQL:", sqlFilePath);
  process.exit(1);
}

const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');
const sqlBlocks = sqlScript.split(/GO\s*$/im).filter(block => block.trim() !== '');
console.log(`Se detectaron ${sqlBlocks.length} bloques SQL (separados por GO).`);

// Configuración general
let config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true'
  }
};

// Autenticación
if (process.env.DB_AUTH === 'windows') {
  console.log("🪟 Usando autenticación de Windows...");
  config.authentication = {
    type: 'ntlm',
    options: {
      domain: '',
      userName: process.env.USERNAME,
      password: ''
    }
  };
} else {
  console.log("🔐 Usando autenticación de SQL Server...");
  config.user = process.env.DB_USER;
  config.password = process.env.DB_PASSWORD;
}

(async () => {
  let pool;
  try {
    pool = await sql.connect(config);
    console.log("✅ Conexión exitosa.");

    for (const block of sqlBlocks) {
      if (block.trim()) {
        console.log("🚀 Ejecutando bloque SQL...");
        await pool.request().query(block);
      }
    }

    console.log("🎉 Archivo SQL ejecutado correctamente.");
  } catch (err) {
    console.error("❌ ERROR de conexión o ejecución:", err.message);
  } finally {
    if (pool) await pool.close();
    sql.close();
  }
})();
