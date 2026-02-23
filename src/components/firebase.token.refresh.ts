import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useAppDispatch } from "src/hooks/useReduxHooks";
import { logout } from "src/services/redux/slices/auth";
import { requestClan } from "src/services/request";
import { NetworkResponse } from "src/types/request.types";
import { firebaseSignInWithUserToken } from "src/utils/firebase.utils";

const RefreshFirebaseToken = () => {
  const dispatch = useAppDispatch();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user || user === null) refreshFirebaseToken();
      if (user) {
        try {
          const tokenResult = await user.getIdTokenResult();
          const expiryTime = new Date(tokenResult.expirationTime).getTime();
          const currentTime = new Date().getTime();
          const timeLeft = expiryTime - currentTime;

          if (timeLeft <= 0) {
            // Token expired, refresh it
            refreshFirebaseToken();
          }
        } catch (error) {
          console.error("Error getting token expiration time:", error);
        }
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshFirebaseToken = async () => {
    if (isRefreshing) return; // Prevent duplicate refresh requests
    setIsRefreshing(true);

    try {
      const req: NetworkResponse = await requestClan({
        route: "/auth/firebase/token",
        type: "GET",
        showToast: false,
      });
      if (req.code === 200) {
        await firebaseSignInWithUserToken(req?.data?.firebaseToken);
      } else {
        dispatch(logout());
      }
    } catch (error) {
      console.error("Error refreshing Firebase token:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return null;
};

export default RefreshFirebaseToken;
