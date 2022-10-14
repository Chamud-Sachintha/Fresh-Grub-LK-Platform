'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Restuarant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Restuarant.init({
    sellerId: DataTypes.INTEGER,
    restuarantName: DataTypes.STRING,
    description: DataTypes.STRING,
    imageFile: DataTypes.STRING.BINARY,
    addressLineFirst: DataTypes.STRING,
    addressLineSecond: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    landMobile: DataTypes.STRING,
    frontMobile: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Restuarant',
  });
  return Restuarant;
};