import React from "react";
import App from "./../App";

// Import drizzle functions (using latest 1.5+)
import { Drizzle, generateStore } from "@drizzle/store"; // fka: drizzle
import { DrizzleProvider } from "@drizzle/react-plugin"; // fka: drizzle-react

// Import Rimble's ProgressAlert utility and its redux store to manage transaction alerts
import store from "./../core/middleware";

// Let drizzle know what contracts we want and how to access our test blockchain
import drizzleOptions from "./../drizzleOptions";

// Setup drizzle
const drizzleStore = generateStore(drizzleOptions);
const drizzle = new Drizzle(drizzleOptions, drizzleStore);

const DrizzleLoader = () => {
  const hasWeb3Provider = () => {
    const hasWeb3Provider = typeof window.ethereum !== "undefined";
    return hasWeb3Provider;
  };

  return hasWeb3Provider() ? (
    <DrizzleProvider store={store} options={drizzleOptions}>
      <App drizzle={drizzle} store={store} />
    </DrizzleProvider>
  ) : (
    <App drizzle={null} />
  );
};

export default DrizzleLoader;
