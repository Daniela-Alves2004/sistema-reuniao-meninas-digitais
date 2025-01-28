import Header from "../../componentes/Header/Header";
import perfilIcon from "../../assets/icons/user.svg";
import Botao from "../../componentes/Botao/Botao";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

require("./Perfil.css");

function Perfil({ exibirSetor = true, exibirBotaoDeletar = true }) {
    return (
        <div className="perfil-container-wrapper">
            <Header />
            <div className="titulo-container">
                <img src={perfilIcon} alt="Ícone de perfil" />
                <p>Informações do Usuário:</p>
            </div>
            <div className={`perfil-container-dados ${
                        !exibirSetor ? "perfil-container-dados-admin" : ""
                    }`}>
                <div  className={`perfil-container-dados-nome ${
                        !exibirSetor ? "perfil-container-dados-nome-admin" : ""
                    }`}>
                    <label htmlFor="nome-completo">Nome completo:</label>
                    <input
                        type="text"
                        id="nome-completo"
                        name="nome-completo"
                        readOnly
                    />
                </div>
                <div className={`perfil-container-dados-email ${
                        !exibirSetor ? "perfil-container-dados-email-admin" : ""
                    }`}>
                    <label htmlFor="email">Email institucional:</label>
                    <input type="email" id="email" name="email" readOnly />
                </div>
                <div className={`perfil-container-dados-ra ${
                        !exibirSetor ? "perfil-container-dados-ra-admin" : ""
                    }`}>
                    <label htmlFor="registro-aluno">RA:</label>
                    <input type="number" id="registro-aluno" name="registro-aluno" readOnly />
                </div>
                {exibirSetor && (
                    <div className="perfil-container-dados-setor">
                        <label htmlFor="setor">Setor:</label>
                        <input type="text" id="setor" name="setor" readOnly />
                    </div>
                )}
            </div>

            <div className="perfil-container-botoes">
                {exibirBotaoDeletar && (
                    <Botao
                        className="btDeletarConta"
                        type="button"
                        texto="Deletar Conta"
                        onClick={() => toast("Conta deletada!")}
                    />
                )}
            </div>
            <ToastContainer />
        </div>
    );
}

export default Perfil;
