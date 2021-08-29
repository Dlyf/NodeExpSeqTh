'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Character extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Character.hasOne(models.Bag, {
        foreignKey: 'characterId',
        as: 'bag',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
      Character.hasMany(models.Weapon, {
        foreignKey: 'characterId',
        as: 'weapons',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })

      Character.belongsToMany(models.Job, {
        through: 'Characters_Jobs',
        foreignKey: 'characterId',
        otherKey: 'jobId',
        as: 'jobs'
      })
    }
  };
  Character.init({
    name: DataTypes.STRING,
    xp: DataTypes.INTEGER,
    pv: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Character',
  });
  return Character;
};