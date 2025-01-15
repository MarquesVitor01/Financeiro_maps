import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, Title, Tooltip, Legend, LineElement, ArcElement } from 'chart.js';

// Registre as escalas, elementos e outros componentes necessários
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  Title, 
  Tooltip, 
  Legend, 
  LineElement,
  ArcElement // Adicionei o ArcElement necessário para o gráfico de pizza
);

export const Main = () => {
  // Dados de entradas e saídas
  const entradas = [
    { valor: 500, data: "12/01/2025", icon: "📈" },
    { valor: 200, data: "11/01/2025", icon: "📊" },
    { valor: 300, data: "10/01/2025", icon: "💸" },
  ];

  const saidas = [
    { valor: 150, data: "12/01/2025", icon: "📉" },
    { valor: 100, data: "11/01/2025", icon: "💳" },
    { valor: 50, data: "10/01/2025", icon: "🛍️" },
  ];

  const totalEntradas = entradas.reduce((acc, entry) => acc + entry.valor, 0);
  const totalSaidas = saidas.reduce((acc, entry) => acc + entry.valor, 0);
  const total = totalEntradas - totalSaidas;

  const [chartData] = useState({
    labels: entradas.map((entry) => entry.data),
    datasets: [
      {
        label: "Entradas",
        data: entradas.map((entry) => entry.valor),
        borderColor: "green",
        backgroundColor: "rgba(0, 255, 0, 0.1)",
        fill: true,
      },
      {
        label: "Saídas",
        data: saidas.map((entry) => entry.valor),
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.1)",
        fill: true,
      },
    ],
  });

  const pieData = {
    labels: ["Entradas", "Saídas"],
    datasets: [
      {
        data: [totalEntradas, totalSaidas],
        backgroundColor: ["green", "red"],
      },
    ],
  };

  const [value, setValue] = useState<Date | null>(new Date());
  const [reminders, setReminders] = useState<Record<string, string>>({});
  const [modal, setModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [reminderText, setReminderText] = useState("");

  const handleDateClick = (date: Date) => {
    setSelectedDate(date.toDateString());
    setModal(true);
  };

  const handleCancel = () => {
    setModal(false);
    setReminderText("");
  };

  const handleSave = () => {
    if (reminderText) {
      setReminders((prev) => ({
        ...prev,
        [selectedDate!]: reminderText,
      }));
      setModal(false);
      setReminderText("");
    }
  };

  const tileClassName = ({ date, view }: any) => {
    const dateString = date.toDateString();
    if (reminders[dateString]) {
      return "highlight-reminder";
    }
    return null;
  };

  return (
    <div className="main">

      <div className="main-boxes mt-5">
        <div className="content-box">
          <h4 className="text-start">Entrada</h4>
          <table className="mini-table">
            <tbody>
              {entradas.map((entrada, index) => (
                <tr key={index}>
                  <td>{`R$ ${entrada.valor}`}</td>
                  <td>{entrada.data}</td>
                  <td>{entrada.icon}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="content-box">
          <h4 className="text-start">Saída</h4>
          <table className="mini-table">
            <tbody>
              {saidas.map((saida, index) => (
                <tr key={index}>
                  <td>{`R$ ${saida.valor}`}</td>
                  <td>{saida.data}</td>
                  <td>{saida.icon}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="content-box">
          <h4 className="text-start">Total</h4>
          <div className="box">
            <p>{`Total: R$ ${total}`}</p>
          </div>
        </div>
      </div>

      <div className="charts-container">

        <div className="chart-box">
          <h4 className="text-start">Distribuição de Entradas e Saídas</h4>
          <Pie data={pieData} options={{
            responsive: true,
            plugins: { legend: { position: "top" } },
          }} />
        </div>

        <div className="calendar-box">
          <Calendar
            onClickDay={handleDateClick}
            value={value}
            onChange={(date) => setValue(date as Date | null)}
            tileClassName={tileClassName} 
          />
          <div className="reminders">
            <h5 className="text-center">Lembretes:</h5>
            <ul>
              {Object.entries(reminders).map(([date, reminder], index) => (
                <li key={index}>
                  <span><strong>{date}:</strong> {reminder}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {modal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Adicionar Lembrete</h3>
            <input
              type="text"
              value={reminderText}
              onChange={(e) => setReminderText(e.target.value)}
              placeholder="Digite o lembrete"
            />
            <div className="modal-buttons">
              <button onClick={handleSave}>Confirmar</button>
              <button onClick={handleCancel}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
