import Header from "./Header";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import { fetchWithToken } from "../services/utils";
import NotificationPopup from "./NotificationPopup";
import { isUserLoggedIn } from "../services/userService";
import "../assets/css/HeaderFooter.css";

const Layout = ({ children }) => {
  const [notification, setNotification] = useState(null);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false); // New state for switch

  useEffect(() => {
    let interval;

    const fetchNotifications = async () => {
      // Check if the user is logged in and notifications are enabled
      if ((await isUserLoggedIn()) && notificationsEnabled) {
        try {
          const response = await fetchWithToken("/notifications/?state=unread");
          if (response.status === 200) {
            const data = await response.json();
            const newNotifications = data?.results[0];
            if (newNotifications) {
              setNotification(newNotifications);
              setShowNotificationPopup(true);
            } else {
              // No new notifications, you might want to reset the state here
              setNotification(null);
              setShowNotificationPopup(false);
            }
          } else if (response.status === 204) {
            // Handle no new notifications
            setNotification(null);
            setShowNotificationPopup(false);
          }
        } catch (error) {
          console.error("Error fetching notification:", error);
        }
      }
    };

    if (notificationsEnabled) {
      interval = setInterval(fetchNotifications, 1000); // Poll every 1 second if notifications are enabled
    }

    return () => {
      if (interval) clearInterval(interval); // Cleanup on unmount
    };
  }, [notificationsEnabled]);

  const handleClosePopup = async () => {
    try {
      const response = await fetchWithToken(
        `/notifications/${notification?.id}/`,
        "PUT",
      );
      setShowNotificationPopup(false);
      console.log("response:", response);
    } catch (error) {
      console.error("Error closing notification:", error);
    }
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  return (
    <div id="root">
      <Header
        onToggleNotifications={toggleNotifications}
        notificationsEnabled={notificationsEnabled}
      />
      <main className="content flex-grow-1">
        <div className="container">{children}</div>
      </main>
      {showNotificationPopup && notification && (
        <NotificationPopup
          notificationContent={notification?.content}
          onClose={handleClosePopup}
        />
      )}
      <Footer />
    </div>
  );
};

export default Layout;
