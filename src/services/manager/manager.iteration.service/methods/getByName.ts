import { Iteration } from "../../../../../types/Iteration";
import { getMySQLConnection } from "../../../../helper/connection";
import { QueryTypes } from "sequelize/types";

export async function getByName(
    iterationName: string
): Promise<Iteration[] | null> {
    const db = await getMySQLConnection();
    let whereClause = '';

    if (iterationName != ':iterationName') {
        const iterationNameNormalized = `%${iterationName.toLowerCase().trim()}%`;
        whereClause = `WHERE iterationName LIKE ${iterationNameNormalized}`;
    }

    const iterationList: Iteration[] = await db.query(
        `SELECT * 
            FROM iterations
            ${whereClause}`,
        { type: QueryTypes.SELECT }
    );

    return iterationList;
}