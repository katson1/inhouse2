import sqlite3 from 'sqlite3';

class MatchController {
    constructor(databasePath) {
        this.db = new sqlite3.Database(databasePath);
    }

    async getMatchController() {
        const rows = await this.query('SELECT * FROM match_controller');
        return rows;
    }

    async updateFirstPick(username) {
        await this.run('UPDATE match_controller SET firstpick = ?', [username]);
    }

    async updateOther(username) {
        await this.run('UPDATE match_controller SET other = ?', [username]);
    }

    async updateNextpick(username) {
        await this.run('UPDATE player SET next = ?', [username]);
    }

    async updatePicksNumber(nextPick) {
        await this.run('UPDATE player SET picksnumber = ?', [nextPick]);
    }

    async clearMatchController() {
        await this.run('DELETE FROM match_controller');
    }

    query(sql, params) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (error, rows) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    run(sql, params) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (error) {
                if (error) {
                    reject(error);
                } else {
                    resolve(this);
                }
            });
        });
    }

    close() {
        this.db.close();
    }
}

export default MatchController;
