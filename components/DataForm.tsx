"use client"; // Marca este componente como um Client Component

import React, { useState, useEffect } from 'react';
import { AssistencialRecord } from '../lib/data'; // Importa AssistencialRecord (sem WithObitos)

interface DataFormProps {
  onSave: (record: AssistencialRecord) => void; // Tipo atualizado
  onClear: () => void;
  editingRecord: AssistencialRecord | null; // Tipo atualizado
}

// Define o estado inicial padrão para o formulário
const initialFormData: AssistencialRecord = {
  id: '',
  data: '',
  turno: 'Manhã',
  atendimentos: 0,
  azul: 0,
  verde: 0,
  amarelo: 0,
  vermelho: 0,
  espera: 0,
  internacoes: 0,
  permanencia: 0,
  avaliacaoTipo: '',
  avaliacoes: 0,
  exameTipo: '',
  exames: 0,
  eventos: 0,
  obitos: 0, // Voltou aqui
  causaObito: '', // Voltou aqui
};

export default function DataForm({ onSave, onClear, editingRecord }: DataFormProps) {
  const [formData, setFormData] = useState<AssistencialRecord>(initialFormData);

  useEffect(() => {
    if (editingRecord) {
      setFormData(editingRecord);
    } else {
      setFormData(initialFormData);
    }
  }, [editingRecord]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id.includes('atendimentos') || id.includes('azul') || id.includes('verde') || id.includes('amarelo') || id.includes('vermelho') || id.includes('internacoes') || id.includes('avaliacoes') || id.includes('exames') || id.includes('eventos') || id.includes('obitos')
        ? parseInt(value) || 0
        : id.includes('espera') || id.includes('permanencia')
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData(initialFormData); 
    onClear();
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm mb-6">
      <h2 className="text-xl font-semibold mb-4">{editingRecord ? 'Editar Registo' : 'Adicionar Novo Registo'}</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Campos do Registo Principal */}
        <input type="hidden" id="id" value={formData.id} onChange={handleChange} />

        <div>
          <label htmlFor="data" className="block text-sm font-medium text-gray-700">Data</label>
          <input type="date" id="data" value={formData.data} onChange={handleChange} className="mt-1 block w-full text-gray-500 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
        </div>
        <div>
          <label htmlFor="turno" className="block text-sm font-medium text-gray-700">Turno</label>
          <select id="turno" value={formData.turno} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 text-gray-500 shadow-sm focus:border-blue-500 focus:ring-blue-500" required>
            <option value="Manhã">Manhã</option>
            <option value="Tarde">Tarde</option>
            <option value="Noite">Noite</option>
          </select>
        </div>
        <div>
          <label htmlFor="atendimentos" className="block text-sm font-medium text-gray-700">Nº Atendimentos (Total)</label>
          <input type="number" id="atendimentos" value={formData.atendimentos} onChange={handleChange} className="mt-1 block w-full text-gray-500 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" min="0" required />
        </div>
        <div>
          <label htmlFor="azul" className="block text-sm font-medium text-gray-700">Nº Atendimentos (Azul)</label>
          <input type="number" id="azul" value={formData.azul} onChange={handleChange} className="mt-1 block w-full rounded-md text-gray-500 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" min="0" required />
        </div>
        <div>
          <label htmlFor="verde" className="block text-sm font-medium text-gray-700">Nº Atendimentos (Verde)</label>
          <input type="number" id="verde" value={formData.verde} onChange={handleChange} className="mt-1 block w-full rounded-md text-gray-500 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" min="0" required />
        </div>
        <div>
          <label htmlFor="amarelo" className="block text-sm font-medium text-gray-700">Nº Atendimentos (Amarelo)</label>
          <input type="number" id="amarelo" value={formData.amarelo} onChange={handleChange} className="mt-1 block w-full text-gray-500 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" min="0" required />
        </div>
        <div>
          <label htmlFor="vermelho" className="block text-sm font-medium text-gray-700">Nº Atendimentos (Vermelho)</label>
          <input type="number" id="vermelho" value={formData.vermelho} onChange={handleChange} className="mt-1 block w-full text-gray-500 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" min="0" required />
        </div>
        <div>
          <label htmlFor="espera" className="block text-sm font-medium text-gray-700">Tempo Médio de Espera (min)</label>
          <input type="number" id="espera" value={formData.espera} onChange={handleChange} className="mt-1 block w-full text-gray-500 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" min="0" step="0.1" required />
        </div>
        <div>
          <label htmlFor="internacoes" className="block text-sm font-medium text-gray-700">Nº Internações</label>
          <input type="number" id="internacoes" value={formData.internacoes} onChange={handleChange} className="mt-1 text-gray-500 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" min="0" required />
        </div>
        <div>
          <label htmlFor="permanencia" className="block text-sm font-medium text-gray-700">Tempo Médio Permanência (dias)</label>
          <input type="number" id="permanencia" value={formData.permanencia} onChange={handleChange} className="mt-1 text-gray-500 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" min="0" step="0.1" required />
        </div>
        <div>
          <label htmlFor="avaliacaoTipo" className="block text-sm font-medium text-gray-700">Tipo Avaliação Especializada</label>
          <input type="text" id="avaliacaoTipo" value={formData.avaliacaoTipo} onChange={handleChange} className="mt-1 text-gray-500 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor="avaliacoes" className="block text-sm font-medium text-gray-700">Nº Avaliações Especializadas</label>
          <input type="number" id="avaliacoes" value={formData.avaliacoes} onChange={handleChange} className="mt-1 text-gray-500 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" min="0" />
        </div>
        <div>
          <label htmlFor="exameTipo" className="block text-sm font-medium text-gray-700">Tipo de Exame Solicitado</label>
          <input type="text" id="exameTipo" value={formData.exameTipo} onChange={handleChange} className="mt-1 block w-full text-gray-500 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor="exames" className="block text-sm font-medium text-gray-700">Nº Exames Solicitados</label>
          <input type="number" id="exames" value={formData.exames} onChange={handleChange} className="mt-1 block w-full text-gray-500 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" min="0" />
        </div>
        <div>
          <label htmlFor="eventos" className="block text-sm font-medium text-gray-700">Eventos Adversos Notificados</label>
          <input type="number" id="eventos" value={formData.eventos} onChange={handleChange} className="mt-1 block w-full text-gray-500 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" min="0" required />
        </div>
        {/* Campos de Óbitos (diretamente no formulário) */}
        <div>
          <label htmlFor="obitos" className="block text-sm font-medium text-gray-700">Nº Óbitos</label>
          <input type="number" id="obitos" value={formData.obitos} onChange={handleChange} className="mt-1 block w-full text-gray-500 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" min="0" required />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <label htmlFor="causaObito" className="block text-sm font-medium text-gray-700">Causa do Óbito</label>
          <input type="text" id="causaObito" value={formData.causaObito} onChange={handleChange} className="mt-1 block w-full text-gray-500 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
        </div>

        {/* Botões de Ação do Formulário Principal */}
        <div className="md:col-span-3 lg:col-span-3 flex justify-end space-x-3 mt-4">
          <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">Salvar Registo</button>
          <button type="button" onClick={() => { setFormData(initialFormData); onClear(); }} className="px-5 py-2 bg-gray-300 text-gray-800 font-medium rounded-lg hover:bg-gray-400 transition-colors">Limpar Formulário</button>
        </div>
      </form>
    </div>
  );
}

