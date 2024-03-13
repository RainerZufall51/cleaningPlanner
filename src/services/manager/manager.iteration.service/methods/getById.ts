import QueryTypes from 'sequelize/types/query-types';
import { Iteration } from '../../../../../types/Iteration';
import { Context } from 'moleculer';

/**
 * Gets the Iteration by its ID
 * @param iterationId ID of the Iteration
 * @returns Iteration with the given ID or null if not found
 */
export async function getById(
    ctx: Context<{ iterationId: string }>
): Promise<Iteration | null> {
    const iterationList: Iteration[] = await ctx.call('db.iterationService.find', { iterationId: ctx.params.iterationId });

    // const iterationList: Iteration[] = await db.query(
    //     `SELECT *
    //         FROM iterations
    //         WHERE iterationId = $iterationId`,
    //     {
    //         bind: {
    //             iterationId
    //         },
    //         type: QueryTypes.SELECT
    //     }
    // );

    if (iterationList.length === 0) {
        return null;
    }

    return iterationList[0];
}
