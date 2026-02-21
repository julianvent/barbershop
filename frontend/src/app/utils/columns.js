export const defaultColDef = {
  resizable: true,
  sortable: true,
  flex: 2,
  minWidth: 100,
};

export const actionsDef = {
  headerName: "Acciones",
  field: "id",
  suppressKeyboardEvent: (params) => {
    const { event } = params;

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || 
        event.key === 'Enter' || event.key === ' ' || 
        event.key === 'Tab') {
      return true; 
    }else {
      return false;
    }
  },
  cellStyle: { 
    overflow: 'visible',
    padding: '4px'
  },
  flex: 1,
};

export const appointmentColumns = (isAdmin) => {
  
  const fields = [
  {
    headerName: "Fecha",
    field: "date",
    sortable: true,

    valueFormatter: (params) => {
      if (!params.value) return "";

      const date = new Date(params.value);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    },

    getQuickFilterText: (params) => {
      if (!params.value) return "";

      const date = new Date(params.value);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    },

    comparator: (valueA, valueB) => {
      if (!valueA) return -1;
      if (!valueB) return 1;

      return new Date(valueA) - new Date(valueB);
    }
  },
  {
    headerName: "Hora",
    field: "time",
    width: 100,
  },
  {
    headerName: "Cliente",
    field: "customer_name",
    width: 200,
  },
  {
    headerName: "Teléfono",
    field: "customer_phone",
    width: 150,
  },
];

export const serviceFields = (isAdmin) => {
  const fields =[
    {
      headerName: "Nombre",
      field: "name",
    },
    {
      headerName: "Precio",
      field: "price",
      valueFormatter: (params) => `$${params.data.price.toFixed(2)}`,
    },
    {
      headerName: "Duración aproximada",
      field: "duration",
      valueFormatter: (params) =>
        Math.floor(params.data.duration / 60) >= 1
          ? Math.floor(params.data.duration / 60) +
            " hr " +
            (params.data.duration % 60) +
            " minutos"
          : params.data.duration + " minutos",
    },
    {
      headerName: "Tipo",
      field: "type",
    },
  ]

  if (isAdmin){
    fields.push({
      headerName: "Establecimiento",
      valueFormatter: (params) => params.data.Establishment.name
    })
  }

  return fields;
};

  if (isAdmin) {

    const getEstablishmentText = (params) => {
      const services = params?.data?.establishment_services;

      if (!Array.isArray(services) || services.length === 0) {
        return "No asignado";
      }

      if (services.length > 1) {
        return "Todos los locales";
      }

      const first = services[0];

      if (!first || !first.establishment_name) {
        return "No asignado";
      }

      return first.establishment_name;
    };

    fields.push({
      headerName: "Establecimiento",
      width: 150,
      valueGetter: getEstablishmentText,
      getQuickFilterText: getEstablishmentText,
    });
  }

  return fields;
}

export const employeesEntries = (isAdmin) => {
  const fields = [
    {
      headerName: "Nombre Completo",
      field: "barber_name",
    },
    {
      headerName: "Telefono",
      field: "phone",
    },
    {
      headerName: "Correo",
      field: "email",
    },
  ];

  if(isAdmin){
    fields.push(
      {
        headerName: "Establecimiento",
        field: "establishment_name"
      }
    )
  }

  return fields;
}

export const appointments_fields = [
  {
    headerName: "Nombre",
    field: "customer_name",
  },
  {
    headerName: "Barbero asignado",
    field: "barber_name",
  },
  {
    headerName: "Estado",
    field: "status",
  },
  {
    headerName: "Horario programado",
    field: "date",
  },
];


export const serviceListFields = [
  {
    headerName: "Nombre",
    field: "name",
  },
  {
    headerName: "Precio",
    field: "precio",
  },
  {
    headerName: "Duracion Aproximada",
    field: "duracion",
  },
  {
    headerName: "Tipo",
    field: "tipo",
  },
];

export const establishmentsFields = [
  {
    headerName: "Nombre del establecimiento",
    field: "name"
  },
  {
    headerName: "Calle",
    field: "street",
  },
  {
    headerName: "Codigo Postal",
    field: "postal_code"
  },
  {
    headerName: "Numero Telefonico",
    field: "phone_number"
  }
];

export const accountsFields = [
  {
    headerName: "Nombre de la cuenta",
    field: "full_name"
  },
  {
    headerName: "Correo",
    field: "email"
  },
];