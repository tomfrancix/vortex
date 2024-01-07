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

                  <h2 className="fw-bold mb-3 text-uppercase">Register</h2>
                  <p className="text-dark-50 mb-3">Please enter your login and password!</p>

                  <form onSubmit={formik.handleSubmit}>
                    <InputField type="text" id="firstName" name="firstName" formik={formik} />
                    <InputField type="text" id="lastName" name="lastName" formik={formik} />
                    <InputField type="email" id="registerEmail" name="email" formik={formik} />
                    <InputField type="text" id="username" name="username" formik={formik} />
                    <InputField type="password" id="registerPassword" name="password" formik={formik} />

                    <button type="submit" className="btn btn-primary">Login</button>

                  </form>

                  <div>
                    <p className="mt-5">
                      Already have an account? 
                      <a href="#"
                          className="text-dark-50 fw-bold"
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