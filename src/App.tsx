import { useCallback, useEffect, useState } from "react";

import { gapi } from "gapi-script";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import styles from "./App.module.scss";

const ErrorPopup = () => {
  const [visibility, setVisibility] = useState<boolean>();

  useEffect(() => {
    setVisibility(true);
    setTimeout(() => setVisibility(false), 4000);
  }, []);

  return (
    <>{visibility && <div className={styles.loginError}>Login Failed</div>}</>
  );
};

const App = () => {
  const clientId =
    "320401139116-emjb3p03su9e05cuj3s6r5r7nrd1g56h.apps.googleusercontent.com";

  const [profile, setProfile] = useState<any>();
  const [loginError, setLoginError] = useState<any>();

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: clientId,
        scope: "",
      });
    };
    gapi.load("client:auth2", initClient);
  });

  const onSuccess = useCallback(
    (res: any) => {
      setProfile(res.profileObj);
    },
    [profile]
  );

  const onFailure = useCallback((err: any) => {
    setLoginError(err);
    console.log("failed", err);
  }, []);

  const logOut = useCallback(() => {
    setProfile(null);
  }, [profile]);

  return (
    <div className={styles.authorizationWindow}>
      <h1>Test Google Authorization</h1>
      <div>
        {profile ? (
          <div className={styles.userWindow}>
            <div className={styles.userImg}>
              <img src={profile.imageUrl} alt="user image" />
            </div>
            <p>{profile.name}</p>
            <p>{profile.email}</p>
            <GoogleLogout
              clientId={clientId}
              buttonText="Log out"
              onLogoutSuccess={logOut}
            />
          </div>
        ) : (
          <GoogleLogin
            clientId={clientId}
            buttonText="Sign in with Google"
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy={"single_host_origin"}
            isSignedIn={true}
            className={styles.loginBtn}
          />
        )}
      </div>

      {loginError && <ErrorPopup />}
    </div>
  );
};

export default App;
