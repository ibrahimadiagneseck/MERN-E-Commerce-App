// import { react } from "react";
import { BsSearch, BsLinkedin, BsGithub, BsYoutube, BsInstagram } from "react-icons/bs";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <>
            {/* -------------------------------------------------------------------------------- */}
            <footer className="py-4">
                <div className="container-xxl"> 
                    <div className="row align-items-center">
                        <div className="col-5">
                            <div className="footer-top-data d-flex g-30 align-items-center">
                                <img src="images/newsletter.png" alt="newsletter" />
                                <h2 className="mb-0 text-white">Sign Up for Newsletter</h2>
                            </div>
                        </div>
                        <div className="col-7">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control py-1"
                                    placeholder="Your Email Address"
                                    aria-label="Your Email Address"
                                    aria-describedby="basic-addon2" />
                                <span className="input-group-text p-2" id="basic-addon2">
                                    Subscribe
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            {/* -------------------------------------------------------------------------------- */}
            <footer className="py-4">
                <div className="container-xxl"> 
                    <div className="row">
                        <div className="col-4">
                            <h4 className="text-white mb-4">Contact Us</h4>
                            <div>
                                <address className="text-white fs-5">
                                    Dakar, Sénégal <br/>
                                    PinCode: 11270
                                </address>
                                <a href="tel: +221 77 521 17 87" className="mt-4 d-block mb-2 text-white">
                                    +221 77 521 17 87
                                </a>
                                <a href="mailto: ibrahimadiagneseck@esp.sn" className="mt-4 d-block mb-2 text-white">
                                    ibrahimadiagneseck@esp.sn
                                </a>
                                <div className="social-icons d-flex align-items-center gap-30">
                                    <a href="">
                                        <BsLinkedin className="text-white fs-5"/>
                                    </a>
                                    <a href="">
                                        <BsGithub className="text-white fs-5"/>
                                    </a>
                                    <a href="">
                                        <BsYoutube className="text-white fs-5"/>
                                    </a>
                                    <a href="">
                                        <BsInstagram className="text-white fs-5"/>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-3">
                            <h4 className="text-white mb-4">Information</h4>
                            <div className="footer-links d-flex flex-column">
                                <Link className="text-white py-2 mb-1">Privacy Policy</Link>
                                <Link className="text-white py-2 mb-1">Refund Policy</Link>
                                <Link className="text-white py-2 mb-1">Shipping Policy</Link>
                                <Link className="text-white py-2 mb-1">Terms & Conditions</Link>
                                <Link className="text-white py-2 mb-1">Blogs</Link>
                            </div>
                        </div>
                        <div className="col-3">
                            <h4 className="text-white mb-4">Account</h4>
                            <div className="footer-links d-flex flex-column">
                                <Link className="text-white py-2 mb-1">About us</Link>
                                <Link className="text-white py-2 mb-1">Faq</Link>
                                <Link className="text-white py-2 mb-1">Contact</Link>
                            </div>
                        </div>
                        <div className="col-2">
                            <h4 className="text-white mb-4">Quick Links</h4>
                            <div className="footer-links d-flex flex-column">
                                <Link className="text-white py-2 mb-1">Laptops</Link>
                                <Link className="text-white py-2 mb-1">Headphones</Link>
                                <Link className="text-white py-2 mb-1">Tablets</Link>
                                <Link className="text-white py-2 mb-1">Watch</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            {/* -------------------------------------------------------------------------------- */}
            <footer className="py-4">
                <div className="container-xxl"> 
                    <div className="row">
                        <div className="col-12">
                            <p className="text-center mb-0 text-white">
                                &copy; { new Date().getFullYear() }; Powered by Ibrahima
                                </p>
                        </div>
                    </div>
                </div>
            </footer>
            {/* -------------------------------------------------------------------------------- */}
        </>
    );
};

export default Footer;