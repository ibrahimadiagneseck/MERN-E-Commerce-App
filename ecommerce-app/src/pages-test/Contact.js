// import { react } from "react";

import { BsInfoCircle } from "react-icons/bs";
import BreadCrumb from "../components-test/BreadCrumb";
import Meta from "../components-test/Meta";
import { AiOutlineHome, AiOutlineMail } from "react-icons/ai";
import { BiPhoneCall } from "react-icons/bi";

const Contact = () => {
    return (
        <>
            <Meta title="Contact Us" />
            <BreadCrumb title="Contact Us" />
            <div className="contact-wrapper py-5 home-wrapper-2">
                <div className="container-xxl">
                    <div className="row">

                        <div className="col-12">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30874.35436875031!2d-17.48199877384218!3d14.695942115040953!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xec17292246d4da9%3A0x438c5fd7d91b27a2!2sPiscine%20Olympique%20Nationale%20de%20Dakar!5e0!3m2!1sfr!2ssn!4v1764277110119!5m2!1sfr!2ssn"
                                width="600" height="450" className="border-0 w-100" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                        </div>

                        <div className="col-12 mt-5">
                            <div className="contact-inner-wrapper d-flex justify-content-between">
                                <div>
                                    <h3 className="contact-title mb-4">Contact</h3>
                                    <form action="" className="d-flex flex-column gap-15">
                                        <div>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Name"
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="email"
                                                className="form-control"
                                                placeholder="Email"
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                placeholder="Mobile Number"
                                            />
                                        </div>
                                        <div>
                                            <textarea
                                                name=""
                                                id=""
                                                className="w-100 form-control"
                                                cols="30"
                                                rows="4"
                                                placeholder="Comments"
                                            ></textarea>
                                        </div>
                                        <div>
                                            <button className="button border-0">Submit</button>
                                        </div>
                                    </form>
                                </div>
                                <div>
                                    <h3 className="contact-title mb-4">Get in touch with us</h3>
                                    <div>
                                        <ul className="ps-0">
                                            <li className="mb-3 d-flex gap-15 align-items-center">
                                                <AiOutlineHome className="fs-5" />
                                                <address className="mb-0">
                                                    Hno: Sicap Amitie 2
                                                    Dakar, Senegal
                                                    PinCode: 10700
                                                </address>
                                            </li>
                                            <li className="mb-3 d-flex gap-15 align-items-center">
                                                <BiPhoneCall className="fs-5" />
                                                <a href="tel:+221 775211787">+221 775211787</a>
                                            </li>
                                            <li className="mb-3 d-flex gap-15 align-items-center">
                                                <AiOutlineMail className="fs-5" />
                                                <a href="mailto:seckibrahimadiagne@gmail.com">
                                                    seckibrahimadiagne@gmail.com
                                                </a>
                                            </li>
                                            <li className="mb-3 d-flex gap-15 align-items-center">
                                                <BsInfoCircle className="fs-5" />
                                                <p className="mb-0">Monday - Friday 10 AM - 8 PM</p>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default Contact;