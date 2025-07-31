"use client"; // Marca este componente como um Client Component

import React, { useState, useMemo } from 'react';
import { AssistencialRecord, QuantifiedItem } from '../lib/data';

interface DataTableProps {
  data: AssistencialRecord[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (record: AssistencialRecord) => void;
}

export default function DataTable({ data, onEdit, onDelete, onView }: DataTableProps) {
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterTurno, setFilterTurno] = useState<string>('all');

  const filteredData = useMemo(() => {
    return data.filter(record => {
      const matchesDate = filterDate ? record.data === filterDate : true;
      const matchesTurno = filterTurno === 'all' ? true : record.turno === filterTurno;
      return matchesDate && matchesTurno;
    });
  }, [data, filterDate, filterTurno]);

  const calculateTotal = (items: QuantifiedItem[] | undefined) => {
    return items?.reduce((sum, item) => sum + item.quantidade, 0) || 0;
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Registos Existentes</h2>
      
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <div>
          <label htmlFor="filter-date" className="block text-sm font-medium text-gray-700">Filtrar por Data:</label>
          <input
            type="date"
            id="filter-date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 text-gray-500 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="filter-turno" className="block text-sm font-medium text-gray-700">Filtrar por Turno:</label>
          <select
            id="filter-turno"
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
        {(filterDate || filterTurno !== 'all') && (
          <button
            onClick={() => {
              setFilterDate('');
              setFilterTurno('all');
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors mt-auto sm:mt-0"
          >
            Limpar Filtros
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turno</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Atendimentos</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Esp. (min)</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Intern.</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Óbitos</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((record) => (
              <tr key={record.id}>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{record.data}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{record.turno}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{record.atendimentos}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{record.espera}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{record.internacoes}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {calculateTotal(record.causaObito)}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onView(record)}
                    className="text-gray-600 hover:text-gray-900 mr-3"
                  >
                    Visualizar
                  </button>
                  <button
                    onClick={() => onEdit(record.id)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(record.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-2 text-center text-sm text-gray-500">Nenhum registo encontrado para os filtros aplicados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
