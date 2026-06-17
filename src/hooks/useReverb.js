import { useEffect, useRef, useCallback } from "react";

/**
 * useReverb Hook
 * Connects to Laravel Reverb WebSocket server for real-time notifications
 * 
 * Usage:
 * const { connected, subscribe, unsubscribe } = useReverb();
 * 
 * subscribe('contact-notifications', (data) => {
 *   console.log('New notification:', data);
 * });
 */

export function useReverb() {
  const wsRef = useRef(null);
  const channelsRef = useRef({});
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  // Get Reverb config from environment or use defaults
  const getReverbConfig = useCallback(() => {
    return {
      host: process.env.VITE_REVERB_HOST || "localhost",
      port: process.env.VITE_REVERB_PORT || 8080,
      scheme: process.env.VITE_REVERB_SCHEME || "ws",
      appKey: process.env.VITE_REVERB_APP_KEY || "your-app-key",
    };
  }, []);

  // Connect to Reverb WebSocket
  const connect = useCallback(() => {
    const config = getReverbConfig();
    const wsUrl = `${config.scheme}://${config.host}:${config.port}/app/${config.appKey}`;

    try {
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log("[Reverb] Connected to WebSocket");
        reconnectAttemptsRef.current = 0;
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleMessage(data);
        } catch (e) {
          console.error("[Reverb] Failed to parse message:", e);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error("[Reverb] WebSocket error:", error);
      };

      wsRef.current.onclose = () => {
        console.log("[Reverb] Disconnected from WebSocket");
        attemptReconnect();
      };
    } catch (error) {
      console.error("[Reverb] Connection error:", error);
      attemptReconnect();
    }
  }, [getReverbConfig]);

  // Handle incoming messages
  const handleMessage = useCallback((data) => {
    const { channel, event, data: payload } = data;

    if (channel && channelsRef.current[channel]) {
      const handlers = channelsRef.current[channel];
      if (handlers[event]) {
        handlers[event].forEach((callback) => {
          try {
            callback(payload);
          } catch (e) {
            console.error(`[Reverb] Error in ${event} handler:`, e);
          }
        });
      }
    }
  }, []);

  // Attempt to reconnect with exponential backoff
  const attemptReconnect = useCallback(() => {
    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      console.error("[Reverb] Max reconnection attempts reached");
      return;
    }

    reconnectAttemptsRef.current += 1;
    const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current - 1), 30000);

    reconnectTimeoutRef.current = setTimeout(() => {
      console.log(`[Reverb] Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`);
      connect();
    }, delay);
  }, [connect]);

  // Subscribe to a channel and event
  const subscribe = useCallback((channel, callback, event = "message") => {
    if (!channelsRef.current[channel]) {
      channelsRef.current[channel] = {};
    }

    if (!channelsRef.current[channel][event]) {
      channelsRef.current[channel][event] = [];
    }

    channelsRef.current[channel][event].push(callback);

    // Send subscription message to server
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          event: "subscribe",
          channel,
        })
      );
    }

    // Return unsubscribe function
    return () => {
      if (channelsRef.current[channel]?.[event]) {
        channelsRef.current[channel][event] = channelsRef.current[channel][event].filter(
          (cb) => cb !== callback
        );
      }
    };
  }, []);

  // Unsubscribe from a channel
  const unsubscribe = useCallback((channel) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          event: "unsubscribe",
          channel,
        })
      );
    }

    delete channelsRef.current[channel];
  }, []);

  // Send a message to a channel
  const send = useCallback((channel, event, data) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          event,
          channel,
          data,
        })
      );
    } else {
      console.warn("[Reverb] WebSocket is not connected");
    }
  }, []);

  // Disconnect from Reverb
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    channelsRef.current = {};
    reconnectAttemptsRef.current = 0;
  }, []);

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    connected: wsRef.current?.readyState === WebSocket.OPEN,
    subscribe,
    unsubscribe,
    send,
    disconnect,
  };
}
