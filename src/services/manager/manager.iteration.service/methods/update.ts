import QueryTypes from "sequelize/types/query-types";
import { Iteration } from "../../../../../types/Iteration";
import { getMySQLConnection } from "../../../../helper/connection";

export async function update(
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
        throw new Error('Error updating iteration' + error.message);
    }
}