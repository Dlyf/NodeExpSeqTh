const db = require('../models');
const User = db.User;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserController {

    register = async (req, res) => {
        // récupérer email et mp dans le body
        try {
            const email = req.body.email;
            
            let user = await User.findOne({ where: { email } });
            if (user) {
                res.status(400).send('User déjà existant')
            } else {
                const password = await bcrypt.hash(req.body.password, 10)
                user = { email, password };

                const data = await User.create(user)
                res.json({ email: data.email, createdAt: data.createdAt });
            }
        } catch (err) {
            res.status(400).send('Mauvaise requête')
        }
    }
        // vérification que le mail n'existe pas déjà dans la base 
    login = async (req, res) => {
        let email, password;
        try {
            email = req.body.email;
            password = req.body.password;
        } catch (err) {
            res.status(400).send('Mauvais body');
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            res.status(401).send(`Erreur d'authentification`)
        } else {
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                res.status(401).send(`Erreur d'authentification`);
            } else {
                const token = jwt.sign(
                    { userId: user.id },
                    'Tes_Test_Cool_Qwerty',
                    {expiresIn: '24h'}
                )
                res.json({
                    id: user.id,
                    email: user.email,
                    token
                })
            }
        }
    }

    getOne = async (req, res) => {
        const id = req.params.userId;
        const data = await User.findByPk(id);
        res.json(data);
    }
        // (opt) vérification du pattern du mp et email

        // (opt) envoie d'un mail de validation d'email

        // Hahashage du mp et enregistrement
}


module.exports = new UserController();