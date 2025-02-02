import Header from "../../components/Header/Header";
import perfilIcon from "../../assets/icons/user.svg";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getDecodedToken } from "../../utils/cookies";

require("./Perfil.css");

function Perfil({ exibirSetor = true}) {

    const decodedToken = getDecodedToken();

    var setor;

    if (getDecodedToken().id_setor === 1) {

        setor = "Marketing";

    } else if (getDecodedToken().id_setor === 2) {

        setor = "Gestão de Pessoas";

    }

    return (

        <div className="perfil-container-wrapper">
            
            <Header />

            <div className="titulo-container">

                <img src={perfilIcon} alt="Ícone de perfil" width={100} height={100} />

            </div>

            <div className={`perfil-container-dados`}>

                {exibirSetor && (

                    <>

                        {/* Nome */}
                        <label htmlFor="nome-completo">Nome completo:</label>
                        <input
                            type="text"
                            id="nome-completo"
                            name="nome-completo"
                            readOnly
                            value={decodedToken.primeiro_nome + " " + decodedToken.ultimo_nome}
                        />

                        {/* Email */}
                        <label htmlFor="email">Email institucional:</label>
                        <input type="email" id="email" name="email" readOnly value={decodedToken.email} />

                        {/* RA */}
                        <label htmlFor="registro-aluno">RA:</label>
                        <input type="number" id="registro-aluno" name="registro-aluno" readOnly value={decodedToken.ra} />

                        {/* Setor */}
                        <label htmlFor="setor">Setor:</label>
                        <input type="text" id="setor" name="setor" readOnly value={setor} />

                    </>

                )}

            </div>
            <ToastContainer />
        </div>
    );
}

export default Perfil;
