import Header from "../../componentes/Header/Header";
import perfilIcon from "../../assets/icons/user.svg";
import Botao from "../../componentes/Botao/Botao";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getDecodedToken } from "../../utils/cookies";

require("./Perfil.css");

function Perfil({ exibirSetor = true, exibirBotaoDeletar = true }) {

    const decodedToken = getDecodedToken();
    
    var setor;

    if (getDecodedToken().id_setor === 1) {

        setor = "Maketing";

    }else if(getDecodedToken().id_setor === 2) {

        setor = "Gestão de Pessoas";

    }

    return (
        <div className="perfil-container-wrapper">
            <Header />
            <div className="titulo-container">
                <img src={perfilIcon} alt="Ícone de perfil" />
                <p>Informações do Usuário:</p>
            </div>
            <div className={`perfil-container-dados ${!exibirSetor ? "perfil-container-dados-admin" : ""}`}>

                <div className={`perfil-container-dados-nome ${!exibirSetor ? "perfil-container-dados-nome-admin" : ""}`}>

                    {/* Nome */}
                    <label htmlFor="nome-completo">Nome completo:</label>
                    <input
                        type="text"
                        id="nome-completo"
                        name="nome-completo"
                        readOnly
                        value={decodedToken.primeiro_nome + " " + decodedToken.ultimo_nome}
                    />

                </div>

                <div className={`perfil-container-dados-email ${!exibirSetor ? "perfil-container-dados-email-admin" : ""}`}>

                    {/* Email */}
                    <label htmlFor="email">Email institucional:</label>
                    <input type="email" id="email" name="email" readOnly value={decodedToken.email} />

                </div>

                <div className={`perfil-container-dados-ra ${!exibirSetor ? "perfil-container-dados-ra-admin" : ""}`}>

                    {/* RA */}
                    <label htmlFor="registro-aluno">RA:</label>
                    <input type="number" id="registro-aluno" name="registro-aluno" readOnly value={decodedToken.ra} />

                </div>
                
                {exibirSetor && (

                    <div className="perfil-container-dados-setor">

                        {/* Setor */}
                        <label htmlFor="setor">Setor:</label>
                        <input type="text" id="setor" name="setor" readOnly value={setor} />

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
