import Meta from "../components/Meta"
import BreadCrumb from "../components/BreadCrumb"
import { Link, useParams } from "react-router-dom";
import { HiOutlineArrowLeft } from "react-icons/hi";
import blog3 from "../images/blog-3.webp";
import Container from "../components-others/Container";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBlog } from "../features/blogs/blogSlice";
import moment from "moment";

const SingleBlog = () => {

    

    // const location = useLocation();
    // const getBlogId = location.pathname.split("/")[2];

    // const { getBlogId } = useParams();
    const { id: getBlogId } = useParams();

    // Récupération des blogs depuis le store Redux
    // `useSelector` permet d'accéder à l'état global
    // `state?.blog?.blog` : navigation optionnelle pour éviter les erreurs si la structure n'existe pas
    const blogState = useSelector((state) => state?.blog?.singleBlog);

    const blog = blogState && typeof blogState === 'object' ? blogState : null;
    
    // `useDispatch` permet d'envoyer des actions Redux
    const dispatch = useDispatch();

    // `useEffect` pour exécuter du code après le rendu du composant
    // Ici, on charge les blogs au montage du composant
    useEffect(() => {
        const getABlog = (id) => {
            // Dispatch de l'action qui va déclencher la récupération des blogs
            if (id) {
                dispatch(getBlog(id));
            }
        };
        
        getABlog(getBlogId);
    }, [dispatch, getBlogId]); // Dépendance : se ré-exécute si `dispatch` change (rare)

    
    const getImageUrl = (item) => {
        if (!item?.images || !Array.isArray(item.images) || item.images.length === 0) {
            return blog3; // fallback
        }
        const firstImage = item.images[0];
        if (typeof firstImage === "string") return firstImage;
        if (firstImage?.url) return firstImage.url;
        return blog3;
    };
    
    // Fonction pour sécuriser et éventuellement tronquer le contenu du blog
    const renderContent = (content) => {
        if (!content) return { __html: '' };
        if (content.__html !== undefined) return content;
        if (typeof content === 'string') {
            const truncated = content.length > 500 ? content.slice(0, 500) + "..." : content;
            return { __html: truncated };
        }
        return { __html: '' };
    };

    return (
        <>
            <Meta title={blog?.title || "Blog"} />

            <BreadCrumb title="Dynamic Blog Name" />
            <Container class1="blog-wrapper home-wrapper-2 py-5">
                    <div className="row">
                        <div className="col-12">
                            <div className="single-blog-card">
                                <Link to="/blogs" className="d-flex align-items-center gap-10">
                                    <HiOutlineArrowLeft className="fs-4" /> Go back to Blogs
                                </Link>
                                <h3 className="title">
                                    {blog?.title || "Blog"}
                                </h3>
                                <img
                                    src={getImageUrl(blog)}
                                    className="img-fluid w-100 my-4"
                                    alt={blog?.title || "blog"}
                                />
                                <p className="date">{moment(blog?.createdAt).format("MMMM Do YYYY, h:mm a")}</p>
                                <p className="desc" dangerouslySetInnerHTML={renderContent(blog?.description)}></p>
                            </div>
                        </div>
                    </div>
            </Container>
        </>
    );
};

export default SingleBlog;