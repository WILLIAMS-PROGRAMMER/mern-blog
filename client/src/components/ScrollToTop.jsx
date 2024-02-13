import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation(); // useLocation es un hook de react-router-dom que permite acceder a la ubicacion actual
    useEffect(() => {
        window.scrollTo(0, 0); // scroll to the top of the page
    }, [pathname]); // run this effect whenever the pathname changes
    return null;
}

export default ScrollToTop; // export the component
