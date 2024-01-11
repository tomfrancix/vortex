import React from 'react';
import { useFormik } from 'formik';
import InputField from './InputField';

const RegistrationForm = ({ onRegister, switchToLoginForm }) => {
  const formik = useFormik({
    initialValues: {
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
    onSubmit: values => {
      // Call the onRegister callback with the form values
      onRegister(values);
    },
  });

  return (
    <section className="gradient-custom">
      <div className="container-fluid">
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-12">
            <div className="card bg-grey">
              <div className="card-body p-3 text-center">

                <div className="md-3 mt-md-1">

                  <h2 className="fw-bold mb-3">Register an account</h2>

                  <form onSubmit={formik.handleSubmit}>
                    <InputField type="text" id="firstName" name="firstName" formik={formik} placeholder="First name..."/>
                    <InputField type="text" id="lastName" name="lastName" formik={formik} placeholder="Last name..." />
                    <InputField type="email" id="registerEmail" name="email" formik={formik} placeholder="Enter your email..." />
                    <InputField type="text" id="username" name="username" formik={formik} placeholder="Create your username..." />
                    <InputField type="password" id="registerPassword" name="password" formik={formik} placeholder="Enter a unique password..." />
                    <InputField type="password" id="confirmPassword" name="confirmPassword" formik={formik} placeholder="Confirm your password..." />

                    <button type="submit" className="btn btn-primary">Register</button>

                  </form>

                  <div>
                    <p className="mt-5 fs-6">
                      Already have an account? 
                      <a href="#"
                          className="text-dark-50 fw-bold p-1"
                          onClick={switchToLoginForm}>
                        Sign In
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistrationForm;