export interface IStartSyncOptions {
  /**
   * If true, sync the receive data to the internal database (MongoDB)
   */
  syncToDb: boolean;
  /**
   * If true, sync the receive data to internal search engine (Elasticsearch)
   */
  syncToSwiftype: boolean;
  /**
   * If true, sync the receive data to internal search engine (Swiftype)
   */
  syncToEs: boolean;
  includeOrders: boolean;
  includeTransactions: boolean;
  includeProducts: boolean;
  includePages: boolean;
  includeCustomCollections: boolean;
  includeSmartCollections: boolean;
  resync: boolean;
  cancelExisting: boolean;
}