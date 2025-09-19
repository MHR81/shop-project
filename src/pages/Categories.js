import PageTransition from "../components/common/PageTransition";
import Categories from '../components/Category/Categories.jsx';
import Breadcrumb from "../components/common/Breadcrumb.jsx";

export default function CategoriesPage() {
    const breadcrumbItems = [
        { label: "Home", to: "/" },
        { label: "Categories", active: true }
    ];

    return (
        <PageTransition>
            <div className="container">
                <Breadcrumb items={breadcrumbItems} />
            </div>
                <Categories />            
        </PageTransition>
    );
}