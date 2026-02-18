export default function SearchGrid({ text, gridApi }) {
  const handleChange = (e) => {
    if (gridApi) {
      gridApi.setGridOption("quickFilterText", e.target.value);
    }
  };

  return (
    <div>
      <label htmlFor="busqueda">Buscar:</label>
      <input
        id="busqueda"
        type="text"
        placeholder={text}
        autoComplete="off"
        onChange={handleChange}
      />
    </div>
  );
}
