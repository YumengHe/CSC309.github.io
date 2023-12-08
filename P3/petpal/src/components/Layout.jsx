import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
  // const [notification, setNotification] = useState(null);
  // const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  // useEffect(() => {
  //   const fetchNotifications = async () => {
  //     // Only fetch notifications if (there are no notifications or the notification popup is not shown) and (the user is logged in)
  //     if (
  //       (!showNotificationPopup || !notification) &&
  //       (await isUserLoggedIn())
  //     ) {
  //       try {
  //         const response = await fetchWithToken("/notifications/?state=unread"); // Update with your actual API endpoint
  //         if (response.status === 200) {
  //           const data = await response.json();
  //           const newNotifications = data?.results[0];
  //           setNotification(newNotifications);
  //           if (newNotifications) {
  //             setShowNotificationPopup(true); // Show pop-up if there are new notifications
  //           }
  //         } else if (response.status === 204) {
  //           // Handle no new notifications
  //         }
  //       } catch (error) {
  //         console.error("Error fetching notification:", error);
  //       }
  //     } else {
  //       // Handle user not logged in
  //     }
  //   };
  //
  //   const interval = setInterval(fetchNotifications, 1000); // Poll every 1 second
  //   return () => clearInterval(interval); // Cleanup on unmount
  // }, [showNotificationPopup]); // Add relevant dependencies here

  // const handleClosePopup = async () => {
  //   try {
  //     const response = await fetchWithToken(
  //       `/notifications/${notification?.id}/`,
  //       "PUT",
  //     );
  //     setShowNotificationPopup(false);
  //     console.log("response:", response);
  //   } catch (error) {
  //     console.error("Error closing notification:", error);
  //   }
  // };

  return (
    <div id="root">
      <Header />
      <main className="content flex-grow-1">
        <div className="container">{children}</div>
      </main>
      {/* {showNotificationPopup && notification && ( */}
      {/*  <NotificationPopup */}
      {/*    notificationContent={notification?.content} */}
      {/*    onClose={handleClosePopup} */}
      {/*  /> */}
      {/* )} */}
      <Footer />
    </div>
  );
};

export default Layout;
