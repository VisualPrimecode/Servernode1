USE LaDataBase;
CREATE TABLE IF NOT EXISTS mensajes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    comentario VARCHAR(255) NOT NULL,
    fecha DATE
);
