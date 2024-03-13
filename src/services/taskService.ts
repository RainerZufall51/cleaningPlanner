import { QueryTypes } from 'sequelize';
import { Task } from '../../types/Task';
import { getMySQLConnection } from '../helper/connection';
import { v4 as uuid } from 'uuid';

/**
 * Creates a Task
 * @param task Task to create
 * @returns Created Task
 */
export async function createTask(task: Task): Promise<Task> {
    try {
        const db = await getMySQLConnection();
        const dbTask = await getTaskByName(task.taskName);

        if (dbTask) {
            throw new Error(`Task ${task.taskName} already exists`);
        }

        const taskId = uuid();
        await db.query(
            `INSERT INTO tasks (taskId, taskName, active)
                            VALUES ($taskId, $taskName, $active)`,
            {
                bind: {
                    taskId: taskId,
                    taskName: task.taskName,
                    active: true
                },
                type: QueryTypes.INSERT
            }
        );

        const createdTask: Task = {
            taskId,
            taskName: task.taskName,
            active: true
        };

        return createdTask;
    } catch (error: any) {
        throw new error('Error creating task: ' + error.message);
    }
}

/**
 * Gets a Task by its name
 * @param taskName Name of the Task to get
 * @returns Complete Task if found or null if not
 */
export async function getTaskByName(taskName: string): Promise<Task[] | null> {
    const db = await getMySQLConnection();

    const taskNameNormalized = `%${taskName.trim()}%`.toLowerCase();

    const taskList: Task[] = await db.query(
        `SELECT * 
            FROM tasks 
            WHERE lower(taskName) LIKE $taskNameNormalized`,
        {
            bind: { taskNameNormalized },
            type: QueryTypes.SELECT
        }
    );

    if (taskList.length != 0) {
        return taskList;
    }

    return null;
}

/**
 * Gets a Task by its id
 * @param taskId Id of the Task to get
 * @returns Complete Task if found or null if not
 */
export async function getTaskById(taskId: string): Promise<Task | null> {
    const db = await getMySQLConnection();

    const taskList: Task[] = await db.query(
        'SELECT * FROM tasks WHERE taskId = $taskId',
        {
            bind: { taskId },
            type: QueryTypes.SELECT
        }
    );

    if (taskList.length != 0) {
        return taskList[0];
    }

    return null;
}

/**
 * Updates a Task
 * @param task Task to update
 * @returns Updated Task
 */
export async function updateTask(task: Task): Promise<Task> {
    try {
        const db = await getMySQLConnection();

        const dbTask = await getTaskById(task.taskId);

        if (!dbTask) {
            throw new Error(`Task ${task.taskId} does not exist`);
        }

        await db.query(
            `UPDATE tasks 
                SET taskName = $taskName,
                    active = $active 
                WHERE taskId = $taskId`,
            {
                bind: {
                    taskName: task.taskName,
                    active: task.active,
                    taskId: task.taskId
                },
                type: QueryTypes.UPDATE
            }
        );

        return task;
    } catch (error: any) {
        throw new error('Error updating task: ' + error.message);
    }
}

/**
 * Deletes a Task
 * @param taskId Id of the Task to delete
 * @returns ID of the deleted Task
 */
export async function deleteTask(taskId: string): Promise<string> {
    try {
        const db = await getMySQLConnection();

        const dbTask = await getTaskById(taskId);

        if (!dbTask) {
            throw new Error(`Task ${taskId} does not exist`);
        }

        await db.query('DELETE FROM tasks WHERE taskId = $taskId', {
            bind: { taskId },
            type: QueryTypes.DELETE
        });

        return taskId;
    } catch (error: any) {
        throw new error('Error deleting task: ' + error.message);
    }
}
