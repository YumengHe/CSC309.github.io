import { Link } from "react-router-dom"; // Import Link from React Router if you're using it

const NotificationPopup = ({ notificationContent, onClose }) => {
  const handleLinkClick = (event) => {
    onClose(); // Call onClose before navigating
  };

  return (
    <div
      className="notification-popup position-fixed top-3 end-0 p-3"
      style={{ zIndex: 1051 }}
    >
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span>Notification</span>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>
        <div className="card-body">
          <p className="card-text">{notificationContent}</p>
          <Link
            to="/notifications"
            className="card-link"
            onClick={handleLinkClick}
          >
            View All Notifications
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;
