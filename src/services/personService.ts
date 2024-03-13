import { QueryTypes } from 'sequelize';
import { getMySQLConnection } from '../helper/connection';
import { Person } from '../../types/Person';
import { v4 as uuid } from 'uuid';

/**
 * Searches for a creates person by id
 * @param personId the ID of the person to look for
 * @returns person if found, null otherwise
 */
export async function getPersonById(personId: string): Promise<Person | null> {
    const db = await getMySQLConnection();

    const personArr: Person[] = await db.query(
        `SELECT *
            FROM person
            WHERE personId = $personId`,
        { type: QueryTypes.SELECT, bind: { personId } }
    );

    if(personArr.length === 0) {
        return null;
    }

    return personArr[0];
}

/**
 * Searches for a person by name
 * @param prename Prename of the person to look for
 * @param surname Surname of the person to look for
 * @returns Person if found, null otherwise
 */
export async function getPersonByName(
    prename: string,
    surname: string
): Promise<Person | null> {
    const db = await getMySQLConnection();
    const personArr: Person[] = await db.query(
        `SELECT *
            FROM person
            WHERE prename = $prename
                AND surname = $surname`,
        {
            bind: { prename, surname },
            type: QueryTypes.SELECT
        }
    );

    if (personArr.length === 0) {
        return null;
    }

    return personArr[0];
}

/**
 * Creates the given person in the database
 * @param person Person-Object to create
 * @returns Created Person object if successful, undefined otherwise
 */
export async function createPerson(
    person: Person
): Promise<Person | string> {
    try {
        const personDb = await getPersonByName(person.prename, person.surname);
        
        if (personDb) {
            throw new Error('Person already exists');
        }
        const db = await getMySQLConnection();

        const personId = uuid();
        await db.query(
            `
            INSERT INTO person (personId, prename, surname, active)
                VALUES ($personId, $prename, $surname, $active)`,
            {
                bind: {
                    personId: personId,
                    prename: person.prename,
                    surname: person.surname,
                    active: true
                },
                type: QueryTypes.INSERT
            }
        );

        return person;
    } catch (error: any) {
        return 'Error while creating person: ' + error.message;
    }
}

/**
 * Updates the given person in the database
 * @param person Person object to update
 * @returns Updated Person object if successful, undefined otherwise
 */
export async function updatePerson(
    person: Person
): Promise<Person | undefined> {
    try {
        const personDb = await getPersonById(person.personId);

        if (!personDb) {
            throw new Error('Person does not exist');
        }

        const query = `UPDATE person 
                        SET prename = $prename,
                            surname = $surname,
                            active = $active
                        WHERE personId = $personId`;
        const db = await getMySQLConnection();

        await db.query(query, {
            bind: {
                personId: person.personId,
                prename: person.prename,
                surname: person.surname,
                active: person.active
            }
        });

        return person;
    } catch (error: any) {
        throw new Error('Error while updating person: ' + error.message);
    }
}

/**
 * Deletes a person from Database
 * @param personId ID of the person to delete
 */
export async function deletePerson(personId: string): Promise<void> {
    const db = await getMySQLConnection();

    await db.query(`DELETE from person
                        WHERE personId = $personId`, {
        bind: { personId: personId }
    });
}
