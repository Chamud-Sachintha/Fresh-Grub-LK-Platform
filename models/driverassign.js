'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DriverAssign extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DriverAssign.init({
    userId: DataTypes.INTEGER,
    status: DataTypes.STRING,
    orderId: DataTypes.INTEGER,
    orderDeliveryStatus: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'DriverAssign',
  });
  return DriverAssign;
};