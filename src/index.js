const PORT = 3000;
const HOST = '0.0.0.0'; // Asegúrate de que sea 0.0.0.0

app.listen(PORT, HOST, () => {
    console.log(`Servidor escuchando en http://${HOST}:${PORT}`);
});