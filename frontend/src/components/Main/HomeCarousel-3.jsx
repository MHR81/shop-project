import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Loading from "../common/Loading";
import { getAllProducts } from "../../api/products";

function NextArrow({ onClick }) {
  return (
    <button
      type="button"
      className="btn btn-outline-danger rounded-circle slick-next-custom"
      onClick={onClick}
      style={{
        position: "absolute",
        top: "50%",
        right: "10px",  // نزدیک گوشه راست
        transform: "translateY(-50%)",
        zIndex: 2,
      }}
    >
      <i className="bi bi-chevron-right"></i>
    </button>
  );
}

function PrevArrow({ onClick }) {
  return (
    <button
      type="button"
      className="btn btn-outline-danger rounded-circle slick-prev-custom"
      onClick={onClick}
      style={{
        position: "absolute",
        top: "50%",
        left: "10px",   // نزدیک گوشه چپ
        transform: "translateY(-50%)",
        zIndex: 2,
      }}
    >
      <i className="bi bi-chevron-left"></i>
    </button>
  );
}



export default function HomeCarousel3() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            getAllProducts()
                .then((data) => {
                    setProducts(data);
                })
                .catch((err) => console.error(err))
                .finally(() => {
                    setLoading(false);
                });
        }, 300);
        return () => {
            clearTimeout(timer);
        };
    }, []);

    if (loading) return <Loading />;
    if (!products.length)
        return <div className="text-center py-5">No products found.</div>;

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: window.innerWidth < 768 ? 1 : 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        swipe: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            { breakpoint: 768, settings: { slidesToShow: 1 } },
            { breakpoint: 992, settings: { slidesToShow: 2 } },
            { breakpoint: 1200, settings: { slidesToShow: 4 } },
        ],
    };

    return (
        <div className="container py-4 position-relative">
            <Slider {...settings}>
                {products.map((product) => (
                    <div key={product.id} className="px-2">
                        <div
                            className="card w-100 h-100 text-center p-3 shadow-sm product-card-hover"
                            style={{ cursor: "pointer", backgroundColor: "var(--color-bg)", borderColor: "var(--color-secondary)" }}
                            onClick={() => navigate(`/product/${product._id}`)}
                        >
                            <img
                                src={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : product.image}
                                alt={product.name}
                                loading="lazy"
                                className="img-fluid rounded-3 mb-2"
                                style={{ maxHeight: 120, objectFit: "contain" }}
                            />
                            <h6 className="fw-bold mb-1 text-truncate" style={{ color: "var(--color-text)" }}>
                                {product.name}
                            </h6>
                            <p className="text-danger fw-bold mb-0">{product.price} $</p>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
}
