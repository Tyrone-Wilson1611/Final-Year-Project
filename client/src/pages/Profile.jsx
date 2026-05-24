import { useEffect, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { api } from "../api/api.js";
import { useAuth } from "../context/auth.jsx";
import Navbar from '../components/Navbar.jsx';

const Profile = () => {
    const { username } = useParams();
    const { user: currentUser } = useAuth();

    const [profile, setProfile] = useState(null);
    const [portfolio, setPortfolio] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const requestedTab = searchParams.get("tab");
    const [activeTab, setActiveTab] = useState(requestedTab || "posts");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const startBuilder = searchParams.get("builder") === "true";
    const [isFollowing, setFollowing] = useState(false);
    const [followLoad, setFollowLoad] = useState(false);

    const isOwnProfile = currentUser?.username === username;

    useEffect(() => {
        const loadProfle = async () => {
            try {
                const profileData = await api(`/users/${username}`, { method: "GET"});

                const portfolioData = await api(`/portfolio/${username}`, {method: "GET"

                });

                setProfile(profileData.user)
                setPortfolio(portfolioData.portfolio);
            } catch(err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadProfle();
    }, [username]);

    useEffect(() => {
            if (requestedTab === "portfolio") {
                setActiveTab("portfolio");
            }
        }, [requestedTab]);

    if (loading) {
        return <p>Loading profile...</p>
    }

    if (error) {
        return <p className="error">{error}</p>
    }

    if (!profile) {
        return <p>User not found</p>;
    }

    const followUser = async () => {
        if (!profile) {
            return;
        }

        try {
            setFollowLoad(true);

            if (isFollowing) {
                await api(`/follows/unfollow/${profile.id}`, { method: "DELETE"

                });

                setFollowing(false);
                setProfile((current) => ({
                    ...current, _count: {
                        ...current._count,
                        followers: Math.max((current._count?.followers || 0)-1,0)

                    }
                }))

            } else {
                await api(`/follows/follow/${profile.id}`, {
                    method: "POST"
                });

                setFollowing(true);
                setProfile((current) => ({
                    ...current,_count: {
                        ...current._count, followers: (current._count?.followers || 0) + 1
                    }
                }));
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setFollowLoad(false);
        }
    }

    return (
        <main className="profile-page">
            <Navbar />
            <section className="profile-header">
                <img
                src={profile.avatarUrl || "https://placehold.co/120x120"}
                alt={profile.username}
                className="profile-avatar"
                />

                <div className="profile-info">
                    <h1>{profile.username}</h1>
                    {profile.bio && <p>{profile.bio}</p>}
                    <div className="profile-statistics">
                        <span>{profile._count?.photos || 0} posts</span>
                        <span>{profile._count?.followers || 0} followers</span>
                        <span>{profile._count?.following || 0} following</span>
                    </div>

                    {isOwnProfile && (
                        <Link to="/edit-profile" className="edit-profile-link">
                            Edit Profile
                        </Link>
                    )}
                </div>

                {!isOwnProfile && (
                    <button

                    type="button"
                    className="follow-button"
                    onClick={followUser}
                    disabled={followLoad}
                    >
                        {followLoad ? "Loading" : isFollowing ? "unfollow" : "Follow"}
                    </button>
                )}
            </section>

            <section className="profile-tabs">
                <button
                type="button"
                className={activeTab === "posts" ? "active-tab" : ""}
                onClick={() => setActiveTab("posts")}
                >
                    Posts
                </button>

                <button
                type="button"
                className={activeTab === "portfolio" ? "active-tab" : ""}
                onClick={() => setActiveTab("portfolio")}
                >
                    Portfolio
                </button>
            </section>

            {activeTab === "posts" && (
                <section className="profile-grid">
                    {(profile.photos || []).map((photo) => (
                        <img
                            key={photo.id}
                            src={photo.imageUrl}
                            alt={photo.title || "Photo"}
                            className="profile-grid-image"
                            />
                    ))}
                </section>
            )}

                {activeTab === "portfolio" && (
                <PortfolioSection
                    portfolio={portfolio}
                    photos={profile.photos || []}
                    isOwnProfile={isOwnProfile}
                    startBuilder={startBuilder}
                    onPortfolioSaved={setPortfolio}
                />
            )}
        </main>
    );


}

const PortfolioSection = ({ portfolio, photos, isOwnProfile, startBuilder, onPortfolioSaved }) => {
    const [builderOpen, setBuilderOpen] = useState(false);
    const [replacePromptOpen, setReplacePromptOpen] =useState(false);

    useEffect(() => {
        if (!startBuilder || !isOwnProfile) {
            return;
        }

        if (portfolio) {
            setReplacePromptOpen(true);
        } else {
            setBuilderOpen(true);
        }
    }, [startBuilder, isOwnProfile, portfolio]);

    if (replacePromptOpen) {
        return (
            <section className="portfolio-empty">
                <p>You already have a portfolio on your profile</p>
                <p>Would you like to replace your existing portfolio?</p>

                <div className="builder-actions">
                    <button type="button" onClick={() => setReplacePromptOpen(false)}>
                        Cancel
                    </button>

                    <button
                    type="button"
                    onClick={() => {
                        setReplacePromptOpen(false);
                        setBuilderOpen(true);
                    }}
                    >
                        Replace portfolio
                    </button>
                </div>
            </section>
        );
    }

    if (builderOpen) {
        return (
            <PortfolioBuilder
                photos={photos}
                existingPortfolio={portfolio}
                onCancel={() => setBuilderOpen(false)}
                onSaved={(savedPortfolio) => {
                    onPortfolioSaved(savedPortfolio);
                    setBuilderOpen(false);
                }}
            />
        );
    }

    if (!portfolio) {
        return (
            <section className="portfolio-empty">
                <p>No portfolio created yet.</p>

                {isOwnProfile && (
                    <button type="button" onClick={() => setBuilderOpen(true)}>
                        Create portfolio
                    </button>
                )}
            </section>
        );
    }

    return (
        <section>
            {isOwnProfile && (
                <button
                    type="button"
                    className="edit-portfolio-button"
                    onClick={() => setBuilderOpen(true)}
                >
                    Edit portfolio
                </button>
            )}

            <PortfolioLayout portfolio={portfolio} />
        </section>
    );
}

const PortfolioLayout = ({ portfolio }) => {
    const items = portfolio.items || []

    return (
        <div className={`portfolio-layout ${portfolio.layout}`}>
            {items.map((item) => (
                <img
                    key={item.id}
                    src={item.photo.imageUrl}
                    alt={item.photo.title || "Portfolio photo"}
                    className={`portfolio-item portfolio-position-${item.position}`}
                    />
            ))}
        </div>
    )
}

const PortfolioBuilder = ({ photos, existingPortfolio, onCancel, onSaved }) => {
    const [layout, setLayout] = useState(existingPortfolio?.layout || "layout_1");
    const [selected, setSelected] = useState(() => {
        const initial = {};

        existingPortfolio?.items?.forEach((item) => {
            initial[item.position] = item.photoId;
        });

        return initial;
    });

    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [availablePhotos, setAvailablePhotos] = useState(photos);
    const [uploadPosition, setUploadPosition] = useState(null);

    const maxPositions = 5;

    const choosePhoto = (position, photoId) => {
        setSelected((current) => ({
            ...current,
            [position]: Number(photoId)
        }));
    };

    const uploadPortPhoto = async( position, file) => {
        if (!file) {
            return;
        }

        try {
            setUploadPosition(position);
            setError("");

            const formData = new FormData();
            formData.append("image", file);
            formData.append("title", `Portfolio photo ${position}`);
            formData.append("type", "portfolio");

            const data = await api("/photos/uploadphoto", {
                method: "POST",
                body: formData
            });

            setAvailablePhotos((current) => [...current, data.photo]);

            setSelected((current) => ({...current, [position]:  data.photo.id}));
        } catch (err) {
            setError(err.message);
        } finally {
            setUploadPosition(null);
        }
        
    }

    const selectedItems = Object.entries(selected).filter(([, photoId]) => photoId)
    .map(([position, photoId]) => {
        const photo = availablePhotos.find((item) => item.id === Number(photoId));

        return {
            position: Number(position),
            photo
        };
    });

    const savePortfolio = async () => {
        const items = Object.entries(selected)
            .filter(([, photoId]) => photoId)
            .map(([position, photoId]) => ({
                position: Number(position),
                photoId: Number(photoId)
            }));

        if (items.length < 1 || items.length > 5) {
            setError("Choose between 1 and 5 photos");
            return;
        }

        try {
            setSaving(true);
            setError("");

            const data = await api("/portfolio/profile/me", {
                method: "POST",
                body: JSON.stringify({
                    layout,
                    items
                })
            });

            onSaved(data.portfolio);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <section className="portfolio-builder">
            <h2>Build portfolio</h2>

            <div className="layout-picker">
                <button
                    type="button"
                    className={layout === "layout_1" ? "active-tab" : ""}
                    onClick={() => setLayout("layout_1")}
                >
                    Layout 1
                </button>

                <button
                    type="button"
                    className={layout === "layout_2" ? "active-tab" : ""}
                    onClick={() => setLayout("layout_2")}
                >
                    Layout 2
                </button>
            </div>

            <div className="portfolio-picker">
                {[1, 2, 3, 4, 5].map((position) => (
                    <label key={position}>
                        Position {position}
                        <select
                            value={selected[position] || ""}
                            onChange={(event) => choosePhoto(position, event.target.value)}
                        >
                            <option value="">Choose existing photo</option>
                            {availablePhotos.map((photo) => (
                                <option key={photo.id} value={photo.id}>
                                    {photo.title || `Photo ${photo.id}`}
                                </option>
                            ))}
                        </select>

                        <span className="portfolio-upload-divider"> upload from device</span>
                        <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(event) => uploadPortPhoto(position, event.target.files[0])}
                        />

                        {uploadPosition === position && <span>Uploading...</span>}
                    </label>
                ))}
            </div>
            
            <div className="portfolio-preview-wrap">
                <h3>Preview</h3>

                <div className={`portfolio-layout ${layout}`}>
                    {selectedItems.map((item) =>
                    item.photo ? (
                        <img
                        key={item.position}
                        src={item.photo.imageUrl}
                        alt={item.photo.title || "Portfolio preview"}
                        className={`portfolio-item portfolio-position-${item.position}`}/>
                    ) : null
                    
                )}
                </div>
            </div>
            {error && <p className="error">{error}</p>}

            <div className="builder-actions">
                <button type="button" onClick={onCancel}>
                    Cancel
                </button>

                <button type="button" onClick={savePortfolio} disabled={saving}>
                    {saving ? "Saving..." : "Save portfolio"}
                </button>
            </div>
        </section>
    );
};

export default Profile;