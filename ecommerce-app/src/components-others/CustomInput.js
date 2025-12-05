// import React from "react";

// Composant CustomInput : champ de saisie réutilisable
const CustomInput = (props) => {
  // Déstructuration des propriétés reçues :
  // - type : type du champ (text, email, password, etc.)
  // - label : texte du label affiché au-dessus du champ
  // - i_id : identifiant unique du champ
  // - i_class : classes CSS supplémentaires
  // - name : nom du champ (pour les formulaires)
  // - val : valeur du champ
  // - onChng : fonction déclenchée lors de la saisie (onChange)
  // - onBlr : fonction déclenchée quand le champ perd le focus (onBlur)
  const { type, label, i_id, i_class, name, val, onChng, onBlr } = props;

  return (
    <div className="form-floating mt-3">
      {/* Champ de saisie */}
      <input
        type={type}                       // Type du champ
        className={`form-control ${i_class}`} // Ajout de classes CSS
        id={i_id}                         // Identifiant HTML
        placeholder={label}               // Texte d’aide (placeholder)
        name={name}                       // Nom du champ
        value={val}                       // Valeur actuelle
        onChange={onChng}                 // Événement lors de la saisie
        onBlur={onBlr}                    // Événement lorsqu'on quitte le champ
      />

      {/* Label flottant */}
      <label htmlFor={label}>{label}</label>
    </div>
  );
};

export default CustomInput; // Exportation du composant pour utilisation ailleurs
