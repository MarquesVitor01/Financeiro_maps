import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface MarketingForm {
  artLink: string;
  creationOrUpdate: string;
  responsible: string;
  completionDate: string;
  servicosConcluidos: boolean;
}

interface MarketingFormProps {
  form: MarketingForm | null;
  onSubmit: (data: MarketingForm) => void;
}

export const MarketingForm: React.FC<MarketingFormProps> = ({ form: initialForm, onSubmit }) => {
  const [form, setForm] = useState<MarketingForm>({
    artLink: '',
    creationOrUpdate: 'Criação',
    responsible: '',
    completionDate: '',
    servicosConcluidos: false,
  });

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
      [name]: type === 'checkbox' ? checked : value, 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="card p-4 mb-4" onSubmit={handleSubmit}>
      <h2 className='text-center'>Informações de Marketing</h2>

      <div className="form-group mb-3">
        <label htmlFor="artLink">Link da Arte Personalizada:</label>
        <input
          type="text"
          id="artLink"
          className="form-control"
          name="artLink"
          value={form.artLink}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group mb-3">
        <label htmlFor="creationOrUpdate">Criação ou Atualização:</label>
        <select
          id="creationOrUpdate"
          className="form-select"
          name="creationOrUpdate"
          value={form.creationOrUpdate}
          onChange={handleInputChange}
        >
          <option value="Criação">Criação</option>
          <option value="Atualização">Atualização</option>
        </select>
      </div>

      <div className="form-group mb-3">
        <label htmlFor="responsible">Responsável pela Atualização:</label>
        <input
          type="text"
          id="responsible"
          className="form-control"
          name="responsible"
          value={form.responsible}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group mb-3">
        <label htmlFor="completionDate">Data da Conclusão:</label>
        <input
          type="date"
          id="completionDate"
          className="form-control"
          name="completionDate"
          value={form.completionDate}
          onChange={handleInputChange}
          required
        />
      </div>

      <label>Serviços Concluídos?</label>
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          id="servicosConcluidos"
          name="servicosConcluidos" 
          checked={form.servicosConcluidos}
          onChange={handleInputChange}
        />
        <label className="form-check-label" htmlFor="servicosConcluidos">Sim</label>
      </div>

      <button type="submit" className="btn btn-primary">Salvar</button>
    </form>
  );
};
