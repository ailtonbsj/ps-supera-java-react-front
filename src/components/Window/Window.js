import { getTransferencias } from "../../services/Transferencias.service";
import "./Window.css";
import { useState, useEffect } from "react";

export default function Window() {
  const [saldo, setSaldo] = useState("0");
  const [saldoNoPeriodo, setSaldoNoPeriodo] = useState("0");

  const LINES_PER_PAGE = 4;
  const [pages, setPages] = useState([]);
  const [page, setPage] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);

  const paginate = (arr, num) => {
    const book = [];
    let pages = -1;
    arr.forEach((item, i) => {
      if (i % num === 0) pages++;
      if (!book[pages]) book[pages] = [];
      book[pages].push(item);
    });
    return book;
  };

  const fecthTransferencias = async (query) => {
    try {
      const res = await getTransferencias(query);
      setPages(paginate(res.transferencias, LINES_PER_PAGE));
      setPageIndex(0);
      setSaldo(res.saldo);
      setSaldoNoPeriodo(res.saldoNoPeriodo);
    } catch (error) {
      alert("Problema de conexão com a API!");
    }
  };

  useEffect(() => {
    fecthTransferencias(new URLSearchParams({}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pages.length > 0) setPage(pages[0]);
    else setPage([]);
  }, [pages]);

  const loadPage = (index) => {
    if (pages.length > 0) setPage(pages[index]);
    setPageIndex(index);
  };

  const firstPage = () => {
    const index = 0;
    if (index > -1) loadPage(index);
  };

  const prevPage = () => {
    const index = pageIndex - 1;
    if (index > -1) loadPage(index);
  };

  const onClickPaginator = (e) => {
    loadPage(parseInt(e.target.getAttribute("data-key")));
  };

  const nextPage = () => {
    const index = pageIndex + 1;
    if (index < pages.length) loadPage(index);
  };

  const lastPage = () => {
    const index = pages.length - 1;
    if (index > -1) loadPage(index);
  };

  const onSearch = async () => {
    const inicio = document.getElementById("inicio").value;
    const fim = document.getElementById("fim").value;
    const operador = document.getElementById("operador").value;
    fecthTransferencias(new URLSearchParams({ inicio, fim, operador }));
  };

  return (
    <div className="Window">
      <div className="title-bar">
        <span />
        <span />
        <span />
      </div>
      <div className="content">
        <div className="inputs">
          <div>
            <label htmlFor="inicio">Data de início</label>
            <input id="inicio" type="date" />
          </div>
          <div>
            <label htmlFor="fim">Data de Fim</label>
            <input id="fim" type="date" />
          </div>
          <div>
            <label htmlFor="operador">Nome do operador transacionado</label>
            <input id="operador" type="text" />
          </div>
        </div>
        <div className="botoes">
          <button onClick={onSearch}>Pesquisar</button>
        </div>
        <div className="saldo">
          Saldo total: R$ {saldo.replace(".", ",")} &nbsp;&nbsp;&nbsp;&nbsp;
          Saldo no período: R$ {saldoNoPeriodo.replace(".", ",")}
        </div>
        <table>
          <thead>
            <tr>
              <th>Datas</th>
              <th>Valencia</th>
              <th>Tipo</th>
              <th>Nome do operador transacionado</th>
            </tr>
          </thead>
          <tbody>
            {page.map((item) => (
              <tr key={item.id}>
                <td>{item.dataTransferencia}</td>
                <td>{`R$ ${item.valor.replace(".", ",")}`}</td>
                <td>{item.tipo}</td>
                <td>{item.nomeOperadorTransacao}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4}>
                <span onClick={firstPage}>&lt;&lt;</span>
                <span onClick={prevPage}>&lt;</span>
                {pages.map((item, key) => (
                  <span
                    data-key={key}
                    key={key}
                    style={{fontWeight: pageIndex === key ? '900' : 'normal'}}
                    onClick={onClickPaginator}>
                    {key + 1}
                  </span>
                ))}
                <span onClick={nextPage}>&gt;</span>
                <span onClick={lastPage}>&gt;&gt;</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
