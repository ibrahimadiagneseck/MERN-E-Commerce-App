// Signup.js
import Meta from "../components/Meta";
import BreadCrumb from "../components/BreadCrumb";
import Container from "../components-others/Container";
import CustomInput from "../components-others/CustomInput";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/user/userSlice"; // ← Correction du nom
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const signUpSchema = yup.object({
  firstname: yup.string().required("First Name is required"),
  lastname: yup.string().required("Last Name is required"),
  email: yup.string().email("Email should be valid").required("Email is required"),
  mobile: yup.string().required("Mobile No is required"),
  password: yup.string().required("Password is required"),
});

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Accéder au state auth depuis Redux
  const { isSuccess, isLoading } = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "", 
      email: "",
      mobile: "",
      password: "",
    },
    validationSchema: signUpSchema,
    onSubmit: (values) => {
      dispatch(registerUser(values));
    },
  });

  // Redirection après succès
  useEffect(() => {
    if (isSuccess) {
      // Réinitialiser le formulaire
      formik.resetForm();
      
      // Rediriger vers la page de login après un court délai
      const timer = setTimeout(() => {
        navigate("/login");
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate, formik]);

  return (
    <>
      <Meta title={"Sign Up"} />
      <BreadCrumb title="Sign Up" />

      <Container class1="login-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <div className="auth-card">
              <h3 className="text-center mb-3">Sign Up</h3>

              <form onSubmit={formik.handleSubmit} className="d-flex flex-column gap-15">
                
                {/* First Name */}
                <div className="mb-3">
                  <CustomInput
                    type="text"
                    label="First Name"
                    i_id="firstname"
                    i_class={formik.touched.firstname && formik.errors.firstname ? 'is-invalid' : ''}
                    name="firstname"
                    val={formik.values.firstname}
                    onChng={formik.handleChange}
                    onBlr={formik.handleBlur}
                  />
                  {formik.touched.firstname && formik.errors.firstname && (
                    <div className="text-danger mt-1" style={{ fontSize: '14px' }}>
                      {formik.errors.firstname}
                    </div>
                  )}
                </div>

                {/* Last Name */}
                <div className="mb-3">
                  <CustomInput
                    type="text"
                    label="Last Name"
                    i_id="lastname"
                    i_class={formik.touched.lastname && formik.errors.lastname ? 'is-invalid' : ''}
                    name="lastname"
                    val={formik.values.lastname}
                    onChng={formik.handleChange}
                    onBlr={formik.handleBlur}
                  />
                  {formik.touched.lastname && formik.errors.lastname && (
                    <div className="text-danger mt-1" style={{ fontSize: '14px' }}>
                      {formik.errors.lastname}
                    </div>
                  )}
                </div>

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

                {/* Mobile */}
                <div className="mb-3">
                  <CustomInput
                    type="text"
                    label="Mobile Number"
                    i_id="mobile"
                    i_class={formik.touched.mobile && formik.errors.mobile ? 'is-invalid' : ''}
                    name="mobile"
                    val={formik.values.mobile}
                    onChng={formik.handleChange}
                    onBlr={formik.handleBlur}
                  />
                  {formik.touched.mobile && formik.errors.mobile && (
                    <div className="text-danger mt-1" style={{ fontSize: '14px' }}>
                      {formik.errors.mobile}
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
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </div>

                {/* Lien vers la page de connexion */}
                <div className="mt-3 text-center">
                  <p className="mb-0">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary fw-bold" style={{ textDecoration: 'none' }}>
                      Login here
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

export default Signup;