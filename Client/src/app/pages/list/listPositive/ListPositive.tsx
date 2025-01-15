import React from "react";
import "./ListPositive.css";
import { Header } from "./components/Header";
import { Main } from "./components/Main";

export const ListPositive: React.FC = () => {
  return (
    <div className="content">
      <Header />
      <Main />
    </div>
  );
};
