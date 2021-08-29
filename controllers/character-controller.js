const db = require("../models");
const Character = db.Character;
const Bag = db.Bag;
const Weapon = db.Weapon;
const Job = db.Job

class CharacterController {
  getAll = async (req, res) => {
    try {
      const data = await Character.findAll({
        include: [
          {
            model: Bag,
            as: "bag",
            attributes: ["color", "capacity"],
          },
          {
            model: Weapon,
            as: "weapons",
            attributes: ["name", "attack"],
          },
          {
            model: Job,
            as: 'jobs',
            through: 'Characters_jobs',
            attributes: ['name', 'defense']
          }
        ],
      });
      res.json(data);
    } catch (err) {
      res.status(404).send("Not found !");
    }
  };

  getOne = async (req, res) => {
    const id = req.params.id;
    const data = await Character.findByPk(id, {
      include: [
        {
          model: Bag,
          as: "bag",
          attributes: ["id", "color", "capacity"],
        },
        {
          model: Weapon,
          as: "weapons",
          attributes: ["id", "name", "attack"],
        },
        {
            model: Job,
            as: 'jobs',
            through: 'Characters_jobs',
            attributes: ['id', 'name', 'defense']
          }
      ],
    });
    // àcompléter
    if (data){
      res.json(data);
    } else {
      res.status(404).send('Pas de personnage trouvé');
    }
  };

  create = async (req, res) => {
    const new_character = {
      name: req.body.name,
      xp: req.body.xp || 0,
      pv: req.body.pv || 20,
      bag: {
        color: req.body.bag.color || "Brown",
        capacity: req.body.bag.capacity || 5,
      },
      weapons: [],
      jobs: []
    };
    if (req.body.weapons) {
      req.body.weapons.forEach((weapon) => {
        const new_weapon = {
          name: weapon.name || "Dague rouillée",
          attack: weapon.attack || 5,
        };
        // new_character.weapons.push(new_weapon);
      });
    }

    if (req.body.jobs) {
      await Promise.all(req.body.jobs.map(async (job) => {
        let new_job;
        if (job.id) {
          new_job = await Job.findByPk(job.id, {
            include: [{model: Character, as: 'characters', through: 'Characters_jobs'}]
          })

        }
        if (!new_job) {
          new_job = {
          name: job.name || 'Aventurier.e',
          defense: job.defense || 5
          }
          
        } else {
          new_job.characters.push(new_character);
        }
        new_character.jobs.push(new_job)
      }))
    }

    
  };
  update = async (req, res) => {
    const id = req.params.id;
    let char = await Character.findByPk(id, {
      include: [
        {
          model: Bag,
          as: "bag",
        },
        {
          model: Weapon,
          as: 'weapons'
        }
      ],
    });
    if (!char) {
      res.status(404).send("Pas de personnage trouvé avec cet ID");
    } else {
      const updated_character = {
        name: req.body.name || char.name,
        xp: req.body.xp || char.xp,
        pv: req.body.pv || char.pv,
      };

      const bag = { color: "Brown", capacity: 5, characterId: char.id };
      // Soit on en récupère un via le body
      if (req.body.bag) {
        bag.color = req.body.bag.color || bag.color;
        bag.capacity = req.body.bag.capacity || bag.capacity;
      }
      // Si le personnage en base n'a pas de sac, il faut en créer un
      let new_bag;
      if (!char.bag) {
        new_bag = await Bag.create(bag);
      } else {
        new_bag = await Bag.update(bag, { where: { characterId: char.id } });
      }
      updated_character.bag = new_bag;

      if (req.body.weapons) {
        await Promise.all(req.body.weapons.map( async (weapon) => {
          let new_weapon = {
            name: weapon.name || "Dague rouillée",
            attack: weapon.attack || 5,
          }
          if (weapon.id && char.weapons && char.weapons.findIndex(cw => cw.id === weapon.id) !== -1) {
            new_weapon = await Weapon.update(new_weapon, { where: { id: weapon.id } })
          } else {
            new_weapon.characterId = char.id;
            new_weapon = await Weapon.create(new_weapon);
          }
          // vérifier si les armes de body ont un Id
          // si elles ont un id et qu'elles existent dans le character -> on modifie
          // sinon -> on la crée
          // updated_character.weapons.push(new_weapon);
        }));
      }

      const data = await Character.update(updated_character, {
        where: { id: id },
        include: [{ model: Bag, as: "bag" }],
      });
      res.json(data);
    }
  };

  delete = async (req, res) => {
    const id = req.params.id;
    const data = await Character.destroy({
      where: { id: id },
      include: [
        { model: Bag, as: "bag" },
        { model: Weapon, as: "weapons" },
      ],
      
    });
    res.json(data);
  };
}

module.exports = new CharacterController();
