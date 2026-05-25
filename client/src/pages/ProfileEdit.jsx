import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api.js";
import { useAuth } from "../context/auth.jsx";
import Navbar from '../components/Navbar.jsx';

//page for editing a user profile
const ProfileEdit = () => {
    const navigate = useNavigate();
    const { updateUser } = useAuth();

    const [form, setForm] = useState({
        username: "",
        bio: "",
        avatarUrl: ""
    });

    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await api("/users/profile", {
                    method: "GET"
                });

                setForm({
                    username: data.user.username || "",
                    bio: data.user.bio || "",
                    avatarUrl: data.user.avatarUrl || ""
                });
            } catch (err) {
                setError(err.message);
            }
        };

        loadProfile();
    }, [])

    const changeDetails = (event) => {
        setForm((current) => ({
            ...current, [event.target.name]: event.target.value
        }));
    };

    const submit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");

            const data = await api ("/users/profile", {
                method: "PATCH",
                body: JSON.stringify(form)
            });

            updateUser(data.user);

            navigate(`/users/${data.user.username}`);

        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="edit-profile-page">
            <Navbar />
            <section className="edit-profile-tab">
                <h1> Edit Profile</h1>

                <form onSubmit={submit} className="edit-profile-details">
                    <label>
                        Username
                        <input
                            name= "username"
                            value={form.username}
                            onChange={changeDetails}
                            />
                    </label>

                    <label>
                        Bio
                        <textarea
                            name="bio"
                            value={form.bio}
                            onChange={changeDetails}
                            rows="4"
                            />
                    </label>

                    <label>
                        Avatar
                        <input
                            name="avatarUrl"
                            value={form.avatarUrl}
                            onChange={changeDetails}
                            />
                    </label>

                    {error && <p className="error">{error}</p>}

                    <button type="submit" disabled={saving}>
                        {saving ? "Saving user details" : "Save changes"}
                    </button>
                </form>
            </section>
        </main>
    )
}
export default ProfileEdit;