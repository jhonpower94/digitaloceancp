import React, { useEffect, useContext } from "react";
import { useDispatch } from "react-redux";
import { loading$ } from "../../redux/action";
import { AppContext } from "../../App";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import ReactCountryFlag from "react-country-flag";
import {
  InputAdornment,
  MenuItem,
  OutlinedInput,
  FormControl,
  InputLabel,
  IconButton,
} from "@material-ui/core";
import NumberFormat from "react-number-format";
import PropTypes from "prop-types";
import getSymbolFromCurrency from "currency-symbol-map";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { countrylist } from "../../config/countrylist";
import { from } from "rxjs";
import { app } from "../../config";
import { addUsers } from "../../config/services";
import { dispatch } from "rxjs/internal/observable/pairs";
import { navigate } from "@reach/router";
var cc = require("currency-codes");

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;
  const { intro } = useContext(AppContext);

  const countryCode = intro.mobilecode;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      format={`${countryCode} ### ### ####`}
      allowEmptyFormatting
      mask="_"
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  flag: {
    fontSize: "2em",
    lineHeight: "2em",
  },
  space: {
    flexFlow: 1,
  },
}));

export default function SignUpReferral(props) {
  const classes = useStyles();
  const { intro, setIntro } = useContext(AppContext);
  const { id } = props;
  const dispatch = useDispatch();
  const [values, setValues] = React.useState({
    numberformat: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    showPassword: false,
    country: countrylist[0].name,
    mobilecode: intro.mobilecode,
    referrerid: "",
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
    console.log(event.target.value);
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const chageCountryCode = (countrycode, dialcode) => {
    setIntro({
      ...intro,
      countrycode: countrycode,
      mobilecode: dialcode,
    });
  };
  const submitForm = (event) => {
    event.preventDefault();
    dispatch(loading$());
    const datas = {
      numberformat: values.numberformat,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      country: values.country,
      mobilecode: intro.mobilecode,
      referrer: true,
      referrerid: id,
    };
    app
      .auth()
      .createUserWithEmailAndPassword(values.email, values.password)
      .then((user) => {
        console.log("user created");
        const userid = user.user.uid;
        addUsers(datas, userid).then(() => {
          dispatch(loading$());
          navigate("../../dashboard");
        });
      })
      .catch((err) => {
        dispatch(loading$());
        console.log(err);
      });
  };
  useEffect(() => {
    setIntro({
      countrycode: countrylist[0].code,
      mobilecode: countrylist[0].dial_code,
    });
  }, []);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <div className={classes.avatar}>
          <img
            src={require("../../images/logo.png")}
            height={
              useMediaQuery(useTheme().breakpoints.up("sm")) ? "70px" : "50px"
            }
          />
        </div>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} onSubmit={submitForm}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="first name"
                autoFocus
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="last name"
                name="lastName"
                autoComplete="lname"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="email dddress"
                name="email"
                autoComplete="email"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={values.showPassword ? "text" : "password"}
                  value={values.password}
                  name="password"
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {values.showPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  labelWidth={70}
                  required
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                required
                variant="outlined"
                label="country"
                name="country"
                value={values.country}
                id="standard-select-currency"
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ReactCountryFlag
                        countryCode={intro.countrycode}
                        svg
                        className={classes.flag}
                      />
                    </InputAdornment>
                  ),
                }}
              >
                {countrylist.map((ct, index) => (
                  <MenuItem
                    key={index}
                    value={ct.name}
                    onClick={() => chageCountryCode(ct.code, ct.dial_code)}
                  >
                    {ct.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                label="mobile"
                value={values.numberformat}
                onChange={handleChange}
                name="numberformat"
                id="formatted-numberformat-input"
                InputProps={{
                  inputComponent: NumberFormatCustom,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                id="refId"
                label="Referrer ID"
                name="referrerid"
                autoComplete="referrer"
                value={id}
                disabled
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox value="allowExtraEmails" color="primary" required />
                }
                label="I agree to term, privacy and policy."
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate("../../account")}
              >
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}