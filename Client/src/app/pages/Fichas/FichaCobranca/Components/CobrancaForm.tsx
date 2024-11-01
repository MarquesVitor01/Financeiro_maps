
import React, { useEffect, useState } from "react";
import Select from "react-select";

interface Form {
    acordo: string;
    dataCobranca: string;
    dataPagamento: string;
    valorPago: string;
    encaminharCliente: string;
    operadorSelecionado: { value: string; label: string } | null;
}

interface CobrancaFormProps {
    form: Form | null;
    onSubmit: (data: Form) => void;
}

export const CobrancaForm: React.FC<CobrancaFormProps> = ({ form: initialForm, onSubmit }) => {
    const [form, setForm] = useState<Form>({
        acordo: "",
        dataCobranca: "",
        dataPagamento: "",
        valorPago: "",
        encaminharCliente: "",
        operadorSelecionado: null,
    });

    const cobranca = [
        { value: "miguel", label: "Miguel" },
        { value: "isa", label: "Isa" },
    ];

    const sairFicha = () => {
        window.history.back();
    };

    useEffect(() => {
        if (initialForm) {
            setForm(initialForm);
        }
    }, [initialForm]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSelectChange = (selectedOption: { value: string; label: string } | null) => {
        setForm((prevForm) => ({
            ...prevForm,
            operadorSelecionado: selectedOption,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };
    return (
        <div className="row">
            <div className="card card-cob d-flex justify-content-center p-4">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="acordoCobrança" className="form-label">
                        Possui acordo com a cobrança?
                    </label>
                    <select
                        className="form-select mb-3"
                        id="acordoCobrança"
                        name="acordo"
                        value={form.acordo}
                        onChange={handleInputChange}
                    >
                        <option value="">Selecione uma opção</option>
                        <option value="sim">Sim</option>
                        <option value="nao">Não</option>
                    </select>
                    <label htmlFor="dataCobranca" className="form-label">
                        Data da Cobrança:
                    </label>
                    <input
                        type="date"
                        name="dataCobranca"
                        id="dataCobranca"
                        className="form-control mb-3"
                        value={form.dataCobranca || ""}
                        onChange={handleInputChange}
                    />

                    <label htmlFor="dataPagamento" className="form-label">
                        Data do Pagamento:
                    </label>
                    <input
                        type="date"
                        name="dataPagamento"
                        id="dataPagamento"
                        className="form-control mb-3"
                        value={form.dataPagamento || ""}
                        onChange={handleInputChange}
                    />

                    <label htmlFor="valorPago" className="form-label">
                        Valor Pago:
                    </label>
                    <input
                        type="text"
                        name="valorPago"
                        id="valorPago"
                        className="form-control mb-3"
                        value={form.valorPago || ""}
                        onChange={handleInputChange}
                    />

                    <hr className="w-50 mx-auto" />

                    <div className="encaminheCob">
                        <label htmlFor="">Deseja retirar o cliente da sua fila?</label>
                        <select
                            className="form-select mb-3"
                            id="encaminharCliente"
                            name="encaminharCliente"
                            value={form.encaminharCliente}
                            onChange={handleInputChange}
                        >
                            {/* valor invertido propositalmente, para condizer com a pergunta e devolver o cliente para o financeiro */}
                            <option value="">Selecione uma opção</option>
                            <option value="sim">Não</option>
                            <option value="nao">Sim</option>
                        </select>
                    </div>
                    <div className="encaminheCob">
                        <label className="form-label">Transfira para outro cobrador:</label>
                        <Select
                            options={cobranca}
                            value={form.operadorSelecionado || null}
                            onChange={handleSelectChange}
                            isClearable
                            isSearchable
                        />
                    </div>

                    <div className="d-flex gap-3 mx-auto">
                        <button type="button" className="btn btn-danger mt-4" onClick={sairFicha}>
                            Sair
                        </button>
                        <button type="submit" className="btn btn-primary mt-4">
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
