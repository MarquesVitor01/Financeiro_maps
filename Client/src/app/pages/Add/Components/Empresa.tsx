import { faSync } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';

interface DadosEmpresaProps {
  form: {
    linkGoogle: string;
    numeroContrato: string;
    data: string;
    operador: string;
    equipe: string;
    razaoSocial: string;
    cpf: string;
    cnpj: string;
    nomeFantasia: string;
    enderecoComercial: string;
    bairro: string;
    cep: string;
    estado: string;
    cidade: string;
    validade: string;
    observacoes: string;
    fixo: string;
    celular: string;
    whatsapp: string;
    email1: string;
    email2: string;
    horarioFuncionamento: string;
    responsavel: string;
    cargo: string;
    opcao1: boolean;
    opcao2: boolean;
    opcao3: boolean;
    opcao4: boolean;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  tipoDocumento: string;
  // handleToggleDocumento: () => void;
  // isRotated: boolean;
}

export const DadosEmpresa: React.FC<DadosEmpresaProps> = ({
  form,
  handleInputChange,
  // tipoDocumento,
  // handleToggleDocumento,
  // isRotated,
}) => {
  // const [formattedDocument, setFormattedDocument] = useState<string>(tipoDocumento === "CPF" ? form.cpf : form.cnpj);

  // const formatCNPJ = (value: string) => {
  //   return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  // };

  // const formatCPF = (value: string) => {
  //   return value.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  // };

  // const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { value } = e.target;

  //   const maxLength = tipoDocumento === "CPF" ? 14 : 18;

  //   const trimmedValue = value.slice(0, maxLength);

  //   const formattedValue = tipoDocumento === "CPF" ? formatCPF(trimmedValue) : formatCNPJ(trimmedValue);

  //   setFormattedDocument(formattedValue);

  //   if (tipoDocumento === "CPF") {
  //     if (form.cnpj && form.cnpj.replace(/\D/g, '') !== "") {
  //       handleInputChange({ target: { name: "cnpj", value: "" } } as React.ChangeEvent<HTMLInputElement>);
  //     }
  //   } else {
  //     if (form.cpf && form.cpf.replace(/\D/g, '') !== "") {
  //       handleInputChange({ target: { name: "cpf", value: "" } } as React.ChangeEvent<HTMLInputElement>);
  //     }
  //   }

  //   handleInputChange({ target: { name: tipoDocumento === "CPF" ? "cpf" : "cnpj", value: formattedValue } } as React.ChangeEvent<HTMLInputElement>);
  // };


  return (
    <div className="row d-flex justify-content-center">
      <h4 className="text-white">Dados da Empresa</h4>

      <div className="form-group mb-3 col-md-4">
        <label htmlFor="razaoSocial">Razão Social</label>
        <input
          type="text"
          className="form-control"
          id="razaoSocial"
          name="razaoSocial"
          value={form.razaoSocial}
          onChange={handleInputChange}
          placeholder="Insira a razão social"
        />
      </div>

      {/* <div className="form-group mb-3 col-md-4">
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
      </div> */}
      <div className="form-group mb-3 col-md-4">
        <label htmlFor="nomeFantasia">CNPJ</label>
        <input
          type="text"
          className="form-control"
          id="cnpj"
          name="cnpj"
          value={form.cnpj}
          onChange={handleInputChange}
          placeholder="Insira o cnpj"
        />
      </div>
      <div className="form-group mb-3 col-md-4">
        <label htmlFor="nomeFantasia">CPF</label>
        <input
          type="text"
          className="form-control"
          id="cpf"
          name="cpf"
          value={form.cpf}
          onChange={handleInputChange}
          placeholder="Insira o cpf"
        />
      </div>

      <div className="form-group mb-3 col-md-4">
        <label htmlFor="nomeFantasia">Nome Fantasia</label>
        <input
          type="text"
          className="form-control"
          id="nomeFantasia"
          name="nomeFantasia"
          value={form.nomeFantasia}
          onChange={handleInputChange}
          placeholder="Insira o nome fantasia"
        />
      </div>

      <div className="form-group mb-3 col-md-4">
        <label htmlFor="enderecoComercial">Endereço Comercial</label>
        <input
          type="text"
          className="form-control"
          id="enderecoComercial"
          name="enderecoComercial"
          value={form.enderecoComercial}
          onChange={handleInputChange}
          placeholder="Insira o endereço comercial"
        />
      </div>

      <div className="form-group mb-3 col-md-4">
        <label htmlFor="bairro">Bairro</label>
        <input
          type="text"
          className="form-control"
          id="bairro"
          name="bairro"
          value={form.bairro}
          onChange={handleInputChange}
          placeholder="Insira o bairro"
        />
      </div>

      <div className="form-group mb-3 col-md-4">
        <label htmlFor="cep">CEP</label>
        <input
          type="text"
          className="form-control"
          id="cep"
          name="cep"
          value={form.cep}
          onChange={handleInputChange}
          placeholder="Insira o CEP"
        />
      </div>

      <div className="form-group mb-3 col-md-4">
        <label htmlFor="estado">Estado</label>
        <input
          type="text"
          className="form-control"
          id="estado"
          name="estado"
          value={form.estado}
          onChange={handleInputChange}
          placeholder="Insira o estado"
        />
      </div>

      <div className="form-group mb-3 col-md-4">
        <label htmlFor="cidade">Cidade</label>
        <input
          type="text"
          className="form-control"
          id="cidade"
          name="cidade"
          value={form.cidade}
          onChange={handleInputChange}
          placeholder="Insira a cidade"
        />
      </div>

      <div className="form-group mb-3 col-md-4">
        <label htmlFor="fixo">Telefone Fixo</label>
        <input
          type="text"
          className="form-control"
          id="fixo"
          name="fixo"
          value={form.fixo}
          onChange={handleInputChange}
          placeholder="Insira o telefone fixo"
        />
      </div>

      <div className="form-group mb-3 col-md-4">
        <label htmlFor="celular">Celular</label>
        <input
          type="text"
          className="form-control"
          id="celular"
          name="celular"
          value={form.celular}
          onChange={handleInputChange}
          placeholder="Insira o celular"
        />
      </div>

      <div className="form-group mb-3 col-md-4">
        <label htmlFor="whatsapp">Whatsapp Comercial</label>
        <input
          type="text"
          className="form-control"
          id="whatsapp"
          name="whatsapp"
          value={form.whatsapp}
          onChange={handleInputChange}
          placeholder="Insira o whatsapp comercial"
        />
      </div>

      <div className="form-group mb-3 col-md-4">
        <label htmlFor="email1">1º E-mail</label>
        <input
          type="text"
          className="form-control"
          id="email1"
          name="email1"
          value={form.email1}
          onChange={handleInputChange}
          placeholder="Insira o primeiro e-mail"
        />
      </div>
      <div className="form-group mb-3 col-md-4">
        <label htmlFor="email2">2º E-mail</label>
        <input
          type="text"
          className="form-control"
          id="email2"
          name="email2"
          value={form.email2}
          onChange={handleInputChange}
          placeholder="Insira o segundo e-mail"
        />
      </div>

      <div className="form-group mb-3 col-md-4">
        <label htmlFor="horarioFuncionamento">Horário de Funcionamento</label>
        <input
          type="text"
          className="form-control"
          id="horarioFuncionamento"
          name="horarioFuncionamento"
          value={form.horarioFuncionamento}
          onChange={handleInputChange}
          placeholder="Insira o horário de funcionamento"
        />
      </div>

      <div className="form-group mb-3 col-md-4">
        <label htmlFor="responsavel">Nome do Responsável</label>
        <input
          type="text"
          className="form-control"
          id="responsavel"
          name="responsavel"
          value={form.responsavel}
          onChange={handleInputChange}
          placeholder="Insira o nome do responsável"
        />
      </div>
      <div className="form-group mb-3 col-md-4">
        <label htmlFor="cargo">Cargo</label>
        <input
          type="text"
          className="form-control"
          id="cargo"
          name="cargo"
          value={form.cargo}
          onChange={handleInputChange}
          placeholder="Insira o cargo"
        />
      </div>
      <div className="form-group mb-3 col-md-4">
        <label htmlFor="linkGoogle">Link Google Maps</label>
        <input
          type="text"
          className="form-control"
          id="linkGoogle"
          name="linkGoogle"
          value={form.linkGoogle}
          onChange={handleInputChange}
          placeholder="Insira o link da página do Google Maps"
        />
      </div>
    </div>
  );
};
