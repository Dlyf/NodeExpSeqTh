const express = require('express');
const Character = require('./models/character');
const CharacterController = require('./controllers/character-controller.js');
const UserController = require('./controllers/user-controller');
const auth = require('./middlewares/auth');
const isHimself = require('./middlewares/isHimself');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
// app.get('Characters', (req, res) => {
    //     res.json(Character.findAll())
    // })
    
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'Hello World' }));
app.post('/register', UserController.register);
app.post('/login', UserController.login);


app.use(auth);
app.get('/character', CharacterController.getAll);
app.get('/character/:id', CharacterController.getOne);
app.post('/character', CharacterController.create);
app.put('/character/:id', CharacterController.update);
app.delete('/character/:id', CharacterController.delete);

app.get('/user/:userId', isHimself, UserController.getOne);

app.listen(port, () => {
    console.log('Server is running on port ', port)
})