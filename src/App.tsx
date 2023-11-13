import { FC, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import "./App.scss";
import "./components/Button/index.scss";

import Header from "./components/Header";

const App: FC = () => {
  const locationOnLoad = document.location.href.split("/")[3];
  const navigate = useNavigate();

  useEffect(() => {
    if (locationOnLoad.length === 0) {
      navigate("/welcome");
    }
  }, [locationOnLoad]);

  return (
    <>
      <Header />
      <div className="container">
        <Outlet />
      </div>
    </>
  );
  /*
   * Необходимо реализовать хедер, общий контейнер под контент и настройки в главном компоненте роутера,
   * в данный компонент будут помещаться все другие компоненты страничек со своими дочерними элементами.
   * Поэтому, необходимо подготовить для этого всего почву.
   * */
};

export default App;
