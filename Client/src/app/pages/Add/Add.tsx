import { useState } from "react";
import "./Add.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

interface FormData {
  valor: string;
  data: string;
  observacoes: string;
  tipo: string; // Adicionado para armazenar "Positivo" ou "Negativo"
}

export const Add: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    valor: "0,00",
    data: "",
    observacoes: "",
    tipo: "positivo", // Valor inicial
  });

  const navigate = useNavigate();

  const formatarValor = (valor: string): string => {
    const apenasNumeros = valor.replace(/\D/g, "");
    if (!apenasNumeros) {
      return "0,00";
    }
    const numero = parseFloat(apenasNumeros) / 100;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
      .format(numero)
      .replace("R$", "")
      .trim();
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorDigitado = e.target.value;
    const valorFormatado = formatarValor(valorDigitado);
    setFormData({ ...formData, valor: valorFormatado });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTipoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, tipo: e.target.value });
  };

  const handleSave = () => {
    setFormData({ valor: "0,00", data: "", observacoes: "", tipo: "positivo" });
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
              type="text"
              id="valor"
              name="valor"
              value={formData.valor}
              onChange={handleValorChange}
              className="form-control"
              placeholder="Digite o valor"
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
