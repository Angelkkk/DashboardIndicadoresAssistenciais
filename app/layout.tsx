import './globals.css'; // Importa os estilos globais, incluindo o Tailwind CSS
import { Inter } from 'next/font/google'; // Importa a fonte Inter do Google Fonts
import { ToastContainer } from 'react-toastify'; // Importa o ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Importa o CSS do React-Toastify

// Configura a fonte Inter
const inter = Inter({ subsets: ['latin'] });

// Metadados da aplicação (opcional, mas boa prática para SEO)
export const metadata = {
  title: 'Dashboard de Indicadores Assistenciais',
  description: 'Análise de desempenho da unidade de saúde',
};

// Componente de layout raiz
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
      </head>
      {/* Fundo branco e texto base quase preto */}
      <body className={`${inter.className} bg-white text-gray-900`}>
        {children} {/* Aqui é onde o conteúdo das suas páginas será renderizado */}
        {/* ToastContainer para exibir as notificações */}
        <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </body>
    </html>
  );
}
