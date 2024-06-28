export default (
  createdsLabel,
  editedsLabel,
  deletedsLabel,
  createds,
  editeds,
  deleteds
) => {
  return {
    labels: [createdsLabel, editedsLabel, deletedsLabel],
    datasets: [
      {
        label: "Tasks",
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        data: [createds, editeds, deleteds],
      },
    ],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Stats",
        },
      },
    },
  };
};
