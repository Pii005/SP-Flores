const cors = require('cors'); // Importa el paquete cors
const express = require('express');
const app = express();
const port = 3000;

app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json());

let casas = [
    new Planeta(1, "Tierra", "Pequeño", "5.972 × 10^24 kg", "Roca", "1 UA", "Sí", "No", "Roca y metal"),
    new Planeta(2, "Júpiter", "Enorme", "1.898 × 10^27 kg", "Gaseoso", "5.2 UA", "No", "Sí", "Gas y líquido metálico"),
    new Planeta(3, "Marte", "Pequeño", "6.39 × 10^23 kg", "Roca", "1.5 UA", "Sí", "No", "Roca y metal")

];

// Middleware para simular una demora de 3 segundos
const simulateDelay = (req, res, next) => {
    setTimeout(next, 3000);
};

/**
 * Obtiene todas las Casas
 */
app.get('/casas', simulateDelay, (req, res) => {
    res.json(casas);
});

/**
 * Crea una nueva Casa
 */
app.post('/casas', simulateDelay, (req, res) => {
    const nuevaCasa = req.body;
    nuevaCasa.id = casas.length + 1;
    casas.push(nuevaCasa);
    res.status(200).json(nuevaCasa);
});

/**
 * Obtiene Casa por ID
 */
app.get('/casas/:id', simulateDelay, (req, res) => {
    const id = parseInt(req.params.id);
    const casa = casas.find(p => p.id === id);
    if (casa) {
        res.json(casa);
    } else {
        res.status(404).send('Casa no encontrada');
    }
});

/**
 * Edita Casa por ID
 */
app.put('/casas/:id', simulateDelay, (req, res) => {
    const id = parseInt(req.params.id);
    const index = casas.findIndex(p => p.id === id);
    if (index !== -1) {
        const newObj = req.body;
        newObj.id = id;
        casas[index] = newObj;
        
        res.json(newObj);
    } else {
        res.status(404).send('Casa no encontrada');
    }
});

/**
 * Elimina Casa por ID
 */
app.delete('/casas/:id', simulateDelay, (req, res) => {
    const id = parseInt(req.params.id);
    const index = casas.findIndex(p => p.id === id);
    if (index !== -1) {
        casas.splice(index, 1);
        res.status(200).send();
    } else {
        res.status(404).send('Casa no encontrada');
    }
});

/**
 * Elimina todas las Casas
 */
app.delete('/casas', simulateDelay, (req, res) => {
    casas = [];
    res.status(200).send('Todas las casas han sido eliminadas');
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});