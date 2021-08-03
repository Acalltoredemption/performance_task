import React from 'react';
import UserTable from '../components/UserTable';

const AdminPanel: React.FC = () => {

    return (
        <div className="app-admin-panel">
            <UserTable />
        </div>
    );
};

export default AdminPanel;
