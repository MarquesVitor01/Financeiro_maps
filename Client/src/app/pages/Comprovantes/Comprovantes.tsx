import React from "react";
import "./Comprovantes.css";

const Comprovantes = () => {
  return (
    <div className="comprovantes">
      <div>
        <h1>Anexo de Comprovantes</h1>
      </div>
      <div>
        <div className="mb-3">
          <label htmlFor="" className="form-label">
            Nome
          </label>
          <input
            type="text"
            className="form-control"
            name=""
            id=""
            aria-describedby="helpId"
            placeholder=""
          />
        </div>
        <div className="mb-3">
          <label htmlFor="" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            name=""
            id=""
            aria-describedby="helpId"
            placeholder=""
          />
        </div>
      </div>
    </div>
  );
};

export default Comprovantes;
