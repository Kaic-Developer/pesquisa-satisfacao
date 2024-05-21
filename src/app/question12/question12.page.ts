import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-question12',
  templateUrl: './question12.page.html',
  styleUrls: ['./question12.page.scss'],
})
export class Question12Page implements OnInit {
  resposta: string = '';

  constructor(private navCtrl: NavController, private dataService: DataService) {}

  async ngOnInit() {
    const currentResponse = await this.dataService.get('currentResponse');
    if (currentResponse && currentResponse.resposta12) {
      this.resposta = currentResponse.resposta12;
    }
  }

  async proxima(): Promise<void> {
    const currentResponse = await this.dataService.get('currentResponse') || {};
    currentResponse.resposta12 = this.resposta;
    await this.dataService.set('currentResponse', currentResponse);

    this.navCtrl.navigateForward('/thank-you'); // Ou qualquer página de conclusão ou próxima
  }

  voltar(): void {
    this.navCtrl.navigateBack('/question11');
  }

  selecionarResposta(resposta: string): void {
    this.resposta = resposta;
  }
}
