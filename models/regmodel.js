'use strict';

const bcrypt = require('bcrypt');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RegModel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RegModel.init({
    emailAddress: DataTypes.STRING,
    userRole: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'RegModel',
    hooks: {
      beforeCreate: async (user) => {
       if (user.password) {
        const salt = bcrypt.genSaltSync(10, 'a');
        user.password = bcrypt.hashSync(user.password, salt);
       }
      }
    }
  });
  return RegModel;
};