
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App.tsx";
import "./index.css";

// Replace these with your actual Auth0 credentials
const domain = import.meta.env.VITE_AUTH0_DOMAIN || "dev-b1inue281c0hoyp5.ca.auth0.com";
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || "your-actual-client-id-here";

if (domain === "dev-example.us.auth0.com" || clientId === "your-client-id" || clientId === "your-actual-client-id-here") {
  console.error("Please set your Auth0 credentials in main.tsx or as environment variables");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <App />
    </Auth0Provider>
  </StrictMode>
);
