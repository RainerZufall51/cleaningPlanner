import { Sequelize } from 'sequelize';

export async function getMySQLConnection() {
    const sequelize = new Sequelize({
        host: 'localhost',
        dialect: 'mysql',
        port: 3306,
        database: 'cleaningPlan',
        username: 'root',
        password: ''
    });
    try {
        await sequelize.authenticate();
    } catch (e) {
        console.log(e);
    }

    return sequelize;
}
