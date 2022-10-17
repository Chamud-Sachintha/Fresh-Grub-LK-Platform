'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RetuarantEatabl extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RetuarantEatabl.init({
    eatableId: DataTypes.INTEGER,
    restuarantId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'RetuarantEatabl',
  });
  return RetuarantEatabl;
};