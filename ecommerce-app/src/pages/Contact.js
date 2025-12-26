import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";

import { BsInfoCircle } from "react-icons/bs";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import { AiOutlineHome, AiOutlineMail } from "react-icons/ai";
import { BiPhoneCall } from "react-icons/bi";
import Container from "../components-others/Container";
import CustomInput from "../components-others/CustomInput";
import { createQuery, resetState } from "../features/enquiry/enquirySlice";

const contactSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  mobile: yup
    .string()
    .matches(/^\+?[0-9\s\-()]+$/, "Invalid phone number")
    .required("Mobile number is required"),
  comment: yup.string().required("Comment is required"),
});

const Contact = () => {
    
  const dispatch = useDispatch();
  
  const { isSuccess, isError, isLoading, message } = useSelector(
    (state) => state.enquiry
  );

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobile: "",
      comment: "",
    },
    validationSchema: contactSchema,
    onSubmit: (values) => {
        console.log("Form submitted with values:", values);
        dispatch(createQuery(values));
    },
  });


  useEffect(() => {
  if (isSuccess && message) {
    toast.success(message);
    formik.resetForm();
    dispatch(resetState());
  }
  
  if (isError && message) {
    toast.error(message);
  }
}, [isSuccess, isError, message, dispatch, formik]);

//   useEffect(() => {
//     if (isSuccess) {

//       toast.success(message || "Query submitted successfully!");
//       formik.resetForm();

//       setTimeout(() => {
//         dispatch(resetState());
//       }, 2000);

//     }
//     if (isError) {
//       toast.error(message || "Failed to submit enquiry");
//     }
//   }, [isSuccess, isError, message, dispatch, formik]); 

  // Fonction pour vérifier si le formulaire est valide
  const isFormValid = formik.isValid && formik.dirty;

  return (
    <>
      <Meta title="Contact Us" />
      <BreadCrumb title="Contact Us" />
      <Container class1="contact-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30874.35436875031!2d-17.48199877384218!3d14.695942115040953!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xec17292246d4da9%3A0x438c5fd7d91b27a2!2sPiscine%20Olympique%20Nationale%20de%20Dakar!5e0!3m2!1sfr!2ssn!4v1764277110119!5m2!1sfr!2ssn"
              width="600"
              height="450"
              className="border-0 w-100"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps location - Our office in Dakar"
            ></iframe>
          </div>

          <div className="col-12 mt-5">
            <div className="contact-inner-wrapper d-flex justify-content-between">
              <div className="w-100">
                <h3 className="contact-title mb-4">Contact</h3>
                <form
                  onSubmit={formik.handleSubmit}
                  className="d-flex flex-column gap-15"
                >
                  <CustomInput
                    type="text"
                    label="Name"
                    i_id="name"
                    i_class=""
                    name="name"
                    onChng={formik.handleChange("name")}
                    onBlr={formik.handleBlur("name")}
                    val={formik.values.name}
                    error={formik.touched.name && formik.errors.name}
                  />

                  <CustomInput
                    type="email"
                    label="Email"
                    i_id="email"
                    i_class=""
                    name="email"
                    onChng={formik.handleChange("email")}
                    onBlr={formik.handleBlur("email")}
                    val={formik.values.email}
                    error={formik.touched.email && formik.errors.email}
                  />

                  <CustomInput
                    type="tel"
                    label="Mobile Number"
                    i_id="mobile"
                    i_class=""
                    name="mobile"
                    onChng={formik.handleChange("mobile")}
                    onBlr={formik.handleBlur("mobile")}
                    val={formik.values.mobile}
                    error={formik.touched.mobile && formik.errors.mobile}
                  />

                  <div>
                    <textarea
                      name="comment"
                      id="comment"
                      className="w-100 form-control"
                      cols="30"
                      rows="4"
                      placeholder="Comments"
                      onChange={formik.handleChange("comment")}
                      onBlur={formik.handleBlur("comment")}
                      value={formik.values.comment}
                    ></textarea>
                    {formik.touched.comment && formik.errors.comment && (
                      <div className="text-danger mt-1">
                        {formik.errors.comment}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <button
                      className="button border-0"
                      type="submit"
                      disabled={isLoading || !isFormValid}
                    >
                      {isLoading ? (
                        <>
                          <span 
                            className="spinner-border spinner-border-sm me-2" 
                            role="status" 
                            aria-hidden="true"
                          ></span>
                          Submitting...
                        </>
                      ) : (
                        "Submit"
                      )}
                    </button>
                    
                    {/* Affichage des messages d'état */}
                    {isError && message && (
                      <div className="alert alert-danger mt-3" role="alert">
                        {message}
                      </div>
                    )}
                    {isSuccess && (
                      <div className="alert alert-success mt-3" role="alert">
                        {message}
                      </div>
                    )}
                  </div>
                </form>
              </div>
              
              <div className="w-100 ms-5">
                <h3 className="contact-title mb-4">Get in touch with us</h3>
                <div>
                  <ul className="ps-0">
                    <li className="mb-3 d-flex gap-15 align-items-center">
                      <AiOutlineHome className="fs-5" />
                      <address className="mb-0">
                        Hno: Sicap Amitie 2
                        <br />
                        Dakar, Senegal
                        <br />
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
      </Container>
    </>
  );
};

export default Contact;