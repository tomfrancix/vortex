import React from 'react';

const InputField = ({ type, id, name, formik, placeholder }) => {

  return (
    <div className="form-outline form-white mb-3 p-0">
        <input
        type={type}
        id={id}
        name={name}
        onChange={formik.handleChange}
        value={formik.values[name]}
        className="form-control form-control-sm fs-6 p-1"
        placeholder={placeholder}
        style={{maxWidth:"300px", margin:"0 auto"}}
        />
    </div>
  );
};

export default InputField;