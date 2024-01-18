import React from 'react';
import { useFormik } from 'formik';
import InputField from '../auth/InputField';

const CreateCompany = ({user, setCompany}) => {

    const token = localStorage.getItem('accessToken');

    const createCompany = async (formData) => {
        var url = '/api/Company/new';
        try {
            const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData.name)
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setCompany(data)
            } else {
                console.error(`Failed to ${url.split('/').pop()}:`, response.statusText);
            }
        } catch (error) {
            console.error(`Error ${url.split('/').pop()}:`, error);
        }
    };

    const formik = useFormik({
        enableReinitialize: true, 
        initialValues: {
            name: ''
        },
        onSubmit: values => {
            console.log(values)
            createCompany(values);
        },
    });
      
    return (
        <section className="py-4 text-center container-fluid bg-dark text-light">
            <div className="row py-lg-5">
                <div className="col-lg-7 col-md-12 col-sm-12 mx-auto">
                    <div>
                        <h1 className="fw-light">Welcome {user.firstName} {user.lastName}</h1>
                        <div className="container-fluid pt-5">
                            <div className="row">
                            <section className="gradient-custom">
                                    <div className="container-fluid">
                                        <div className="row d-flex justify-content-center align-items-center">
                                            <div className="col-12">
                                                <div className="card bg-light">
                                                    <div className="card-body p-3 text-center">
                                                        <div className="md-3 mt-md-1">
                                                            <h2 className="fw-bold mb-3">Create Collaboration Group</h2>
                                                            <form onSubmit={formik.handleSubmit}>
                                                                <InputField type="text" id="name" name="name" formik={formik} />
                                                                <button type="submit" className="btn btn-primary">Create</button>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CreateCompany;