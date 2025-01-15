import React from "react";
import "./Home.css";
import { Header } from "./components/Header";
import { Main } from "./components/Main";

export const Home: React.FC = () => {
  return (
    <div className="content">
      <Header />
      <Main />
    </div>
  );
};
