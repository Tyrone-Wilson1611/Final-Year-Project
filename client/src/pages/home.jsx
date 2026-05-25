import { useAuth } from '../context/auth.jsx';
import { useEffect, useState} from 'react';
import { api } from "../api/api.js";
import { Bell, LogOut, Heart, MessageCircle, PlusSquare, User} from "lucide-react";
import { Link } from "react-router-dom";



const Home = () => {
    const { user, logout } = useAuth();
    const [photos, setPhotos]= useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [openComments, setOpenComments] = useState(null);
    const [commentText, setCommentText] = useState({});
    const [photoComments, setPhotoComments] = useState({});
    const [openMenu, setMenu] = useState(false);
    //Calling GET Request from the backend to be able to see user posts on the home feed
    useEffect(() => {
        const getPhotos = async () => {
            try {
                const data = await api("/photos", {
                    method: "GET",
                });
                setPhotos(data.photos || []);
            } catch (err) {
                setError(
                    err.message
                );
            } finally {
                setLoading(false);
            }
        };
        getPhotos();
            }, []);
            //POST request that allows a user to like another user's photo 
            const likePhoto = async(photoId) => {
            try {
                const data = await api(`/photos/${photoId}/likes`, { method: "POST"

                });

                setPhotos((currentPhotos) =>
                currentPhotos.map((photo) => {
                    if (photo.id !== photoId) {
                        return photo;
                    }
                    const currentLikes = photo._count?.likes || 0;

                    return {
                        ...photo,
                        _count: {
                            ...photo._count,
                            likes: data.liked ? currentLikes + 1 : Math.max(currentLikes -1, 0)
                        }
                    };
                })
            );
            } catch (err) {
                setError(err.message);
            }
            };

        const loadComments = async (photoId) => {
            try { 
                if (openComments === photoId) {
                    setOpenComments(null);
                    return;
                }
                const data = await api(`/photos/${photoId}/comments`, {
                    method: "GET"
                });

                setPhotoComments((current) => ({
                    ...current, 
                    [photoId]: data.comments || []
                }));

                setOpenComments(photoId);
            } catch (err) {
                setError(err.message);
            }
                
            }

            const createComment = async(photoId) => {
                const text = commentText[photoId];

                if (!text || text.trim() === "") {
                    return;
                }

                try {
                    const data = await api(`/photos/${photoId}/comments`, { method: "POST", body: JSON.stringify({text})
                });

                setPhotoComments((current) => ({
                    ...current,
                    [photoId]: [...(current[photoId] || []), data.comment]
                }));

                setCommentText((current) => ({
                    ...current,
                    [photoId]: ""
                }));

                setPhotos((currentPhotos) => 
                currentPhotos.map((photo) => {
                    if (photo.id !== photoId) {
                        return photo;
                    }

                    return {
                        ...photo,
                        _count: {
                            ...photo._count,
                            comments: (photo._count?.comments || 0)+1
                        }
                    };
                })
            );
        } catch (err) {
            setError(err.message);
        }
            }
    return ( //front end display
        <main className = "home-page">
            <header className="top-header">
                <h1>PhotoPort</h1>

                <div className="top-actions">
                    <div className='menu-wrap'>
                        <button
                              type="button"
                              className="icon-button"
                              aria-label="create"
                              onClick={() => setMenu((open) => !open)}>
                                <PlusSquare size={22} />
                              </button>

                              {openMenu && (
                                <div className="create-menu">
                                    <Link to="/upload">Create Post</Link>

                                    <Link to={`/users/${user?.username}?tab=portfolio&builder=true`}>
                                    Create Portfolio</Link>
                        </div>
                    )}
                    </div>
                    <Link to={`/users/${user?.username}`} className="icon-link" aria-label="profile">
                    <User size={22} />
                    </Link>
                    <button type="button" aria-label="Notifications">
                        <Bell size={22} />
                    </button>
                    <button type="button" onClick={logout} aria-label="Logout">
                        <LogOut size={22}/>
                    </button>
                </div>
            </header>

            <section className="feed">
                {loading && <p>Loading feed...</p>}
                {error && <p className="error">{error}</p>}

                {!loading && photos.length === 0 && (
                    <p>No photos have been uploaded yet.</p>
                )}

                {photos.map((photo) => (
                    <article className="post" key = {photo.id} >
                        <div className = "post-header">
                            <div>
                            <Link to={`/users/${photo.user?.username}`}>
                                <strong>{photo.user?.username}</strong>
                            </Link>
                                {photo.title && <p>{photo.title}</p>}
                            </div>
                        </div>

                        <img src={photo.imageUrl} alt ={photo.title || "Photo"}
                        className = "post-image"/>

                        <div className="post-actions">
                            <button type="button" onClick={() => likePhoto(photo.id)}>
                                <Heart size={22} />
                                <span>{photo._count?.likes || 0}</span>
                            </button>

                            <button type="button" onClick ={() => loadComments(photo.id)}>
                                <MessageCircle size={22} />
                                <span>{photo._count?.comments || 0}</span>
                            </button>
                        </div>

                            {openComments === photo.id && (
                                <div className="comments-panel">
                                    <div className="comments-list">
                                        {(photoComments[photo.id] || []).map((comment) => (
                                            <div className="comment" key ={comment.id}>
                                                <strong>{comment.user?.username}</strong>
                                                <span>{comment.text}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="comment-form">
                                        <input
                                            type="text"
                                            placeholder="Add a comment..."
                                            value={commentText[photo.id] || ""}
                                            onChange={(event) =>
                                                setCommentText((current) => ({
                                                    ...current,
                                                    [photo.id]: event.target.value
                                                }))
                                            }
                                        />

                                        <button type="button" onClick={() => createComment(photo.id)}>
                                            Post Comment
                                        </button>
                                    </div>
                                </div>
                            )}
                        </article>
                    ))}
                </section>
            </main>
        );
    };


export default Home;