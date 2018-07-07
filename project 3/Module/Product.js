/**
 * Created by turtlologist on 18/06/2018.
 */
var Sequelize = require('sequelize');
var db = require('./db');

var Product = db.defineModel('product', {
    asin: {
        type: Sequelize.STRING,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    productName: {
        type: Sequelize.STRING,
        validate: {
            notEmpty: true
        }
    },
    productDescription: {
        type: Sequelize.STRING,
        validate: {
            notEmpty: true
        }
    },
    group: {
        type: Sequelize.STRING,
        validate: {
            notEmpty: true
        }
    }
});

module.exports = Product;