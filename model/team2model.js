import sqlite3 from 'sqlite3';

class Team2 {
  constructor(databasePath) {
    this.db = new sqlite3.Database(databasePath);
  }

  async getTeam2() {
    const rows = await this.query('SELECT rowid, * FROM team2');
    return rows;
  }

  async getTeam2WithPlayers() {
    const rows = await this.query('SELECT * FROM team2 inner join player on username = player');
    return rows;
  }

  async getTeam2Cap() {
    const rows = await this.query('SELECT rowid, * FROM team2 where rowid = 1');
    return rows[0];
  }

  async insertPlayerOnTeam2(username) {
    await this.run('INSERT INTO team2 (player) VALUES (?)', [username]);
  }

  async clearTeam2() {
    await this.run('DELETE FROM team2');
  }
  
  async getTeam2MMR() {
    const rows = await this.query('SELECT AVG(mmr) AS mmr FROM team2 inner join player on username = player');
    return rows[0];
  }

  async redraftTeam2() {
    await this.run('DELETE FROM team2 where rowid <> 1');
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

export default Team2;
