import React, {useState} from 'react';
import Main from './ui/layout/Main';
import Navbar from './ui/layout/Navbar';


import history from './history/history.js';
import {Router, Route} from 'react-router';



const App: React.FC = () => {

    const [newUser, setNewUser] = useState<any>('');

    const handleCallback = (newUserData: any): any => {
        setNewUser(newUserData);
    };

    return (
            <div>
            <Navbar />
            <Router history={history}>
                <div className="App">
                <Route exact path ='/' component={Main} />
                </div>
            </Router>
            </div>
       
    );
};

export default App;
