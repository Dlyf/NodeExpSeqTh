'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Adresse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Adresse.init({
    numero: DataTypes.INTEGER,
    rue: DataTypes.STRING,
    code_postal: DataTypes.STRING,
    ville: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Adresse',
  });
  return Adresse;
};