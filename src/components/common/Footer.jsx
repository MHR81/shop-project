import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="footer text-center py-4 shadow-sm w-100">
            <div className="container-fluid ps-5">
                <div className="row">

                    <div className="col-md-4 mb-3 ps-3 d-flex justify-content-start">
                        <div className="footer-section w-75 text-start">
                            <h5 className="fw-bold">
                                <span className="fs-3">Fake</span> <span className="fs-1 text-danger">Store</span>
                            </h5>
                            <p>
                                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sapiente et minima facere
                                tempora consequuntur dolorum.
                            </p>
                        </div>
                    </div>

                    <div className="col-md-4 mb-3 ps-3 d-flex justify-content-start">
                        <div className="footer-section w-75 text-start">
                            <h5 className="fw-bold">Products</h5>
                            <ul className="list-unstyled">
                                <li>
                                    <Link className="footer-link" to="/Products/Product1">
                                        <i className="bi bi-check"></i> Womens clothing
                                    </Link>
                                </li>
                                <li>
                                    <Link className="footer-link" to="/Products/Product2">
                                        <i className="bi bi-check"></i> Mens clothing
                                    </Link>
                                </li>
                                <li>
                                    <Link className="footer-link" to="/Products/Product3">
                                        <i className="bi bi-check"></i> Jewelery
                                    </Link>
                                </li>
                                <li>
                                    <Link className="footer-link" to="/Products/Product4">
                                        <i className="bi bi-check"></i> Electronics
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="col-md-4 mb-3 ps-3 d-flex justify-content-start">
                        <div className="footer-section w-75 text-start">
                            <h5 className="fw-bold">Contact Us</h5>
                            <ul className="list-unstyled">
                                <li>
                                    <Link className="footer-link" to="https://instagram.com">
                                        <i className="bi bi-instagram"></i> instagram
                                    </Link>
                                </li>
                                <li>
                                    <Link className="footer-link" to="https://t.me">
                                        <i className="bi bi-telegram"></i> telegram
                                    </Link>
                                </li>
                                <li>
                                    <Link className="footer-link" to="https://wa.me">
                                        <i className="bi bi-whatsapp"></i> whatsapp
                                    </Link>
                                </li>
                                <li>
                                    <Link className="footer-link" to="https://facebook.com">
                                        <i className="bi bi-facebook"></i> facebook
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
                <div className="text-center">
                    <p className="mb-0">Made with ❤️ by <a className="footer-link text-danger" href="https://t.me/m_h_r_81" target="_blank" rel="noopener noreferrer">MHR81</a></p>
                </div>
            </div>
        </footer>
    );
}
