import { faBars, faHome, faChartLine, faTachometerAlt, faBullhorn, faMoneyBillWave, faHandHoldingUsd, faTimes, faFileCode, faFileAlt, faClose } from "@fortawesome/free-solid-svg-icons";
import "./navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./ScriptNav/script";
import ScriptNav from "./ScriptNav/script";
import { useAuth } from "../../context/AuthContext";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [script1, setScript1] = useState(false);
  const [script2, setScript2] = useState(false);
  const { nome, avatar, cargo, userId } = useAuth();
  const adminId = "9CfoYP8HtPg7nymfGzrn8GE2NOR2";

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleScriptChange = (script: string) => {
    if (script === "Script 1") {
      setScript1(!script1);
      setScript2(false);
    } else if (script === "Script 2") {
      setScript2(!script2);
      setScript1(false);
    }
  };

  const closeScript = () => {
    setScript1(false);
    setScript2(false);
  };

  return (
    <div>
      <button
        className={`btn btn-primary sidebar-toggle ${isOpen ? "open" : ""}`}
        onClick={toggleSidebar}
        aria-label={isOpen ? "Fechar Menu" : "Abrir Menu"}
      >
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
      </button>

      <nav className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-sticky">
          <div className="nav-perfil">
            <Link to={"/perfil"}>
              <img src={avatar} alt="Foto de Perfil" />
            </Link>
            <p>{nome}</p>
          </div>
          <ul className="nav options flex-column">
            <li className="nav-item">
              <Link
                className="nav-link icon-tooltip"
                to="/setores"
                data-tooltip="Home"
              >
                <FontAwesomeIcon icon={faHome} />
                <span>Home</span>
              </Link>
            </li>
            {(cargo === "vendas" || userId === adminId) && (
              <li className="nav-item">
                <Link
                  className="nav-link icon-tooltip"
                  to="/vendas"
                  data-tooltip="Vendas"
                >
                  <FontAwesomeIcon icon={faChartLine} />
                  <span>Vendas</span>
                </Link>
              </li>
            )}
            {(cargo === "monitoria" || userId === adminId) && (
              <li className="nav-item">
                <Link
                  className="nav-link icon-tooltip"
                  to="/monitoria"
                  data-tooltip="Monitoria"
                >
                  <FontAwesomeIcon icon={faTachometerAlt} />
                  <span>Monitoria</span>
                </Link>
              </li>
            )}
            {(cargo === "marketing" || userId === adminId) && (
              <li className="nav-item">
                <Link
                  className="nav-link icon-tooltip"
                  to="/marketing"
                  data-tooltip="Marketing"
                >
                  <FontAwesomeIcon icon={faBullhorn} />
                  <span>Marketing</span>
                </Link>
              </li>
            )}
            {(cargo === "financeiro" || userId === adminId) && (
              <li className="nav-item">
                <Link
                  className="nav-link icon-tooltip"
                  to="/financeiro"
                  data-tooltip="Financeiro"
                >
                  <FontAwesomeIcon icon={faMoneyBillWave} />
                  <span>Financeiro</span>
                </Link>
              </li>
            )}
            {(cargo === "cobranca" || userId === adminId) && (
              <li className="nav-item">
                <Link
                  className="nav-link icon-tooltip"
                  to="/cobranca"
                  data-tooltip="Cobrança"
                >
                  <FontAwesomeIcon icon={faHandHoldingUsd} />
                  <span>Cobrança</span>
                </Link>
              </li>
            )}
          </ul>
          <ul className="nav flex-column">
            {(cargo === "vendas" || userId === adminId) && (
              <li className="nav-item">
                <button
                  className="nav-link icon-tooltip"
                  data-tooltip="Script"
                  onClick={openModal}
                >
                  <FontAwesomeIcon icon={faFileCode} />
                  <span>Script</span>
                </button>
              </li>
            )}
            <li className="nav-item">
              <Link
                className="nav-link icon-tooltip"
                to={"/relatorio"}
                data-tooltip="Relatório"
              >
                <FontAwesomeIcon icon={faFileAlt} />
                <span>Relatório</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <ScriptNav isOpen={isModalOpen} onClose={closeModal}>
        <button className="btn btn-primary" onClick={() => handleScriptChange("Script 1")}>Script 1</button>
        <button className="btn btn-primary" onClick={() => handleScriptChange("Script 2")}>Script 2</button>
        {script1 && (
          <div className="box-script">
            <p className="close-script">
              <FontAwesomeIcon icon={faClose} onClick={closeScript} />
            </p>
            <p>
              Olá, bom dia (Boa tarde)! Meu nome é ______ falo do Grupo Maps, o
              motivo do meu contato com o senhor(a) é referente à atualização
              (criação) da página dentro da plataforma do Google Maps.
            </p>

            <p>
              <strong>Atualização:</strong> Hoje sua página encontra-se ativa,
              porém está com baixa visibilidade, dificultando que os clientes
              consigam localizar sua empresa. Irei validar algumas informações
              que estão disponíveis para seus clientes, tudo bem?
            </p>

            <p>
              <strong>Criação:</strong> Vamos realizar a criação e a inclusão da
              sua página para que o senhor(a) tenha uma melhor visibilidade.
              Para isso, vou realizar algumas validações, tudo bem?
            </p>

            <p>Nome fantasia permanece o _________? O endereço é o _______?</p>

            <p>
              Vamos incluir um alfinete localizador para que o cliente consiga
              visualizar sua empresa com mais facilidade.
            </p>

            <p>
              O horário de funcionamento é das ___ às ____? Tem horário de
              almoço?
            </p>

            <p>O número de contato é o _______? Ele também é o WhatsApp?</p>

            <p>
              Perfeito, vamos incluir um botão direcionador. Assim, o cliente
              vai clicar e já será direcionado direto para uma conversa com o
              senhor(a).
            </p>

            <p>
              Tem alguma rede social para incluir, Instagram ou Facebook? Me
              informe o nome.
            </p>

            <p>
              Senhor(a), pode nos encaminhar 30 fotos e 5 vídeos mensalmente
              para inclusão na página do seu serviço.
            </p>

            <p>
              Para quando o senhor(a) nos encaminhar as fotos e conseguir
              localizar seu cadastro em nosso sistema, pode me informar o CNPJ
              ou CPF?
            </p>

            <p>
              Vamos encaminhar 3 artes personalizadas com as informações para
              sua empresa. Assim, o senhor(a) pode utilizar tanto no WhatsApp
              quanto nas suas redes sociais.
            </p>

            <p>
              Caso não tenha logotipo, vamos criar um para o senhor(a) com as
              cores de sua preferência.
            </p>

            <p>
              Pode me informar um email para encaminhar o desempenho da página
              mensalmente?
            </p>

            <p>
              Tem mais alguma alteração ou inclusão que deseja realizar na
              página?
            </p>

            <p>
              Perfeito! Referente a todo o processo de atualização, inclusão e
              divulgação da página, gera-se um investimento único de R$______
              com o vencimento apenas para o dia ____.
            </p>

            <p>
              Vamos iniciar a prestação de serviços a partir de hoje e, até o
              vencimento, o senhor(a) já conseguirá ver o serviço sendo
              prestado, tudo bem?
            </p>

            <p>Restou alguma dúvida?</p>

            <p>
              Certo, ciente do valor e do vencimento, o senhor(a) confirma o
              processo de atualização e divulgação da página com "sim" ou "eu
              confirmo"?
            </p>

            <p>
              O número da central e o protocolo de atendimento o senhor(a) quer
              anotar ou podemos encaminhar via WhatsApp?
            </p>

            <p>
              Em instantes, nosso setor de marketing vai entrar em contato e
              encaminhar as demais atualizações. Obrigado!
            </p>

            <p>
              <strong>Número da central:</strong> 0800 580 2766
            </p>
          </div>
        )}

        {script2 && (
          <div className="box-script">
            <p className="close-script" onClick={closeScript}>
              <FontAwesomeIcon icon={faClose} />
            </p>
            <p>
              Olá, boa tarde/bom dia. Eu me chamo _______, falo do Grupo Maps,
              tudo bem?
            </p>

            <p>
              Estou entrando em contato referente à sua página na plataforma do
              Google Maps, que atualmente se encontra ativa, porém desatualizada
              e com baixa visibilidade. Vou validar algumas informações
              disponíveis na página, ok?
            </p>

            <p>O nome fantasia permanece como _____?</p>

            <p>O endereço ainda é _____?</p>

            <p>
              O número para contato disponível na página é ____? Esse número é
              WhatsApp?
            </p>

            <p>
              (Se sim) Irei adicionar um botão direcionador onde os clientes
              irão clicar e serão direcionados direto para o atendimento no
              WhatsApp.
            </p>

            <p>O horário de funcionamento permanece ____?</p>

            <p>
              Consegue me informar o seu e-mail para te encaminhar o desempenho?
            </p>

            <p>
              O senhor tem redes sociais para adicionar na página? (Se sim) Pode
              me passar por gentileza. (Redes sociais: Facebook, Instagram,
              YouTube, iFood etc....)
            </p>

            <p>
              Para o processo de atualização, você pode nos encaminhar 30 fotos
              e 5 vídeos mensalmente para adicionar na sua página, assim
              aprimorando ainda mais os seus serviços. O senhor quer anotar o
              número para enviar as fotos ou prefere que eu mande uma mensagem?
            </p>

            <p>
              Vamos encaminhar 3 artes personalizadas com as informações da sua
              empresa, assim você pode utilizar no WhatsApp, Instagram ou em
              qualquer outra rede de sua preferência. Caso não tenha logotipo,
              iremos realizar a criação de uma com as cores da sua preferência.
              Ok?
            </p>

            <p>
              Para um registro interno e para quando o senhor encaminhar as
              fotos e vídeos e conseguirmos te localizar em nosso sistema,
              consegue me informar o CNPJ/CPF?
            </p>

            <p>Gostaria de adicionar algo mais na página?</p>

            <p>
              Referente ao processo de atualização e divulgação, gera um
              investimento único e trimestral no valor de R$ _____ com o
              vencimento somente para o dia ____.
            </p>

            <p>
              (Pausa de 1 segundo) Gostaria de anotar o protocolo ou posso te
              encaminhar pelo WhatsApp?
            </p>

            <p>
              Ciente do valor e da data de vencimento, o senhor confirma todas
              as atualizações com SIM ou EU CONFIRMO?
            </p>

            <p>
              Dentro de instantes, o nosso setor de Marketing entra em contato
              com o senhor solicitando as demais atualizações. Só aguarde um
              momento em linha para o nosso setor de qualidade validar as
              informações do atendimento, por favor!
            </p>
          </div>
        )}
      </ScriptNav>
    </div>
  );
};
