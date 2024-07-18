import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';
import * as echarts from 'echarts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-responses1',
  templateUrl: './responses1.page.html',
  styleUrls: ['./responses1.page.scss'],
})
export class Responses1Page implements OnInit {
  questions: string[] = [
    'Indique a natureza da sua necessidade',
    'Como avalia o atendimento pelo agente da polícia fiscal?',
    'Como avalia o tempo de espera que levou para ser atendido?',
    'Como avalia o tempo de resposta para ser atendida a sua situação?',
    'O funcionário demonstrou atenção e disponibilidade para responder às suas preocupações?',
    'As acomodações que encontrou foram-lhe favoráveis?',
    'Os sistemas tecnológicos estiveram funcionais durante o atendimento?',
    'O tempo de interacção com o colaborador atingiu as suas expectativas?',
    'Como avalia a capacidade técnica do colaborador em resolver a sua situação?',
    'A sua situação foi devidamente resolvida tal como gostaria?',
    'Como avalia o nível de atendimento na AGT?',
    'Gostaria de apresentar a sua sugestão?'
  ];
  responses: any[] = [];
  filteredResponses: any[] = [];
  showContent: boolean = true; // Alterar para falso se quiser ocultar até carregar os dados
  isModalOpen: boolean = false;
  isPersonDetailModalOpen: boolean = false;
  selectedQuestion: string = '';
  selectedResponse: string = '';
  selectedPerson: any = null;
  selectedPersonResponses: any[] = [];
  selectedResponsePeople: any[] = [];
  responseCounts: { text: string, count: number, percentage: number }[] = [];
  startDate: string = '';
  endDate: string = '';
  chartInstance: any;
  chartOptions: any;
  people: any[] = [];
  selectedFilter: string = 'all';

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private dataService: DataService
  ) {}

  async ngOnInit() {
    // Aguarde até que o armazenamento esteja pronto
    await this.dataService.init();

    // Carregue todas as respostas do armazenamento
    this.responses = await this.dataService.getAllResponses();

    // Prepare a lista de pessoas para o modal de detalhes
    this.people = this.responses.map(response => ({
      nome: response.nome,
      idade: response.idade,
      sexo: response.sexo,
      respostas: this.questions.map((q, i) => ({
        pergunta: q,
        resposta: response[`resposta${i + 1}`]
      }))
    }));

    // Carregue os parâmetros de rota
    this.route.queryParams.subscribe(params => {
      this.startDate = params['startDate'];
      this.endDate = params['endDate'];
      this.filterResponses();
    });
  }

  filterResponses() {
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      this.filteredResponses = this.responses.filter(r => {
        const date = new Date(r.date); // Certifique-se de que o campo de data é 'date'
        return date >= start && date <= end;
      });
    } else {
      this.filteredResponses = this.responses;
    }
  }

  openModal(question: string) {
    this.selectedQuestion = question;
    this.applyFilter(); // Aplica o filtro ao abrir o modal
    this.isModalOpen = true;
    setTimeout(() => this.renderChart(), 0); // Renderiza o gráfico após abrir o modal
  }

  closeModal() {
    this.isModalOpen = false;
  }

  openPersonDetailModal(responseText: string) {
    this.selectedResponse = responseText;
    this.selectedResponsePeople = this.filteredResponses.filter(response => response[`resposta${this.questions.indexOf(this.selectedQuestion) + 1}`] === responseText);
    this.isPersonDetailModalOpen = true;
  }

  closePersonDetailModal() {
    this.isPersonDetailModalOpen = false;
  }

  applyFilter() {
    this.responseCounts = this.calculateResponseCounts(this.selectedQuestion, this.selectedFilter);
    this.renderChart();
  }

  calculateResponseCounts(question: string, filter: string): { text: string, count: number, percentage: number }[] {
    const questionIndex = this.questions.indexOf(question) + 1;
    const responseCountMap: { [key: string]: number } = {};

    let filtered = this.filteredResponses;
    if (filter === 'male') {
      filtered = filtered.filter(r => r.sexo === 'Masculino');
    } else if (filter === 'female') {
      filtered = filtered.filter(r => r.sexo === 'Feminino');
    }

    filtered.forEach(response => {
      const answer = response[`resposta${questionIndex}`];
      if (answer !== undefined && answer !== null) {
        if (!responseCountMap[answer]) {
          responseCountMap[answer] = 0;
        }
        responseCountMap[answer]++;
      }
    });

    const totalResponses = filtered.length;

    return Object.keys(responseCountMap).map(key => ({
      text: key,
      count: responseCountMap[key],
      percentage: parseFloat(((responseCountMap[key] / totalResponses) * 100).toFixed(2))
    }));
  }

  renderChart() {
    const chartDom = document.getElementById('modal-chart');
    if (chartDom) {
      this.chartInstance = echarts.init(chartDom);
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
            data: this.responseCounts.map(response => ({
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
      this.chartInstance.setOption(this.chartOptions);
      this.chartInstance.resize(); // Adicionado para garantir que o gráfico seja redimensionado corretamente
    }
  }

  formatDate(date: string): string {
    const dateObj = new Date(date);
    const day = ('0' + dateObj.getDate()).slice(-2);
    const month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  }

  exportModalAsPDF() {
    const doc = new jsPDF();

    // Título do PDF
    doc.setFontSize(18);
    doc.text(this.selectedQuestion, 10, 10);

    // Subtítulo com o filtro
    const filterText = this.selectedFilter === 'male' ? 'Filtro: Homens' : this.selectedFilter === 'female' ? 'Filtro: Mulheres' : 'Filtro: Todos';
    doc.setFontSize(12);
    doc.text(filterText, 10, 20);

    // Adicionando o gráfico
    const chartCanvas = this.chartInstance.getDataURL({
      pixelRatio: 2,
      backgroundColor: '#fff'
    });
    doc.addImage(chartCanvas, 'PNG', 10, 30, 180, 120);

    // Adicionando os dados
    const data = this.responseCounts.map(response => [
      response.text,
      response.count,
      `${response.percentage}%`
    ]);

    (doc as any).autoTable({
      head: [['Resposta', 'Total de Votos', 'Percentagem']],
      body: data,
      startY: 160,
    });

    const totalMen = this.filteredResponses.filter(r => r.sexo === 'Masculino').length;
    const totalWomen = this.filteredResponses.filter(r => r.sexo === 'Feminino').length;
    const peopleText = this.selectedFilter === 'male' ? `Total de homens: ${totalMen}` :
      this.selectedFilter === 'female' ? `Total de mulheres: ${totalWomen}` :
        `Total de homens: ${totalMen}, Total de mulheres: ${totalWomen}`;

    doc.setFontSize(12);
    doc.text(peopleText, 10, (doc as any).lastAutoTable.finalY + 10);

    // Nome do arquivo PDF
    const fileName = `${this.formatDate(new Date().toISOString())}-Filtro-${filterText}.pdf`;
    doc.save(fileName);
  }

  goBack() {
    this.navCtrl.navigateBack('/responses');
  }
}
