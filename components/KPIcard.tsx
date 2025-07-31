interface KPIcardProps {
  title: string;
  value: string | number;
  colorClass: string; // Tailwind class for text color, e.g., 'text-blue-600'
}

export default function KPIcard({ title, value, colorClass }: KPIcardProps) {
  return (
    <div className="kpi-card bg-white p-5 rounded-xl shadow-sm flex flex-col justify-between">
      <h3 className="font-semibold text-gray-600">{title}</h3>
      <p className={`text-4xl font-bold mt-2 ${colorClass}`}>{value}</p>
    </div>
  );
}

