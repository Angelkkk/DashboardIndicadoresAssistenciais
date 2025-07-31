"use client"; // Marca este componente como um Client Component

import React from 'react';
import { AssistencialRecord } from '../lib/data'; // Importa AssistencialRecord (sem WithObitos)

interface ViewRecordModalProps {
  record: AssistencialRecord | null; // Tipo atualizado
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewRecordModal({ record, isOpen, onClose }: ViewRecordModalProps) {
  if (!isOpen || !record) return null;

  // Função auxiliar para formatar a data
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR');
    } catch (e) {
      return dateString; // Retorna a string original se houver erro de formatação
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-xl font-bold text-gray-900">Detalhes do Registo</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">
            &times; {/* Símbolo de "x" para fechar */}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-gray-700">
          <p><strong>ID:</strong> {record.id}</p>
          <p><strong>Data:</strong> {formatDate(record.data)}</p>
          <p><strong>Turno:</strong> {record.turno}</p>
          <p><strong>Atendimentos (Total):</strong> {record.atendimentos}</p>
          <p><strong>Azul:</strong> {record.azul}</p>
          <p><strong>Verde:</strong> {record.verde}</p>
          <p><strong>Amarelo:</strong> {record.amarelo}</p>
          <p><strong>Vermelho:</strong> {record.vermelho}</p>
          <p><strong>Tempo Espera (min):</strong> {record.espera}</p>
          <p><strong>Internações:</strong> {record.internacoes}</p>
          <p><strong>Permanência (dias):</strong> {record.permanencia}</p>
          <p><strong>Tipo Avaliação:</strong> {record.avaliacaoTipo || 'N/A'}</p>
          <p><strong>Nº Avaliações:</strong> {record.avaliacoes}</p>
          <p><strong>Tipo Exame:</strong> {record.exameTipo || 'N/A'}</p>
          <p><strong>Nº Exames:</strong> {record.exames}</p>
          <p><strong>Eventos Adversos:</strong> {record.eventos}</p>
          <p><strong>Óbitos:</strong> {record.obitos}</p> {/* Exibe a propriedade obitos diretamente */}
          <p className="col-span-full"><strong>Causa Óbito:</strong> {record.causaObito || 'N/A'}</p> {/* Exibe a causaObito diretamente */}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

