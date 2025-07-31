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
  icons: {
    icon: '/favicon.png', // A forma correta de definir o ícone nos metadados
  },
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
        {/* Adiciona o favicon personalizado */}
        <link rel="icon" href="/favicon.png" type="image/png" />
        <style>
          {`
            .chart-container {
              position: relative;
              width: 100%;
              max-width: 600px; /* Aumenta a largura máxima */
              margin-left: auto;
              margin-right: auto;
              height: 300px; /* Aumenta a altura padrão */
              max-height: 400px;
            }
            @media (min-width: 768px) {
              .chart-container {
                height: 450px; /* Aumenta a altura para telas maiores */
              }
            }
          `}
        </style>
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
