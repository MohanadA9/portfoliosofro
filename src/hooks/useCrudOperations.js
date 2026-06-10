import { useState, useCallback } from "react";
import { apiPost, apiPut, apiDelete, apiGet } from "../api/request";

/**
 * Custom hook for CRUD operations with loading and error states
 * @param {string} baseEndpoint - Base API endpoint (e.g., '/admin/courses')
 * @returns {Object} CRUD operations and state management
 */
export const useCrudOperations = (baseEndpoint) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const create = useCallback(
    async (data) => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      try {
        const response = await apiPost(`${baseEndpoint}/store`, data);
        setSuccess(true);
        return response;
      } catch (err) {
        setError(err.message || "Failed to create");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [baseEndpoint],
  );

  const read = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiGet(`${baseEndpoint}/show/${id}`);
        return response;
      } catch (err) {
        setError(err.message || "Failed to fetch");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [baseEndpoint],
  );

  const update = useCallback(
    async (id, data) => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      try {
        const response = await apiPut(`${baseEndpoint}/update/${id}`, data);
        setSuccess(true);
        return response;
      } catch (err) {
        setError(err.message || "Failed to update");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [baseEndpoint],
  );

  const delete_ = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      try {
        const response = await apiDelete(`${baseEndpoint}/delete/${id}`);
        setSuccess(true);
        return response;
      } catch (err) {
        setError(err.message || "Failed to delete");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [baseEndpoint],
  );

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return {
    create,
    read,
    update,
    delete: delete_,
    loading,
    error,
    success,
    clearMessages,
  };
};
