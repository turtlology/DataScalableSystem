var Sequelize = require('sequelize');
var db = require('./db');


var User = db.defineModel('users', {
    username: {
        type: Sequelize.STRING,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    password: {
        type: Sequelize.STRING,
        validate: {
            notEmpty: true
        }
    },
    fname: {
        type: Sequelize.STRING,
        validate: {
            notEmpty: true
        }
    },
    lname: {
        type: Sequelize.STRING,
        validate: {
            notEmpty: true
        }
    },
    address: {
        type: Sequelize.STRING,
        validate: {
            notEmpty: true
        }
    },
    city: {
        type: Sequelize.STRING,
        validate: {
            notEmpty: true
        }
    },
    state: {
        type: Sequelize.STRING,
        validate: {
            notEmpty: true
        }
    },
    zip: {
        type: Sequelize.STRING,
        validate: {
            notEmpty: true
        }
    },
    email: {
        type: Sequelize.STRING,
        validate: {
            notEmpty: true
        }
    }

});

module.exports = User;