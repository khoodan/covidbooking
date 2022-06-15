export abstract class DataService {
  protected async getDataForItem(dataList: any[], mapper: (data: any) => Promise<void>): Promise<void> {
    await Promise.all(dataList.map(mapper))
  }
}