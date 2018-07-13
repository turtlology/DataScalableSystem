/**
 * Created by turtlologist on 2018/7/7.
 */
var Sequelize = require('sequelize');
var db = require('./db');

var Reciept = db.defineModel('Reciept', {
    one: {
        type: Sequelize.STRING,
        validate: {
            notEmpty: true
        }
    },
    two: {
        type: Sequelize.STRING,
        validate: {
            notEmpty: true
        }
    }
});

module.exports = Reciept;