const express = require('express');
const userController = require('./controllers/user-controller');
const characterController = require('.')


const app = express();
const port = 3001;

app.get('/', (req, res) => res.json({ message: 'Hello World' }));

// app.get('Characters', (req, res) => {
//     res.json(Character.findAll())
// })
app.use(express.json());

app.get('/user', userController.getAll);
app.get('/user/:id', userController.getOne);
app.post('/user', userController.create);
app.put('/user/:id', userController.update);
app.delete('/user/:id', userController.delete);

app.listen(port, () => {
    console.log('Server is running on port ', port)
})


// Reprendre le projet d'exercice:
//     - Créer son controller avec CRUD
//     - Ajouter une adresse: un user peut avoir une adresse
//     (numero, rue, code postal, ville)