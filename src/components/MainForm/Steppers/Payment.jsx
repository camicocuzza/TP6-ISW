import React from 'react';
import {
  Typography,
  Grid,
  TextField,
  InputLabel,
  Select,
  MenuItem,  
  useTheme,
  InputAdornment
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MaskedInput from 'react-text-mask';
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillAlt, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { faCcVisa, faCcMastercard } from '@fortawesome/free-brands-svg-icons';
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
        /[4-5]/,
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
const Payment = ({ orderData, handleChange, errors, touched,setAmount,amount }) => {
  const theme = useTheme();
  const classes = useStyles();
 /* -------------metodos de pago --------------------- */
  return (
    <>
      <Typography variant="h6" gutterBottom>
        M??todo de pago
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
           Total a pagar: ${orderData.precioAcumulado+orderData.precioServicio}
        </Typography>
        </Grid>
        </>
         ):(null)}
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
          <Grid item xs={12} md={12}>
            <TextField
              id="cardName"
              name="cardName"
              error={touched.cardName && Boolean(errors.cardName)}
              helperText={touched.cardName && errors.cardName}
              label="Nombre y apellido del titular"
              value={orderData.cardName}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="cardNumber"
              id="cardNumber"
              error={touched.cardNumber && Boolean(errors.cardNumber)}
              helperText={touched.cardNumber && errors.cardNumber}
              label="N??mero de tarjeta"
              placeholder="XXXX XXXX XXXX XXXX"
              onChange={handleChange}
              value={orderData.cardNumber}
              fullWidth
              InputProps={{
                inputComponent: VisaMask,
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
              helperText={touched.expDate && errors.expDate}
              label="Fecha de expiraci??n"
              fullWidth
              onChange={handleChange}
              value={orderData.expDate}
              InputProps={{
                inputComponent: ExpDateMask,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="cvv"
              name="cvv"
              label="CVV"
              error={touched.cvv && Boolean(errors.cvv)}
              helperText={touched.cvv && errors.cvv}
              placeholder="C??digo de seguridad"
              onChange={handleChange}
              value={orderData.cvv}
              fullWidth
              InputProps={{
                inputComponent: CVVMask,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="dni"
              name="dni"
              error={touched.dni && Boolean(errors.dni)}
              helperText={touched.dni && errors.dni}
              label="DNI del titular"
              onChange={handleChange}
              value={orderData.dni}
              fullWidth
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
             helperText={touched.amount && errors.amount}
              onChange={handleChange}
              value={orderData.amount}
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                min: '0',
              }}
            />

          </Grid>
           
        </Grid>
        
      )}
     
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
