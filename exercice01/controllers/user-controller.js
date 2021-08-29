const db = require('../models');
const User = db.User;

class UserController {

    getAll = async (req, res) => {
        const data = await User.findAll();
        res.json(data);
    }

    getOne = async (req, res) => {
        const id = req.params.id;
        const data = await User.findByPk(id);
        res.json(data);
    }
    
    create = async (req, res) => {
        const new_user = {
            nom: req.body.nom,
            prenom: req.body.prenom,
            age: req.body.age || 0,
        }
        const data = await User.create(new_user);
        res.json(data);
    }
    update = async (req, res) => {
        const id = req.params.id;
        const char = await User.findByPk(id);
        const updated_user = {
            nom : req.body.nom || char.nom,
            prenom : req.body.prenom || char.prenom,
            age : req.body.age || char.age
        }

        const data = await User.update(updated_user, { where : {id: id}});
        res.json(data);
    }
    delete = async (req, res) => {
        const id = req.params.id;
        const data = await User.destroy({ where: { id: id } });
        res.json(data);
    }
}

module.exports = new UserController();