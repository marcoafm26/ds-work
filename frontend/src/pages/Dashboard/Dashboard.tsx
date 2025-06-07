import Card from '../../components/Card/Card';
import Navbar from '../../components/Navbar/Navbar';
import getClient from '../../utils/getClient';
import './Dashboard.scss';
import { pages } from './Pages';

const Dashboard = () => {
    const client = getClient();
    return (
        <div className="dashboard" data-size="large">
            <Navbar name={client?.name} />
            <div className="card__grid">
                {pages.map((page) => (
                    <Card
                        key={page.title}
                        logo={page.logo}
                        title={page.title}
                        description={page.description}
                        link={page.link}
                    />
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
