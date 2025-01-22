import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  ArcElement,
} from "chart.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { Lembretes } from "../../lembretes/Lembretes";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  ArcElement
);

export const Main = () => {
  const [entrada, setEntrada] = useState<any[]>([]);
  const [saida, setSaida] = useState<any[]>([]);

  const fetchPositivoData = async () => {
    try {
      const q = query(
        collection(db, "registros"),
        where("tipo", "==", "positivo")
      );
      const querySnapshot = await getDocs(q);
      const registros: any[] = [];
      querySnapshot.forEach((doc) => {
        registros.push(doc.data());
      });
      setEntrada(registros);
    } catch (error) {
      console.error("Erro ao buscar dados positivos:", error);
    }
  };

  const fetchNegativoData = async () => {
    try {
      const q = query(
        collection(db, "registros"),
        where("tipo", "==", "negativo")
      );
      const querySnapshot = await getDocs(q);
      const registros: any[] = [];
      querySnapshot.forEach((doc) => {
        registros.push(doc.data());
      });
      setSaida(registros);
    } catch (error) {
      console.error("Erro ao buscar dados negativos:", error);
    }
  };

  const totalEntradas = entrada.reduce((acc, entry) => acc + entry.valor, 0);
  const totalSaidas = saida.reduce((acc, entry) => acc + entry.valor, 0);
  const total = totalEntradas - totalSaidas;

  const [chartData] = useState({
    labels: entrada.map((entry) => entry.data),
    datasets: [
      {
        label: "Entradas",
        data: entrada.map((entry) => entry.valor),
        borderColor: "green",
        backgroundColor: "rgba(0, 255, 0, 0.1)",
        fill: true,
      },
      {
        label: "Saídas",
        data: saida.map((entry) => entry.valor),
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
    const formattedDate = new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
    setSelectedDate(formattedDate);
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
      toast.success(`Lembrete adicionado para o dia ${selectedDate}`);
    }
  };

  const handleDeleteReminder = (date: string) => {
    setReminders((prev) => {
      const updatedReminders = { ...prev };
      delete updatedReminders[date];
      return updatedReminders;
    });
  };

  const tileClassName = ({ date, view }: any) => {
    if (view === "month") {
      const formattedDate = new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date);
      if (reminders[formattedDate]) {
        return "highlight-reminder";
      }
    }
    return null;
  };

  useEffect(() => {
    fetchNegativoData();
    fetchPositivoData();
  }, []);

  return (
    <div className="main">
      <div className="main-boxes row">
        <div className="content-box col-md-3 col-10">
          <h4 className="text-start">Entrada</h4>
          <table className="mini-table">
            <tbody>
              {entrada.slice(-3).map((entrada, index) => (
                <tr key={index}>
                  <td>{`R$ ${entrada.valor.toFixed(2)}`}</td>
                  <td>{new Date(entrada.data).toLocaleDateString("pt-BR")}</td>
                  <td>📈</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="content-box col-md-3 col-10">
          <h4 className="text-start">Saída</h4>
          <table className="mini-table">
            <tbody>
              {saida.slice(-3).map((saida, index) => (
                <tr key={index}>
                  <td>{`R$ ${saida.valor.toFixed(2)}`}</td>
                  <td>{new Date(saida.data).toLocaleDateString("pt-BR")}</td>
                  <td>📉</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="content-box col-md-3 col-10">
          <h4 className="text-start">Total</h4>
          <div className="box">
            <p>{`Total: R$ ${total.toFixed(2)}`}</p>
          </div>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-box col-10 col-md-3">
          <h4 className="text-start">Distribuição de Entradas e Saídas</h4>
          <Pie
            data={pieData}
            options={{
              responsive: true,
              plugins: { legend: { position: "top" } },
            }}
          />
        </div>
        <Lembretes calendarSize="400px" />
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
              className="modal-input"
            />
            <div className="modal-buttons">
              <button onClick={handleSave}>Confirmar</button>
              <button onClick={handleCancel}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};
