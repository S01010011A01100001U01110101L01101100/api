const express = require('express'); // require -> commonJS
const crypto = require('node:crypto');
const cors = require('cors');
const dragonBallData = require('./api/dragonBall.json');

const { validateDB } = require('./dragonball/ball')

const app = express();
app.use(express.json());


app.disable('x-powered-by'); // deshabilitar el header X-Powered-ByExpress:


// Definir la función antes de las rutas
function getTransformationsById(characterData, transformationId) {
    const transformation = characterData.transformations.find(trans => trans.id === parseInt(transformationId));
    return transformation ? transformation : null;
  }

app.get('/:character', (req, res) => {
try {
    const { character } = req.params; // Obtener el nombre del personaje desde los parámetros de la URL
    const { id } = req.query; // Obtener el id de transformación desde los query parameters

    // Buscar el personaje en la base de datos
    const characterData = dragonBallData.find(ch => ch.name.toLowerCase() === character.toLowerCase());

    // Verificar si el personaje existe
    if (characterData) {
    // Obtener las transformaciones si no hay id, o una transformación específica si se pasa un id
    const transformation = id ? getTransformationsById(characterData, id) : characterData.transformations;

    // Si encontramos las transformaciones, devolverlas como respuesta
    if (transformation) {
        return res.json(transformation);
    }
    }

    // Si no se encuentra el personaje o las transformaciones, retornar error 404
    res.status(404).json({ error: `Transformación no encontrada para ${character.charAt(0).toUpperCase() + character.slice(1)}` });
} catch (error) {
    // En caso de un error inesperado, retornar el error 500
    console.error('Error interno:', error);
    res.status(500).json({ error: 'Ocurrió un error en el servidor', details: error.message });
}
});

app.post('/post', (req, res) => {
    const result = validateDB(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error.format() });
    }

    const newCharacter = {
        id: crypto.randomUUID(), // Genera un ID único para el nuevo personaje
        ...result.data
    };

    // Aquí asume que `dragonBallData` es el array en el que se almacenan personajes
    dragonBallData.push(newCharacter);

    res.status(201).json(newCharacter);
});


app.options('*', cors());

const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
  console.log('Documentación de la API disponible en http://localhost:1234/api-docs');
});
