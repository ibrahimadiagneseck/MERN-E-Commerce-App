import Meta from "../components/Meta"
import BreadCrumb from "../components/BreadCrumb"
import { Link } from "react-router-dom";
import Container from "../components-others/Container";
import CustomInput from "../components-others/CustomInput";


const Login = () => {
    return (
        <>
            <Meta title={"Login"} /> 
            <BreadCrumb title="Login" />

            <Container class1="login-wrapper py-5 home-wrapper-2">
                <div className="row">
                    <div className="col-12">
                        <div className="auth-card">
                            <h3 className="text-center mb-3">Login</h3>
                            <form action="" className="d-flex flex-column gap-15">
                                <CustomInput
                                    type="email"
                                    label="Email"
                                    i_id="email"
                                    i_class=""
                                    name="email"
                                />

                                <CustomInput
                                    type="password"
                                    label="Password"
                                    i_id="password"
                                    i_class=""
                                    name="password"
                                />
                                <div>
                                    <Link to="/forgot-password">Forgot Password?</Link>

                                    <div className="mt-3 d-flex justify-content-center gap-15 align-items-center">
                                        <button type="submit" className="button border-0">Login</button>
                                        <Link to="/signup" className="button signup">SignUp</Link>
                                    </div>
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