import Meta from "../components/Meta"
import BreadCrumb from "../components/BreadCrumb"
import Container from "../components-others/Container";
import CustomInput from "../components-others/CustomInput";

const Signup = () => {
    return (
        <>
            <Meta title={"Sign Up"} /> 
            <BreadCrumb title="Sign Up" />

            <Container class1="login-wrapper py-5 home-wrapper-2">
                <div className="row">
                    <div className="col-12">
                        <div className="auth-card">
                            <h3 className="text-center mb-3">Sign Up</h3>

                            <form action="" className="d-flex flex-column gap-15">

                                {/* Nom */}
                                <CustomInput
                                    type="text"
                                    label="Name"
                                    i_id="name"
                                    i_class=""
                                    name="name"
                                />

                                {/* Email */}
                                <CustomInput
                                    type="email"
                                    label="Email"
                                    i_id="email"
                                    i_class=""
                                    name="email"
                                />

                                {/* Numéro de téléphone */}
                                <CustomInput
                                    type="text"
                                    label="Mobile Number"
                                    i_id="mobile"
                                    i_class=""
                                    name="mobile"
                                />

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
