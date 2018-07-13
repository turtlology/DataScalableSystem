/**
 * Created by turtlologist on 2018/7/7.
 */
var Sequelize = require('sequelize');
var db = require('./db');
var History = db.defineModel('history', {
    username: {
        type: Sequelize.STRING,
        validate: {
            notEmpty: true
        }
    },
    asin: {
        type: Sequelize.STRING,
        validate: {
            notEmpty: true
        }
    },
    productName: {
        type: Sequelize.STRING,
        validate: {
            notEmpty: true
        }
    }
});

module.exports = History;