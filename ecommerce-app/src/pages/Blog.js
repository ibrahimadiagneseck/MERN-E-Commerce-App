import React from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import BlogCard from "../components/BlogCard";
import Container from "../components-others/Container";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBlogs } from "../features/blogs/blogSlice";
import watchImage from "../images/watch.jpg";
import moment from "moment";



const Blog = () => {

    const blogState = useSelector((state) => state?.blog?.blog);
    
    const dispatch = useDispatch();

    useEffect(() => {
        const getBlogs = () => {
            dispatch(getAllBlogs());
        };
        
        getBlogs();
    }, [dispatch]);

    // Fonction pour obtenir l'URL d'une image de manière sécurisée
        const getImageUrl = (item, index) => {
            if (!item?.images || !Array.isArray(item.images)) {
                // Retourner des images par défaut si pas d'images
                return index === 0 ? watchImage : watchImage;
            }
            
            if (item.images.length > index) {
                // Si l'image a une propriété url
                if (item.images[index]?.url) {
                    return item.images[index].url;
                }
                // Si l'image est une string directement
                if (typeof item.images[index] === 'string') {
                    return item.images[index];
                }
            }
            
            // Retourner des images par défaut
            return index === 0 ? watchImage : watchImage;
        };

//     // Fonction simplifiée pour obtenir l'URL d'image
// const getImageUrl = (item) => {
//     // 1. Vérifier images array (Cloudinary format)
//     if (item?.images?.length > 0) {
//         const firstImage = item.images[0];
//         if (firstImage?.url) return firstImage.url;
//         if (typeof firstImage === 'string') return firstImage;
//         if (firstImage?.secure_url) return firstImage.secure_url;
//     }
    
//     // 2. Vérifier image property directe
//     if (item?.image) {
//         if (item.image?.url) return item.image.url;
//         if (typeof item.image === 'string') return item.image;
//     }
    
//     // 3. Retourner image par défaut
//     return watchImage;
// };
    
        // Helper function to safely render description
        const renderDescription = (description) => {
            if (!description) return '';
            return { __html: description };
        };

    return (
        <>
            <Meta title={"Blogs"} />
            <BreadCrumb title="Blogs" />
            <Container class1="blog-wrapper home-wrapper-2 py-5">
                    <div className="row">
                        <div className="col-3">
                            <div className="filter-card mb-3">
                                <h3 className="filter-title">Find By Categories</h3>
                                <div>
                                    <ul className="ps-0">
                                        <li>Watch</li>
                                        <li>Tv</li>
                                        <li>Camera</li>
                                        <li>Laptop</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-9">
                            <div className="row">:
                                {
                                    blogState?.map((item, index) => {
                                        return (
                                            <div className="col-6 mb-3" key={index}>
                                                <BlogCard id={ item?._id } title={ item?.title } description={renderDescription(item.description)} image={ getImageUrl(item, 0) } date={moment(item?.createdAt).format("MMMM Do YYYY, h:mm a")} />
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
            </Container>
        </>
    )

}

export default Blog;