import { IterationTask } from '../../types/IterationTask';
import { v4 as uuid } from 'uuid';
import { getMySQLConnection } from '../helper/connection';
import { QueryTypes } from 'sequelize';
import { Iteration } from '../../types/Iteration';

export async function createIterationTask(iterationTask: IterationTask): Promise<IterationTask>{
    try {
        const db = await getMySQLConnection();
        const  dbIterationTask = await getIterationTaskFromDB(iterationTask);

        if(dbIterationTask){
            throw new Error(`Task ${iterationTask.taskId} already exists in iteration ${iterationTask.iterationId}`);
        }

        iterationTask.iterationTaskId = uuid();
        await db.query(
            `INSERT INTO iterationTasks(iterationTaskId, iterationId, taskId, doneAt)
                        VALUES($iterationTaskId, $iterationId, $taskId, $doneAt)`,
            {
                bind: {
                    iterationTaskId: iterationTask.iterationTaskId,
                    iterationId: iterationTask.iterationId,
                    taskId: iterationTask.taskId,
                    doneAt: iterationTask.doneAt
                },
                type: QueryTypes.INSERT
            }
        );

        return iterationTask;
    } catch (error: any) {
        throw new Error('Error creating iterationTask: ' + error);
    }
}

async function getIterationTaskFromDB(iterationTask: IterationTask) {
    const db = await getMySQLConnection();

    const dbIterationTask = await db.query(
        `SELECT * 
                FROM iterations 
                WHERE iterationId = $iterationId
                    AND taskId = $taskId`,
        {
            bind: {
                iterationId: iterationTask.iterationId,
                taskId: iterationTask.taskId
            },
            type: QueryTypes.SELECT
        }
    );
    return { dbIterationTask, db };
}

export async function getIterationTaskById(iterationTaskId: string): Promise<IterationTask> {
    const db = await getMySQLConnection();

    const iterationTaskList: IterationTask[] = await db.query(
        `SELECT *
                FROM iterationTasks
                WHERE iterationTaskId = $iterationTaskId`,
        {
            bind: {
                iterationTaskId
            },
            type: QueryTypes.SELECT
        }
    );

    if (iterationTaskList.length === 0) {
        throw 'IterationTask not found';
    }

    return iterationTaskList[0];
}

export async function setIterationTaskDone(iterationTaskId: string): Promise<IterationTask> {
    const db = await getMySQLConnection();

    const iterationTask = await getIterationTaskById(iterationTaskId);

    if (iterationTask.doneAt) {
        return iterationTask;
    }

    await db.query(
        `UPDATE iterationTasks
                SET doneAt = $doneAt
                WHERE iterationTaskId = $iterationTaskId`,
        {
            bind: {
                doneAt: new Date(),
                iterationTaskId
            },
            type: QueryTypes.UPDATE
        }
    );

    return iterationTask;
}

export async function deleteIterationTask(iterationTaskId: string) {
    throw new Error('Not yet implemented');
}

export async function listIterationTask() {
    throw new Error('Not yet implemented');
}
