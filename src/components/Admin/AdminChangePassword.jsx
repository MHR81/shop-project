export default function AdminChangePassword() {
    return (
        <div>
            <h4 className="fw-bold mb-3 text-danger fs-3">Change Password</h4>
            <form style={{ maxWidth: 400 }}>
                <div className="mb-3">
                    <label className="form-label">Current Password</label>
                    <input type="password" className="form-control" />
                </div>
                <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <input type="password" className="form-control" />
                </div>
                <div className="mb-3">
                    <label className="form-label">Confirm New Password</label>
                    <input type="password" className="form-control" />
                </div>
                <button type="submit" className="btn btn-warning">Change Password</button>
            </form>
        </div>
    );
}