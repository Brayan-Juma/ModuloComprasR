import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import "../styles/Facturas.css";

const Facturas = () => {
  const [facturas, setFacturas] = useState([]);
  const [searchType, setSearchType] = useState("proveedor_id");
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/facturas");
        const data = await response.json();
        setFacturas(data);
        setPageCount(Math.ceil(data.length / itemsPerPage));
      } catch (error) {
        console.error("Error fetching facturas:", error);
      }
    };

    fetchFacturas();
  }, []);

  const handleAddFactura = () => {
    navigate("/facturas/detalle-factura");
  };

  const handleEdit = (factura) => {
    navigate(`/facturas/detalle-factura/${factura.id}`);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/facturas/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }
      setFacturas(facturas.filter((factura) => factura.id !== id));
    } catch (error) {
      console.error("Error deleting factura:", error);
    }
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const filteredFacturas = facturas.filter((factura) => {
    if (searchType === "proveedor_id") {
      return factura.proveedor_id.toString().includes(searchValue);
    } else if (searchType === "fecha") {
      return factura.fecha.includes(searchValue);
    }
    return true;
  });

  const offset = currentPage * itemsPerPage;
  const currentFacturas = filteredFacturas.slice(offset, offset + itemsPerPage);

  return (
    <div className="content">
      <div className="container">
        <h2>Lista de Facturas</h2>
        <button onClick={handleAddFactura}>Agregar Factura</button>
        <div className="search-bar">
          <select
            value={searchType}
            onChange={(e) => {
              setSearchType(e.target.value);
              setSearchValue(""); // Resetear el valor de búsqueda al cambiar el tipo de búsqueda
            }}
          >
            <option value="proveedor_id">Proveedor ID</option>
            <option value="fecha">Fecha</option>
          </select>
          <input
            type={searchType === "fecha" ? "date" : "text"}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={`Buscar por ${
              searchType === "proveedor_id" ? "Proveedor ID" : "Fecha"
            }`}
          />
        </div>

        <div className="facturas-table-container">
          <table className="facturas-table">
            <thead>
              <tr>
                <th>Editar</th>
                <th>Eliminar</th>
                <th>ID</th>
                <th>Fecha</th>
                <th>Proveedor ID</th>
                <th>Tipo de Pago</th>
                <th>Fecha de Vencimiento</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {currentFacturas.map((factura) => (
                <tr key={factura.id}>
                  <td>
                    <button className="editar" onClick={() => handleEdit(factura)}>
                      Editar
                    </button>
                  </td>
                  <td>
                    <button className="eliminar" onClick={() => handleDelete(factura.id)}>
                      Eliminar
                    </button>
                  </td>
                  <td>{factura.id}</td>
                  <td>{new Date(factura.fecha).toLocaleDateString()}</td>
                  <td>{factura.proveedor_id}</td>
                  <td>{factura.tipo_pago}</td>
                  <td>
                    {factura.fecha_vencimiento
                      ? new Date(factura.fecha_vencimiento).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>{factura.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ReactPaginate
          previousLabel={"<"}
          nextLabel={">"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
      </div>
    </div>
  );
};

export default Facturas;
