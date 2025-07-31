"use client"; // Marca este componente como um Client Component

import React, { useState, useEffect } from 'react';
import { AssistencialRecord, QuantifiedItem } from '../lib/data';
import { toast } from 'react-toastify';

interface DataFormProps {
  onSave: (record: AssistencialRecord) => void;
  onClear: () => void;
  editingRecord: AssistencialRecord | null;
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
  avaliacaoTipo: [],
  exameTipo: [],
  eventos: 0,
  causaObito: [],
};

const initialQuantifiedItem: QuantifiedItem = {
  id: '',
  nome: '',
  quantidade: 1,
};

export default function DataForm({ onSave, onClear, editingRecord }: DataFormProps) {
  const [formData, setFormData] = useState<AssistencialRecord>(initialFormData);
  
  const [currentAvaliacao, setCurrentAvaliacao] = useState<QuantifiedItem>(initialQuantifiedItem);
  const [currentExame, setCurrentExame] = useState<QuantifiedItem>(initialQuantifiedItem);
  const [currentObito, setCurrentObito] = useState<QuantifiedItem>(initialQuantifiedItem);

  useEffect(() => {
    if (editingRecord) {
      setFormData(editingRecord);
    } else {
      setFormData(initialFormData);
    }
    setCurrentAvaliacao(initialQuantifiedItem);
    setCurrentExame(initialQuantifiedItem);
    setCurrentObito(initialQuantifiedItem);
  }, [editingRecord]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id.includes('atendimentos') || id.includes('azul') || id.includes('verde') || id.includes('amarelo') || id.includes('vermelho') || id.includes('internacoes') || id.includes('eventos')
        ? parseInt(value) || 0
        : id.includes('espera') || id.includes('permanencia')
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleQuantifiedItemChange = (e: React.ChangeEvent<HTMLInputElement>, itemType: 'avaliacaoTipo' | 'exameTipo' | 'causaObito') => {
    const { id, value } = e.target;
    let itemToUpdate: QuantifiedItem = { ...initialQuantifiedItem };
    if (itemType === 'avaliacaoTipo') itemToUpdate = { ...currentAvaliacao };
    if (itemType === 'exameTipo') itemToUpdate = { ...currentExame };
    if (itemType === 'causaObito') itemToUpdate = { ...currentObito };
    
    if (id === 'nome') {
      itemToUpdate.nome = value;
    } else if (id === 'quantidade') {
      itemToUpdate.quantidade = parseInt(value) || 1;
    }

    if (itemType === 'avaliacaoTipo') setCurrentAvaliacao(itemToUpdate);
    if (itemType === 'exameTipo') setCurrentExame(itemToUpdate);
    if (itemType === 'causaObito') setCurrentObito(itemToUpdate);
  };

  const handleAddItem = (itemType: 'avaliacaoTipo' | 'exameTipo' | 'causaObito') => {
    let newItem: QuantifiedItem = initialQuantifiedItem;
    if (itemType === 'avaliacaoTipo') newItem = currentAvaliacao;
    if (itemType === 'exameTipo') newItem = currentExame;
    if (itemType === 'causaObito') newItem = currentObito;

    if (!newItem.nome || newItem.quantidade <= 0) {
      toast.error('Por favor, preencha o nome e a quantidade.');
      return;
    }

    const newId = `${itemType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setFormData(prev => ({
      ...prev,
      [itemType]: [...(prev[itemType] as QuantifiedItem[]), { ...newItem, id: newId }],
    }));

    if (itemType === 'avaliacaoTipo') setCurrentAvaliacao(initialQuantifiedItem);
    if (itemType === 'exameTipo') setCurrentExame(initialQuantifiedItem);
    if (itemType === 'causaObito') setCurrentObito(initialQuantifiedItem);
  };

  const handleRemoveItem = (itemType: 'avaliacaoTipo' | 'exameTipo' | 'causaObito', idToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      [itemType]: (prev[itemType] as QuantifiedItem[]).filter(item => item.id !== idToRemove),
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
      <form onSubmit={handleSubmit} className="grid grid-cols-1 text-gray-500 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Campos do Registo Principal */}
        <input type="hidden" id="id" value={formData.id} onChange={handleChange} />

        <div>
          <label htmlFor="data" className="block text-sm font-medium text-gray-700">Data</label>
          <input type="date" id="data" value={formData.data} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus-within:border-blue-500 focus-within:ring-blue-500" required />
        </div>
        <div>
          <label htmlFor="turno" className="block text-sm font-medium text-gray-700">Turno</label>
          <select id="turno" value={formData.turno} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus-within:border-blue-500 focus-within:ring-blue-500" required>
            <option value="Manhã">Manhã</option>
            <option value="Tarde">Tarde</option>
            <option value="Noite">Noite</option>
          </select>
        </div>
        <div>
          <label htmlFor="atendimentos" className="block text-sm font-medium text-gray-700">Nº Atendimentos (Total)</label>
          <input type="number" id="atendimentos" value={formData.atendimentos} onChange={handleChange} className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus-within:border-blue-500 focus-within:ring-blue-500" min="0" required />
        </div>
        <div>
          <label htmlFor="azul" className="block text-sm font-medium text-gray-700">Nº Atendimentos (Azul)</label>
          <input type="number" id="azul" value={formData.azul} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus-within:border-blue-500 focus-within:ring-blue-500" min="0" required />
        </div>
        <div>
          <label htmlFor="verde" className="block text-sm font-medium text-gray-700">Nº Atendimentos (Verde)</label>
          <input type="number" id="verde" value={formData.verde} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus-within:border-blue-500 focus-within:ring-blue-500" min="0" required />
        </div>
        <div>
          <label htmlFor="amarelo" className="block text-sm font-medium text-gray-700">Nº Atendimentos (Amarelo)</label>
          <input type="number" id="amarelo" value={formData.amarelo} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus-within:border-blue-500 focus-within:ring-blue-500" min="0" required />
        </div>
        <div>
          <label htmlFor="vermelho" className="block text-sm font-medium text-gray-700">Nº Atendimentos (Vermelho)</label>
          <input type="number" id="vermelho" value={formData.vermelho} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus-within:border-blue-500 focus-within:ring-blue-500" min="0" required />
        </div>
        <div>
          <label htmlFor="espera" className="block text-sm font-medium text-gray-700">Tempo Médio de Espera (min)</label>
          <input type="number" id="espera" value={formData.espera} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus-within:border-blue-500 focus-within:ring-blue-500" min="0" step="0.1" required />
        </div>
        <div>
          <label htmlFor="internacoes" className="block text-sm font-medium text-gray-700">Nº Internações</label>
          <input type="number" id="internacoes" value={formData.internacoes} onChange={handleChange} className="mt-1 block p-2 w-full border border-gray-300 rounded-md shadow-sm focus-within:border-blue-500 focus-within:ring-blue-500" min="0" required />
        </div>
        <div>
          <label htmlFor="permanencia" className="block text-sm font-medium text-gray-700">Tempo Médio Permanência (dias)</label>
          <input type="number" id="permanencia" value={formData.permanencia} onChange={handleChange} className="mt-1 block p-2 w-full border border-gray-300 rounded-md shadow-sm focus-within:border-blue-500 focus-within:ring-blue-500" min="0" step="0.1" required />
        </div>
        <div>
          <label htmlFor="eventos" className="block text-sm font-medium text-gray-700">Eventos Adversos Notificados</label>
          <input type="number" id="eventos" value={formData.eventos} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus-within:border-blue-500 focus-within:ring-blue-500" min="0" required />
        </div>

        {/* Campos de Múltipla Seleção para Tipo de Avaliação */}
        <div className="lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700">Avaliações Especializadas</label>
          <div className="mt-1 flex flex-wrap gap-2 p-1 text-gray-500 border border-gray-300 rounded-md shadow-sm focus-within:border-blue-500 focus-within:ring-blue-500">
              {(formData.avaliacaoTipo as QuantifiedItem[]).map((item) => (
                  <span key={item.id} className="flex items-center px-2 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                      {item.nome} ({item.quantidade})
                      <button type="button" onClick={() => handleRemoveItem('avaliacaoTipo', item.id)} className="ml-2 text-red-500 hover:text-red-700 focus:outline-none">&times;</button>
                  </span>
              ))}
              <div className="flex-grow flex gap-2">
                <input
                  type="text"
                  id="avaliacaoNome"
                  value={currentAvaliacao.nome}
                  onChange={(e) => setCurrentAvaliacao(prev => ({ ...prev, nome: e.target.value }))}
                  className="flex-grow min-w-0 p-0 m-0 border-none focus:ring-0 placeholder:text-gray-500"
                  placeholder="Tipo de Avaliação"
                />
                <input
                  type="number"
                  id="avaliacaoQuantidade"
                  value={currentAvaliacao.quantidade}
                  onChange={(e) => setCurrentAvaliacao(prev => ({ ...prev, quantidade: parseInt(e.target.value) || 1 }))}
                  className="w-20 p-0 m-0 border-none text-center focus:ring-0"
                  min="1"
                />
                <button type="button" onClick={() => handleAddItem('avaliacaoTipo')} className="px-3 py-1 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  Add
                </button>
              </div>
          </div>
        </div>

        {/* Campo de Múltipla Seleção para Tipo de Exame */}
        <div className="lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700">Exames Solicitados</label>
          <div className="mt-1 flex flex-wrap gap-2 p-1 text-gray-500 border border-gray-300 rounded-md shadow-sm focus-within:border-blue-500 focus-within:ring-blue-500">
              {(formData.exameTipo as QuantifiedItem[]).map((item) => (
                  <span key={item.id} className="flex items-center px-2 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                      {item.nome} ({item.quantidade})
                      <button type="button" onClick={() => handleRemoveItem('exameTipo', item.id)} className="ml-2 text-red-500 hover:text-red-700 focus:outline-none">&times;</button>
                  </span>
              ))}
              <div className="flex-grow flex gap-2">
                <input
                  type="text"
                  id="exameNome"
                  value={currentExame.nome}
                  onChange={(e) => setCurrentExame(prev => ({ ...prev, nome: e.target.value }))}
                  className="flex-grow min-w-0 p-0 m-0 border-none focus:ring-0 placeholder:text-gray-500"
                  placeholder="Tipo de Exame"
                />
                <input
                  type="number"
                  id="exameQuantidade"
                  value={currentExame.quantidade}
                  onChange={(e) => setCurrentExame(prev => ({ ...prev, quantidade: parseInt(e.target.value) || 1 }))}
                  className="w-20 p-0 m-0 border-none text-center focus:ring-0"
                  min="1"
                />
                <button type="button" onClick={() => handleAddItem('exameTipo')} className="px-3 py-1 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  Add
                </button>
              </div>
          </div>
        </div>

        {/* Campos de Múltipla Seleção para Óbitos */}
        <div className="lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700">Óbitos</label>
          <div className="mt-1 flex flex-wrap gap-2 p-1 text-gray-500 border border-gray-300 rounded-md shadow-sm focus-within:border-blue-500 focus-within:ring-blue-500">
              {(formData.causaObito as QuantifiedItem[]).map((item) => (
                  <span key={item.id} className="flex items-center px-2 py-1 text-sm font-medium text-red-800 bg-red-100 rounded-full">
                      {item.nome} ({item.quantidade})
                      <button type="button" onClick={() => handleRemoveItem('causaObito', item.id)} className="ml-2 text-red-500 hover:text-red-700 focus:outline-none">&times;</button>
                  </span>
              ))}
              <div className="flex-grow flex gap-2">
                <input
                  type="text"
                  id="obitoCausa"
                  value={currentObito.nome}
                  onChange={(e) => setCurrentObito(prev => ({ ...prev, nome: e.target.value }))}
                  className="flex-grow min-w-0 p-0 m-0 border-none focus:ring-0 placeholder:text-gray-500"
                  placeholder="Causa do Óbito"
                />
                <input
                  type="number"
                  id="obitoQuantidade"
                  value={currentObito.quantidade}
                  onChange={(e) => setCurrentObito(prev => ({ ...prev, quantidade: parseInt(e.target.value) || 1 }))}
                  className="w-20 p-0 m-0 border-none text-center focus:ring-0"
                  min="1"
                />
                <button type="button" onClick={() => handleAddItem('causaObito')} className="px-3 py-1 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors">
                  Add
                </button>
              </div>
          </div>
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

