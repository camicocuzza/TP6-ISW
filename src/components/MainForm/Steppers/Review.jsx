import React from 'react';
import { Typography, Grid, InputLabel } from '@mui/material';
import { useTheme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCcVisa, faCcMastercard } from '@fortawesome/free-brands-svg-icons';


const useStyles = makeStyles((theme) => ({
  title: {
    marginTop: theme.spacing(2),
  },
}));

const Review = ({ orderData, amount }) => {
  const theme = useTheme();
  const classes = useStyles();
  return (
    <>
      <Typography variant="h5" gutterBottom>
        Resumen del pedido
      </Typography>
      <Typography variant="h6" gutterBottom className={classes.title}>
        Productos en Carrito
      </Typography>
      <Typography gutterBottom>
        {orderData.carrito.map((carr) => (
          <InputLabel value={carr}>{carr}</InputLabel>
        ))}
      </Typography>
      <Typography variant="h7" gutterBottom className={classes.title}>
        Total a pagar: ${orderData.precioAcumulado + orderData.precioServicio}
      </Typography>
      <Typography gutterBottom></Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            Dirección de entrega
          </Typography>
          <Typography gutterBottom>
            {`${orderData.addressDelivery} ${orderData.numberDelivery} - ${orderData.cityDelivery}`}
          </Typography>
          {orderData.referenceDelivery && (
            <Typography gutterBottom>
              {`Datos de referencia: ${orderData.referenceDelivery}`}
            </Typography>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            Tipo de entrega
          </Typography>
          {orderData.immediately ? (
            <Typography gutterBottom>Lo antes posible</Typography>
          ) : (
            <>
              <Typography gutterBottom>Programada</Typography>
              <Typography gutterBottom>
                {`Fecha y hora de entrega: ${orderData.date.toLocaleString('es-AR')}`}
              </Typography>
            </>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            Método de Pago
          </Typography>
          {orderData.cash ? (
            <>
              <Typography gutterBottom>{`Efectivo`}</Typography>
              <Typography gutterBottom>{`Paga con: $${orderData.amount}`}</Typography>
              <Typography gutterBottom>{`Vuelto: $${orderData.amount - (orderData.precioAcumulado+orderData.precioServicio)}`}</Typography>
            </>
          ) : (
            <>
              <Typography gutterBottom>Tarjeta de Crédito</Typography>
              
              <Typography gutterBottom>{`Titular: ${orderData.cardName}`}</Typography>
              
              <Typography gutterBottom>
                {`Número: XXXX-XXXX-XXXX-${orderData.cardNumber.substr(
                  orderData.cardNumber.length - 4,
                )}`}
                {orderData.cardNumber.substr(0, 1) === '4' ? (
                  <FontAwesomeIcon size="3x" icon={faCcVisa} color={theme.palette.secondary.main} />
                ) : (
                  <FontAwesomeIcon size="3x" icon={faCcMastercard} color={theme.palette.secondary.main} />
                )}
              </Typography>
              <Typography gutterBottom>{`Fecha de Vencimiento: ${orderData.expDate}`}</Typography>
              <br></br>

            </>

          )}
        </Grid>
      </Grid>
    </>
  );
};

Review.propTypes = {
  orderData: PropTypes.object.isRequired,
};

export default Review;
