import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { AssistencialRecord } from '../../../lib/data';

export async function GET() {
  const { data, error } = await supabase.from('indicadores_assistenciais').select('*');
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const newRecord = await request.json();
  const { data, error } = await supabase.from('indicadores_assistenciais').insert([newRecord]).select();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data[0], { status: 201 });
}

export async function PUT(request: Request) {
  const updatedRecord = await request.json();
  const { data, error } = await supabase.from('indicadores_assistenciais')
    .update(updatedRecord)
    .eq('id', updatedRecord.id)
    .select();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data[0]);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const idToDelete = searchParams.get('id');
  const { error } = await supabase.from('indicadores_assistenciais').delete().eq('id', idToDelete);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: 'Registo excluído com sucesso.' });
}
