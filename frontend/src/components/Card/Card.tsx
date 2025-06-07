import { useNavigate } from 'react-router-dom';
import './Card.scss';

interface CardProps {
    logo: string;
    title: string;
    description: string;
    link: string;
}

const Card = ({ logo, title, description, link }: CardProps) => {
    const navigate = useNavigate();
    return (
        <div className="card" onClick={() => navigate(link)}>
            <img src={logo} alt="" />
            <h2>{title}</h2>
            <p>{description}</p>
        </div>
    );
};

export default Card;
