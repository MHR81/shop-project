export default function AdminProfile() {
    return (
        <div>
            <h4 className="fw-bold mb-3"><span className="fs-4">Admin</span> <span className="text-danger fs-3">Profile</span></h4>
            <div className="mb-3">
                <label className="form-label">Name</label>
                <input className="form-control" value="Admin" disabled />
            </div>
            <div className="mb-3">
                <label className="form-label">Email</label>
                <input className="form-control" value="admin@admin.com" disabled />
            </div>
        </div>
    );
}