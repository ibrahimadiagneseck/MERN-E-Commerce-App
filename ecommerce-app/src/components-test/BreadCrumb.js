// import { react } from "react";
import { NavLink, Link } from "react-router-dom";
import { BsSearch } from "react-icons/bs";

const BreadCrumb = (props) => {

    const { title } = props; 

    return (
        <>
            <div className="breadcrumb mb-0 py-4">
                <div className="container-xxl">
                    <div className="row">
                        <div className="col-12">
                            <p className="text-center mb-0">
                                <Link to="/" className="text-dark">Home &nbsp;</Link> / {title}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default BreadCrumb;