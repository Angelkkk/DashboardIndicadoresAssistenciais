"use client"; // Este componente precisa ser um Client Component pois usa hooks e interage com o DOM

import React, { useRef, useEffect } from 'react';
import { Chart, ChartConfiguration, ChartData, ChartOptions, registerables } from 'chart.js';

// Registra todos os componentes do Chart.js (tipos de gráfico, escalas, etc.)
Chart.register(...registerables);

interface ChartCardProps {
  title: string;
  description: string;
  chartType: ChartConfiguration['type'];
  chartData: ChartData;
  chartOptions?: ChartOptions;
}

// Configurações de tooltip padrão para os gráficos
const chartTooltip = {
    backgroundColor: '#fff',
    titleColor: '#333',
    bodyColor: '#666',
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    displayColors: true,
    bodyFont: {
        size: 13
    },
    titleFont: {
        size: 14,
        weight: 'bold'
    }
};

// Função auxiliar para quebrar labels longas em múltiplas linhas
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

export default function ChartCard({ title, description, chartType, chartData, chartOptions }: ChartCardProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      // Destroi a instância anterior do gráfico se existir
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Cria uma nova instância do gráfico
      chartInstance.current = new Chart(chartRef.current, {
        type: chartType,
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false, // Permite que o gráfico se ajuste ao tamanho do container
          plugins: {
            tooltip: chartTooltip, // Usa o tooltip padrão
            legend: {
                position: 'top',
                labels: {
                    font: { size: 14 }
                }
            }
          },
          ...chartOptions, // Sobrescreve opções padrão com as passadas via props
        },
      });
    }

    // Função de limpeza para destruir o gráfico quando o componente for desmontado
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartType, chartData, chartOptions]); // Dependências do useEffect

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
      <h2 className="text-xl text-gray-600 font-semibold mb-1">{title}</h2>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <div className="chart-container"> {/* Container para controlar o tamanho do canvas */}
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}

