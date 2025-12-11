import Meta from "../components/Meta"
import BreadCrumb from "../components/BreadCrumb"
import Container from "../components-others/Container";
import CustomInput from "../components-others/CustomInput";
import { useFormik } from "formik";
import * as yup from "yup";

const signUpSchema = yup.object({
    firstname: yup.string().required("First Name is  required"),
    lastname: yup.string().required("Last Name is  required"),
    // sex: yup.mixed().oneOf(['male', 'female', 'other'] as const).defined(),
    email: yup.string().nullable().email("Email Should be valid"),
    mobile: yup.string().required("Mobile  No is  required"),
    password: yup.string().required("Password is  required"),
    // birthDate: yup.date().nullable().min(new Date(1900, 0, 1));
});

const Signup = () => {

    const formik = useFormik({
    initialValues: {
        firstName: "",
        lastName: "", 
        email: "",
        mobile: "",
        password: "",
    },
    validationSchema: signUpSchema,
    onSubmit: (values) => {
        alert(JSON.stringify(values, null, 2));
    },
}); 

    return (
        <>
            <Meta title={"Sign Up"} /> 
            <BreadCrumb title="Sign Up" />

            <Container class1="login-wrapper py-5 home-wrapper-2">
                <div className="row">
                    <div className="col-12">
                        <div className="auth-card">
                            <h3 className="text-center mb-3">Sign Up</h3>

                            <form action="" 
                                onSubmit={formik.handleSubmit}
                                className="d-flex flex-column gap-15">

                                {/* Nom */}
                                <CustomInput
                                    type="text"
                                    label="First Name"
                                    i_id="firstname"
                                    i_class=""
                                    name="firstname"
                                    value={formik.values.firstname}
                                    onchange={formik.handleChange("firstname")}
                                    onBlur={formik.handleBlur("firstname")} 
                                />
                                <div className="error">
                                    {formik.touched.firstname && formik.errors.firstname}
                                </div>

                                {/* Nom */}
                                <CustomInput
                                    type="text"
                                    label="Last Name"
                                    i_id="lastname"
                                    i_class=""
                                    name="lastname"
                                    value={formik.values.lastname}
                                    onchange={formik.handleChange("lastname")}
                                    onBlur={formik.handleBlur("lastname")} 
                                />
                                <div className="error">
                                    {formik.touched.lastname && formik.errors.lastname}
                                </div>

                                {/* Email */}
                                <CustomInput
                                    type="email"
                                    label="Email"
                                    i_id="email"
                                    i_class=""
                                    name="email"
                                    value={formik.values.email}
                                    onchange={formik.handleChange("email")}
                                    onBlur={formik.handleBlur("email")} 
                                />
                                <div className="error">
                                    {formik.touched.email && formik.errors.email}
                                </div>

                                {/* Numéro de téléphone */}
                                <CustomInput
                                    type="text"
                                    label="Mobile Number"
                                    i_id="mobile"
                                    i_class=""
                                    name="mobile"
                                    value={formik.values.mobile}
                                    onchange={formik.handleChange("mobile")}
                                    onBlur={formik.handleBlur("mobile")} 
                                />
                                <div className="error">
                                    {formik.touched.mobile && formik.errors.mobile}
                                </div>

                                {/* Mot de passe */}
                                <CustomInput
                                    type="password"
                                    label="Password"
                                    i_id="password"
                                    i_class=""
                                    name="password"
                                />

                                <div className="mt-3 d-flex justify-content-center gap-15 align-items-center">
                                    <button type="submit" className="button border-0">Sign Up</button>
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
