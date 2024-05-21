import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-question13',
  templateUrl: './question13.page.html',
  styleUrls: ['./question13.page.scss'],
})
export class Question13Page implements OnInit {
  resposta: string = '';

  constructor(private navCtrl: NavController, private dataService: DataService) {}

  async ngOnInit() {
    const currentResponse = await this.dataService.get('currentResponse');
    if (currentResponse && currentResponse.resposta13) {
      this.resposta = currentResponse.resposta13;
    }
  }

  async proxima(): Promise<void> {
    if (this.resposta) {
      const currentResponse = await this.dataService.get('currentResponse') || {};
      currentResponse.resposta13 = this.resposta;
      await this.dataService.set('currentResponse', currentResponse);

      this.navCtrl.navigateForward('/thank-you'); // Ou qualquer página de conclusão ou próxima
    } else {
      alert('Por favor, escreva uma resposta.');
    }
  }

  voltar(): void {
    this.navCtrl.navigateBack('/question12');
  }
}
