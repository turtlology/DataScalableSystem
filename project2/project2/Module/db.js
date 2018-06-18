
const Sequelize = require('sequelize');

const sequelize = new Sequelize('DataScalableSystem', 'root', 'root', {
    //host: 'ediss.cyfeqjhd9zxr.us-east-1.rds.amazonaws.com',
    host: 'localhost',
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        acquire: 10000,
        idle: 10000,
        evict: 10000
    },

    operatorsAliases: false
});

function defineModel (name, attributes) {
    var attrs = {};

    for (let key in attributes) {
        let value = attributes[key];
        if (typeof value === 'object' && value['type']) {
            value.allowNull = value.allowNull || false;
            attrs[key] = value;
        } else {
            attrs[key] = {
                type: value,
                allowNull: false
            };
        }
    }
    return sequelize.define(name, attrs, {
        tableName: name,
        timestamps: false,
        hooks: {
            beforeValidate: function (obj) {
                let now = Date.now();
                if (obj.isNewRecord) {
                    obj.createAt = now;
                    obj.updateAt = now;
                    obj.version = 0;
                } else {
                    obj.updateAt = now;
                    ++obj.version;
                }
            }
        }
    });
}

exports.defineModel = defineModel;