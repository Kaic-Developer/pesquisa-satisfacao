import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.page.html',
  styleUrls: ['./thank-you.page.scss'],
})
export class ThankYouPage {
  constructor(private navCtrl: NavController, private dataService: DataService) {}

  async finalizar(): Promise<void> {
    // Recupere a resposta atual
    const currentResponse = await this.dataService.get('currentResponse');

    if (currentResponse) {
      // Adicione a resposta ao armazenamento
      await this.dataService.addResponse(currentResponse);
    }

    // Limpe os dados temporários
    await this.dataService.clearTempData();

    // Navegue de volta para a página inicial e recarregue-a
    this.navCtrl.navigateRoot('/home').then(() => {
      window.location.reload();
    });
  }

  voltar(): void {
    this.navCtrl.navigateBack('/question12');
  }
}
