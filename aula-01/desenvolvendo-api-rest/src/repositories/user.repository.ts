import DatabaseError from "../models/errors/database.error.model";
import db from "../db";
import User from "../models/user.model";

class UserRepository {

    async finAllUsers(): Promise<User[]> {
        const query = `
            SELECT uuid, username
            FROM application_user
        `;

        const { rows } = await db.query<User>(query);

        return rows || [];
    }

    async findById(uuid: string): Promise<User> {
        try {
            const query = `
                SELECT uuid, username
                FROM application_user
                WHERE uuid = $1
            `;

            const values = [uuid];
            const { rows } = await db.query<User>(query, values);
            const [ user ] = rows;

            return user;            
        } catch (error) {
            throw new DatabaseError('Erro na consulta por ID', error);
        }
    }

    async findByUsernameAndPassword(username: string, password: string): Promise<User | null> {
        try {
            const query = `
                SELECT uuid, username
                FROM application_user
                WHERE username = $1
                AND password = crypt($2, 'my_salt')
            `;

            const values = [username, password];
            const { rows } = await db.query(query, values);
            const [ user ] = rows;

            return !user ? null : user;
        } catch (error) {
            throw new DatabaseError('Erro na consulta por username e password', error);
        }
    }

    async create(user: User): Promise<string> {
        const query = `
            INSERT INTO application_user (
                username,
                password
            )
            VALUES ($1, crypt($2, 'my_salt'))
            RETURNING uuid
        `

        const values = [user.username, user.password];

        const { rows } = await db.query<{ uuid: string }>(query, values);
        const [ newUser ] = rows;

        return newUser.uuid;
    }

    async update(user: User): Promise<void> {
        const query = `
            UPDATE application_user
            SET
                username = $1,
                password = crypt($2, 'my_salt')
            WHERE uuid = $3
        `

        const values = [user.username, user.password, user.uuid];

        await db.query(query, values);
    }

    async remove(uuid: string): Promise<void> {
        const query = `
            DELETE
            FROM application_user
            WHERE uuid = $1
        `

        const values = [uuid];

        await db.query(query, values);
    }

}

export default new UserRepository();