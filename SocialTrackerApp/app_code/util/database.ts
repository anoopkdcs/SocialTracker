import { openDatabaseSync, SQLiteDatabase, SQLiteRunResult } from "expo-sqlite";
import { getStackTrace } from "./func";


interface WhereCondition {
  column: string;
  value: any;
  operator?: string; // =, >, <, >=, <=, LIKE, etc.
}

interface OrderByCondition {
  column: string;
  direction?: 'ASC' | 'DESC';
}

interface QueryOptions {
  where?: WhereCondition[];
  orderBy?: OrderByCondition[];
  limit?: number;
  offset?: number;
}

class DatabaseService {
  // private db: SQLiteDatabase
  private db: any


  async init(dbName: string){
    this.db = await openDatabaseSync(dbName);
  }


 

  async executeQuery<T>(sql: string, params: any[] = []): Promise<SQLiteRunResult> {
    getStackTrace()
    return new Promise(async (resolve, reject) => {
      try{
        const result = await this.db.runAsync(sql, ...params)
        console.log({executeQueryResult: result, sql})
        resolve(result)
      }
      catch(err){
        console.log({executeQueryError: err})
        reject(err)
      }
    })
  }

  async initializeTable(tableName: string, schema: string): Promise<unknown> {
    getStackTrace()
    const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (${schema})`;
   //console.log({sql})
   return await this.db.execAsync(sql)
  }

  async rawQuery<T>(sqlQuery: string): Promise<unknown[]> {
    
    console.log({rawQuery: sqlQuery})
    return new Promise(async(resolve, reject) => {
      try{
        const result = await this.db.getAllAsync(sqlQuery)
        console.log({rawQueryResult: result})
        resolve(result)
      }catch(err){
        console.log({rawQueryError: err})
        reject(err)
      }
    })
  }

  async getAll<T>(tableName: string, options: QueryOptions = {}): Promise<unknown[]> {
    getStackTrace()
    let sql = `SELECT * FROM ${tableName}`;
    const params: any[] = [];

    if (options.where && options.where.length > 0) {
      sql += ' WHERE ' + options.where
        .map(condition => {
          params.push(condition.value);
          return `${condition.column} ${condition.operator || '='} ?`;
        })
        .join(' AND ');
    }

    if (options.orderBy && options.orderBy.length > 0) {
      sql += ' ORDER BY ' + options.orderBy
        .map(order => `${order.column} ${order.direction || 'ASC'}`)
        .join(', ');
    }

    if (options.limit) {
      sql += ` LIMIT ${options.limit}`;
      if (options.offset) {
        sql += ` OFFSET ${options.offset}`;
      }
    }

    console.log({getAllSql: sql, params})
    return new Promise(async (resolve, reject) => {
      try{
        const result = await this.db.getAllAsync(sql, params)
        console.log({getAllResult: result, params})
        resolve(result)
      }catch(err){
        console.log({getAllError: err})
        reject(err)
      }
    })
  }

  async getOne<T>(tableName: string, options: QueryOptions = {}): Promise<unknown> {
    return new Promise( async (resolve, reject)=>{
      try{
        const results = await this.getAll<T>(tableName, { ...options, limit: 1 });
        console.log({getOne: results})
        resolve(results.length > 0 ? results[0] : null)
      }catch(err){
        console.log({getOneReject:err})
        reject({err: err} )
      }
    })
  
  }

  async getById<T>(tableName: string, id: number | string): Promise<unknown> {
    getStackTrace()
    const options: QueryOptions = {
      where: [{ column: 'id', value: id }]
    };
    return this.getOne<T>(tableName, options);
  }

  async insert<T>(tableName: string, data: Partial<T>): Promise<SQLiteRunResult> {
    getStackTrace()
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = new Array(values.length).fill('?').join(',');

    const sql = `INSERT INTO ${tableName} (${columns.join(',')}) VALUES (${placeholders})`;
    console.log({sql, values})
    return await this.executeQuery(sql, values);
    
  }

  async update<T>(
    tableName: string,
    conditions: WhereCondition[],
    data: Partial<T>
  ): Promise<unknown> {
    getStackTrace()
    const columns = Object.keys(data);
    const values = Object.values(data);
    const setClause = columns.map(col => `${col} = ?`).join(',');
    
    let sql = `UPDATE ${tableName} SET ${setClause}`;
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions
        .map(condition => `${condition.column} ${condition.operator || '='} ?`)
        .join(' AND ');
      values.push(...conditions.map(c => c.value));
    }
    console.log({sql, values})
   return await this.executeQuery(sql, values);
  }

  async delete(tableName: string, conditions: WhereCondition[]): Promise<unknown> {
    getStackTrace()
    let sql = `DELETE FROM ${tableName}`;
    const params: any[] = [];

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions
        .map(condition => {
          params.push(condition.value);
          return `${condition.column} ${condition.operator || '='} ?`;
        })
        .join(' AND ');
    }

   return await this.executeQuery(sql, params);
  }
}


export default DatabaseService
export type { WhereCondition, OrderByCondition, QueryOptions };
