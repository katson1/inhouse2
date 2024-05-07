import sqlite3 from 'sqlite3';

class Team1 {
  constructor(databasePath) {
    this.db = new sqlite3.Database(databasePath);
  }

  async getTeam1() {
    const rows = await this.query('SELECT * FROM team1');
    return rows;
  }

  async insertPlayerOnTeam1(username) {
    await this.run('INSERT INTO team1 (player) VALUES (?)', [username]);
  }

  async clearTeam1() {
    await this.run('DELETE FROM team1');
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

export default Team1;
