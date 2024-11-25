import { faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

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
  };
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  tipoDocumento: string;
}

export const DadosEmpresa: React.FC<DadosEmpresaProps> = ({
  form,
  handleInputChange,
}) => {

  // Função para formatar o CPF (visual)
  const formatCPF = (value: string): string => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4")
      .substring(0, 14);
  };

  // Função para formatar o CNPJ (visual)
  const formatCNPJ = (value: string): string => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4")
      .replace(/(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, "$1.$2.$3/$4-$5")
      .substring(0, 18);
  };


  const handleDocumentChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { value, name } = e.target;
    let formattedValue = value;

    if (name === "cpf") {
      formattedValue = formatCPF(value);
      handleInputChange({
        target: { name, value: value.replace(/\D/g, "") },
      } as React.ChangeEvent<HTMLInputElement>);
    } else if (name === "cnpj") {
      formattedValue = formatCNPJ(value);
      handleInputChange({
        target: { name, value: value.replace(/\D/g, "") },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };


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
      <div className="form-group mb-3 col-md-4">
        <label htmlFor="nomeFantasia">CNPJ</label>
        <input
          type="text"
          className="form-control"
          id="cnpj"
          name="cnpj"
          value={form.cnpj ? formatCNPJ(form.cnpj) : ""}
          onChange={handleDocumentChange}
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
          value={form.cpf ? formatCPF(form.cpf) : ""}
          onChange={handleDocumentChange}
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
