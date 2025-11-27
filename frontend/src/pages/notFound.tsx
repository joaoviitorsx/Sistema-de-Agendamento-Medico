import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center'
    }}>
        <h1>404</h1>
        <h2>Página não encontrada</h2>
        <p>A página que você está procurando não existe.</p>
        <Link to="/paciente" style={{ marginTop: 20, color: '#1976d2', textDecoration: 'underline' }}>
            Voltar para a página inicial
        </Link>
    </div>
);

export default NotFound;