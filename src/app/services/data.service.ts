// src/app/services/data.service.ts
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.create();
  }

  async set(key: string, value: any): Promise<any> {
    return await this.storage.set(key, value);
  }

  async get(key: string): Promise<any> {
    return await this.storage.get(key);
  }

  async addResponse(response: any): Promise<void> {
    response.date = new Date().toISOString();
    const responses = (await this.get('responses')) || [];
    responses.push(response);
    await this.set('responses', responses);
  }

  async getAllResponses(): Promise<any[]> {
    const responses = await this.get('responses');
    return responses ? responses : [];
  }

  async clearTempData(): Promise<void> {
    await this.set('currentResponse', null);
  }

  // Adicionado para gerenciar o estado de login
  async clearLoginStatus(): Promise<void> {
    await this.set('isLoggedIn', false);
  }
}
