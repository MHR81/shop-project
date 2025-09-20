import { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs"; // آیکون چشم از react-icons

export default function PasswordInput({ value, onChange, placeholder }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="input-group mb-3">
            <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                value={value}
                onChange={onChange}
                placeholder={placeholder || "Password"}
                autoComplete="new-password"
            />
            <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(prev => !prev)}
                title={showPassword ? "Hide password" : "Show password"}
                
            >
                {showPassword ? <BsEyeSlash /> : <BsEye />}
            </button>
        </div>
    );
}