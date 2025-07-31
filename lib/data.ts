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
  avaliacaoTipo: string;
  avaliacoes: number;
  exameTipo: string;
  exames: number;
  eventos: number;
  obitos: number; // Voltou para a tabela principal
  causaObito: string; // Voltou para a tabela principal
}

// Dados iniciais para o dashboard (com óbitos diretamente aqui)
export const initialSourceData: AssistencialRecord[] = [
  { id: 'rec-1', data: '2025-07-29', turno: 'Manhã', atendimentos: 50, azul: 15, verde: 20, amarelo: 10, vermelho: 5, espera: 25, internacoes: 2, permanencia: 3, avaliacaoTipo: 'Cardiologia', avaliacoes: 3, exameTipo: 'Raio-X', exames: 10, eventos: 0, obitos: 0, causaObito: '' },
  { id: 'rec-2', data: '2025-07-29', turno: 'Tarde', atendimentos: 65, azul: 20, verde: 25, amarelo: 15, vermelho: 5, espera: 30, internacoes: 3, permanencia: 2.5, avaliacaoTipo: 'Pediatria', avaliacoes: 2, exameTipo: 'Exames de Sangue', exames: 15, eventos: 1, obitos: 0, causaObito: '' },
  { id: 'rec-3', data: '2025-07-29', turno: 'Noite', atendimentos: 40, azul: 10, verde: 15, amarelo: 10, vermelho: 5, espera: 40, internacoes: 1, permanencia: 4, avaliacaoTipo: 'Neurologia', avaliacoes: 1, exameTipo: 'Ultrassonografia', exames: 5, eventos: 0, obitos: 1, causaObito: 'Insuficiência Respiratória Aguda' },
  { id: 'rec-4', data: '2025-07-30', turno: 'Manhã', atendimentos: 55, azul: 18, verde: 22, amarelo: 10, vermelho: 5, espera: 28, internacoes: 2, permanencia: 3.2, avaliacaoTipo: 'Ortopedia', avaliacoes: 2, exameTipo: 'Raio-X', exames: 8, eventos: 0, obitos: 0, causaObito: '' },
  { id: 'rec-5', data: '2025-07-30', turno: 'Tarde', atendimentos: 70, azul: 25, verde: 30, amarelo: 10, vermelho: 5, espera: 35, internacoes: 4, permanencia: 2.8, avaliacaoTipo: 'Ginecologia', avaliacoes: 3, exameTipo: 'Exames de Sangue', exames: 20, eventos: 0, obitos: 0, causaObito: '' },
];
