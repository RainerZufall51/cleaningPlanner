const SqlAdapter = require('moleculer-db-adapter-sequelize');
import { Options, Op } from 'sequelize';

export function getMySQLConnection() {
    return new SqlAdapter(
        'cleaningPlanner',
        'root',
        '',
        {
            host: 'localhost:3306',
            dialect: 'mysql',
            operatorsAliases: {
                $in: Op.in,
                $or: Op.or,
                $like: Op.like
            },
            pool: {
                max: 5,
                min: 0,
                idle: 10000
            },
            define: {
                timestamps: false,
                freezeTableName: true
            },
            noSync: true
        } as Options
    );
}
