const cors = require('cors'); // Importa el paquete cors
const express = require('express');
const app = express();
const port = 3000;

app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json());

let casas = [
    { id: 1, titulo: 'Casa Blanca', transaccion: 'venta',precio: 250000, tipo: 'departamento'},
    { id: 2, titulo: 'Casa Roja', transaccion: 'alquiler',precio: 120000, tipo: 'departamento' },
    { id: 3, titulo: 'Casa Gris', transaccion: 'venta',precio: 150000, tipo: 'departamento' }
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