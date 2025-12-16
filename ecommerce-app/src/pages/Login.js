// Login.js
import Meta from "../components/Meta";
import BreadCrumb from "../components/BreadCrumb";
import { Link, useNavigate } from "react-router-dom";
import Container from "../components-others/Container";
import CustomInput from "../components-others/CustomInput";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/user/userSlice"; 
import { useEffect } from "react";

const loginSchema = yup.object({
  email: yup.string().email("Email should be valid").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Accéder au state auth depuis Redux
  const { isSuccess, isLoading, user } = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      dispatch(loginUser(values));
    },
  });

  // Extraire resetForm explicitement
  const { resetForm } = formik;

  // Redirection après succès
  useEffect(() => {
    let timer;
    
    if (isSuccess && user) {
      // Réinitialiser le formulaire
      resetForm();
      
      // Rediriger vers la page d'accueil après un court délai
      timer = setTimeout(() => {
        navigate("/");
      }, 1500);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isSuccess, user, navigate, resetForm]);

  return (
    <>
      <Meta title={"Login"} /> 
      <BreadCrumb title="Login" />

      <Container class1="login-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <div className="auth-card">
              <h3 className="text-center mb-3">Login</h3>

              <form onSubmit={formik.handleSubmit} className="d-flex flex-column gap-15">
                
                {/* Email */}
                <div className="mb-3">
                  <CustomInput
                    type="email"
                    label="Email"
                    i_id="email"
                    i_class={formik.touched.email && formik.errors.email ? 'is-invalid' : ''}
                    name="email"
                    val={formik.values.email}
                    onChng={formik.handleChange}
                    onBlr={formik.handleBlur}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="text-danger mt-1" style={{ fontSize: '14px' }}>
                      {formik.errors.email}
                    </div>
                  )}
                </div>

                {/* Password */}
                <div className="mb-3">
                  <CustomInput
                    type="password"
                    label="Password"
                    i_id="password"
                    i_class={formik.touched.password && formik.errors.password ? 'is-invalid' : ''}
                    name="password"
                    val={formik.values.password}
                    onChng={formik.handleChange}
                    onBlr={formik.handleBlur}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <div className="text-danger mt-1" style={{ fontSize: '14px' }}>
                      {formik.errors.password}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <Link to="/forgot-password" className="text-primary" style={{ textDecoration: 'none' }}>
                    Forgot Password?
                  </Link>
                </div>

                <div className="mt-3 d-flex justify-content-center gap-15 align-items-center">
                  <button 
                    type="submit" 
                    className="button border-0"
                    disabled={isLoading}
                    style={{ 
                      opacity: isLoading ? 0.7 : 1,
                      cursor: isLoading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </button>
                  
                  <Link 
                    to="/signup" 
                    className="button signup"
                    style={{ 
                      textDecoration: 'none',
                      textAlign: 'center',
                      padding: '10px 20px'
                    }}
                  >
                    SignUp
                  </Link>
                </div>

                {/* Lien vers la page d'inscription */}
                <div className="mt-3 text-center">
                  <p className="mb-0">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-primary fw-bold" style={{ textDecoration: 'none' }}>
                      Sign up here
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Login;