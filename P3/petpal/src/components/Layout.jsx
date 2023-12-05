import Header from "./Header";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import { fetchWithToken } from "../services/utils";
import NotificationPopup from "./NotificationPopup";
import { isUserLoggedIn } from "../services/userService";

const Layout = ({ children }) => {
  const [notification, setNotification] = useState(null);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  const fetchNotifications = async () => {
    if ((await isUserLoggedIn()) === true) {
      try {
        const response = await fetchWithToken("/notifications/?state=unread"); // Update with your actual API endpoint
        if (response.status === 200) {
          const data = await response.json();
          const newNotifications = data?.results[0];
          setNotification(newNotifications);
          // console.log(
          //   "newNotification:",
          //   newNotifications,
          // );
          if (newNotifications) {
            setShowNotificationPopup(true); // Show pop-up if there are new notification
          }
        } else if (response.status === 204) {
          // console.log("No new notification");
        }
      } catch (error) {
        // console.error("Error fetching notification:", error);
      }
    } else {
      // console.log("User not logged in");
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchNotifications, 1000); // Poll every 10 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

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

  return (
    <div id="root">
      <Header />
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
