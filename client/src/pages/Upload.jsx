import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus } from "lucide-react";
import { api } from "../api/api.js";
import Navbar from "../components/Navbar.jsx";
//frontend page for uploading a post
const Upload = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const imageChange = (event) => {
        const file = event.target.files[0];

        setImage(file || null);
        setError("");

        if (file) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview("");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!image) {
            setError("Choose an image to upload");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("title", title);
            formData.append("image", image);
            
            await api("/photos/uploadphoto", {
                method: "POST",
                body: formData
            });

            navigate("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="upload-page">
            <Navbar />
            <section className="upload-panel">
                <div className="upload-header">
                    <ImagePlus size = {28} />
                    <h1>Upload photo</h1>
                </div>

                <form onSubmit={handleSubmit} className="upload-form">
                    <label>
                        Title
                        <input
                        type="text"
                        placeholder="Give your photo a title"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        />
                    </label>

                    <label>
                        Image
                        <input
                            type="file"
                            accept= "image/jpeg,image/png,image/webp"
                            onChange= {imageChange}
                            />
                    </label>

                    {preview && (
                        <img
                        src={preview}
                        alt = "Photo post preview"
                        className="upload-preview"
                        />
                    )}

                    {error && <p className="error">{error}</p>}

                    <button type="submit" disabled={loading}>
                        {loading ? "Uploading your spectacular photo" : "Upload"}
                    </button>
                </form>
            </section>
        </main>
    )

}    
export default Upload;