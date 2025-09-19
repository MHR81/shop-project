import PageTransition from "../components/common/PageTransition";
import Breadcrumb from "../components/common/Breadcrumb";
import Products from '../components/Products/Products.jsx'
import Categories from '../components/Products/PCategories.jsx'

export default function ProductsPage() {
    const breadcrumbItems = [
        { label: "Home", to: "/" },
        { label: "Cart", active: true }
    ];

    return (
        <PageTransition>
            <div className="container">
                <Breadcrumb items={breadcrumbItems} />
            </div>
            <div className="container">
            <div className="products-card d-flex justify-content-center rounded my-3">
                <h3 className="my-4 fw-bold"><span className='fs-2'>Our</span> <span className='text-danger fs-1'>Products</span></h3>
            </div>
            </div>

            <div className='container d-xxl-none'>
                    <Categories />
                </div>

            <div className='row my-4'>
                <div className='col'>
                    <Products />
                </div>
                
                <div className='container d-none d-xxl-block col-3'>
                    <div className="container my-4">
                    <Categories />
                    </div>
                </div>
            </div>

        </PageTransition>
    )
}