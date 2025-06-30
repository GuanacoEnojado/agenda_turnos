import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';

export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  created_at?: string;
}


@Injectable({
  providedIn: 'root'
})
export class DbService {
  private database!: SQLiteObject;
  private dbReady = false
  

  constructor(
    private sqlite: SQLite,
    private platform: Platform
  ) { 
    this.initializeDatabase();
  }

async initializeDatabase() {
    await this.platform.ready();
    
    try {
      this.database = await this.sqlite.create({
        name: 'auth.db',
        location: 'default'
      });
      
      await this.createTables();
      this.dbReady = true;
      console.log('Base de datos crada');
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

  private async createTables() {
    const sql = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await this.database.executeSql(sql, []);
  }

  async registerUser(user: User): Promise<boolean> {
    if (!this.dbReady) {
      await this.initializeDatabase();
    }

    try {
      const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      await this.database.executeSql(sql, [user.username, user.email, user.password]);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  }

  async loginUser(username: string, password: string): Promise<User | null> {
    if (!this.dbReady) {
      await this.initializeDatabase();
    }

    try {
      const sql = 'SELECT * FROM users WHERE (username = ? OR email = ?) AND password = ?';
      const result = await this.database.executeSql(sql, [username, username, password]);
      
      if (result.rows.length > 0) {
        return result.rows.item(0);
      }
      return null;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  async checkUserExists(username: string, email: string): Promise<boolean> {
    if (!this.dbReady) {
      await this.initializeDatabase();
    }

    try {
      const sql = 'SELECT COUNT(*) as count FROM users WHERE username = ? OR email = ?';
      const result = await this.database.executeSql(sql, [username, email]);
      return result.rows.item(0).count > 0;
    } catch (error) {
      console.error('Check user exists error:', error);
      return false;
    }
  }
}