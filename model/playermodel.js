import sqlite3 from 'sqlite3';

class Player {
  constructor(databasePath) {
    this.db = new sqlite3.Database(databasePath);
  }

  async getPlayers() {
    const rows = await this.query('SELECT * FROM player');
    return rows;
  }

  async getPlayerByusername(username) {
    const rows = await this.query('SELECT * FROM player WHERE username = ?', [username]);
    return rows;
  }

  async getPlayerByTopMMR() {
    const rows = await this.query('SELECT * FROM player ORDER BY mmr DESC LIMIT 10');
    return rows;
  }

  async getPlayerByBotMMR() {
    const rows = await this.query('SELECT * FROM player ORDER BY mmr LIMIT 10');
    return rows;
  }

  async getPlayerByTopWins() {
    const rows = await this.query('SELECT * FROM player ORDER BY win LIMIT 10');
    return rows;
  }

  async getPlayerByTopLoses() {
    const rows = await this.query('SELECT * FROM player ORDER BY lose LIMIT 10');
    return rows;
  }

  async getPlayersListWithIn(stringWithoutBrackets, username) {
    const rows = await this.query(`SELECT rowid, * FROM player WHERE username IN (${stringWithoutBrackets},"${username}")`, []);
    return rows;
  }

  async createPlayer(username, mmr) {
    const result = await this.run('INSERT INTO player (username, mmr, win, lose, games) VALUES (?,?,0,0,0)', [username, mmr]);
    return result.lastID;
  }

  async updatePlayerWins(username) {
    await this.run('UPDATE player SET win = win + 1 WHERE username = ?', [username]);
  }

  async updatePlayerLoses(username) {
    await this.run('UPDATE player SET lose = lose + 1 WHERE username = ?', [username]);
  }

  async updatePlayerGames(username) {
    await this.run('UPDATE player SET games = games + 1 WHERE username = ?', [username]);
  }

  async updatePlayerMmrWin(username) {
    await this.run('UPDATE player SET mmr = mmr + 5 WHERE username = ?', [username]);
  }

  async updatePlayerMmrLose(username) {
    await this.run('UPDATE player SET mmr = mmr - 5 WHERE username = ?', [username]);
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

export default Player;
