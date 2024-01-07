import React, { useState } from 'react';
import RegistrationForm from './auth/RegistrationForm';
import LoginForm from './auth/LoginForm';
import Header from './Header';

const LandingPage = ({setUser, websiteData}) => {

    const [currentForm, setCurrentForm] = useState('login');

    const handleAuthentication = async (url, formData) => {
    try {
        const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
        });

        if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.token);
        data.isLoggedIn = true;
        console.log(data);
        setUser(data);
        } else {
        console.error(`Failed to ${url.split('/').pop()}:`, response.statusText);
        }
    } catch (error) {
        console.error(`Error ${url.split('/').pop()}:`, error);
    }
    };

    const handleRegister = async (formData) => {
        await handleAuthentication('/api/Account/register', formData); 
    };

    const handleLogin = async (formData) => {
        await handleAuthentication('/api/Account/login', formData);
    };

    const switchToRegisterForm = () => {
        setCurrentForm('register');
      };

    const switchToLoginForm = () => {
        setCurrentForm('login');
    };

    return (
    <div>
        <Header websiteData={websiteData} authenticated={false} />
        <section className="py-4 text-center container-fluid bg-dark text-light">
            <div className="row py-lg-5">
            <div className="col-lg-7 col-md-12 col-sm-12 mx-auto">
                <h1 className="fw-light">Welcome to {websiteData.websiteName}</h1>
                <p className="lead">{websiteData.summary}</p>
                <div className="container-fluid pt-5">
                    <div className="row">
                        <div className="col-lg-6 col-md-12 mx-auto">
                            {currentForm === 'register' ? (
                                <RegistrationForm onRegister={handleRegister} switchToLoginForm={switchToLoginForm} />
                            ) : (
                                <LoginForm onLogin={handleLogin} switchToRegisterForm={switchToRegisterForm}/>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </section>
    </div>
    );
};

export default LandingPage;