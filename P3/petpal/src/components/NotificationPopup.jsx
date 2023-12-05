const NotificationPopup = ({ notificationContent, onClose }) => {
  return (
    <div
      className="notification-popup position-fixed top-3 end-0 p-3"
      style={{ zIndex: 1051 }}
    >
      <div className="card">
        <div className="card-header">
          Notification
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>
        <div className="card-body">
          <p className="card-text">{notificationContent}</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;
