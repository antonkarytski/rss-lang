import React, { useMemo } from 'react';
import {Line} from 'react-chartjs-2';
import {makeStyles} from "@material-ui/core";

const options = { responsive: true, maintainAspectRatio: false };

const BarChart = (props) => {
  const { data } = props;
  const classes = useStyles();

  const dataBar = useMemo(() => ({
    labels: data?.map(({ t }) => (
      t.toLocaleDateString({}, {
        day: '2-digit', month: '2-digit', year: '2-digit',
      }))),
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
    height: '300px',
    backgroundColor: '#89eab0',
    padding: '30px',
    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 25%), 0 2px 4px 1px rgb(0 0 0 / 20%), 0 4px 8px 2px rgb(0 0 0 / 15%), 0 8px 16px 4px rgb(0 0 0 / 10%)',
    borderRadius: '40px',
  },
}));
export default BarChart;
