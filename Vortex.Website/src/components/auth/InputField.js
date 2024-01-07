import React from 'react';

const InputField = ({ type, id, name, formik }) => {

  return (
    <div className="form-outline form-white mb-3">
        <input
        type={type}
        id={id}
        name={name}
        onChange={formik.handleChange}
        value={formik.values.email}
        className="form-control form-control-lg"
        placeholder={`Enter your ${name}...`}
        />
    </div>
  );
};

export default InputField;