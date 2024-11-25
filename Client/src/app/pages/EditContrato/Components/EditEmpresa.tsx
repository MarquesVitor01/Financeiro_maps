import { faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";

interface VendaData {
  razaoSocial: string;
  cpf: string;
  cnpj: string;
  nomeFantasia: string;
  enderecoComercial: string;
  bairro: string;
  cep: string;
  estado: string;
  cidade: string;
  observacoes: string;
  fixo: string;
  celular: string;
  whatsapp: string;
  email1: string;
  email2: string;
  horarioFuncionamento: string;
  responsavel: string;
  cargo: string;
  linkGoogle: string;
}

interface EditEmpresaFormProps {
  form: VendaData | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  tipoDocumento: "CPF" | "CNPJ";
  handleToggleDocumento: () => void;
  isRotated: boolean;
}

const InputField = ({
  id,
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}) => (
  <div className="form-group mb-3 col-md-4">
    <label htmlFor={id}>{label}</label>
    <input
      type={type}
      className="form-control"
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
);

export const EditEmpresa: React.FC<EditEmpresaFormProps> = ({
  form,
  handleInputChange,
  tipoDocumento,
  handleToggleDocumento,
  isRotated,
}) => {
  const [formattedDocument, setFormattedDocument] = useState<string>(tipoDocumento === "CPF" ? form?.cpf || '' : form?.cnpj || '');

  useEffect(() => {
    setFormattedDocument(tipoDocumento === "CPF" ? form?.cpf || '' : form?.cnpj || '');
  }, [tipoDocumento, form]);

  const formatCNPJ = (value: string) => {
    return value.replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  };

  const formatCPF = (value: string) => {
    return value.replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    let formattedValue = value;
  
    // Formatação para CPF ou CNPJ
    if (name === "cpf" || name === "cnpj") {
      const maxLength = name === "cpf" ? 14 : 18;
      const trimmedValue = value.slice(0, maxLength);
      formattedValue = name === "cpf" ? formatCPF(trimmedValue) : formatCNPJ(trimmedValue);
      setFormattedDocument(formattedValue);
    }

  
    handleInputChange({
      target: { name, value: formattedValue },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  if (!form) return null;

  return (
    <div className="row d-flex justify-content-center">
      <h4 className="text-white">Dados da Empresa</h4>
      <InputField
        id="razaoSocial"
        label="Razão Social"
        name="razaoSocial"
        value={form.razaoSocial}
        onChange={handleInputChange}
        placeholder="Insira a razão social"
      />
      <div className="form-group mb-3 col-md-4">
        <label htmlFor="documento">{tipoDocumento}</label>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            id="documento"
            name={tipoDocumento === "CPF" ? "cpf" : "cnpj"}
            value={formattedDocument}
            onChange={handleDocumentChange}
            placeholder={`Insira o ${tipoDocumento}`}
          />
          <button
            type="button"
            className="btn btn-outline-secondary bg-white"
            onClick={handleToggleDocumento}
          >
            <FontAwesomeIcon
              icon={faSync}
              className={`icon-troca ${isRotated ? 'rotated' : ''} text-dark`}
            />
          </button>
        </div>
      </div>
      <InputField
        id="nomeFantasia"
        label="Nome Fantasia"
        name="nomeFantasia"
        value={form.nomeFantasia}
        onChange={handleInputChange}
        placeholder="Insira o nome fantasia"
      />
      <InputField
        id="enderecoComercial"
        label="Endereço Comercial"
        name="enderecoComercial"
        value={form.enderecoComercial}
        onChange={handleInputChange}
        placeholder="Insira o endereço comercial"
      />
      <InputField
        id="bairro"
        label="Bairro"
        name="bairro"
        value={form.bairro}
        onChange={handleInputChange}
        placeholder="Insira o bairro"
      />
      <InputField
        id="cep"
        label="CEP"
        name="cep"
        value={form.cep}
        onChange={handleInputChange}
        placeholder="Insira o CEP"
      />
      <InputField
        id="estado"
        label="Estado"
        name="estado"
        value={form.estado}
        onChange={handleInputChange}
        placeholder="Insira o estado"
      />
      <InputField
        id="cidade"
        label="Cidade"
        name="cidade"
        value={form.cidade}
        onChange={handleInputChange}
        placeholder="Insira a cidade"
      />
      <InputField
        id="fixo"
        label="Telefone Fixo"
        name="fixo"
        value={form.fixo}
        onChange={handleInputChange}
        placeholder="Insira o telefone fixo"
      />
      <InputField
        id="celular"
        label="Celular"
        name="celular"
        value={form.celular}
        onChange={handleInputChange}
        placeholder="Insira o celular"
      />
      <InputField
        id="whatsapp"
        label="Whatsapp Comercial"
        name="whatsapp"
        value={form.whatsapp}
        onChange={handleInputChange}
        placeholder="Insira o whatsapp comercial"
      />
      <InputField
        id="email1"
        label="1º E-mail"
        name="email1"
        value={form.email1}
        onChange={handleInputChange}
        placeholder="Insira o primeiro e-mail"
      />
      <InputField
        id="email2"
        label="2º E-mail"
        name="email2"
        value={form.email2}
        onChange={handleInputChange}
      />
      <InputField
        id="horarioFuncionamento"
        label="Horário de funcionamento"
        name="horarioFuncionamento"
        value={form.horarioFuncionamento}
        onChange={handleInputChange}
      />
      <InputField
        id="responsavel"
        label="Nome do Responsável"
        name="responsavel"
        value={form.responsavel}
        onChange={handleInputChange}
      />
      <InputField
        id="cargo"
        label="Cargo do Responsável"
        name="cargo"
        value={form.cargo}
        onChange={handleInputChange}
      />
      <InputField
        id="linkGoogle"
        label="Link Google Maps"
        name="linkGoogle"
        value={form.linkGoogle}
        onChange={handleInputChange}
      />
    </div>
  );
};
