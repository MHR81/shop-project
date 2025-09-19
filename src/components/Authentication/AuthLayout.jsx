// src/components/Authentication/AuthLayout.jsx
export default function AuthLayout({ title, children }) {
    return (
        <div
            className="card login-card mx-auto my-5 shadow"
            style={{ maxWidth: "400px" }}
        >
            <div className="card-body">
                <h3 className="card-title mb-4 text-center fs-2 fw-bold text-danger">
                    {title}
                </h3>
                {children}
            </div>
        </div>
    );
}
