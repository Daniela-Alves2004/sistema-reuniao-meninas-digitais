import './Style.css'
const Botao = ({ className = {}, tipo, texto, onClick }) => {
  return (
    <button className={className} type={tipo} onClick={onClick}>
      {texto}
    </button>
  );
};

export default Botao;
