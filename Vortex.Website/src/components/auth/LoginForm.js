import React from 'react';
import { useFormik } from 'formik';
import InputField from './InputField';

const LoginForm = ({ onLogin, switchToRegisterForm }) => {
  const formik = useFormik({
    initialValues: {
        email: '',
        password:'',
        rememberMe: false
      },
    onSubmit: values => {
      // Call the onLogin callback with the form values
      onLogin(values);
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

                  <h2 className="fw-bold mb-3 fs-5">Login to your account</h2>

                  <form onSubmit={formik.handleSubmit}>
                    <InputField type="email" id="loginEmail" name="email" formik={formik}  placeholder="Enter your email..."/>
                    <InputField type="password" id="loginPassword" name="password" formik={formik}  placeholder="Enter your password..."/>
                    <button type="submit" className="btn btn-primary">Login</button>

                  </form>

                  <div>
                    <p className="mt-5 fs-6" >
                      Don't have an account? 
                      <a href="#"
                          className="text-dark-50 fw-bold p-1"
                          onClick={switchToRegisterForm}>
                        Sign Up
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

export default LoginForm;