import React from 'react';
import {
  Typography,
  Grid,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  useTheme,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MaskedInput from 'react-text-mask';
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillAlt, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { faCcVisa, faCcMastercard } from '@fortawesome/free-brands-svg-icons';

import { useState, useRef, useEffect } from "react";
import Cards from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";

import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  fileLabel: {
    marginBottom: theme.spacing(1),
  },
  divider: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
}));

const VisaMask = (props) => {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[
        /[4/5]/,
        /\d/,
        /\d/,
        /\d/,
        ' ',
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        ' ',
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        ' ',
        /\d/,
        /\d/,
        /\d/,
        /\d/,
      ]}
      guide={false}
      keepCharPositions
      showMask
    />
  );
};
const MastercardMask = (props) => {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[
        /5/,
        /\d/,
        /\d/,
        /\d/,
        ' ',
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        ' ',
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        ' ',
        /\d/,
        /\d/,
        /\d/,
        /\d/,
      ]}
      guide={false}
      keepCharPositions
      showMask
    />
  );
};
VisaMask.propTypes = {
  inputRef: PropTypes.any.isRequired,
};
MastercardMask.propTypes = {
  inputRef: PropTypes.any.isRequired,
};
const ExpDateMask = (props) => {
  const { inputRef, ...other } = props;
  const autoCorrectedDatePipe = createAutoCorrectedDatePipe('mm/dd/yyyy HH:MM');
  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[/\d/, /\d/, '/', /\d/, /\d/]}
      guide={false}
      keepCharPositions
      showMask
      pipe={autoCorrectedDatePipe}
    />
  );
};
ExpDateMask.propTypes = {
  inputRef: PropTypes.any.isRequired,
};
const CVVMask = (props) => {
  const { inputRef, ...other } = props;
  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[/\d/, /\d/, /\d/, /\d/]}
      guide={false}
      keepCharPositions
      showMask
    />
  );
};
CVVMask.propTypes = {
  inputRef: PropTypes.any.isRequired,
};
const Payment = ({ orderData, handleChange, errors, touched, setAmount, amount }) => {
  const theme = useTheme();
  const classes = useStyles();
  const ref = useRef(null);


  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [focus, setFocus] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expDate, setExpDate] = useState("");
  const [cvv, setCvv] = useState("");


  useEffect(() => {
    // ref.current.focus();
  }, []);


  const handleChangeAmount = (e) => {
    setAmount(e.target.value)
  }

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Método de pago
      </Typography>
      <Grid container spacing={3}>
        {orderData.precioAcumulado > 0 ? (
          <>
            <Grid item xs={12}>
              <Typography variant="h7" gutterBottom className={classes.title}>
                Precio del servicio: ${orderData.precioServicio}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h7" gutterBottom className={classes.title}>
                Total a pagar: ${orderData.precioAcumulado + orderData.precioServicio}
              </Typography>
            </Grid>
          </>
        ) : (null)}
        <Grid item xs={12}>
          <InputLabel className={classes.fileLabel}>Indique forma de pago</InputLabel>
          <Select
            fullWidth
            name="cash"
            id="cash"
            error={touched.cash && Boolean(errors.cash)}
            value={orderData.cash}
            onChange={handleChange}
          >
            <MenuItem value>
              <FontAwesomeIcon
                style={{ marginRight: 5 }}
                icon={faMoneyBillAlt}
                color={theme.palette.secondary.main}
              />
              Efectivo
            </MenuItem>
            <MenuItem value={false}>
              <FontAwesomeIcon
                style={{ marginRight: 5 }}
                icon={faCreditCard}
                color={theme.palette.secondary.main}
              />
              Tarjeta
            </MenuItem>
          </Select>
        </Grid>
      </Grid>
      {!orderData.cash ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={2}>
            <Cards
              number={cardNumber}
              name={cardName}
              expiry={expDate}
              cvc={cvv}
              focused={focus}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              id="cardName"
              name="cardName"
              error={touched.cardName && Boolean(errors.cardName)}
              label="Nombre y apellido del titular"
              // value={orderData.cardName}
              // onChange={handleChange}
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              onFocus={(e) => setFocus(e.target.name)}
              ref={ref}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="cardNumber"
              id="cardNumber"
              error={touched.cardNumber && Boolean(errors.cardNumber)}
              label="Número de tarjeta"
              helperText="XXXX XXXX XXXX XXXX"
              fullWidth
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              onFocus={(e) => setFocus(e.target.name)}
              ref={ref}
              InputProps={{
                inputComponent: VisaMask, MastercardMask,
              }}
            />
            <FontAwesomeIcon size="2x" icon={faCcVisa} color={theme.palette.secondary.main} />
            <FontAwesomeIcon size="2x" icon={faCcMastercard} color={theme.palette.secondary.main} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="expDate"
              name="expDate"
              error={touched.expDate && Boolean(errors.expDate)}
              label="Fecha de expiración"
              fullWidth
              value={expDate}
              onChange={(e) => setExpDate(e.target.value)}
              onFocus={(e) => setFocus(e.target.name)}
              InputProps={{
                inputComponent: ExpDateMask,
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              id="dni"
              name="dni"
              error={touched.dni && Boolean(errors.dni)}
              label="DNI del titular"
              onChange={handleChange}
              onFocus={(e) => setFocus(e.target.name)}
              value={orderData.dni}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              type="tel"
              name="cvc"
              error={touched.cvv && Boolean(errors.cvv)}
              label="CVV"
              helperText="Código de seguridad"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              onFocus={(e) => setFocus(e.target.name)}
              fullWidth
              InputProps={{
                inputComponent: CVVMask,
              }}
            />
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              id="amount"
              name="amount"
              label="Monto con el que va a pagar"
              type="number"
              error={touched.amount && Boolean(errors.amount)}
              onChange={handleChangeAmount}
              value={amount}
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                min: '0',
              }}
            />
          </Grid>
        </Grid>
      )}
      {amount < (orderData.precioAcumulado + orderData.precioServicio) ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h7" gutterBottom className={classes.title}>
              No le alcanza para pagar. Coloque un monto mayor.
            </Typography>
          </Grid>
        </Grid>
      ) : (null)}
    </>
  );
};

Payment.propTypes = {
  orderData: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  touched: PropTypes.any.isRequired,
  errors: PropTypes.any.isRequired,
};

export default Payment;
