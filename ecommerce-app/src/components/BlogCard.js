// import { react } from "react";
import { Link } from "react-router-dom";
// import { BsSearch } from "react-icons/bs";
// import blog1 from "../images/blog-1.jpg";

const BlogCard = (props) => {
        
    const { id, title, description, date, image } = props;

    // Helper function to safely render description
    const renderDescription = (description) => {
        if (!description) return '';
        return { __html: description };
    };

    return (
            <div className="blog-card">
                <div className="card-image">
                    <img src={image}  className="img-fluid w-100" alt="blog"/>
                </div>
                <div className="blog-content">
                    <p className="date">{ date }</p>
                    <h5 className="title">{ title }</h5>
                    <p className="desc" dangerouslySetInnerHTML={renderDescription(description.substr(0, 70) + "...")}>
                    </p>
                    <Link to={"/blog/" + id} className="button">Read More</Link>
                </div>
            </div>
    )
};

export default BlogCard;