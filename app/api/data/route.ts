import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase'; // Importa o cliente Supabase
import { AssistencialRecord } from '../../../lib/data'; // Importa a interface para tipagem

// As funções GET, POST, PUT, DELETE agora interagem com o Supabase
export async function GET() {
  console.log('API: Requisição GET recebida para /api/data');
  // Seleciona todos os campos, incluindo obitos e causaObito
  const { data, error } = await supabase.from('indicadores_assistenciais').select('*');

  if (error) {
    console.error('API Erro (GET): Falha ao buscar dados do Supabase:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  console.log('API: Dados buscados com sucesso (GET). Quantidade:', data.length);
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  console.log('API: Requisição POST recebida para /api/data');
  const newRecord: AssistencialRecord = await request.json();
  
  if (!newRecord.id) {
    newRecord.id = `rec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Insere o registo completo, incluindo obitos e causaObito
  const { data, error } = await supabase.from('indicadores_assistenciais').insert([newRecord]).select();

  if (error) {
    console.error('API Erro (POST): Falha ao inserir dados no Supabase:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  console.log('API: Dados inseridos com sucesso (POST). Novo registro:', data[0]);
  return NextResponse.json(data[0], { status: 201 });
}

export async function PUT(request: Request) {
  console.log('API: Requisição PUT recebida para /api/data');
  const updatedRecord: AssistencialRecord = await request.json();
  
  // Atualiza o registo completo, incluindo obitos e causaObito
  const { data, error } = await supabase.from('indicadores_assistenciais')
    .update(updatedRecord)
    .eq('id', updatedRecord.id) // Condição para atualizar o registo correto
    .select(); // Retorna o registo atualizado

  if (error) {
    console.error('API Erro (PUT): Falha ao atualizar dados no Supabase:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  console.log('API: Dados atualizados com sucesso (PUT). Registro:', data[0]);
  return NextResponse.json(data[0]);
}

export async function DELETE(request: Request) {
  console.log('API: Requisição DELETE recebida para /api/data');
  const { searchParams } = new URL(request.url);
  const idToDelete = searchParams.get('id');

  if (!idToDelete) {
    console.error('API Erro (DELETE): ID do registro não fornecido.');
    return NextResponse.json({ message: 'ID do registo não fornecido.' }, { status: 400 });
  }

  // Remove o registo principal
  const { error } = await supabase.from('indicadores_assistenciais').delete().eq('id', idToDelete);

  if (error) {
    console.error('API Erro (DELETE): Falha ao excluir dados do Supabase:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  console.log('API: Dados excluídos com sucesso (DELETE). ID:', idToDelete);
  return NextResponse.json({ message: 'Registo excluído com sucesso.' });
}

