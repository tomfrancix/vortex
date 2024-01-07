import React, { useState } from 'react';
import Header from './Header';
import ChooseCompany from './homepage/ChooseCompany';
import CreateCompany from './homepage/CreateCompany';
import CompanyView from './company/CompanyView';

const HomePage = ({websiteData, user, handleLogout}) => {

    const [currentView, setCurrentView] = useState('choose-company');
    const [company, setCompany] = useState(null);

    const createCompany = () => {
        setCurrentView('create-company');
    };

    return (
    <div>
        <Header websiteData={websiteData} handleLogout={handleLogout} authenticated={true} company={company}/>
        {
            company == null ? (
            <>
                {
                    {
                        'choose-company': <ChooseCompany user={user} createCompany={createCompany} setCompany={setCompany}/>,
                        'create-company': <CreateCompany user={user} setCompany={setCompany}/>

                    }[currentView] 
                }
            </>
            ) : (
                <CompanyView company={company} setCompany={setCompany}/>
            ) 
        }
    </div>
    );
};

export default HomePage;