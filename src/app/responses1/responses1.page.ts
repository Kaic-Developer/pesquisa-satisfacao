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
  ageFilter: { min: number, max: number } = { min: 0, max: 100 };

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
    console.log('All responses:', this.responses);

    // Prepare a lista de pessoas para o modal de detalhes
    this.people = this.responses.map(response => ({
      nome: response.nome,
      idade: response.idade,
      genero: response.genero,
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
    let filtered = this.responses;

    // Filtrar por data
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      filtered = filtered.filter(r => {
        const date = new Date(r.date); // Certifique-se de que o campo de data é 'date'
        return date >= start && date <= end;
      });
      console.log('Filtered by date:', filtered);
    }

    // Filtrar por idade
    filtered = filtered.filter(r => r.idade >= this.ageFilter.min && r.idade <= this.ageFilter.max);
    console.log('Filtered by age:', filtered);

    this.filteredResponses = filtered;
    this.applyFilter();
  }

  applyFilter() {
    this.responseCounts = this.calculateResponseCounts(this.selectedQuestion, this.selectedFilter);
    console.log('Response counts:', this.responseCounts);
    this.renderChart();
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

  calculateResponseCounts(question: string, filter: string): { text: string, count: number, percentage: number }[] {
    const questionIndex = this.questions.indexOf(question) + 1;
    const responseCountMap: { [key: string]: number } = {};

    let filtered = this.filteredResponses;
    if (filter === 'male') {
      filtered = filtered.filter(r => r.genero === 'masculino');
    } else if (filter === 'female') {
      filtered = filtered.filter(r => r.genero === 'feminino');
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
    return `${day}_${month}_${year}`;
  }

  exportModalAsPDF() {
    const doc = new jsPDF('portrait', 'mm', [297, 420]); // A3 page size
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;

    // Título do PDF
    doc.setFontSize(18);
    const splitTitle = doc.splitTextToSize(this.selectedQuestion, pageWidth - 2 * margin);
    doc.text(splitTitle, pageWidth / 2, margin * 2, { align: 'center' });

    // Subtítulo com o filtro
    const filterText = this.selectedFilter === 'male' ? 'Filtro: Homens' : this.selectedFilter === 'female' ? 'Filtro: Mulheres' : 'Filtro: Todos';
    doc.setFontSize(12);
    doc.text(filterText, pageWidth / 2, margin * 3.5, { align: 'center' });

    // Adicionando o gráfico
    const chartCanvas = this.chartInstance.getDataURL({
      pixelRatio: 2,
      backgroundColor: '#fff'
    });
    doc.addImage(chartCanvas, 'PNG', (pageWidth - 180) / 2, margin * 5, 180, 120);

    // Adicionando os dados
    const data = this.responseCounts.map(response => [
      response.text,
      response.count,
      `${response.percentage}%`
    ]);

    (doc as any).autoTable({
      head: [['Resposta', 'Total de Votos', 'Percentagem']],
      body: data,
      startY: 150,
      margin: { left: (pageWidth - 180) / 2, right: (pageWidth - 180) / 2 },
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 4
      },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 60 },
        2: { cellWidth: 60 }
      }
    });

    const totalMen = this.filteredResponses.filter(r => r.genero === 'masculino').length;
    const totalWomen = this.filteredResponses.filter(r => r.genero === 'feminino').length;
    const peopleText = this.selectedFilter === 'male' ? `Total de homens: ${totalMen}` :
      this.selectedFilter === 'female' ? `Total de mulheres: ${totalWomen}` :
        `Total de homens: ${totalMen}, Total de mulheres: ${totalWomen}`;

    doc.setFontSize(12);
    doc.text(peopleText, pageWidth / 2, (doc as any).lastAutoTable.finalY + 10, { align: 'center' });

    // Nome do arquivo PDF
    const fileName = `Respostas_${this.formatDate(this.startDate)}_a_${this.formatDate(this.endDate)}-FILTRADAS.pdf`;
    doc.save(fileName);
  }

  goBack() {
    this.navCtrl.navigateBack('/responses');
  }
}
