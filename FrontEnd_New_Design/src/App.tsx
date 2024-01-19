import React, { FC, useState } from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import MainRoutes from "./routes/MainRoutes";
import { useGlobalContext } from "./Context/GlobalContext";
import Auth from "./Container/Auth/Auth";
import Message from "./Components/Messages/Message";
import Loading from "./Layout/Loading";
import LoadingBar from "react-top-loading-bar";

const App: FC = () => {
  const [progress, setProgress] = useState(0);
  const [loadingScreen, setLoadScreen] = useState(true);

  const setLoading = (barProgress: number, loadingScreen: boolean) => {
    setProgress(barProgress);
    setLoadScreen(loadingScreen);
  };
  return (
    <>
      <Auth>
        <LoadingBar
          color="#f11946"
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
        />
        <Loading isLoading={loadingScreen} />
        <Message />
        <MainRoutes loading={setLoading} />
      </Auth>
    </>
  );
};

export default App;
