"use client";

import { useEffect, useRef, useState } from "react";
import { setUserData } from "../lib/utils";
import { SC } from "../service/Api/serverCall";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export const GoogleLoginButton = (props) => {
  const divRef = useRef(null);
  const [authenticating, setAuthenticating] = useState(false); // Login API state

  useEffect(() => {
    if (window && window.google && divRef.current) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(divRef.current, {
        theme: "outline",
        size: "large",
        text: props?.mode === "singup" ? "signup_with" : "signin_with",
      });
    }
  }, []);

  const handleCredentialResponse = async (response) => {
    setAuthenticating(true);
    const idToken = response.credential;

    try {
      const res = await SC.postCall({
        url: "login-google",
        data: { idToken },
      });

      if (res.data.token) {
        const userData = {
          email: res.data.user.email.toLowerCase(),
          token: res.data.token,
          ...res.data.user,
        };

        setUserData(userData);
        window.dispatchEvent(new Event("storage"));

        if (props?.onSuccessfullLoginCB) {
          props.onSuccessfullLoginCB();
          return;
        }
        props.router.push("/");
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.error("Login error", error);
      alert("Something went wrong");
    } finally {
      setAuthenticating(false);
    }
  };

  return (
    <>
      {(authenticating && (
        <div className="mt-2 text-sm ">Authenticating...</div>
      )) || <div ref={divRef}></div>}
    </>
  );
};
