import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import * as echarts from 'echarts';

@Component({
  selector: 'app-responses',
  templateUrl: './responses.page.html',
  styleUrls: ['./responses.page.scss'],
})
export class ResponsesPage implements OnInit {
  responses: any[] = [];
  chartOptions: any;
  chartInstance: any;
  showContent: boolean = false; // Variable to control the display of the content

  constructor(
    private navCtrl: NavController,
    private alertController: AlertController,
    private dataService: DataService
  ) {}

  async ngOnInit() {
    // Initially, do not load responses or chart
  }

  async ionViewWillEnter() {
    const alert = await this.alertController.create({
      header: 'Senha necessária',
      message: 'Digite a senha para acessar as respostas:',
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: 'Senha',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this.navCtrl.navigateRoot('/home');
          },
        },
        {
          text: 'Entrar',
          handler: async (data) => {
            if (data.password === 'agt@01') {
              this.showContent = true;
              this.responses = await this.dataService.getAllResponses();
              this.updateChart();
            } else {
              this.alertController
                .create({
                  header: 'Erro',
                  message: 'Senha incorreta!',
                  buttons: ['OK'],
                })
                .then((alert) => alert.present());
              this.navCtrl.navigateRoot('/home');
            }
          },
        },
      ],
    });

    await alert.present();
  }

  ionViewDidEnter() {
    // Ensure the chart is rendered when the view is entered
    if (this.showContent) {
      this.renderChart();
      window.addEventListener('resize', this.resizeChart.bind(this));
    }
  }

  ionViewWillLeave() {
    // Cleanup the resize event listener
    window.removeEventListener('resize', this.resizeChart.bind(this));
  }

  toggleDetails(response: any, event: Event) {
    event.stopPropagation();
    response.showDetails = !response.showDetails;
  }

  async confirmDelete(response: any, event: Event) {
    event.stopPropagation();

    const alert = await this.alertController.create({
      header: 'Confirmação',
      message: 'Digite a senha para deletar esta resposta:',
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: 'Senha',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Deletar',
          handler: async (data) => {
            if (data.password === 'agt@01') {
              await this.deleteResponse(response);
            } else {
              const errorAlert = await this.alertController.create({
                header: 'Erro',
                message: 'Senha incorreta!',
                buttons: ['OK'],
              });
              await errorAlert.present();
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async deleteResponse(response: any) {
    this.responses = this.responses.filter((res) => res !== response);
    await this.dataService.set('responses', this.responses);
    this.updateChart(); // Update the chart after deleting a response
  }

  voltar(): void {
    this.navCtrl.navigateBack('/home');
  }

  updateChart() {
    const chartData: { [key: string]: number } = {
      'Muito Bom': 0,
      'Bom': 0,
      'Pouco Satisfeito': 0,
      'Totalmente Insatisfeito': 0,
    };

    this.responses.forEach((response) => {
      for (let i = 1; i <= 12; i++) {
        const resposta = response[`resposta${i}`];
        if (resposta && chartData.hasOwnProperty(resposta)) {
          chartData[resposta]++;
        }
      }
    });

    this.chartOptions = {
      title: {
        text: 'Distribuição das Respostas',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: 'bottom',
      },
      series: [
        {
          name: 'Respostas',
          type: 'pie',
          radius: '50%',
          data: Object.keys(chartData).map((key) => ({
            value: chartData[key],
            name: key,
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };

    if (this.chartInstance) {
      this.chartInstance.setOption(this.chartOptions);
    } else {
      this.renderChart();
    }
  }

  renderChart() {
    const chartDom = document.getElementById('chart')!;
    this.chartInstance = echarts.init(chartDom);
    this.chartInstance.setOption(this.chartOptions);
    this.resizeChart(); // Ensure the chart is resized correctly
  }

  resizeChart() {
    if (this.chartInstance) {
      this.chartInstance.resize();
    }
  }
}
