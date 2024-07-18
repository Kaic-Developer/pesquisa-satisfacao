  import { Component, OnInit } from '@angular/core';
  import { NavController } from '@ionic/angular';
  import { DataService } from '../services/data.service';

  @Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
  })
  export class HomePage implements OnInit {
    nome: string = '';
    sexo: string = '';
    idade: number | undefined;

    constructor(private navCtrl: NavController, private dataService: DataService) {}

    async ngOnInit() {
      // Limpar os campos de entrada ao inicializar a página
      this.nome = '';
      this.idade = undefined;
      this.sexo = '';

      // Limpar qualquer dado temporário ao inicializar a página
      await this.dataService.clearTempData();
    }

    async iniciar(): Promise<void> {
      if (this.nome && this.idade) {
        const currentResponse = {
          nome: this.nome,
          idade: this.idade,
          sexo: this.sexo,
          resposta1: '',
          resposta2: '',
          resposta3: '',
          resposta4: '',
          resposta5: '',
          resposta6: '',
          resposta7: '',
          resposta8: '',
          resposta9: '',
          resposta10: '',
          resposta11: '',
          resposta12: '',


        };
        await this.dataService.set('currentResponse', currentResponse);
        this.navCtrl.navigateForward('/question1');
      } else {
        alert('Por favor, preencha todos os campos.');
      }
    }

    irParaResponses(): void {
      this.navCtrl.navigateForward('/responses');
    }
  }
