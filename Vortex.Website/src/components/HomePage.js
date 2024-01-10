import React, { useState } from 'react';
import Header from './Header';
import ChooseCompany from './homepage/ChooseCompany';
import CreateCompany from './homepage/CreateCompany';
import Company from './company/Company';

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
                        /* Add other links for user manager page and analytics page.*/

                    }[currentView] 
                }
            </>
            ) : (
                <Company company={company} setCompany={setCompany}/>
            ) 
        }
    </div>
    );
};

export default HomePage;