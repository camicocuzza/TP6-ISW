import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Stepper, StepLabel, Step, Button, Grid, StepContent } from '@mui/material';
import * as yup from 'yup';
import { useFormik } from 'formik';
import OrderData from './Steppers/OrderData';
import Review from './Steppers/Review';
import Payment from './Steppers/Payment';
import DeliveryAddress from './Steppers/DeliveryAddress';

const useStyles = makeStyles((theme) => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(5),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));
const oldDate = new Date();
const newDate = new Date(oldDate.setMinutes(oldDate.getMinutes() + 60)) ;

const initialOrderData = {
  comercio: '',
  carrito: [],
  producto: '',
  precio: 0,
  precioServicio: 500,
  cantidad: 1,
  precioAcumulado: 0,
  addressDelivery: '',
  numberDelivery: '',
  cityDelivery: '',
  referenceDelivery: '',
  mapActive: false,
  immediately: true,
  date: newDate,
  amount: '',
  cardNumber: '',
  cardName: '',
  expDate: '',
  cvv: '',
  dni: '',
};

const steps = ['Datos del Pedido', 'Dirección del Pedido', 'Método de Pago', 'Resumen'];

const MainForm = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [arrayNoVacio, setArrayNoVacio] = useState(false);
  const [precioAcumulado, setPrecioAcumulado] = useState(0);
  const [amount, setAmount] = useState();
  const [orderData, setOrderData] = useState(initialOrderData);

  const validationSchema = [
    yup.object().shape({
      comercio: yup.string().required("Seleccione un comercio"),
      producto: yup.string(),
      cantidad: yup.number().positive("Debe ser un numero positivo").min(1, "Debe ingresar como mínimo 1").integer("Debe ser un numero entero"),
    }),
    yup.object().shape({
      addressDelivery: yup.string().required("Debe colocar una calle."),
      numberDelivery: yup.number().required("Debe colocar número.").positive('Ingrese número válido'),
      cityDelivery: yup.string().required("Debe seleccionar una ciudad."),
      referenceDelivery: yup.string(),
      immediately: yup.boolean(),
      date: yup.date().when('immediately', {
        is: false,
        then: yup.date().min(new Date(), "La fecha y hora deben ser mayores a la fecha y hora actuales.").required(),
      }),
    }),
    yup.object().shape({
      cash: yup.boolean().required(),
      amount: yup.number().when('cash', {
        is: true,
        then: yup.number().min(precioAcumulado+500,'No le alcanza para pagar (mínimo $' + parseInt(precioAcumulado+500) + ')')
        .max(precioAcumulado+500+1000,'El monto ingresado es muy elevado (máximo $' + parseInt(precioAcumulado+500+1000) + ')').required('El monto es requerido'),
      }),
      cardNumber: yup.string().when('cash', {
        is: false,
        then: yup.string().required('Ingrese número de tarjeta').length(19, 'Ingrese número de tarjeta válido'),
      }),
      cardName: yup.string().when('cash', {
        is: false,
        then: yup.string().required('Ingrese nombre del titular'),
      }),
      expDate: yup.string().when('cash', {
        is: false,
        then: yup
          .string()
          .test('is-exp-date', 'Ingrese fecha de expiración válida', (value) => {
            if (value) {
              const month = Number(value.substr(0, 2));
              const year = Number(value.substr(value.length - 2));
              const currentYear = Number(new Date().getFullYear().toString().substr(2));
              const currentMonth = Number((new Date().getMonth() + 1).toString());
  
              if (year > currentYear) {
                return true;
              }
              if (year === currentYear && month >= currentMonth) {
                return true;
              }
            }
            return false;
          })
          .length(5)
          .required(),
      }),
      cvv: yup.string().when('cash', {
        is: false,
        then: yup
          .string()
          .test('is-cvv', 'Ingrese CVV válido', (value) => {
            if (value && (value.length === 3 || value.length === 4)) {
              return true;
            }
            return false;
          })
          .required('Ingrese CVV'),
      }),
      dni: yup.string().when('cash', {
        is: false,
        then: yup.string().required('Ingrese DNI'),
      }),
    }),
  ];
  const handleSelectedDate = (e) => {
    setOrderData((prevState) => ({ ...prevState, date: e }));
    console.log(orderData);
  };


  const handleNext = () => {
    
    
    if (activeStep === 0 && arrayNoVacio === true) {
      setActiveStep(activeStep + 1);
    }
    if (activeStep === 1) {
      setActiveStep(activeStep + 1);
    }
    if (activeStep === 2) {
      setActiveStep(activeStep + 1);
    }
    if (activeStep === 3) {
      setActiveStep(activeStep + 1);
    }
    console.log("Acumulado: " + precioAcumulado);
    console.log("Amount: " + amount);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  const handleSubmitForm = (values, { resetForm }) => {
    if (activeStep === 3) {
      handleNext();
      resetForm({});
    } else {
      handleNext();
    }
  };

  const { handleChange, handleSubmit, values, errors, touched, setFieldValue } = useFormik({
    initialValues: initialOrderData,
    validationSchema: validationSchema[activeStep],
    onSubmit: handleSubmitForm,
  });
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <OrderData
            orderData={values}
            handleChange={handleChange}
            setFieldValue={setFieldValue}
            errors={errors}
            touched={touched}
            handleSelectedDate={handleSelectedDate}
            arrayNoVacio={arrayNoVacio}
            setArrayNoVacio={setArrayNoVacio}
            setPrecioAcumulado={setPrecioAcumulado}
            // isDisabled{isDisabled}
            // setIsDisabled{setIsDisabled}
          />
        );
      case 1:
        return (
          <DeliveryAddress
            orderData={values}
            setFieldValue={setFieldValue}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleSelectedDate={handleSelectedDate}
          />
        );
      case 2:
        return (
          <Payment
            orderData={values}
            setFieldValue={setFieldValue}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            setAmount={setAmount}
            amount={amount}
          />
        );
      case 3:
        return <Review orderData={values} amount={amount} />;
      default:
        throw new Error('Unknown step');
    }
  };

  const handleOtroPedido = () => {
    setActiveStep(0);
    setArrayNoVacio(false);
    setPrecioAcumulado(0);
    setAmount('')
    setOrderData(initialOrderData)
    orderData.carrito=[]

  };

  return (
    <div className={classes.layout}>
      <>
        {activeStep === steps.length ? (
          <>
            <Grid container direction="column" alignItems="center" justify="center">
              <Grid item>
                <br></br><br></br>
                <Typography variant="h5" align="center" gutterBottom>
                  ¡Gracias por realizar tu pedido!
                </Typography>
              </Grid>
              <Grid item>
                <img src="images/tilde.jpg" alt="tilde" align="center" width={250} />
              </Grid>
              <Grid item>
                <Typography variant="subtitle1" align="center">
                  Gracias por su compra. Su pedido está siendo preparado!
                </Typography>
              </Grid>
            </Grid>
            <br></br>
            <div className={classes.buttons}>
              <Button onClick={() => handleOtroPedido()} className={classes.button}>
                Realizar otro pedido
              </Button>
            </div>
          </>
        ) : (
          <><br/><br/>
            <Typography component="h1" variant="h5" align="center" gutterBottom>
              <b> Pedí a tu comercio adherido favorito</b>
            </Typography>
            <Typography component="h1" variant="h5" align="center" gutterBottom>
              ¡No te quedes con las ganas!
            </Typography>
            <Stepper activeStep={activeStep} orientation="vertical" className={classes.stepper}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                  <StepContent>
                    <>                   
                      <form onSubmit={handleSubmit}>
                        {getStepContent(activeStep)}
                        <br/>
                        <div className={classes.buttons}>
                          {activeStep !== 0 && (
                            <>
                            <Button onClick={handleBack} className={classes.button}>
                              ATRÁS
                            </Button>
                            </>
                          )}
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                          >
                            {activeStep === steps.length - 1 ? 'Confirmar' : 'Siguiente'}
                          </Button>

                        </div>

                      </form>
                    </>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
            {/* <Button onClick={() => handleOtroPedido()} 
              variant="contained"
              color="error"
              className={classes.button}
            >
              Cancelar pedido
            </Button> */}
            
          </>
        )}
      </>
    </div>
  );
};

export default MainForm;
