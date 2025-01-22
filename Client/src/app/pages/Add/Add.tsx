import { useState } from "react";
import "./Add.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

interface FormData {
  valor: number; // Alterado para número
  data: string;
  observacoes: string;
  tipo: string;
  categoria: string;
}

export const Add: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    valor: 0, // Inicializado como número
    data: "",
    observacoes: "",
    tipo: "positivo",
    categoria: '',
  });

  const navigate = useNavigate();

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorDigitado = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    const valorNumerico = valorDigitado ? parseFloat(valorDigitado) / 100 : 0; // Converte para número
    setFormData({ ...formData, valor: valorNumerico });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTipoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, tipo: e.target.value });
  };

  const handleSave = async () => {
    try {
      const registro = {
        valor: formData.valor, // Aqui já é um número
        data: formData.data,
        observacoes: formData.observacoes,
        tipo: formData.tipo,
        categoria: formData.categoria,
        createdAt: new Date().toISOString(), 
      };

      await addDoc(collection(db, "registros"), registro);

      alert("Registro salvo com sucesso!");
      setFormData({ valor: 0, data: "", observacoes: "", tipo: "positivo", categoria: '' });
    } catch (error) {
      console.error("Erro ao salvar registro: ", error);
      alert("Ocorreu um erro ao salvar o registro.");
    }
  };

  return (
    <div className="container-add">
      <button onClick={() => navigate(-1)} className="btn-floating btn-danger btn">
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>

      <h2 className="text-light">Adicionar Registro</h2>
      <div className="formulario">
        <form className="form-content">
          <div className="form-group">
            <label htmlFor="valor" className="text-light">Valor</label>
            <input
              type="number" 
              id="valor"
              name="valor"
              value={formData.valor.toFixed(2)}
              onChange={handleValorChange}
              className="form-control"
              placeholder="Digite o valor"
            />
          </div>
          <div className="form-group">
            <label htmlFor="categoria" className="text-light">Categoria</label>
            <input
              type="text"
              id="categoria"
              name="categoria"
              value={formData.categoria.toUpperCase()}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Digite a categoria do registro"
            />
          </div>
          <div className="form-group">
            <label htmlFor="data" className="text-light">Data</label>
            <input
              type="date"
              id="data"
              name="data"
              value={formData.data}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="observacoes" className="text-light">Observações</label>
            <textarea
              id="observacoes"
              name="observacoes"
              value={formData.observacoes}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Adicione observações"
            />
          </div>
          <div className="form-group">
            <label className="text-light">Tipo do registro</label>
            <div className="radio-group">
              <label className="radio-option positivo">
                <input
                  type="radio"
                  name="tipo"
                  value="positivo"
                  checked={formData.tipo === "positivo"}
                  onChange={handleTipoChange}
                />
                Positivo
              </label>
              <label className="radio-option negativo">
                <input
                  type="radio"
                  name="tipo"
                  value="negativo"
                  checked={formData.tipo === "negativo"}
                  onChange={handleTipoChange}
                />
                Negativo
              </label>
            </div>
          </div>
          <button type="button" onClick={handleSave} className="btn btn-primary">
            Salvar Registro
          </button>
        </form>
      </div>
    </div>
  );
};
