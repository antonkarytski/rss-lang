import React, { useMemo } from 'react';
import {Line} from 'react-chartjs-2';
import {makeStyles} from "@material-ui/core";

const options = { responsive: true, maintainAspectRatio: false };

const BarChart = (props) => {
  const { data } = props;
  const classes = useStyles();

  const dataBar = useMemo(() => ({
    // labels: data.map(({ t }) => (
    //   t.toLocaleDateString({}, {
    //     day: '2-digit', month: '2-digit', year: '2-digit',
    //   }))),
    datasets: [
      {
        label: 'Количество изученных слов за каждый день',
        backgroundColor: '#567DF4',
        borderColor: '#6979F8',
        borderWidth: 1,
        data,
      },
    ],
  }), [data]);

  return (
    <div className={classes.chart}>
      {data?.length && (
        <Line
          data={dataBar}
          options={options}
        />
      )}
    </div>
  );
};

const useStyles = makeStyles(() => ({
  chart: {
    height: '100px',
  },
}));
export default BarChart;
