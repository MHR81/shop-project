import { useNavigate } from "react-router-dom";
import banner from "../../Images/Home1.png";

export default function HomeCard1() {
    const navigate = useNavigate();
    // Removed t from useTranslation

    const handleShopNow = () => {
        navigate("/Products");
    };

    return (
        <div>
            {/* Desktop: Banner with overlay */}
            <div className="d-none d-md-block w-100 position-relative rounded-3 home-banner">
                <img src={banner} alt="Home Banner" className="w-100 h-100 rounded-3 home-banner-img" />
                <div className="container position-absolute mx-5 top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-start text-muted home-banner-content">
                    <h1 className="display-2 fw-bold mb-3">
                        <span className="text-danger">New</span>
                        <span className="d-block">Arrival</span>
                    </h1>
                    <p className="fs-5 mb-4 w-50 text-truncate">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit
                    </p>
                    <button onClick={handleShopNow} className="btn btn-outline-danger px-4 py-2 fw-bold shadow-sm">Buy Now</button>
                </div>
            </div>
            {/* Mobile: Simple content */}
            <div className="d-block d-md-none py-5 px-3 d-flex flex-column align-items-start mt-4 rounded-3 home-banner">
                <h1 className="display-4 fw-bold mb-3">
                    <span className="text-danger">New</span>
                    <span className="d-block">Arrival</span>
                </h1>
                <p className="fs-5 mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                </p>
                <button onClick={handleShopNow} className="btn btn-outline-danger px-4 py-2 fw-bold shadow-sm">Buy Now</button>
            </div>
        </div>
    );
}
