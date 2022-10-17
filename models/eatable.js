'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Eatable extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Eatable.init({
    categoryId: DataTypes.INTEGER,
    eatableName: DataTypes.STRING,
    eatableDescription: DataTypes.STRING,
    eatablePrice: DataTypes.INTEGER,
    eatableFeaturedImage: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Eatable',
  });
  return Eatable;
};