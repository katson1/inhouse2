import sqlite3 from 'sqlite3';

class Spec {
  constructor(databasePath) {
    this.db = new sqlite3.Database(databasePath);
  }

  async addAsSpec(username) {
    const result = await this.run('INSERT INTO spec (username) VALUES (?)', [username]);
    return result.lastID;
  }

  async removeAsSpec(username) {
    const result = await this.run('DELETE FROM spec WHERE username = ?', [username]);
    return result.lastID;
  }

  async searchSpec(username) {
    const result = await this.get('SELECT username FROM spec WHERE username = ?', [username]);
  
    return result ? result.username : null;
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

  get(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(query, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  close() {
    this.db.close();
  }
}

export default Spec;
