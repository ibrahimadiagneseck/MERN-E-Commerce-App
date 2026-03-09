// import { Helmet } from "react-helmet";

const Color = (props) => {

    const { colorData, setColor } = props;        

    return (
        <>
            <ul className="colors ps-0">
                {colorData && colorData.length > 0 ? (
                    colorData.map((color, index) => (
                        <li 
                        onClick={() => setColor(color)} 
                        key={index} 
                        style={{ backgroundColor: color }} // applique la couleur en arrière-plan
                        ></li>
                    ))
                ) : (
                    <li>Aucune couleur disponible</li>
                )}
            </ul>
        </>
    )
};

export default Color;