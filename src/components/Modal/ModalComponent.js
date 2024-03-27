import { useEffect, useContext, createContext } from "react";
import { useSpring, animated, useTransition } from "@react-spring/web";
import "./Modal.css";

// Create a context to pass onClose function to nested components
const ModalContext = createContext();

const ModalComponent = ({ children, isOpen, onClose }) => {
  /*// Function to handle Escape key press to close the modal
  const handleEscape = (e) => {
    if (e.keyCode === 27) {
      onClose();
    }
  };

   // Add event listener for Escape key press when modal is opened
  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    // Remove event listener when component unmounts
    return () => document.removeEventListener("keydown, handleEscape");
  }, []);
 */
  // Define transition for modal visibility
  const modalTransition = useTransition(isOpen, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 1 },
    config: { duration: 300 },
  });

  // Define spring animation for modal appearance
  const springs = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? "translateY(0%)" : "translateY(-100%)",
    config: { duration: 300 },
  });

  return modalTransition(
    (styles, isOpen) =>
      isOpen && (
        // Render animated div for modal overlay with styles for visibility
        <animated.div
          style={styles}
          className="react-modal-overlay"
          onClick={onClose}
        >
          {/* Render animated div for modal wrapper with spring animation */}
          <animated.div
            style={springs}
            className="react-modal-wrapper"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="react-modal-content">
              {/* Provide onClose function to nested components */}
              <ModalContext.Provider value={{ onClose }}>
                {children}
              </ModalContext.Provider>
            </div>
          </animated.div>
        </animated.div>
      )
  );
};

// Component for dismissing the modal
const DismissButton = ({ children, className }) => {
  const { onClose } = useContext(ModalContext);
  return (
    <button type="button" onClick={onClose} className={className}>
      {children}
    </button>
  );
};

// Component for modal header
const ModalHeader = ({ children }) => {
  const { onClose } = useContext(ModalContext);
  return (
    <div className="react-modal-header">
      <div className="react-modal-title">{children}</div>
      {/* Render DismissButton component for closing the modal */}
      <DismissButton className="btn-close">&times;</DismissButton>
    </div>
  );
};

// Component for modal body
const ModalBody = ({ children }) => {
  return <div className="react-modal-body">{children}</div>;
};

// Component for modal footer
const ModalFooter = ({ children }) => {
  return <div className="react-modal-footer">{children}</div>;
};

// Attach nested components and DismissButton to ModalComponent for easy usage
ModalComponent.Header = ModalHeader;
ModalComponent.Body = ModalBody;
ModalComponent.Footer = ModalFooter;
ModalComponent.DismissButton = DismissButton;

export default ModalComponent;
