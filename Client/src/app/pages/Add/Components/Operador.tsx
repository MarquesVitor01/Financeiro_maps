// Operador.tsx
import React from 'react';
interface OperadorProps {
  form: {
    numeroContrato: string;
    data: string;
    dataVencimento: string;
    operador: string;
    equipe: string;
    validade: string;
    parcelas: string;
    valorVenda: string;
    contrato: string;
    formaPagamento: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSelectChange: (selectedOption: any) => void;
  operadoresOpcoes: { value: string; label: string }[];
}

export const Operador: React.FC<OperadorProps> = ({
  form,
  handleInputChange,
}) => {
  return (
    <div className="row d-flex justify-content-center">
      <h4 className="text-white">Informações do Contrato</h4>

      <div className="form-group mb-3 col-md-4">
        <label htmlFor="numeroContrato">Contrato Nº</label>
        <input
          type="text"
          className="form-control"
          id="numeroContrato"
          name="numeroContrato"
          value={form.numeroContrato}
          onChange={handleInputChange}
          placeholder='Inserido de forma automática a partir do cnpj/cpf'
          readOnly
        />
      </div>
      <div className="form-group mb-3 col-md-4">
        <label htmlFor="valorVenda">Valor da Venda</label>
        <input
          type="text"
          className="form-control"
          id="valorVenda"
          name="valorVenda"
          value={form.valorVenda}
          onChange={handleInputChange}
          placeholder='Insira o valor da venda'
        />
      </div>
      <div className="form-group mb-3 col-md-4">
        <label htmlFor="parcelas">Parcelas</label>
        <select
          className="form-control"
          id="parcelas"
          name="parcelas"
          value={form.parcelas}
          onChange={handleInputChange}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
        </select>
      </div>
      <div className="form-group mb-3 col-md-4">
        <label htmlFor="formaPagamento">Forma de Pagamento</label>
        <select
          className="form-control"
          id="formaPagamento"
          name="formaPagamento"
          value={form.formaPagamento}
          onChange={handleInputChange}
        >
          <option value="">Selecione uma opção</option>
          <option value="Pix">Pix</option>
          <option value="Boleto">Boleto</option>
          <option value="Crédito">Crédito</option>
        </select>
      </div>

      <div className="form-group mb-3 col-md-4">
        <label htmlFor="data">Data (dd/mm/aaaa)</label>
        <input
          type="date"
          className="form-control"
          id="data"
          name="data"
          value={form.data}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group mb-3 col-md-4">
        <label htmlFor="dataVencimento">Data do Vencimento (dd/mm/aaaa)</label>
        <input
          type="date"
          className="form-control"
          id="dataVencimento"
          name="dataVencimento"
          value={form.dataVencimento}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group mb-3 col-md-4">
        <label htmlFor="operador">Operador</label>
        <input
          type="text"
          className="form-control text-capitalize"
          id="operador"
          name="operador"
          value={form.operador}
          onChange={handleInputChange}
          readOnly
        />
      </div>

      <div className="form-group mb-3 col-md-4">
        <label htmlFor="equipe">Equipe</label>
        <input
          type="text"
          className="form-control"
          id="equipe"
          name="equipe"
          value={form.equipe}
          onChange={handleInputChange}
          readOnly
        />
      </div>

      <div className="form-group mb-3 col-md-4">
        <label htmlFor="validade">Válido por</label>
        <select
          className="form-control"
          id="validade"
          name="validade"
          value={form.validade}
          onChange={handleInputChange}
        >
          <option value="">Selecione uma opção</option>
          <option value="Cancelamento">Cancelamento</option>
          <option value="Mensal">Mensal</option>
          <option value="Trimestral">Trimestral</option>
          <option value="Semestral">Semestral</option>
          <option value="Anual">Anual</option>
        </select>
      </div>
      <div className="form-group mb-3 col-md-4">
        <label htmlFor="contrato">Tipo de Contrato</label>
        <select
          className="form-control"
          id="contrato"
          name="contrato"
          value={form.contrato}
          onChange={handleInputChange}
        >
          <option value="">Selecione uma opção</option>
          <option value="Base">Base</option>
          <option value="Renovacao">Renovação</option>
        </select>
      </div>
    </div>
  );
};
