import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as echarts from 'echarts';

@Component({
  selector: 'app-responses',
  templateUrl: './responses.page.html',
  styleUrls: ['./responses.page.scss'],
})
export class ResponsesPage implements OnInit {
  questions: string[] = [
    'Durante o atendimento, qual o nível de cordialidade, empatia e respeito demonstrado pelos funcionários da Administração Geral Tributária.',
    'Postura comportamental dos funcionários da Administração Geral Tributária.',
    'Qualidade técnica dos funcionários da Administração Geral Tributária.',
    'Tempo de espera na resolução do motivo que o levou a visitar Administração Geral Tributária.',
    'Condições das infraestruturas da Administração Geral Tributária (Ex. climatização, iluminação, cadeiras, placas sinalizadoras e informativas, limpeza e ruídos).',
    'Operacionalidade das plataformas tecnológicas da Administração Geral Tributária.',
    'Os mecanismos de comunicação são assertivos, claros e objectivos.',
    'Qualidade do atendimento prestado pelo agente da Polícia Fiscal e Aduaneira, em representação da Administração Geral Tributária.'
  ];
  responses: any[] = [];
  filteredResponses: any[] = [];
  showContent: boolean = false;
  startDate: string = '';
  endDate: string = '';

  constructor(
    private navCtrl: NavController,
    private alertController: AlertController,
    private dataService: DataService
  ) {}

  async ngOnInit() {
    // Define a data atual para startDate e endDate
    const today = new Date().toISOString().substring(0, 10);
    this.startDate = today;
    this.endDate = today;

    // Verificar estado de login
    const isLoggedIn = await this.dataService.get('isLoggedIn');
    if (isLoggedIn) {
      this.showContent = true;
      this.responses = await this.dataService.getAllResponses();
      this.filterResponses();
    }
  }

  async ionViewWillEnter() {
    const isLoggedIn = await this.dataService.get('isLoggedIn');
    if (!isLoggedIn) {
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
                await this.dataService.set('isLoggedIn', true);
                try {
                  this.responses = await this.dataService.getAllResponses();
                  this.filterResponses();
                  console.log('Respostas carregadas:', this.responses);
                } catch (error) {
                  console.error('Erro ao carregar respostas:', error);
                  const errorAlert = await this.alertController.create({
                    header: 'Erro',
                    message: 'Erro ao carregar respostas. Tente novamente.',
                    buttons: ['OK'],
                  });
                  await errorAlert.present();
                }
              } else {
                const errorAlert = await this.alertController.create({
                  header: 'Erro',
                  message: 'Senha incorreta!',
                  buttons: ['OK'],
                });
                await errorAlert.present();
                this.navCtrl.navigateRoot('/home');
              }
            },
          },
        ],
      });

      await alert.present();
    }
  }

  async logout() {
    await this.dataService.clearLoginStatus();
    this.navCtrl.navigateRoot('/home');
  }

  filterResponses() {
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      this.filteredResponses = this.responses.filter(r => {
        const date = new Date(r.date); // Certifique-se de que o campo de data é 'date'
        return date >= start && date <= end;
      });
      console.log('Respostas filtradas:', this.filteredResponses);
    } else {
      this.filteredResponses = this.responses;
      console.log('Sem filtro de data, respostas:', this.filteredResponses);
    }
  }

  async goToNextPage() {
    if (!this.startDate || !this.endDate) {
      const alert = await this.alertController.create({
        header: 'Erro',
        message: 'Por favor, selecione um intervalo de datas.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    this.navCtrl.navigateForward(`/responses1?startDate=${this.startDate}&endDate=${this.endDate}`);
  }

  formatDate(date: string): string {
    const dateObj = new Date(date);
    const day = ('0' + dateObj.getDate()).slice(-2);
    const month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  }

  calculateResponseCounts(question: string, filteredResponses: any[]): { text: string, count: number, percentage: number }[] {
    const questionIndex = this.questions.indexOf(question) + 1;
    const responseCountMap: { [key: string]: number } = {};

    filteredResponses.forEach(response => {
      const answer = response[`resposta${questionIndex}`];
      if (answer !== undefined && answer !== null) {
        if (!responseCountMap[answer]) {
          responseCountMap[answer] = 0;
        }
        responseCountMap[answer]++;
      }
    });

    const totalResponses = filteredResponses.length;

    return Object.keys(responseCountMap).map(key => ({
      text: key,
      count: responseCountMap[key],
      percentage: parseFloat(((responseCountMap[key] / totalResponses) * 100).toFixed(2))
    }));
  }

  async renderChart(question: string, filteredResponses: any[]): Promise<string> {
    const chartDom = document.createElement('div');
    chartDom.style.width = '800px';
    chartDom.style.height = '500px';

    const chartInstance = echarts.init(chartDom);
    const responseCounts = this.calculateResponseCounts(question, filteredResponses);
    const chartOptions = {
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
          data: responseCounts.map(response => ({
            value: response.count,
            name: `${response.text} (${response.percentage}%)`,
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

    chartInstance.setOption(chartOptions);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(chartInstance.getDataURL({
          pixelRatio: 2,
          backgroundColor: '#fff'
        }));
      }, 1000);
    });
  }

  async downloadPDF() {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [550, 500]
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;
    const chartWidth = 500;
    const chartHeight = 300;

    const startDateFormatted = this.formatDate(this.startDate);
    const endDateFormatted = this.formatDate(this.endDate);

    for (let i = 0; i < this.questions.length; i++) {
      const question = this.questions[i];
      if (i > 0) doc.addPage();

      doc.setFontSize(18);
      const splitTitle = doc.splitTextToSize(question, pageWidth - 2 * margin);
      doc.text(splitTitle, pageWidth / 2, 40, { align: 'center' });

      const chartImage = await this.renderChart(question, this.filteredResponses);
      doc.addImage(chartImage, 'PNG', (pageWidth - chartWidth) / 2, 60, chartWidth, chartHeight);

      const responseCounts = this.calculateResponseCounts(question, this.filteredResponses);
      const data = responseCounts.map(response => [
        response.text,
        response.count,
        `${response.percentage}%`
      ]);

      (doc as any).autoTable({
        head: [['Resposta', 'Total de Votos', 'Percentagem']],
        body: data,
        startY: 370,
        theme: 'grid',
        styles: {
          fontSize: 10,
          cellPadding: 4
        },
        margin: { left: (pageWidth - chartWidth) / 2 },
        columnStyles: {
          0: { cellWidth: 200 },
          1: { cellWidth: 60 },
          2: { cellWidth: 60 }
        }
      });

      const totalMen = this.filteredResponses.filter(r => r.genero === 'masculino').length;
      const totalWomen = this.filteredResponses.filter(r => r.genero === 'feminino').length;
      const peopleText = `Total de homens: ${totalMen}, Total de mulheres: ${totalWomen}`;

      doc.setFontSize(12);
      doc.text(peopleText, pageWidth / 2, (doc as any).lastAutoTable.finalY + 20, { align: 'center' });
    }

    const fileName = `Respostas_${startDateFormatted}_a_${endDateFormatted}.pdf`;
    doc.save(fileName);
  }
}
