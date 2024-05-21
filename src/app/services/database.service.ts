import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  public async set(key: string, value: any) {
    await this._storage?.set(key, value);
  }

  public async get(key: string) {
    return await this._storage?.get(key);
  }

  public async addResponse(response: any) {
    const responses = (await this.get('responses')) || [];
    responses.push(response);
    await this.set('responses', responses);
  }

  public async getResponses() {
    return await this.get('responses');
  }
}
