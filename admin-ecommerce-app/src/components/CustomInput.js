import React from "react";

const CustomInput = (props) => {
  const { 
    type, 
    label, 
    i_id, 
    i_class, 
    name, 
    val, 
    onChng, 
    onBlr,
    placeholder,
    disabled,
    required
  } = props;
  
  return (
    <div className="form-floating">
      <input
        type={type}
        className={`form-control ${i_class || ''}`}
        id={i_id}
        placeholder={placeholder || label}
        name={name}
        value={val || ''}
        onChange={onChng}
        onBlur={onBlr}
        disabled={disabled}
        required={required}
        style={{
          boxShadow: "none",
          borderColor: "var(--color-c3d4da)"
        }}
      />
      <label htmlFor={i_id} className="text-muted">
        {label}
      </label>
    </div>
  );
};

export default CustomInput;
