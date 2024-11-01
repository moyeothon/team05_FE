import React, { useState, useEffect, useRef } from 'react';
import './MusicItem.css';

const MusicItem = ({ track, isSelected, onSelect }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const audioRef = useRef(null);
    const optionsRef = useRef(null);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.onended = () => setIsPlaying(false);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (optionsRef.current && !optionsRef.current.contains(event.target)) {
                setShowOptions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div 
            className={`music-item ${isSelected ? 'selected' : ''}`}
            onClick={onSelect}
        >
            <div className="music-info">
                <img 
                    src={track.image || track.album?.images[0]?.url} 
                    alt="앨범 커버" 
                    className="album-cover"
                />
                <div className="song-details">
                    <h3 className="song-title">{track.name || track.song}</h3>
                    <p className="artist-name">
                        {track.artists ? 
                            track.artists.map(artist => artist.name).join(', ') : 
                            track.artist}
                    </p>
                </div>
            </div>
            <div className="music-controls">
                {track.preview_url && (
                    <button className="play-button" onClick={togglePlay}>
                        <audio ref={audioRef} src={track.preview_url} />
                        <img 
                            src={isPlaying ? "/pause_icon.svg" : "/play_icon.svg"} 
                            alt={isPlaying ? "일시정지" : "재생"} 
                        />
                    </button>
                )}
                {track.external_urls && (
                    <div className="options-container" ref={optionsRef}>
                        <button 
                            className="options-button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowOptions(!showOptions);
                            }}
                        >
                            <img src="/more_options.svg" alt="더보기" />
                        </button>
                        {showOptions && (
                            <div className="options-popup">
                                <button 
                                    className="option-item spotify-link"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(track.external_urls.spotify, '_blank');
                                        setShowOptions(false);
                                    }}
                                >
                                    스포티파이에서 듣기
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MusicItem; 