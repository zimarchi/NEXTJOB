import { useAuth } from "@/context/userContext";
import { MODAL_STATES } from "@/constants/modalStates";

export default function EmailConfirmationRequestModal({title}: {title :string}) {

  // Etats via useContext
  const { toggleModals } = useAuth ()

  return (
    <section
    className="modalPage modalPageColor" 
    onClick={() => toggleModals(MODAL_STATES.CLOSE)}
    role="dialog"
    aria-modal="true"
    aria-labelledby="email-confirmation-request-dialog-title"
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
          <h4 id="email-confirmation-request-dialog-title">{title}</h4>
          <p className="modalText">
              Un e-mail de confirmation vous a été envoyé. Veuillez vérifier votre boîte de réception et valider votre adresse e-mail avant de vous connecter.
          </p> 
          <button type="reset" className="resetButton" style = {{margin: "15px 0 10px 0"}} onClick={() => toggleModals(MODAL_STATES.CLOSE)}>
              Fermer
          </button>     
      </div>
    </section>
  )
}
