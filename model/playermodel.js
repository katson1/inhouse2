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

  //unnused
  async getPlayerByUsernameWithRank(username) {
    const query = `
      SELECT p.*, (
        SELECT COUNT(*) + 1 
        FROM player 
        WHERE mmr > p.mmr
      ) AS position
      FROM player p
      WHERE p.username = ? 
    `;
    const rows = await this.query(query, [username]);
    return rows;
  }

  async getPlayerByTopMMR() {
    const query = `
      SELECT 
        username, 
        mmr, 
        win, 
        lose, 
        games, 
        primary_role, 
        secondary_role
      FROM 
        player 
      WHERE 
        games > 0
      ORDER BY 
        mmr DESC 
      LIMIT 20;
    `;
    const rows = await this.query(query);
    return rows;
  }

  async getAllPlayerByTopMMR() {
    const query = `
      SELECT 
        username, 
        mmr, 
        win, 
        lose, 
        games, 
        primary_role, 
        secondary_role
      FROM 
        player 
      ORDER BY 
        mmr DESC;
    `;
    const rows = await this.query(query);
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

  async createPlayer(username, mmr, role, role2) {
    const result = await this.run('INSERT INTO player (username, mmr, win, lose, games, primary_role, secondary_role) VALUES (?,?,0,0,0,?,?)', [username, mmr, role, role2]);
    return result.lastID;
  }

  async updatePlayerWins(username) {
    await this.run('UPDATE player SET win = win + 1 WHERE username = ?', [username]);
  }

  async updatePlayerLoses(username) {
    await this.run('UPDATE player SET lose = lose + 1 WHERE username = ?', [username]);
  }

  async updatePlayerMmr(mmr, username) {
    await this.run('UPDATE player SET mmr = ? WHERE username = ?', [mmr, username]);
  }

  async updatePlayerPrimaryRole(primary_role, username) {
    await this.run('UPDATE player SET primary_role = ? WHERE username = ?', [primary_role, username]);
  }

  async updatePlayerSecondaryRole(secondary_role, username) {
    await this.run('UPDATE player SET secondary_role = ? WHERE username = ?', [secondary_role, username]);
  }

  async updatePlayerWinStats(mmr, username) {
    await this.run('UPDATE player SET mmr = mmr + ?, win = win + 1, games = games + 1 WHERE username = ?', [mmr, username]);
  }

  async updatePlayerLoseStats(mmr, username) {
    await this.run('UPDATE player SET mmr = mmr + ?, lose = lose + 1, games = games + 1 WHERE username = ?', [mmr, username]);
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
