import React, { useEffect, useState } from "react";
import Select from "react-select";

interface Form {
  valorPago: string;
  acordo: string;
  rePagamento: string;
  dataPagamento: string;
  encaminharCliente: string;
  operadorSelecionado: { value: string; label: string } | null;
}

interface FinanceiroFormProps {
  form: Form | null;
  onSubmit: (data: Form) => void;
}

export const FinanceiroForm: React.FC<FinanceiroFormProps> = ({ form: initialForm, onSubmit }) => {
  const [form, setForm] = useState<Form>({
    valorPago: "",
    acordo: "",
    rePagamento: "",
    dataPagamento: "",
    encaminharCliente: "",
    operadorSelecionado: null,
  });

  const cobranca = [
    { value: "miguel", label: "Miguel" },
    { value: "isa", label: "Isa" },
  ];

  const sairFicha = () => {
    window.history.back();
  };

  useEffect(() => {
    if (initialForm) {
      setForm(initialForm);
    }
  }, [initialForm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (selectedOption: { value: string; label: string } | null) => {
    setForm((prevForm) => ({
      ...prevForm,
      operadorSelecionado: selectedOption,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="row">
      <div className="card card-cob d-flex justify-content-center p-4">
        <form onSubmit={handleSubmit}>
          <label htmlFor="valorInput" className="form-label">
            Valor Pago:
          </label>
          <input
            type="text"
            name="valorPago"
            id="valorInput"
            className="form-control mb-3"
            value={form.valorPago}
            onChange={handleInputChange}
          />

          {/* <label htmlFor="acordoCobrança" className="form-label">
            Possui acordo com a cobrança?
          </label>
          <select
            className="form-select mb-3"
            id="acordoCobrança"
            name="acordo"
            value={form.acordo}
            onChange={handleInputChange}
          >
            <option value="">Selecione uma opção</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </select> */}

          <label htmlFor="rePagamento" className="form-label">
            O cliente realizou o pagamento?
          </label>
          <select
            className="form-select mb-3"
            id="rePagamento"
            name="rePagamento"
            value={form.rePagamento}
            onChange={handleInputChange}
          >
            <option value="">Selecione uma opção</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
            <option value="cancelado">Cancelado</option>
          </select>

          <label htmlFor="dataPagamento" className="form-label">
            Data do Pagamento:
          </label>
          <input
            type="date"
            name="dataPagamento"
            id="dataPagamento"
            className="form-control mb-3"
            value={form.dataPagamento}
            onChange={handleInputChange}
          />
          <hr className="w-50 mx-auto" />

          <div className="encaminheCob">
            <label htmlFor="">Deseja encaminhar para a cobrança?</label>
            <select
            className="form-select mb-3"
            id="encaminharCliente"
            name="encaminharCliente"
            value={form.encaminharCliente}
            onChange={handleInputChange}
          >
            <option value="">Selecione uma opção</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </select>

            <label className="form-label">Selecione ou digite um operador:</label>
            <Select
              options={cobranca}
              value={form.operadorSelecionado}
              onChange={handleSelectChange}
              isClearable
              isSearchable
            />
          </div>

          <div className="d-flex gap-3 mx-auto">
            <button type="button" className="btn btn-danger mt-4" onClick={sairFicha}>
              Sair
            </button>
            <button type="submit" className="btn btn-primary mt-4">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
