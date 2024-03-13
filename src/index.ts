import express from 'express';
import { getMySQLConnection } from './helper/connection';
import { QueryTypes } from 'sequelize';
import { Person } from '../types/Person';
import bodyParser from 'body-parser';
import {
    createPerson,
    deletePerson,
    getPersonById,
    getPersonByName,
    updatePerson
} from './services/personService';
import {
    createTask,
    deleteTask,
    getTaskById,
    getTaskByName,
    updateTask
} from './services/taskService';
import { Iteration } from '../types/Iteration';
import {
    createIteration,
    getIterationById,
    getIterationByName,
    updateIteration
} from './services/iterationService';

const app = express();
app.listen(3000, () => console.log('Server is running'));
app.use(bodyParser.json());

app.get('/', (_req, res) => res.send('cleaning Planner API'));

app.get('/person', async (_req, res) => {
    const db = await getMySQLConnection();
    const personList: Person[] = await db.query('SELECT * FROM person', {
        type: QueryTypes.SELECT
    });

    res.json({ personList });
});

app.get('/person/:personId', async (req, res) => {
    const person = await getPersonById(req.params.personId);

    if (!person) {
        res.status(404).json({ error: 'Person not found' });
        return;
    }

    res.json({ person });
});

app.get('/person/:prename/:surname', async (req, res) => {
    const person = await getPersonByName(
        req.params.prename,
        req.params.surname
    );

    if (!person) {
        res.status(404).json({ error: 'Person not found' });
        return;
    }

    res.json({ person });
});

app.post('/person', async (req, res) => {
    const person: Person = req.body.person;

    try {
        const personResult = await createPerson(person);
        let status = 200;

        if(typeof(personResult) === 'string') {
            status = 500;
        }

        res.status(status).json({ personResult });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/person', async (req, res) => {
    const person: Person = req.body.person;

    try {
        const personResult = await updatePerson(person);
        res.json({ personResult });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/person/:personId', async (req, res) => {
    try {
        await deletePerson(req.params.personId);
        res.status(200).json(req.params.personId);
    } catch (error: any) {
        res.status(500).json({ error: error.Message });
    }
});

// Task
app.post('/task', async (req, res) => {
    try {
        const task = await createTask(req.body.task);
        res.status(200).json(task);
    } catch (error: any) {
        res.status(500).json({ error: error.Message });
    }
});

app.get('/task/:taskId', async (req, res) => {
    try {
        const task = await getTaskById(req.params.taskId);
        res.status(200).json(task);
    } catch (error: any) {
        res.status(500).json({ error: error.Message });
    }
});

app.get('/task/search/:taskName', async (req, res) => {
    try {
        const task = await getTaskByName(req.params.taskName);

        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        res.status(200).json(task);
    } catch (error: any) {
        res.status(500).json({ error: error.Message });
        return;
    }
});

app.put('/task', async (req, res) => {
    try {
        const task = await updateTask(req.body.task);
        res.status(200).json(task);
    } catch (error: any) {
        res.status(500).json({ error: error.Message });
        return;
    }
});

app.delete('/task/:taskId', async (req, res) => {
    try {
        deleteTask(req.params.taskId);
        res.status(200).json(req.params.taskId);
        return;
    } catch (error: any) {
        res.status(500).json({ error: error.Message });
        return;
    }
});

// Iteration
app.post('/iteration', async (req, res) => {
    try {
        const iteration: Iteration = await createIteration(req.body.iteration);
        res.status(200).json(iteration);
    } catch (error: any) {
        res.status(500).json({ error: error.Message });
    }
});

app.get('/iteration/:iterationId', async (req, res) => {
    try {
        const iteration = await getIterationById(req.params.iterationId);
        return iteration;
    } catch (error: any) {
        res.status(500).json({ error: error.Message });
    }
});

app.get('/iteration/list/:iterationName', async (req, res) => {
    try {
        const iterationList = await getIterationByName(
            req.params.iterationName
        );
        res.status(200).json(iterationList);
    } catch (error: any) {
        res.status(500).json({ error: error.Message });
    }
});

app.put('/iteration', async (req, res) => {
    try {
        const iteration = await updateIteration(req.body.iteration);
        res.status(200).json(iteration);
    } catch (error: any) {
        res.status(500).json({ error: error.Message });
    }
});

app.delete('/iteration/:iterationId', async (req, res) => {
    res.status(404).json({ message: 'Not yet implemented' });
});

// IterationTask
app.post('/iterationTask', async (req, res) => {
    res.status(404).json({ message: 'Not yet implemented' });
});

app.get('/iterationTask/:iterationTaskId', async (req, res) => {
    res.status(404).json({ message: 'Not yet implemented' });
});

app.get('/iterationTask/list', async (req, res) => {
    res.status(404).json({ message: 'Not yet implemented' });
});

app.put('/iterationTask', async (req, res) => {
    res.status(404).json({ message: 'Not yet implemented' });
});

app.put('/iterationTask/setDone', async (req, res) => {
    res.status(404).json({ message: 'Not yet implemented' });
});
