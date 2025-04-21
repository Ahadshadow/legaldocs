"use client";

import { useEffect, useRef } from "react";
import { setUserData } from "../lib/utils";
import { SC } from "../service/Api/serverCall";
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
export const GoogleLoginButton = (props) => {
  const divRef = useRef(null);
  useEffect(() => {
    if (window && window.google && divRef.current) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(divRef.current, {
        theme: "outline",
        size: "large",
      });
    }
  }, []);

  const handleCredentialResponse = async (response) => {
    const idToken = response.credential; // Google ID token (JWT)
    const res = await SC.postCall({
      url: "login-google",
      data: { idToken },
    });

    if (res.data.token) {
      const userData = {
        email: res.data.user.email.toLowerCase(),
        token: res.data.token,
        ...res.data.user, // Assuming the API returns additional user data
      };

      setUserData(userData);
      // Trigger a storage event to update other components
      window.dispatchEvent(new Event("storage"));

      if (props?.onSuccessfullLoginCB) {
        props.onSuccessfullLoginCB();
        return;
      }
      props.router.push("/");
    } else {
      alert("Login failed");
    }
  };

  return <div ref={divRef}></div>;
};
