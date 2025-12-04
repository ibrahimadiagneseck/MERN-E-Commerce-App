import Meta from "../components-test/Meta"
import BreadCrumb from "../components-test/BreadCrumb"
import Container from "../components-test/Container";
// import { Link } from "react-router-dom";

const RefundPolicy = () => {
    return (
        <>
            <Meta title={"Refund Policy"} /> 
            <BreadCrumb title="Refund Policy" />
            <Container class1="policy-wrapper py-5 home-wrapper-2">
                    <div className="row">
                        <div className="col-12">
                            <div className="policy"></div>
                        </div>
                    </div>
            </Container>
        </>
    )
}

export default RefundPolicy;