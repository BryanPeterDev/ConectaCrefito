import { useState, useEffect, useCallback } from 'react';
import { getPosts, getMyPosts, isAuthenticated } from '../services/api';

export function useJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchJobs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getPosts();
            // Aceita array direto ou { posts: [...] }
            setJobs(Array.isArray(data) ? data : data.posts ?? []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchJobs(); }, [fetchJobs]);

    return { jobs, loading, error, refetch: fetchJobs };
}

export function useMyJobs() {
    const [myJobs, setMyJobs] = useState([]);
    const [loadingMy, setLoadingMy] = useState(false);
    const [errorMy, setErrorMy] = useState(null);

    const fetchMyJobs = useCallback(async () => {
        if (!isAuthenticated()) { setMyJobs([]); return; }
        setLoadingMy(true);
        setErrorMy(null);
        try {
            const data = await getMyPosts();
            setMyJobs(Array.isArray(data) ? data : data.posts ?? []);
        } catch (err) {
            setErrorMy(err.message);
        } finally {
            setLoadingMy(false);
        }
    }, []);

    useEffect(() => { fetchMyJobs(); }, [fetchMyJobs]);

    return { myJobs, loadingMy, errorMy, refetchMy: fetchMyJobs };
}
