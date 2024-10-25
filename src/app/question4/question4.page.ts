import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-question4',
  templateUrl: './question4.page.html',
  styleUrls: ['./question4.page.scss'],
})
export class Question4Page implements OnInit {
  resposta: string = '';
  gifSrc: string = 'assets/animations/unnamed-3.gif'; // GIF padrão inicial
  additionalGifSrc: string = ''; // GIF adicional
  isDefaultGif: boolean = true; // Flag para verificar se é o GIF padrão

  constructor(private navCtrl: NavController, private dataService: DataService) {}

  async ngOnInit() {
    const currentResponse = await this.dataService.get('currentResponse');
    if (currentResponse && currentResponse.resposta4) {
      this.resposta = currentResponse.resposta4;
      this.updateGifSrc();
    }
  }

  selecionarResposta(valor: string) {
    this.resposta = valor;
    this.updateGifSrc();
  }

  updateGifSrc() {
    if (!this.resposta) {
      this.gifSrc = 'assets/animations/unnamed-3.gif'; // GIF padrão
      this.additionalGifSrc = ''; // Nenhum GIF adicional
      this.isDefaultGif = true;
      return;
    }

    this.isDefaultGif = false;
    this.additionalGifSrc = 'assets/animations/unnamed-2.gif'; // GIF adicional exibido quando uma resposta é selecionada

    switch (this.resposta) {
      case 'Plenamente Satisfeito':
        this.gifSrc = 'assets/animations/Plenamente-Satisfeito.gif';
        break;
      case 'Muito Satisfeito':
        this.gifSrc = 'assets/animations/Muito-Satisfeito.gif';
        break;
      case 'Pouco Satisfeito':
        this.gifSrc = 'assets/animations/Pouco-Satisfeito.gif';
        break;
      case 'Nada Satisfeito':
        this.gifSrc = 'assets/animations/Nada-Satisfeito.gif';
        break;
      default:
        this.gifSrc = 'assets/animations/unnamed-3.gif'; // GIF padrão
        this.additionalGifSrc = ''; // Nenhum GIF adicional
        this.isDefaultGif = true;
    }
  }

  async proxima(): Promise<void> {
    if (this.resposta) {
      const currentResponse = await this.dataService.get('currentResponse') || {};
      currentResponse.resposta4 = this.resposta;
      await this.dataService.set('currentResponse', currentResponse);

      this.navCtrl.navigateForward('/question5');
    } else {
      alert('Por favor, selecione uma opção.');
    }
  }

  voltar(): void {
    this.navCtrl.navigateBack('/question3');
  }
}
