import React, { useState } from "react";
import Header from "../../components/Header/Header";
import perfilIcon from "../../assets/icons/user.svg";
import "react-toastify/dist/ReactToastify.css";
import { getDecodedToken } from "../../utils/cookies";
import PopUp from "../../components/PopUp/PopUp";
import { createLocation, createSetor } from "../../utils/api";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';


require("./Perfil.css");

function Perfil() {

    const decodedToken = getDecodedToken();

    const navigate = useNavigate();

    // Estados para controlar a visibilidade dos popups
    const [showPopupLocal, setShowPopupLocal] = useState(false);
    const [showPopupSetor, setShowPopupSetor] = useState(false);
    
    // Estado para controlar o tipo de local
    const [tipoLocal, setTipoLocal] = useState("Presencial"); 

    // Funções para abrir e fechar os popups
    const handleOpenPopupLocal = () => setShowPopupLocal(true);
    const handleClosePopupLocal = () => setShowPopupLocal(false);

    const handleOpenPopupSetor = () => setShowPopupSetor(true);
    const handleClosePopupSetor = () => setShowPopupSetor(false);

    // Função para controlar a mudança do tipo de local
    const handleTipoChange = (event) => {
        setTipoLocal(event.target.value);
    };

    // Função para adicionar um local
    const handleAddLocal = (event) => {
        event.preventDefault();
        const tipo = event.target.tipo.value;
        const link = event.target.link.value;
        const sala = event.target.sala.value;

        const locationData = {
            tipo: tipo,
            link: link,
            sala: sala,
        };

        createLocation(locationData)
            .then(() => {
                handleClosePopupLocal();
                toast.success("Local adicionado com sucesso!");
            })
            .catch((error) => {
                console.error("Erro ao adicionar local:", error);
            });

        event.target.reset();

    };

    // Função para adicionar um setor
    const handleAddSetor = (event) => {

        event.preventDefault();

        const nome = event.target.nome.value;

        const setorData = {
            nome: nome,
        };

        createSetor(setorData)
            .then(() => {
                handleClosePopupSetor();
                toast.success("Setor adicionado com sucesso!");
            })
            .catch((error) => {
                console.error("Erro ao adicionar setor:", error);
            });

        event.target.reset();

    };
        

    // Lógica para definir o setor
    let setor;
    if (decodedToken.id_setor === 1) {
        setor = "Marketing";
    } else if (decodedToken.id_setor === 2) {
        setor = "Gestão de Pessoas";
    }else if (decodedToken.id_setor === 3) {
        setor = "Conteúdo";
    }else if (decodedToken.id_setor === 4) {
        setor = "Instrutores";
    }else if (decodedToken.id_setor === 5) {
        setor = "Coordenação";
    }

    return (
        <div className="perfil-container-wrapper">
            <Header />

            <div className="titulo-container">
                <img src={perfilIcon} alt="Ícone de perfil" width={100} height={100} />
            </div>

            <div className={`perfil-container-dados`}>
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
                </div>

                {decodedToken.papel === "Lider" && (
                    <div className="perfil-container-botoes">
                        <button onClick={handleOpenPopupLocal}>+ Local</button>
                        <button onClick={handleOpenPopupSetor}>+ Setor</button>
                        <button onClick={() => navigate('/cadastro')}>+ Membros</button>
                    </div>
                )}

            <PopUp isOpen={showPopupLocal} onClose={handleClosePopupLocal}>
                <h4>Adicionar local:</h4>
                <form onSubmit={handleAddLocal}>
                    {/* Seleção do tipo de local */}
                    <select name="tipo" value={tipoLocal} onChange={handleTipoChange}>
                        <option value="Presencial">Presencial</option>
                        <option value="Remoto">Remoto</option>
                    </select>

                    {/* Campo Link (habilitado apenas para Remoto) */}
                    <label htmlFor="link">Link:</label>
                    <input
                        type="text"
                        id="link"
                        name="link"
                        disabled={tipoLocal === "Presencial"} // Desabilita se for Presencial
                    />

                    {/* Campo Sala (habilitado apenas para Presencial) */}
                    <label htmlFor="sala">Sala:</label>
                    <input
                        type="text"
                        id="sala"
                        name="sala"
                        disabled={tipoLocal === "Remoto"} // Desabilita se for Remoto
                    />

                    <button type="submit">Adicionar</button>
                </form>
            </PopUp>

            {/* PopUp para adicionar setor */}
            <PopUp isOpen={showPopupSetor} onClose={handleClosePopupSetor}>
                <h4>Adicionar setor:</h4>
                <form onSubmit={handleAddSetor}>
                    <label htmlFor="nome">Nome:</label>
                    <input type="text" id="nome" name="nome" />
                    <button type="submit">Adicionar</button>
                </form>
            </PopUp>

            <ToastContainer />
        </div>
    );
}

export default Perfil;