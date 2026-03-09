// Composant CustomModal : une fenêtre modale personnalisée
const CustomModal = (props) => {
  // Déstructuration des propriétés reçues :
  // - open : boolean pour afficher ou cacher la modal
  // - hideModal : fonction pour fermer la modal
  // - performAction : fonction exécutée lorsqu’on clique sur “Ok”
  // - title : texte à afficher dans le contenu de la modal
  const { open, hideModal, performAction, title } = props;

  return (
    <Modal
      title="Confirmation"        // Titre affiché en haut de la modal
      open={open}                // Contrôle l’affichage de la modal
      onOk={performAction}       // Action à exécuter lorsque l’utilisateur confirme
      onCancel={hideModal}       // Action à exécuter lorsque l’utilisateur annule
      okText="Ok"                // Texte du bouton de confirmation
      cancelText="Cancel"        // Texte du bouton d’annulation
    >
      <p>{title}</p>             {/* Contenu principal : texte passé en propriété */}
    </Modal>
  );
};

export default CustomModal;       // Exportation du composant pour utilisation ailleurs
