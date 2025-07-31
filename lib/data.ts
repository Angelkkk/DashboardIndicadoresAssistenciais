// Define a interface para um item de avaliação, exame ou óbito
export interface QuantifiedItem {
  id: string; // ID único para cada item
  nome: string;
  quantidade: number;
}

// Define a interface para o tipo de dados de um registo assistencial
export interface AssistencialRecord {
  id: string;
  data: string; // Formato YYYY-MM-DD
  turno: 'Manhã' | 'Tarde' | 'Noite';
  atendimentos: number;
  azul: number;
  verde: number;
  amarelo: number;
  vermelho: number;
  espera: number; // Tempo médio de espera em minutos
  internacoes: number;
  permanencia: number; // Tempo médio de permanência em dias
  avaliacaoTipo: QuantifiedItem[]; // Alterado para array de objetos
  exameTipo: QuantifiedItem[]; // Alterado para array de objetos
  eventos: number;
  causaObito: QuantifiedItem[]; // Alterado para array de objetos
  // As propriedades 'avaliacoes', 'exames' e 'obitos' foram removidas
}

// Dados iniciais para o dashboard (sem óbitos diretamente aqui)
export const initialSourceData: AssistencialRecord[] = [
  { id: 'rec-1', data: '2025-07-29', turno: 'Manhã', atendimentos: 50, azul: 15, verde: 20, amarelo: 10, vermelho: 5, espera: 25, internacoes: 2, permanencia: 3, avaliacaoTipo: [{ id: 'av-1', nome: 'Cardiologia', quantidade: 3 }], exameTipo: [{ id: 'ex-1', nome: 'Raio-X', quantidade: 10 }], eventos: 0, causaObito: [] },
  { id: 'rec-2', data: '2025-07-29', turno: 'Tarde', atendimentos: 65, azul: 20, verde: 25, amarelo: 15, vermelho: 5, espera: 30, internacoes: 3, permanencia: 2.5, avaliacaoTipo: [{ id: 'av-2', nome: 'Pediatria', quantidade: 2 }], exameTipo: [{ id: 'ex-2', nome: 'Exames de Sangue', quantidade: 15 }], eventos: 1, causaObito: [] },
  { id: 'rec-3', data: '2025-07-29', turno: 'Noite', atendimentos: 40, azul: 10, verde: 15, amarelo: 10, vermelho: 5, espera: 40, internacoes: 1, permanencia: 4, avaliacaoTipo: [{ id: 'av-3', nome: 'Neurologia', quantidade: 1 }], exameTipo: [{ id: 'ex-3', nome: 'Ultrassonografia', quantidade: 5 }], eventos: 0, causaObito: [{ id: 'ob-1', nome: 'Insuficiência Respiratória Aguda', quantidade: 1 }] },
  { id: 'rec-4', data: '2025-07-30', turno: 'Manhã', atendimentos: 55, azul: 18, verde: 22, amarelo: 10, vermelho: 5, espera: 28, internacoes: 2, permanencia: 3.2, avaliacaoTipo: [{ id: 'av-4', nome: 'Ortopedia', quantidade: 2 }], exameTipo: [{ id: 'ex-4', nome: 'Raio-X', quantidade: 8 }], eventos: 0, causaObito: [] },
  { id: 'rec-5', data: '2025-07-30', turno: 'Tarde', atendimentos: 70, azul: 25, verde: 30, amarelo: 10, vermelho: 5, espera: 35, internacoes: 4, permanencia: 2.8, avaliacaoTipo: [{ id: 'av-5', nome: 'Ginecologia', quantidade: 3 }], exameTipo: [{ id: 'ex-5', nome: 'Exames de Sangue', quantidade: 20 }], eventos: 0, causaObito: [] },
];
