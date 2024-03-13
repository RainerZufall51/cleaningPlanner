import { ServiceSchema } from 'moleculer';
import { getMySQLConnection } from '../helper/connection';
import Sequelize, { DataTypes } from 'sequelize';

const DbService = require('moleculer-db');

const DbPerson: ServiceSchema = {
    name: 'db.iteration',
    mixins: [DbService],
    settings: {
        idField: 'personId'
    },
    merged(schema: ServiceSchema) {
        schema.adapter = getMySQLConnection();
    },
    model: {
        name: 'iterations',
        define: {
            iterationId: { type: DataTypes.STRING, primaryKey: true },
            iterationName: { type: DataTypes.STRING, allowNull: false },
            startAt: { type: DataTypes.DATE, allowNullL: false },
            endAt: { type: DataTypes.DATE, allowNullL: false }
        }
    }
};


export = DbPerson;