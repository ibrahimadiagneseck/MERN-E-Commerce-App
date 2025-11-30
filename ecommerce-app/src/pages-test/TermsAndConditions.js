import Meta from "../components-test/Meta"
import BreadCrumb from "../components-test/BreadCrumb"
// import { Link } from "react-router-dom";

const TermsAndCondition = () => {
    return (
        <>
            <Meta title={"Terms And Conditions"} /> 
            <BreadCrumb title="Terms And Conditions" />
            <section className="policy-wrapper py-5 home-wrapper-2">
                <div className="container-xxl">
                    <div className="row">
                        <div className="col-12">
                            <div className="policy"></div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default TermsAndCondition;