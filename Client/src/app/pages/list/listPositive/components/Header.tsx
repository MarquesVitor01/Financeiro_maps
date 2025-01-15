export const Header = () => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("pt-BR");

    return (
        <div className="header-content">
            <div className="header-title">
                <h4>Olá, Vitor!</h4>
            </div>
            <div className="header-time">
                <span>{formattedDate}</span>
            </div>
        </div>
    );
};
