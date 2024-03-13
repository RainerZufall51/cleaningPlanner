import { Iteration } from '../../types/Iteration';
import { v4 as uuid } from 'uuid';
import { getMySQLConnection } from '../helper/connection';
import { QueryTypes } from 'sequelize';

export async function createIteration(
    iteration: Iteration
): Promise<Iteration> {
    try {
        const db = await getMySQLConnection();
        const dbIteration = await getIterationByName(iteration.iterationName);

        if (dbIteration) {
            throw new Error('Iteration already exists');
        }

        const iterationId = uuid();
        await db.query(
            `INSERT INTO iterations(iterationId, iterationName, startAt, endAt)
                    VALUES($iterationId, $iterationName, $startAt, $endAt)`,
            {
                bind: {
                    iterationId,
                    iterationName: iteration.iterationName,
                    startAt: iteration.startAt,
                    endAt: iteration.endAt
                },
                type: QueryTypes.INSERT
            }
        );

        iteration.iterationId = iterationId;
        return iteration;
    } catch (error: any) {
        throw error;
    }
}

/**
 * Gets the Iteration by its ID
 * @param iterationId ID of the Iteration
 * @returns Iteration with the given ID or null if not found
 */
export async function getIterationById(
    iterationId: any
): Promise<Iteration | null> {
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

    if (iterationList.length === 0) {
        return null;
    }

    return iterationList[0];
}

export async function getIterationByName(
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

export async function updateIteration(
    iteration: Iteration
): Promise<Iteration> {
    try {
        const db = await getMySQLConnection();

        await db.query(
            `UPDATE iterations
                SET iterationName = $iterationName, 
                    startAt = $startAt, 
                    endAt = $endAt`,
            {
                bind: {
                    iterationName: iteration.iterationName,
                    startAt: iteration.startAt,
                    endAt: iteration.endAt
                },
                type: QueryTypes.UPDATE
            }
        );

        return iteration;
    } catch (error: any) {
        throw new Error('Error updating iteration', error.message);
    }
}
