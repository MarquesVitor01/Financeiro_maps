import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Lembretes.css";
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom"; // Importação do useLocation

interface LembretesProps {
  calendarSize?: string;
}

export const Lembretes: React.FC<LembretesProps> = ({ calendarSize = "700px" }) => {
  const [reminders, setReminders] = useState<Record<string, string[]>>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [reminderText, setReminderText] = useState("");
  const location = useLocation(); // Obtenha a rota atual

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "lembretes"), (snapshot) => {
      const data: Record<string, string[]> = {};
      snapshot.forEach((doc) => {
        const { date, reminder } = doc.data();
        if (!data[date]) {
          data[date] = [];
        }
        data[date].push(reminder);
      });
      setReminders(data);
    });

    return () => unsubscribe();
  }, []);

  const handleDateClick = (date: Date) => {
    const formattedDate = new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);

    setSelectedDate(formattedDate);
  };

  const handleSave = async () => {
    if (!reminderText) {
      toast.error("Digite um lembrete!");
      return;
    }

    if (selectedDate) {
      try {
        await addDoc(collection(db, "lembretes"), {
          date: selectedDate,
          reminder: reminderText,
        });

        toast.success(`Lembrete adicionado para ${selectedDate}`);
        setReminderText("");
        setSelectedDate("");
      } catch (error) {
        toast.error("Erro ao salvar o lembrete!");
      }
    }
  };

  const handleCancel = () => {
    setReminderText("");
    setSelectedDate("");
  };

  const handleDeleteReminder = async (reminder: string) => {
    if (selectedDate) {
      try {
        const reminderRef = collection(db, "lembretes");
        const querySnapshot = await getDocs(reminderRef);

        querySnapshot.forEach(async (docSnapshot) => {
          if (docSnapshot.data().date === selectedDate && docSnapshot.data().reminder === reminder) {
            await deleteDoc(doc(db, "lembretes", docSnapshot.id));
            toast.success("Lembrete excluído!");
          }
        });
      } catch (error) {
        toast.error("Erro ao excluir o lembrete.");
      }
    }
  };

  const getTileClassName = ({ date, view }: any) => {
    if (view === "month") {
      const formattedDate = new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date);

      if (reminders[formattedDate]) {
        return "highlighted-day";
      }
    }

    const tileHeight = calendarSize === "700px" ? "150px" : calendarSize === "400px" ? "0px" : "40px";
    return `tile-height-${tileHeight}`;
  };

  return (
    <>
      {location.pathname === "/lembretes" && <h3 className="title-calendar">Calendario de Lembretes</h3>}

      <div className="lembretes-container">
        <div className="calendar-box" style={{ width: calendarSize, height: calendarSize }}>
          <Calendar
            locale="pt-BR"
            onClickDay={handleDateClick}
            tileClassName={getTileClassName}
          />
        </div>

        {selectedDate && (
          <div className="reminder-section">
            <h4>Lembretes para {selectedDate}</h4>

            <div className="reminder-list">
              {reminders[selectedDate]?.length ? (
                reminders[selectedDate].map((reminder, index) => (
                  <div key={index} className="reminder-item">
                    <span>{reminder}</span>
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="delete-icon"
                      onClick={() => handleDeleteReminder(reminder)}
                    />
                  </div>
                ))
              ) : (
                <p>Não há lembretes para esta data.</p>
              )}
            </div>

            <div className="add-reminder">
              <input
                type="text"
                value={reminderText}
                onChange={(e) => setReminderText(e.target.value)}
                placeholder="Digite seu lembrete"
                className="reminder-input"
              />
              <div className="reminder-buttons">
                <button onClick={handleSave}>Salvar</button>
                <button onClick={handleCancel}>Cancelar</button>
              </div>
            </div>
          </div>
        )}

        <ToastContainer />
      </div>
    </>
  );
};
