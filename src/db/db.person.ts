import { ServiceSchema } from "moleculer";
import { getMySQLConnection } from "../helper/connection";
import  Sequelize from "sequelize";

const DbService = require('moleculer-db');

const DbPersonService: ServiceSchema = {
    name: 'db.person',
    mixins: [DbService],
    settings: {
        idField: 'personId'
    },
    merged(schema: ServiceSchema) {
        schema.adapter = getMySQLConnection();
    },
    model: {
        name: 'person',
        define: {
            personId: {
                type: Sequelize.CHAR(36),
                primaryKey: true
            },
            prename: {
                type: Sequelize.CHAR(50)
            },
            surname: {
                type: Sequelize.CHAR(50)
            },
            active: {
                type: Sequelize.BOOLEAN
            }
        }
    }
};

export = DbPersonService;

