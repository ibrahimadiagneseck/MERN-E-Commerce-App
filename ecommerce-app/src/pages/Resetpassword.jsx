import Meta from "../components/Meta"
import BreadCrumb from "../components/BreadCrumb"
import Container from "../components-others/Container";
import CustomInput from "../components-others/CustomInput";
// import { Link } from "react-router-dom";

const Resetpassword = () => {
    return (
        <>
            <Meta title={"Reset Password"} /> 
            <BreadCrumb title="Reset Password" />

            <Container class1="login-wrapper py-5 home-wrapper-2">
                    <div className="row">
                    <div className="col-12">
                        <div className="auth-card">
                            <h3 className="text-center mb-3">Reset Password</h3>
                            <p className="text-center mt-2 mb-3">
                                We will send you an email to reset your password
                            </p>
                            <form action="" className="d-flex flex-column gap-15">
                                <CustomInput
                                    type="password"
                                    label="Password"
                                    i_id="password"
                                    i_class=""
                                    name="password"
                                />

                                <CustomInput
                                    type="password"
                                    label="Confirm Password"
                                    i_id="confirmpassword"
                                    i_class=""
                                    name="confirmpassword"
                                />
                                <div>
                                    <div className="mt-3 d-flex justify-content-center gap-15 align-items-center">
                                        <button type="submit" className="button border-0">Ok</button>
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

export default Resetpassword;