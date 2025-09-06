/* eslint-disable react-hooks/exhaustive-deps */
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { AxiosInstance } from "../../../api/axios";

function AuthOptions({ setOption }) {
  const [loading, setLoading] = useState({
    google: false,
    facebook: false,
    twitter: false,
  });
  const navigate = useNavigate();
  let tokenClient = null;

  // Initialize Google OAuth client
  useEffect(() => {
    if (window.google) {
      tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id:
          "165272386548-8ervo4je9f2qe3tdhqrukcdu05u4lole.apps.googleusercontent.com",
        scope:
          "openid profile email https://www.googleapis.com/auth/userinfo.email",
        callback: async (tokenResponse) => {
          const accessToken = tokenResponse.access_token;
          if (accessToken) {
            const userInfo = await fetch(
              "https://www.googleapis.com/oauth2/v3/userinfo",
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            ).then((res) => res.json());
            Cookies.set("token", `Bearer ${accessToken}`);
            Cookies.set("username", userInfo.name);
            await handleSocialLogin(
              {
                username: userInfo.name,
                token: `Bearer ${accessToken}`,
                social_media_site: "google",
                email: userInfo.email,
                is_social: "True",
              },
              "google"
            );
          }
        },
      });
    }
  }, []);

  useEffect(() => {
    if (!window.fbAsyncInit) {
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: "599678379745870",
          cookie: true,
          xfbml: true,
          version: "v23.0", // Must be a valid version string
          autoLogAppEvents: true,
        });
        console.log("Facebook SDK initialized");
      };

      // Load SDK Asynchronously
      (function (d, s, id) {
        var js,
          fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        js.onerror = () => console.error("Failed to load Facebook SDK");
        fjs.parentNode.insertBefore(js, fjs);
      })(document, "script", "facebook-jssdk");
    }

    return () => {
      // Cleanup
      delete window.fbAsyncInit;
      delete window.FB;
    };
  }, []);

  // 2. Proper Facebook Login Handler
  const handleFacebookLogin = () => {
    if (!window.FB) {
      console.error("Facebook SDK not loaded yet");
      return;
    }

    window.FB.getLoginStatus((response) => {
      console.log("Current login status:", response);

      window.FB.login(
        (loginResponse) => {
          if (loginResponse.authResponse) {
            console.log("Welcome! Fetching your information....");
            window.FB.api("/me", { fields: "name,email" }, (userResponse) => {
              console.log(JSON.stringify(userResponse));
              // Send to your backend
              Cookies.set(
                "token",
                `Bearer ${loginResponse.authResponse.accessToken}`
              );
              Cookies.set("username", userResponse.name);
              handleSocialLogin(
                {
                  username: userResponse.name,
                  token: `Bearer ${loginResponse.authResponse.accessToken}`,
                  social_media_site: loginResponse.authResponse.graphDomain,
                  email: userResponse.email,
                  is_social: "True",
                },
                "facebook"
              );
            });
          } else {
            console.log("User cancelled login or did not fully authorize.");
          }
        },
        { scope: "public_profile,email" }
      );
    });
  };

  const handleSocialLogin = async (payload, provider) => {
    setLoading((prev) => ({ ...prev, [provider]: true }));
    console.log(payload);
    try {
      await AxiosInstance.post("/login-social", payload);
      navigate("/dashboard");
    } catch (error) {
      console.error(
        `${provider} login failed`,
        error.response?.data || error.message
      );
    } finally {
      setLoading((prev) => ({ ...prev, [provider]: false }));
    }
  };

  const handleGoogleLogin = () => {
    tokenClient?.requestAccessToken();
  };

  const handleXLogin = () => {
    setLoading((prev) => ({ ...prev, x: true }));

    const CLIENT_ID = "ZGdhMWdrS0dMSDN4RExzYXV6WDI6MTpjaQ";
    const REDIRECT_URI = "http://localhost:5173/"; // URI مسجّل في X
    const SCOPE = "tweet.read users.read offline.access";
    const STATE = Math.random().toString(36).substring(2, 15); // random string
    const CODE_CHALLENGE_METHOD = "plain";
    const CODE_CHALLENGE = Math.random().toString(36).substring(2, 15);

    const params = new URLSearchParams({
      response_type: "code",
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope: SCOPE,
      state: STATE,
      code_challenge: CODE_CHALLENGE,
      code_challenge_method: CODE_CHALLENGE_METHOD,
    });

    window.location.href = `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) return;
    console.log(code);
    handleSocialLogin(
      {
        code,
      },
      "X"
    );
  }, []);

  return (
    <div className="wayBtns">
      <div className="wayBox">
        <div>
          <img className="logo" src="/logo.png" alt="" />
        </div>
        <h1>Log in or sign up</h1>
        <p>Use your email or other service to continue with us</p>
        <div className="socialBtns">
          {/* Google Button */}
          <button onClick={handleGoogleLogin} disabled={loading.google}>
            <img src="/media/social-icons/google.svg" alt="Google" />
            Continue with Google
            {loading.google && <span className="loader"></span>}
          </button>

          {/* Facebook Button */}
          <button onClick={handleFacebookLogin} disabled={loading.facebook}>
            <img src="/media/social-icons/facebook.svg" alt="Facebook" />
            Continue with Facebook
            {loading.facebook && <span className="loader"></span>}
          </button>

          {/* Apple Button */}
          <button disabled>
            <img src="/media/social-icons/apple.svg" alt="Apple" />
            Continue with Apple
          </button>

          {/* Twitter Button */}
          <button onClick={handleXLogin} disabled={loading.twitter}>
            <img src="/media/social-icons/twitter.svg" alt="Twitter" />
            Continue with Twitter
            {loading.twitter && <span className="loader"></span>}
          </button>

          {/* Email Button */}
          <button onClick={() => setOption("login")}>
            <img src="/media/social-icons/email.svg" alt="Email" />
            Continue with Email
          </button>
        </div>
        <div className="w100">
          By continuing, you agree to kitaba's{" "}
          <Link className="linearText" to="/terms">
            Terms of Use
          </Link>
          . Read our{" "}
          <Link className="linearText" to="/privacy-policy">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AuthOptions;
