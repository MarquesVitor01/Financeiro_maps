import React from "react";

interface VendaData {
  numeroContrato: string;
  valorVenda: string;
  validade: string;
  formaPagamento: string;
  data: string;
  operador: string;
  equipe: string;
  contrato: string;
  dataVencimento: string;
  parcelas: string;
}

interface EditOperadorProps {
  form: VendaData | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const SelectField = ({
  id,
  label,
  name,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  name: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => (
  <div className="form-group mb-3 col-md-4">
    <label htmlFor={id}>{label}</label>
    <select className="form-control" id={id} name={name} value={value} onChange={onChange}>
      <option value="">Selecione uma opção</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const InputField = ({
  id,
  label,
  name,
  value,
  onChange,
  readOnly = false,
}: {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
}) => (
  <div className="form-group mb-3 col-md-4">
    <label htmlFor={id}>{label}</label>
    <input
      type="text"
      className="form-control text-capitalize"
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
    />
  </div>
);

const InputData = ({
  id,
  label,
  name,
  value,
  onChange,
  readOnly = false,
}: {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
}) => (
  <div className="form-group mb-3 col-md-4">
    <label htmlFor={id}>{label}</label>
    <input
      type="date"
      className="form-control"
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
    />
  </div>
);

export const EditOperador: React.FC<EditOperadorProps> = ({ form, handleInputChange }) => {
  if (!form) return null;

  return (
    <div className="row d-flex justify-content-center">
      <h4 className="text-white">Informações do Contrato</h4>

      <InputField
        id="numeroContrato"
        label="Contrato Nº"
        name="numeroContrato"
        value={form.numeroContrato}
        onChange={handleInputChange}
        readOnly
      />
      <InputField
        id="valorVenda"
        label="Valor da Venda"
        name="valorVenda"
        value={form.valorVenda}
        onChange={handleInputChange}
      />
      <SelectField
        id="validade"
        label="Parcelas"
        name="parcelas"
        value={form.parcelas}
        onChange={handleInputChange}
        options={[...Array(12)].map((_, i) => ({ value: (i + 1).toString(), label: (i + 1).toString() }))}
      />
      <SelectField
        id="formaPagamento"
        label="Forma de Pagamento"
        name="formaPagamento"
        value={form.formaPagamento}
        onChange={handleInputChange}
        options={[
          { value: "Pix", label: "Pix" },
          { value: "Boleto", label: "Boleto" },
          { value: "Crédito", label: "Crédito" },
        ]}
      />
      <InputData
        id="data"
        label="Data (dd/mm/aaaa)"
        name="data"
        value={form.data}
        onChange={handleInputChange}
      />
      <InputData
        id="dataVencimento"
        label="Data do Vencimento (dd/mm/aaaa)"
        name="dataVencimento"
        value={form.dataVencimento}
        onChange={handleInputChange}
      />
      <InputField
        id="operador"
        label="Operador"
        name="operador"
        value={form.operador}
        onChange={handleInputChange}
        readOnly
      />
      <InputField
        id="equipe"
        label="Equipe"
        name="equipe"
        value={form.equipe}
        onChange={handleInputChange}
        readOnly
      />
      <SelectField
        id="validade"
        label="Tipo de validade"
        name="validade"
        value={form.validade}
        onChange={handleInputChange}
        options={[
          { value: "Cancelamento", label: "Cancelamento" },
          { value: "Mensal", label: "Mensal" },
          { value: "Trimestral", label: "Trimestral" },
          { value: "Semestral", label: "Semestral" },
          { value: "Anual", label: "Anual" },
        ]}
      />
      <SelectField
        id="contrato"
        label="Tipo de Contrato"
        name="contrato"
        value={form.contrato}
        onChange={handleInputChange}
        options={[
          { value: "Base", label: "Base" },
          { value: "Renovacao", label: "Renovação" },
        ]}
      />
    </div>
  );
};
