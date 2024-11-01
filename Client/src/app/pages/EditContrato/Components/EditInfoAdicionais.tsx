import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface VendaData {
  observacoes: string;
  qrcodeText: string;
}

interface EditInfoAdicionaisProps {
  form: VendaData | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const TextAreaField = ({
  id,
  label,
  name,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}) => (
  <div className="form-group mb-3">
    <label htmlFor={id}>{label}</label>
    <textarea
      className="form-control textarea-resizable"
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      rows={3}
      placeholder={placeholder}
      style={{ resize: 'both', overflow: 'auto', width: '100%' }}
    />
  </div>
);

const InputField = ({
  id,
  label,
  name,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) => (
  <div className="form-group mb-3">
    <label htmlFor={id}>{label}</label>
    <input
      type="text"
      id={id}
      className="form-control"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
);

export const EditInfoAdicionais: React.FC<EditInfoAdicionaisProps> = ({ form, handleInputChange }) => {
  if (!form) return null;

  return (
    <div>
      <h4 className='text-white'>Informações Adicionais</h4>

      <TextAreaField
        id="observacoes"
        label="Observações"
        name="observacoes"
        value={form.observacoes}
        onChange={handleInputChange}
        placeholder="Adicione observações ou comentários relevantes..."
      />

      <InputField
        id="qrcode"
        label="Texto para QR Code"
        name="qrcodeText"
        value={form.qrcodeText}
        onChange={handleInputChange}
        placeholder="Digite o texto para gerar o QR Code..."
      />

      {form.qrcodeText && (
        <div className="mt-3">
          <h5>QR Code:</h5>
          <QRCodeSVG value={form.qrcodeText} size={128} />
        </div>
      )}
    </div>
  );
};
