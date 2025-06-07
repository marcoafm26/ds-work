import './Header.scss';

interface HeaderProps {
    name: string;
}

const Header = ({ name }: HeaderProps) => {
    return (
        <div className="header">
            <h2>{name}</h2>
        </div>
    );
};

export default Header;
