import { Iteration } from '../../../../../types/Iteration';
import { getMySQLConnection } from '../../../../helper/connection';
import { getByName } from './getByName';
import { v4 as uuid } from 'uuid';
import QueryTypes from 'sequelize/types/query-types';

export async function createIteration(
    iteration: Iteration
): Promise<Iteration> {
    try {
        const db = await getMySQLConnection();
        const dbIteration = await getByName(iteration.iterationName);

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
