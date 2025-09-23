export default function Dashboard() {
    return (
        <div>
            <h4 className="fw-bold mb-4"><span className="fs-4">Admin</span> <span className="text-danger fs-3">Dashboard</span></h4>
            <ul className="list-unstyled mb-4">
                <li>• Complete Profile</li>
                <li>• Manage Products</li>
                <li>• Manage Categories</li>
                <li>• View Orders</li>
                <li>• View and reply to user tickets</li>
                <li>• Change password</li>
                <li>• Logout</li>
            </ul>
            <div className="alert alert-info">To get started, select an option from the panel.</div>
        </div>
    );
}