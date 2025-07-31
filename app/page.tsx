"use client"; // Marca este componente como um Client Component

import { useState, useEffect, useCallback } from 'react';
import KPIcard from '../components/KPIcard';
import ChartCard from '../components/ChartCard';
import DataForm from '../components/DataForm';
import DataTable from '../components/DataTable';
import CustomModal from '../components/CustomModal';
import ViewRecordModal from '../components/ViewRecordModal';
import { AssistencialRecord, QuantifiedItem } from '../lib/data';
import { ChartData, ChartOptions } from 'chart.js';
import { toast } from 'react-toastify';

export default function HomePage() {
  const [dataRecords, setDataRecords] = useState<AssistencialRecord[]>([]);
  const [currentFilter, setCurrentFilter] = useState<string>('all');
  const [filterTurno, setFilterTurno] = useState<string>('all');
  const [kpiData, setKpiData] = useState({
    totalAtendimentos: 0,
    tempoEspera: 0,
    totalInternacoes: 0,
    totalObitos: 0,
  });

  const [riskChartData, setRiskChartData] = useState<ChartData<'doughnut'>>({ labels: [], datasets: [] });
  const [riskChartOptions, setRiskChartOptions] = useState<ChartOptions<'doughnut'>>({});
  
  const [attendanceVsWaitTimeChartData, setAttendanceVsWaitTimeChartData] = useState<ChartData<'bar' | 'line'>>({ labels: [], datasets: [] });
  const [attendanceVsWaitTimeChartOptions, setAttendanceVsWaitTimeChartOptions] = useState<ChartOptions<'bar' | 'line'>>({});

  const [outcomesChartData, setOutcomesChartData] = useState<ChartData<'bar'>>({ labels: [], datasets: [] });
  const [outcomesChartOptions, setOutcomesChartOptions] = useState<ChartOptions<'bar'>>({});

  const [resourcesChartData, setResourcesChartData] = useState<ChartData<'bar'>>({ labels: [], datasets: [] });
  const [resourcesChartOptions, setResourcesChartOptions] = useState<ChartOptions<'bar'>>({});

  const [showDashboard, setShowDashboard] = useState<boolean>(true);
  const [editingRecord, setEditingRecord] = useState<AssistencialRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [modalAction, setModalAction] = useState<(() => void) | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [viewingRecord, setViewingRecord] = useState<AssistencialRecord | null>(null);

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

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/data');
      if (!response.ok) {
        const errorText = await response.text();
        toast.error('Erro ao carregar dados do servidor.');
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      const records: AssistencialRecord[] = await response.json();
      setDataRecords(records);
    } catch (error) {
      toast.error('Erro ao carregar dados do servidor.');
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const calculateTotal = (items: QuantifiedItem[] | undefined) => {
    return items?.reduce((sum, item) => sum + item.quantidade, 0) || 0;
  };

  const updateKPIs = (data: AssistencialRecord[]) => {
    const totalAtendimentos = data.reduce((sum, item) => sum + item.atendimentos, 0);
    const totalInternacoes = data.reduce((sum, item) => sum + item.internacoes, 0);
    const totalObitos = data.reduce((sum, item) => sum + calculateTotal(item.causaObito), 0);
    
    const totalEsperaSum = data.reduce((sum, item) => sum + item.espera * item.atendimentos, 0);
    const avgEsperaValue = totalAtendimentos > 0 ? (totalEsperaSum / totalAtendimentos) : 0;
    const formattedAvgEspera = avgEsperaValue.toFixed(0);

    setKpiData({
      totalAtendimentos,
      tempoEspera: parseFloat(formattedAvgEspera),
      totalInternacoes,
      totalObitos,
    });
  };

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

  const updateOutcomesChart = (data: AssistencialRecord[]) => {
    const totalObitos = data.reduce((sum, item) => sum + calculateTotal(item.causaObito), 0);

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

  const updateResourcesChart = (data: AssistencialRecord[]) => {
    const avaliacoes = data.reduce((acc, item) => {
      (item.avaliacaoTipo as QuantifiedItem[]).forEach(tag => {
        if (tag.nome.trim()) {
          acc[tag.nome.trim()] = (acc[tag.nome.trim()] || 0) + tag.quantidade;
        }
      });
      return acc;
    }, {} as Record<string, number>);

    const exames = data.reduce((acc, item) => {
      (item.exameTipo as QuantifiedItem[]).forEach(tag => {
        if (tag.nome.trim()) {
          acc[tag.nome.trim()] = (acc[tag.nome.trim()] || 0) + tag.quantidade;
        }
      });
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

  const updateDashboard = (filter: string, turnoFilter: string) => {
    const filteredData = dataRecords.filter(d => (filter === 'all' || d.data === filter) && (turnoFilter === 'all' || d.turno === turnoFilter));
    updateKPIs(filteredData);
    updateRiskChart(filteredData);
    updateAttendanceVsWaitTimeChart(filteredData);
    updateOutcomesChart(filteredData);
    updateResourcesChart(filteredData);
  };

  useEffect(() => {
    updateDashboard(currentFilter, filterTurno);
  }, [dataRecords, currentFilter, filterTurno]);

  const uniqueDates = [...new Set(dataRecords.map(item => item.data))].sort();

  const handleSaveRecord = async (record: AssistencialRecord) => {
    try {
      const isDuplicate = dataRecords.some(
        (existingRecord) =>
          existingRecord.data === record.data &&
          existingRecord.turno === record.turno &&
          existingRecord.id !== record.id
      );

      if (isDuplicate) {
        toast.error('Já existe um registo para esta data e turno. Por favor, edite o registo existente ou escolha outra data/turno.');
        return;
      }

      let response;
      if (record.id) {
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

      await fetchData();
      setEditingRecord(null);
    } catch (error) {
      toast.error('Erro ao salvar registo.');
    }
  };

  const handleEditRecord = (id: string) => {
    const recordToEdit = dataRecords.find(r => r.id === id);
    if (recordToEdit) {
      setEditingRecord(recordToEdit);
      setShowDashboard(false);
      toast.info('A editar registo. Preencha o formulário.');
    } else {
      toast.error('Registo não encontrado para edição.');
    }
  };

  const handleDeleteRecord = (id: string) => {
    setModalMessage('Tem certeza que deseja excluir este registo?');
    setModalAction(() => async () => {
      try {
        const response = await fetch(`/api/data?id=${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        await fetchData();
        setIsModalOpen(false);
        toast.success('Registo excluído com sucesso!');
      } catch (error) {
        toast.error('Erro ao excluir registo.');
      }
    });
    setIsModalOpen(true);
  };

  const handleClearForm = () => {
    setEditingRecord(null);
    toast.info('Formulário limpo.');
  };

  const handleViewRecord = (record: AssistencialRecord) => {
    setViewingRecord(record);
    setIsViewModalOpen(true);
  };

  const handleShowDataManagement = () => {
      const password = window.prompt('Digite a senha para acessar a área de gerenciamento:');
      if (password === '12345') { // A senha '12345' é apenas um exemplo
          setShowDashboard(false);
      } else {
          toast.error('Senha incorreta!');
      }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard de Indicadores Assistenciais</h1>
        <p className="text-gray-600 mt-1">Análise de desempenho da unidade de saúde.</p>
      </header>

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
          onClick={handleShowDataManagement} // Chama a nova função de validação
          className={`px-6 py-3 text-lg font-medium rounded-xl shadow transition-colors ${
            !showDashboard ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Gerenciar Dados
        </button>
      </div>

      <div id="dashboard-view" className={showDashboard ? '' : 'hidden'}>
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <label htmlFor="date-filter" className="font-semibold text-gray-700">Filtrar por Período:</label>
            <div id="date-filter" className="flex flex-wrap gap-2">
              <select
                id="date-filter-select"
                value={currentFilter}
                onChange={(e) => setCurrentFilter(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 text-gray-500 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">Todos os Dias</option>
                {uniqueDates.map(date => (
                  <option key={date} value={date}>
                    {new Date(date + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap gap-2">
                <select
                  id="turno-filter-select"
                  value={filterTurno}
                  onChange={(e) => setFilterTurno(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 text-gray-500 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="all">Todos os Turnos</option>
                  <option value="Manhã">Manhã</option>
                  <option value="Tarde">Tarde</option>
                  <option value="Noite">Noite</option>
                </select>
            </div>
          </div>
        </div>

        <section id="kpi-section" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <KPIcard title="Total de Atendimentos" value={kpiData.totalAtendimentos} colorClass="text-blue-600" />
          <KPIcard title="Tempo Médio de Espera" value={`${kpiData.tempoEspera} min`} colorClass="text-amber-600" />
          <KPIcard title="Total de Internações" value={kpiData.totalInternacoes} colorClass="text-teal-600" />
          <KPIcard title="Total de Óbitos" value={kpiData.totalObitos} colorClass="text-red-600" />
        </section>

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

      <CustomModal
        isOpen={isModalOpen}
        message={modalMessage}
        onConfirm={() => {
          if (modalAction) modalAction();
          setIsModalOpen(false);
        }}
        onCancel={() => setIsModalOpen(false)}
      />

      <ViewRecordModal
        record={viewingRecord}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
      />
    </div>
  );
}

