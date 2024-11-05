import React from "react";
import { QRCodeSVG } from "qrcode.react";

interface InfoAdicionaisProps {
  form: {
    observacoes: string;
    renovacaoAutomatica: string;
  };
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement 
    >
  ) => void;
}

export const InfoAdicionais: React.FC<InfoAdicionaisProps> = ({
  form,
  handleInputChange,
}) => {
  return (
    <div>
      <h4 className="text-white">Informações Adicionais</h4>

      <div className="form-group mb-3">
        <label htmlFor="observacoes" className="form-label text-white">
          Observações
        </label>
        <textarea
          className="form-control"
          id="observacoes"
          name="observacoes"
          value={form.observacoes}
          onChange={handleInputChange}
          rows={3}
        />
      </div>

      <div className="form-group mb-3">
        <label htmlFor="renovacaoAutomatica" className="form-label text-white">
          Renovação Automática
        </label>
        <select
          className="form-control"
          id="renovacaoAutomatica"
          name="renovacaoAutomatica"
          value={form.renovacaoAutomatica}
          onChange={handleInputChange}
        >
          <option value="">Selecione</option>
          <option value="Sim">Sim</option>
          <option value="Não">Não</option>
        </select>
      </div>
    </div>
  );
};
