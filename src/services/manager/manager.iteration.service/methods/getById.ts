import QueryTypes from 'sequelize/types/query-types';
import { Iteration } from '../../../../../types/Iteration';
import { getMySQLConnection } from '../../../../helper/connection';

/**
 * Gets the Iteration by its ID
 * @param iterationId ID of the Iteration
 * @returns Iteration with the given ID or null if not found
 */
export async function getById(iterationId: string): Promise<Iteration | null> {
    const db = await getMySQLConnection();
    
    const iterationList: Iteration[] = await db.query(
        `SELECT *
            FROM iterations
            WHERE iterationId = $iterationId`,
        {
            bind: {
                iterationId
            },
            type: QueryTypes.SELECT
        }
    );

    return iterationList[0];
}
