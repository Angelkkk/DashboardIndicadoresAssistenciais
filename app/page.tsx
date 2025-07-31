"use client"; // Marca este componente como um Client Component

import { useState, useEffect, useCallback } from 'react'; // Importa os hooks useState, useEffect e useCallback
import KPIcard from '../components/KPIcard'; // Importa o componente KPIcard
import ChartCard from '../components/ChartCard'; // Importa o novo componente ChartCard
import DataForm from '../components/DataForm'; // Importa o componente DataForm
import DataTable from '../components/DataTable'; // Importa o componente DataTable
import CustomModal from '../components/CustomModal'; // Importa o componente CustomModal
import ViewRecordModal from '../components/ViewRecordModal'; // Importa o novo componente ViewRecordModal
import { AssistencialRecord } from '../lib/data'; // Importa apenas AssistencialRecord
import { ChartData, ChartOptions } from 'chart.js'; // Importa os tipos do Chart.js
import { toast } from 'react-toastify'; // Importa a função toast

export default function HomePage() {
  // Estado para armazenar os registos de dados
  const [dataRecords, setDataRecords] = useState<AssistencialRecord[]>([]);
  // Estado para o filtro de data atual
  const [currentFilter, setCurrentFilter] = useState<string>('all');
  // Estado para os valores dos KPIs
  const [kpiData, setKpiData] = useState({
    totalAtendimentos: 0,
    tempoEspera: 0,
    totalInternacoes: 0,
    totalObitos: 0,
  });

  // Estados para os dados e opções de cada gráfico
  const [riskChartData, setRiskChartData] = useState<ChartData<'doughnut'>>({ labels: [], datasets: [] });
  const [riskChartOptions, setRiskChartOptions] = useState<ChartOptions<'doughnut'>>({});
  
  // CORREÇÃO AQUI: Permite datasets de 'bar' ou 'line'
  const [attendanceVsWaitTimeChartData, setAttendanceVsWaitTimeChartData] = useState<ChartData<'bar' | 'line'>>({ labels: [], datasets: [] });
  const [attendanceVsWaitTimeChartOptions, setAttendanceVsWaitTimeChartOptions] = useState<ChartOptions<'bar' | 'line'>>({});

  const [outcomesChartData, setOutcomesChartData] = useState<ChartData<'bar'>>({ labels: [], datasets: [] });
  const [outcomesChartOptions, setOutcomesChartOptions] = useState<ChartOptions<'bar'>>({});

  const [resourcesChartData, setResourcesChartData] = useState<ChartData<'bar'>>({ labels: [], datasets: [] });
  const [resourcesChartOptions, setResourcesChartOptions] = useState<ChartOptions<'bar'>>({});

  // Estados para o gerenciamento de dados
  const [showDashboard, setShowDashboard] = useState<boolean>(true); // Controla qual vista está ativa
  const [editingRecord, setEditingRecord] = useState<AssistencialRecord | null>(null); // Registo atualmente em edição
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Controla a visibilidade do modal de confirmação
  const [modalMessage, setModalMessage] = useState<string>(''); // Mensagem do modal de confirmação
  const [modalAction, setModalAction] = useState<(() => void) | null>(null); // Ação a ser executada pelo modal de confirmação

  // Novos estados para o modal de visualização
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false); // Controla a visibilidade do modal de visualização
  const [viewingRecord, setViewingRecord] = useState<AssistencialRecord | null>(null); // Registo atualmente em visualização


  // Função auxiliar para quebrar labels longas em múltiplas linhas para gráficos
  const wrapLabels = (label: string | string[], maxChars: number): string | string[] => {
    if (Array.isArray(label)) {
        return label.map(l => wrapLabels(l, maxChars)) as string[];
    }
    const words = label.split(' ');
    let line = '';
    const lines = [];
    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        if (testLine.length > maxChars && i > 0) {
            lines.push(line.trim());
            line = words[i] + ' ';
        } else {
            line = testLine;
        }
    }
    lines.push(line.trim());
    return lines;
  };

  // Função para carregar os dados da API (agora busca apenas a tabela principal)
  const fetchData = useCallback(async () => {
    console.log('Frontend: Tentando buscar dados da API...');
    try {
      const response = await fetch('/api/data'); // Busca apenas a tabela principal
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Frontend Erro: Falha HTTP ao buscar registos principais! status: ${response.status}, mensagem: ${errorText}`);
        toast.error('Erro ao carregar dados do servidor.');
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const records: AssistencialRecord[] = await response.json();
      console.log('Frontend: Dados buscados com sucesso:', records);
      setDataRecords(records);
    } catch (error) {
      console.error("Frontend Erro: Falha ao carregar dados:", error);
      toast.error('Erro ao carregar dados do servidor.');
    }
  }, []); // Vazio pois não depende de nenhum estado ou prop

  // Efeito para carregar os dados na montagem do componente
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Função para atualizar os valores dos KPIs
  const updateKPIs = (data: AssistencialRecord[]) => {
    const totalAtendimentos = data.reduce((sum, item) => sum + item.atendimentos, 0);
    const totalInternacoes = data.reduce((sum, item) => sum + item.internacoes, 0);
    const totalObitos = data.reduce((sum, item) => sum + item.obitos, 0); // Já é number

    const totalEsperaSum = data.reduce((sum, item) => sum + item.espera * item.atendimentos, 0);
    const avgEsperaValue = totalAtendimentos > 0 ? (totalEsperaSum / totalAtendimentos) : 0;
    const formattedAvgEspera = avgEsperaValue.toFixed(0); // Retorna string

    setKpiData({
      totalAtendimentos,
      tempoEspera: parseFloat(formattedAvgEspera), // Converte para number
      totalInternacoes,
      totalObitos,
    });
  };

  // Lógica do gráfico de Classificação de Risco
  const updateRiskChart = (data: AssistencialRecord[]) => {
    const riskCounts = data.reduce((acc, item) => {
      acc.azul += item.azul;
      acc.verde += item.verde;
      acc.amarelo += item.amarelo;
      acc.vermelho += item.vermelho;
      return acc;
    }, { azul: 0, verde: 0, amarelo: 0, vermelho: 0 });

    setRiskChartData({
      labels: ['Azul', 'Verde', 'Amarelo', 'Vermelho'],
      datasets: [{
        label: 'Nº de Atendimentos',
        data: [riskCounts.azul, riskCounts.verde, riskCounts.amarelo, riskCounts.vermelho],
        backgroundColor: ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444'],
        borderColor: '#fff',
        borderWidth: 4,
        hoverOffset: 8
      }]
    });
    setRiskChartOptions({
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    font: { size: 14 }
                }
            }
        },
        cutout: '60%'
    });
  };

  // Lógica do gráfico de Atendimentos vs. Tempo de Espera
  const updateAttendanceVsWaitTimeChart = (data: AssistencialRecord[]) => {
    const labels = data.map(item => `${item.data.slice(8,10)}/${item.data.slice(5,7)} - ${item.turno}`);
    const attendanceData = data.map(item => item.atendimentos);
    const waitTimeData = data.map(item => item.espera);

    setAttendanceVsWaitTimeChartData({
        labels: labels,
        datasets: [{
            label: 'Nº de Atendimentos',
            data: attendanceData,
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
            yAxisID: 'y',
            type: 'bar',
            order: 2
        }, {
            label: 'Tempo Médio de Espera (min)',
            data: waitTimeData,
            backgroundColor: 'rgba(245, 158, 11, 1)',
            borderColor: 'rgba(245, 158, 11, 1)',
            yAxisID: 'y1',
            type: 'line',
            tension: 0.3,
            order: 1
        }]
    });
    setAttendanceVsWaitTimeChartOptions({
        plugins: {
            legend: { position: 'top' },
        },
        scales: {
            x: { grid: { display: false } },
            y: {
                beginAtZero: true,
                type: 'linear',
                position: 'left',
                title: { display: true, text: 'Nº de Atendimentos' }
            },
            y1: {
                beginAtZero: true,
                type: 'linear',
                position: 'right',
                title: { display: true, text: 'Tempo de Espera (min)' },
                grid: { drawOnChartArea: false }
            }
        }
    });
  };

  // Lógica do gráfico de Análise de Desfechos Críticos
  const updateOutcomesChart = (data: AssistencialRecord[]) => {
    const totalObitos = data.reduce((sum, item) => sum + item.obitos, 0);

    const outcomesCounts = {
        internacoes: data.reduce((sum, item) => sum + item.internacoes, 0),
        eventos: data.reduce((sum, item) => sum + item.eventos, 0),
        obitos: totalObitos
    };

    setOutcomesChartData({
        labels: ['Internações', 'Eventos Adversos', 'Óbitos'],
        datasets: [{
            label: 'Contagem',
            data: [outcomesCounts.internacoes, outcomesCounts.eventos, outcomesCounts.obitos],
            backgroundColor: ['#14b8a6', '#f97316', '#dc2626'],
            borderColor: ['#0f766e', '#c2410c', '#991b1b'],
            borderWidth: 1
        }]
    });
    setOutcomesChartOptions({
        indexAxis: 'y',
        plugins: {
            legend: { display: false },
        },
        scales: {
            x: { beginAtZero: true, grid: { display: false } },
            y: { grid: { display: false } }
        }
    });
  };

  // Lógica do gráfico de Recursos Utilizados
  const updateResourcesChart = (data: AssistencialRecord[]) => {
    const avaliacoes = data.reduce((acc, item) => {
        if (item.avaliacaoTipo && item.avaliacoes > 0) {
            acc[item.avaliacaoTipo] = (acc[item.avaliacaoTipo] || 0) + item.avaliacoes;
        }
        return acc;
    }, {} as Record<string, number>);

    const exames = data.reduce((acc, item) => {
        if (item.exameTipo && item.exames > 0) {
            acc[item.exameTipo] = (acc[item.exameTipo] || 0) + item.exames;
        }
        return acc;
    }, {} as Record<string, number>);

    const allResourceLabels = [...new Set([...Object.keys(avaliacoes), ...Object.keys(exames)])];
    const avaliacoesData = allResourceLabels.map(label => avaliacoes[label] || 0);
    const examesData = allResourceLabels.map(label => exames[label] || 0);

    setResourcesChartData({
        labels: allResourceLabels.map(l => wrapLabels(l, 16)),
        datasets: [{
            label: 'Avaliações Especializadas',
            data: avaliacoesData,
            backgroundColor: 'rgba(37, 99, 235, 0.7)',
            stack: 'Stack 0'
        }, {
            label: 'Exames Solicitados',
            data: examesData,
            backgroundColor: 'rgba(22, 163, 74, 0.7)',
            stack: 'Stack 0'
        }]
    });
    setResourcesChartOptions({
        plugins: {
            legend: { position: 'top' },
        },
        scales: {
            x: { stacked: true, grid: { display: false } },
            y: { stacked: true, beginAtZero: true }
        }
    });
  };

  // Função principal para atualizar o dashboard com base no filtro
  const updateDashboard = (filter: string) => {
    const filteredData = dataRecords.filter(d => filter === 'all' || d.data === filter);
    updateKPIs(filteredData);
    updateRiskChart(filteredData);
    updateAttendanceVsWaitTimeChart(filteredData);
    updateOutcomesChart(filteredData);
    updateResourcesChart(filteredData);
  };

  // Efeito para atualizar o dashboard sempre que os dados ou o filtro mudam
  useEffect(() => {
    updateDashboard(currentFilter);
  }, [dataRecords, currentFilter]); // Dependências: dataRecords e currentFilter

  // Geração dos botões de filtro de data (agora no JSX)
  const uniqueDates = [...new Set(dataRecords.map(item => item.data))].sort();

  // Lógica de gerenciamento de dados (agora interagindo com a API)
  const handleSaveRecord = async (record: AssistencialRecord) => {
    try {
      // Validação de duplicados
      const isDuplicate = dataRecords.some(
        (existingRecord) =>
          existingRecord.data === record.data &&
          existingRecord.turno === record.turno &&
          existingRecord.id !== record.id // Ignora o próprio registro se estiver editando
      );

      if (isDuplicate) {
        toast.error('Já existe um registo para esta data e turno. Por favor, edite o registo existente ou escolha outra data/turno.');
        return; // Impede a operação de salvar
      }

      let response;
      if (record.id) {
        // Editar registo existente
        response = await fetch('/api/data', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        toast.success('Registo atualizado com sucesso!');
      } else {
        // Adicionar novo registo
        response = await fetch('/api/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        toast.success('Registo adicionado com sucesso!');
      }

      await fetchData(); // Recarrega os dados após salvar/editar
      setEditingRecord(null); // Limpa o registo em edição
    } catch (error) {
      console.error("Erro ao salvar/editar registo:", error);
      toast.error('Erro ao salvar registo.');
    }
  };

  const handleEditRecord = (id: string) => {
    const recordToEdit = dataRecords.find(r => r.id === id);
    if (recordToEdit) {
      setEditingRecord(recordToEdit);
      setShowDashboard(false); // Mudar para a vista de gerenciamento de dados
      toast.info('A editar registo. Preencha o formulário.');
    } else {
      toast.error('Registo não encontrado para edição.');
    }
  };

  const handleDeleteRecord = (id: string) => {
    setModalMessage('Tem certeza que deseja excluir este registo?');
    setModalAction(() => async () => { // Ação assíncrona para o modal
      try {
        const response = await fetch(`/api/data?id=${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        await fetchData(); // Recarrega os dados após excluir
        setIsModalOpen(false); // Fecha o modal após a exclusão
        toast.success('Registo excluído com sucesso!');
      } catch (error) {
        console.error("Erro ao excluir registo:", error);
        toast.error('Erro ao excluir registo.');
      }
    });
    setIsModalOpen(true); // Abre o modal
  };

  const handleClearForm = () => {
    setEditingRecord(null);
    toast.info('Formulário limpo.');
  };

  // Função para visualizar um registo no modal
  const handleViewRecord = (record: AssistencialRecord) => {
    setViewingRecord(record);
    setIsViewModalOpen(true);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard de Indicadores Assistenciais</h1>
        <p className="text-gray-600 mt-1">Análise de desempenho da unidade de saúde.</p>
      </header>

      {/* Seção de botões de navegação */}
      <div className="flex justify-center mb-6 space-x-4">
          <button
            onClick={() => setShowDashboard(true)}
            className={`px-6 py-3 text-lg font-medium rounded-xl shadow transition-colors ${
              showDashboard ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Ver Dashboard
          </button>
          <button
            onClick={() => setShowDashboard(false)}
            className={`px-6 py-3 text-lg font-medium rounded-xl shadow transition-colors ${
              !showDashboard ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Gerenciar Dados
          </button>
      </div>

      {/* Conteúdo do Dashboard */}
      <div id="dashboard-view" className={showDashboard ? '' : 'hidden'}>
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <label htmlFor="date-filter" className="font-semibold text-gray-700">Filtrar por Período:</label>
                <div id="date-filter" className="flex flex-wrap gap-2">
                    {/* Botão "Todos os Dias" */}
                    <button
                        onClick={() => setCurrentFilter('all')}
                        className={`filter-btn px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            currentFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Todos os Dias
                    </button>
                    {/* Botões de filtro para datas únicas */}
                    {uniqueDates.map(date => (
                        <button
                            key={date}
                            onClick={() => setCurrentFilter(date)}
                            className={`filter-btn px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                currentFilter === date ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {new Date(date + 'T00:00:00').toLocaleDateString('pt-BR')}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Seção de KPIs */}
        <section id="kpi-section" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            <KPIcard title="Total de Atendimentos" value={kpiData.totalAtendimentos} colorClass="text-blue-600" />
            <KPIcard title="Tempo Médio de Espera" value={`${kpiData.tempoEspera} min`} colorClass="text-amber-600" />
            <KPIcard title="Total de Internações" value={kpiData.totalInternacoes} colorClass="text-teal-600" />
            <KPIcard title="Total de Óbitos" value={kpiData.totalObitos} colorClass="text-red-600" />
        </section>

        {/* Seção de Gráficos */}
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <ChartCard
                title="Fluxo de Atendimento"
                description="Distribuição dos pacientes por classificação de risco no período selecionado."
                chartType="doughnut"
                chartData={riskChartData}
                chartOptions={riskChartOptions}
            />
            <ChartCard
                title="Atendimentos vs. Tempo de Espera"
                description="Volume de atendimentos e o tempo médio de espera correspondente por turno."
                chartType="bar"
                chartData={attendanceVsWaitTimeChartData}
                chartOptions={attendanceVsWaitTimeChartOptions}
            />
            <ChartCard
                title="Análise de Desfechos Críticos"
                description="Comparativo dos principais desfechos clínicos registrados."
                chartType="bar"
                chartData={outcomesChartData}
                chartOptions={outcomesChartOptions}
            />
            <ChartCard
                title="Recursos Utilizados"
                description="Demandas por avaliações especializadas e exames complementares."
                chartType="bar"
                chartData={resourcesChartData}
                chartOptions={resourcesChartOptions}
            />
        </main>
      </div>

      {/* Conteúdo de Gerenciamento de Dados */}
      <div id="data-management-view" className={showDashboard ? 'hidden' : ''}>
        <DataForm
          onSave={handleSaveRecord}
          onClear={handleClearForm}
          editingRecord={editingRecord}
        />
        <DataTable
          data={dataRecords}
          onEdit={handleEditRecord}
          onDelete={handleDeleteRecord}
          onView={handleViewRecord} 
        />
      </div>

      {/* Modal de Confirmação */}
      <CustomModal
        isOpen={isModalOpen}
        message={modalMessage}
        onConfirm={() => {
          if (modalAction) modalAction();
          setIsModalOpen(false);
        }}
        onCancel={() => setIsModalOpen(false)}
      />

      {/* Modal de Visualização de Registo */}
      <ViewRecordModal
        record={viewingRecord}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
      />
    </div>
  );
}
